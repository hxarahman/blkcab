import { useCallback, useEffect, useRef, useState } from "react";
import {
  COLS,
  ROWS,
  HAZARD_SPAWNS,
  PLAYER_SPAWN,
  isWall,
  pathCells,
  wrapX,
} from "./maze";
import {
  Collectible,
  Dir,
  GameState,
  GridPos,
  Hazard,
  HazardKind,
  ItemKind,
  PowerMode,
  rankFor,
  track,
} from "./types";
import { triggerHaptic, type HapticIntensity } from "./haptics";

export interface EngineOptions {
  /** Per-channel haptic intensity. Read live via ref so changes apply mid-round. */
  haptics?: {
    hazard: HapticIntensity;
    collect: HapticIntensity;
    power: HapticIntensity;
  };
}

const ROUND_SECONDS = 60;
const PLAYER_SPEED = 5.2;        // cells per second
const HAZARD_BASE_SPEED = 3.4;
const COPYCAT_SPEED = 4.4;

// Re-ranked: real brand stickers + classic collectibles (matcha/coffee/people)
// are all back. Lower-tier filler items spawn more often; brand stickers are rarer.
export const ITEM_POINTS: Record<ItemKind, number> = {
  // Classic collectibles — small but plentiful, the "dots" of the round.
  matcha: 10,
  coffee: 10,
  people: 15,
  person_boy: 25,
  person_girl: 25,

  // Legacy SVG sticker placeholders — no longer spawned, kept for type safety.
  mtc_sticker: 0,
  cp_sticker: 0,
  est_sticker: 0,
  cabbie_sticker: 0,

  // Tier S
  bc_artifact: 100,        // hidden BC drop — rarest
  bc_bar: 80,              // long brand bar
  // Tier A
  bc_stack: 60,
  cabista: 50,
  mind_the_cab_pill: 45,
  // Tier B
  bc_tag_orange: 40,
  hail_coffee: 35,
  bc_cp_cream: 30,
  // Tier C
  bc_tag_cream: 25,
  est2017_pill: 20,
};

const HAZARD_PENALTY: Record<HazardKind, number> = {
  burnt_beans: -20,
  bad_reviews: -30,
  queue_chaos: 0,
  dead_energy: 0,
  copycat: -40,
};

const MULTIPLIERS = [1, 1.2, 1.5, 2, 3];

const POWER_OVERLAY: Record<Exclude<PowerMode, "none">, string> = {
  matcha_hypnosis: "MATCHA HYPNOSIS",
  no_compromise: "NO COMPROMISE",
  cabbie_stories: "CABBIE STORIES",
  bc_drop: "BC DROP",
};

const POWER_DURATION: Record<Exclude<PowerMode, "none">, number> = {
  matcha_hypnosis: 8,
  no_compromise: 7,
  cabbie_stories: 10,
  bc_drop: 12,
};

interface Player {
  x: number; y: number; // float cell coords
  dir: Dir;
  nextDir: Dir;
  slowUntil: number;    // queue chaos slow timer (epoch ms)
}

interface InternalCollectible extends Collectible {
  spawnedAt: number;
  hidden?: boolean; // for bc_drop secret artifacts
}

const initialState = (): GameState => ({
  phase: "start",
  score: 0,
  timeLeft: ROUND_SECONDS,
  combo: 0,
  multiplier: 1,
  power: "none",
  powerLeft: 0,
  collectedBcArtifact: false,
  bcArtifactCount: 0,
  matchaStreak: 0,
  coffeeStreak: { count: 0, firstAt: 0 },
  flashHazard: 0,
  shakeKey: 0,
});

function rndChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// Build collectibles: ONLY the real uploaded brand stickers.
// Sparse, deliberate placement so each sticker reads on the board (no
// matcha/coffee/people clutter). Counts roughly inverse to point value.
function buildCollectibles(): InternalCollectible[] {
  const items: InternalCollectible[] = [];
  const reserved = new Set([`${PLAYER_SPAWN.x},${PLAYER_SPAWN.y}`]);
  HAZARD_SPAWNS.forEach((p) => reserved.add(`${p.x},${p.y}`));

  // Pool of valid placements, shuffled, then drawn without replacement so
  // no two stickers ever overlap.
  const pool = pathCells
    .filter((c) => !reserved.has(`${c.x},${c.y}`))
    .slice()
    .sort(() => Math.random() - 0.5);
  let cursor = 0;
  const take = (): GridPos | null => {
    if (cursor >= pool.length) return null;
    return pool[cursor++];
  };

  // Spawn config — (kind, count). Premium, less cluttered: roughly -40% pickups
  // overall vs the previous tuning. Brand stickers are rare prizes; the dots
  // (matcha/coffee/people) are the main rhythm. No more boy/girl portraits —
  // a single minimal "people" icon stands in for the community.
  const spawnPlan: Array<[ItemKind, number]> = [
    ["matcha", 11],            // dots — most abundant
    ["coffee", 11],
    ["people", 9],             // minimal community icon
    ["est2017_pill", 3],       // Tier C — less common
    ["bc_tag_cream", 3],
    ["bc_cp_cream", 2],        // Tier B
    ["hail_coffee", 2],
    ["bc_tag_orange", 2],
    ["mind_the_cab_pill", 1],  // Tier A — rare
    ["cabista", 1],
    ["bc_stack", 1],
    ["bc_bar", 1],             // Tier S — very rare
  ];

  for (const [kind, count] of spawnPlan) {
    for (let i = 0; i < count; i++) {
      const c = take();
      if (!c) break;
      items.push({
        id: `${kind}_${i}_${Math.random().toString(36).slice(2, 6)}`,
        kind,
        pos: { x: c.x, y: c.y },
        collected: false,
        spawnedAt: 0,
      });
    }
  }

  // BC artifact (rare, single — extras can drop via BC DROP power)
  const a = take();
  if (a) {
    items.push({
      id: "bc_artifact_main",
      kind: "bc_artifact",
      pos: { x: a.x, y: a.y },
      collected: false,
      spawnedAt: 0,
    });
  }

  return items;
}

function buildHazards(): Hazard[] {
  const kinds: HazardKind[] = ["burnt_beans", "bad_reviews", "queue_chaos", "dead_energy", "copycat"];
  return HAZARD_SPAWNS.map((pos, i) => ({
    id: `h${i}`,
    kind: kinds[i % kinds.length],
    pos: { x: pos.x, y: pos.y },
    dir: rndChoice<Dir>(["up", "down", "left", "right"]),
    speed: kinds[i % kinds.length] === "copycat" ? COPYCAT_SPEED : HAZARD_BASE_SPEED,
    cooldown: 0,
  }));
}

const dirVec = (d: Dir): [number, number] => {
  switch (d) {
    case "up": return [0, -1];
    case "down": return [0, 1];
    case "left": return [-1, 0];
    case "right": return [1, 0];
  }
};

const oppositeDir = (d: Dir): Dir =>
  d === "up" ? "down" : d === "down" ? "up" : d === "left" ? "right" : "left";

// Snap to integer when crossing grid
const nearInt = (v: number, eps = 0.06) => Math.abs(v - Math.round(v)) < eps;

export interface CollectFx {
  id: string;
  kind: ItemKind;
  pos: GridPos;
  at: number;
}

export function useGameEngine(options?: EngineOptions) {
  const [state, setState] = useState<GameState>(initialState);
  const [items, setItems] = useState<InternalCollectible[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [player, setPlayer] = useState<Player>({
    x: PLAYER_SPAWN.x, y: PLAYER_SPAWN.y, dir: "left", nextDir: "left", slowUntil: 0,
  });
  const [collectFx, setCollectFx] = useState<CollectFx[]>([]);
  const [powerFx, setPowerFx] = useState<{ id: number; mode: PowerMode } | null>(null);

  // Mutable refs for game loop
  const sRef = useRef(state); sRef.current = state;
  const iRef = useRef(items); iRef.current = items;
  const hRef = useRef(hazards); hRef.current = hazards;
  const pRef = useRef(player); pRef.current = player;
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const endedAtRef = useRef<number>(0);

  // ---- Timer HUD test mode --------------------------------------------------
  // Enabled via `?timerTest=1` in the URL or `localStorage.timerTest = "1"`.
  // When on, we log round start/end wall-clock timestamps + measured duration
  // so QA can confirm the round never exceeds 60 s in real time.
  const timerTestRef = useRef<boolean>(false);
  if (typeof window !== "undefined" && timerTestRef.current === false) {
    try {
      const url = new URL(window.location.href);
      timerTestRef.current =
        url.searchParams.get("timerTest") === "1" ||
        window.localStorage?.getItem("timerTest") === "1";
    } catch { /* noop */ }
  }
  const [testElapsed, setTestElapsed] = useState<number>(0);

  // Live ref to haptics settings so changes apply mid-round without restarting the loop.
  const hapticsRef = useRef(options?.haptics);
  hapticsRef.current = options?.haptics;
  const buzz = useCallback((channel: "hazard" | "collect" | "power") => {
    const intensity = hapticsRef.current?.[channel] ?? "off";
    triggerHaptic(channel, intensity);
  }, []);

  // Per-hazard buzz cooldown — without this, overlapping the hazard fires
  // navigator.vibrate every animation frame (~60×/sec). Each new call cancels
  // the prior pattern on Android, so the user feels nothing. We treat one
  // contact as one buzz, then re-arm after 600 ms (covers walking past).
  const lastHazardBuzzRef = useRef<Record<string, number>>({});

  const reset = useCallback(() => {
    setState(initialState());
    setItems(buildCollectibles());
    setHazards(buildHazards());
    setPlayer({ x: PLAYER_SPAWN.x, y: PLAYER_SPAWN.y, dir: "left", nextDir: "left", slowUntil: 0 });
    setCollectFx([]);
    setPowerFx(null);
  }, []);

  // Now: prepares the round and pauses on a "ready" screen until the first swipe.
  const start = useCallback(() => {
    reset();
    setState((s) => ({ ...s, phase: "ready", timeLeft: ROUND_SECONDS }));
    track("game_ready");
  }, [reset]);

  const goTutorial = useCallback(() => setState((s) => ({ ...s, phase: "tutorial" })), []);
  const goStart = useCallback(() => setState((s) => ({ ...s, phase: "start" })), []);

  const setDir = useCallback((d: Dir) => {
    // First swipe in "ready" phase actually starts the round.
    if (sRef.current.phase === "ready") {
      startedAtRef.current = performance.now();
      endedAtRef.current = 0;
      if (timerTestRef.current) {
        const iso = new Date().toISOString();
        // eslint-disable-next-line no-console
        console.log(
          `[TimerTest] round_start  iso=${iso}  perf=${startedAtRef.current.toFixed(1)}ms  cap=${ROUND_SECONDS}s`
        );
      }
      setState((s) => ({ ...s, phase: "playing" }));
      track("game_start");
    }
    setPlayer((p) => ({ ...p, nextDir: d, dir: p.dir })); // keep current dir; engine will switch at next intersection
  }, []);

  // Main loop
  useEffect(() => {
    if (state.phase !== "playing") return;

    const tick = (now: number) => {
      const last = lastTickRef.current || now;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp for perf
      lastTickRef.current = now;

      // ---- update player
      const p = { ...pRef.current };
      const slowed = now < p.slowUntil;
      const speedMult =
        (sRef.current.power === "no_compromise" ? 1.25 : 1) *
        (slowed ? 0.55 : 1);
      const speed = PLAYER_SPEED * speedMult;

      // Try to apply nextDir if at intersection center
      const cx = Math.round(p.x);
      const cy = Math.round(p.y);
      const atCenter = nearInt(p.x) && nearInt(p.y);
      if (atCenter) {
        p.x = cx; p.y = cy;
        const [nx, ny] = dirVec(p.nextDir);
        if (!isWall(cx + nx, cy + ny)) p.dir = p.nextDir;
      }
      const [vx, vy] = dirVec(p.dir);
      const nxFloat = p.x + vx * speed * dt;
      const nyFloat = p.y + vy * speed * dt;

      // Wall collision: only block if moving into wall cell
      const targetX = Math.round(nxFloat + vx * 0.5);
      const targetY = Math.round(nyFloat + vy * 0.5);
      let canMove = !isWall(targetX, targetY);
      // Tunnel wrap
      let newX = nxFloat, newY = nyFloat;
      if (newX < -0.5) newX = COLS - 0.5;
      if (newX > COLS - 0.5) newX = -0.5;
      if (canMove) { p.x = newX; p.y = newY; }

      // ---- collect items
      const collectedThis: InternalCollectible[] = [];
      const newItems = iRef.current.map((it) => {
        if (it.collected) return it;
        if (it.hidden && sRef.current.power !== "bc_drop") return it;
        const dx = it.pos.x - p.x;
        const dy = it.pos.y - p.y;
        if (dx * dx + dy * dy < 0.35) {
          collectedThis.push(it);
          return { ...it, collected: true };
        }
        return it;
      });

      // ---- update hazards
      const newHazards = hRef.current.map((h) => {
        const next = { ...h };
        const slowFactor = sRef.current.power === "matcha_hypnosis" ? 0.6 : 1;
        const sp = next.speed * slowFactor;
        const hcx = Math.round(next.pos.x);
        const hcy = Math.round(next.pos.y);
        if (nearInt(next.pos.x) && nearInt(next.pos.y)) {
          next.pos = { x: hcx, y: hcy };
          // pick a new direction at intersections
          const options: Dir[] = (["up", "down", "left", "right"] as Dir[]).filter((d) => {
            const [dx, dy] = dirVec(d);
            return !isWall(hcx + dx, hcy + dy) && d !== oppositeDir(next.dir);
          });
          // copycat: prefer direction toward player
          if (next.kind === "copycat" && options.length > 0) {
            options.sort((a, b) => {
              const [ax, ay] = dirVec(a);
              const [bx, by] = dirVec(b);
              const da = Math.hypot(hcx + ax - p.x, hcy + ay - p.y);
              const db = Math.hypot(hcx + bx - p.x, hcy + by - p.y);
              return da - db;
            });
          } else if (options.length > 0 && Math.random() < 0.7) {
            // mostly continue
          }
          if (options.length > 0) next.dir = options[0] || rndChoice<Dir>(options);
          else next.dir = oppositeDir(next.dir);
        }
        const [hvx, hvy] = dirVec(next.dir);
        next.pos = { x: next.pos.x + hvx * sp * dt, y: next.pos.y + hvy * sp * dt };
        if (next.pos.x < -0.5) next.pos.x = COLS - 0.5;
        if (next.pos.x > COLS - 0.5) next.pos.x = -0.5;
        return next;
      });

      // ---- hazard collisions
      let scoreDelta = 0;
      let comboDelta = 0;
      let resetCombo = false;
      let resetMult = false;
      let queueSlow = false;
      let shakeFlash = false;
      let smashed: string[] = [];

      for (const h of newHazards) {
        const dx = h.pos.x - p.x;
        const dy = h.pos.y - p.y;
        if (dx * dx + dy * dy < 0.5) {
          if (sRef.current.power === "no_compromise") {
            // Smash hazard
            smashed.push(h.id);
            scoreDelta += 15;
            continue;
          }
          if (sRef.current.power === "matcha_hypnosis" || sRef.current.power === "bc_drop") {
            // protective, no penalty but combo break
            resetCombo = true;
            continue;
          }
          if (h.kind === "queue_chaos") queueSlow = true;
          if (h.kind === "dead_energy") resetMult = true;
          scoreDelta += HAZARD_PENALTY[h.kind];

          // One buzz per contact event (re-arm after 600 ms). This stops the
          // 60 fps spam that otherwise cancels every vibration mid-pattern.
          const lastBuzz = lastHazardBuzzRef.current[h.id] ?? 0;
          if (now - lastBuzz > 600) {
            lastHazardBuzzRef.current[h.id] = now;
            buzz("hazard");
          }

          if (HAZARD_PENALTY[h.kind] !== 0) {
            resetCombo = true;
            shakeFlash = true;
          }
        }
      }

      // ---- collect rewards
      let timeBonus = 0;
      let newPower: PowerMode | null = null;
      let bcArt = false;
      let bcArtCount = 0;
      let updatedMatchaStreak = sRef.current.matchaStreak;
      let coffeeStreak = sRef.current.coffeeStreak;

      for (const c of collectedThis) {
        const base = ITEM_POINTS[c.kind];
        scoreDelta += Math.round(base * sRef.current.multiplier);
        comboDelta += 1;

        // Classic collectibles
        if (c.kind === "matcha") {
          updatedMatchaStreak += 1;
          // 5 matcha in a row → matcha hypnosis
          if (updatedMatchaStreak >= 5) {
            newPower = "matcha_hypnosis";
            updatedMatchaStreak = 0;
          }
        } else if (c.kind === "coffee") {
          // Light time bonus + track 3-coffee combo for a small score kicker
          timeBonus += 1;
          const fresh = now - coffeeStreak.firstAt > 4000 ? 0 : coffeeStreak.count;
          const nextCount = fresh + 1;
          coffeeStreak = { count: nextCount, firstAt: fresh === 0 ? now : coffeeStreak.firstAt };
          if (nextCount >= 3) {
            scoreDelta += 25;
            coffeeStreak = { count: 0, firstAt: 0 };
          }
        } else if (c.kind === "people") {
          comboDelta += 1; // people boost the combo
        } else if (c.kind === "person_boy" || c.kind === "person_girl") {
          // legacy types — should not spawn anymore, treat like people
          comboDelta += 1;
        } else {
          // Reset matcha streak on any non-matcha pickup
          updatedMatchaStreak = 0;
        }

        // Brand sticker effects (re-ranked)
        if (c.kind === "est2017_pill") timeBonus += 5;
        if (c.kind === "bc_tag_cream") timeBonus += 5;
        if (c.kind === "bc_cp_cream") newPower = "matcha_hypnosis";
        if (c.kind === "hail_coffee") scoreDelta += 10;
        if (c.kind === "bc_tag_orange") newPower = "no_compromise";
        if (c.kind === "mind_the_cab_pill") newPower = "no_compromise";
        if (c.kind === "cabista") comboDelta += 2; // +1 base + 2 = +3
        if (c.kind === "bc_stack") newPower = "cabbie_stories";
        if (c.kind === "bc_bar") newPower = "cabbie_stories";
        if (c.kind === "bc_artifact") { newPower = "bc_drop"; bcArt = true; bcArtCount += 1; }
      }

      // Apply player slow
      if (queueSlow) p.slowUntil = now + 3000;

      // commit hazards (smash)
      const finalHazards = newHazards.map((h) =>
        smashed.includes(h.id)
          ? { ...h, pos: { x: HAZARD_SPAWNS[0].x, y: HAZARD_SPAWNS[0].y }, cooldown: now + 3000 }
          : h
      );

      // ---- BC drop hidden items spawn (once)
      // Drops a small handful of bonus artifacts + brand sticker rewards so
      // the BC Insider rank (3+ artifacts) is reachable through the BC DROP
      // power chain rather than score alone.
      let itemsAfter = newItems;
      if (newPower === "bc_drop") {
        const extras: InternalCollectible[] = [];
        const dropPlan: ItemKind[] = [
          "bc_artifact",
          "bc_artifact",
          "bc_bar",
          "bc_stack",
          "cabista",
        ];
        for (let i = 0; i < dropPlan.length; i++) {
          const c = rndChoice(pathCells);
          extras.push({
            id: `bcd_${i}_${Math.random().toString(36).slice(2, 6)}`,
            kind: dropPlan[i],
            pos: { x: c.x, y: c.y },
            collected: false,
            spawnedAt: now,
            hidden: false,
          });
        }
        itemsAfter = [...itemsAfter, ...extras];
      }

      // ---- combo & multiplier
      let nextCombo = sRef.current.combo + comboDelta;
      if (resetCombo) nextCombo = 0;
      let nextMultIdx = MULTIPLIERS.findIndex((m) => m === sRef.current.multiplier);
      if (nextMultIdx < 0) nextMultIdx = 0;
      // Increase multiplier every 5 clean pickups
      const tier = Math.min(MULTIPLIERS.length - 1, Math.floor(nextCombo / 5));
      let nextMult = MULTIPLIERS[tier];
      if (resetMult) nextMult = 1;
      if (resetCombo) nextMult = 1;

      // ---- power timer
      let powerLeft = sRef.current.powerLeft - dt;
      let curPower: PowerMode = sRef.current.power;
      if (newPower) { curPower = newPower; powerLeft = POWER_DURATION[newPower]; }
      if (powerLeft <= 0) { powerLeft = 0; curPower = "none"; }

      // ---- time (HARD wall-clock cap from first swipe; bonuses give score, never extend the round)
      if (timeBonus > 0) scoreDelta += timeBonus * 5; // convert recovered seconds → small score kicker
      const elapsedSec = startedAtRef.current > 0 ? (now - startedAtRef.current) / 1000 : 0;
      const timeLeft = Math.max(0, ROUND_SECONDS - elapsedSec);

      // ---- commit state
      pRef.current = p;
      iRef.current = itemsAfter;
      hRef.current = finalHazards;

      const nextScore = Math.max(0, sRef.current.score + scoreDelta);

      sRef.current = {
        ...sRef.current,
        score: nextScore,
        timeLeft,
        combo: nextCombo,
        multiplier: nextMult,
        power: curPower,
        powerLeft,
        collectedBcArtifact: sRef.current.collectedBcArtifact || bcArt,
        bcArtifactCount: sRef.current.bcArtifactCount + bcArtCount,
        matchaStreak: updatedMatchaStreak,
        coffeeStreak,
        flashHazard: shakeFlash ? now : sRef.current.flashHazard,
        shakeKey: shakeFlash ? sRef.current.shakeKey + 1 : sRef.current.shakeKey,
      };

      setPlayer(p);
      setItems(itemsAfter);
      setHazards(finalHazards);
      setState(sRef.current);

      // ---- visual FX: floating sticker pops + power bubble
      if (collectedThis.length > 0) {
        const fx: CollectFx[] = collectedThis.map((c) => ({
          id: `fx_${c.id}_${now.toFixed(0)}`,
          kind: c.kind,
          pos: { x: c.pos.x, y: c.pos.y },
          at: now,
        }));
        setCollectFx((prev) => [...prev.filter((f) => now - f.at < 1400), ...fx]);
        buzz("collect");
      }
      if (newPower) {
        setPowerFx({ id: now, mode: newPower });
        buzz("power");
      }

      if (timeLeft <= 0) {
        sRef.current = { ...sRef.current, phase: "result", timeLeft: 0 };
        setState(sRef.current);
        track("game_end", { score: nextScore });
        if (timerTestRef.current && startedAtRef.current > 0 && endedAtRef.current === 0) {
          endedAtRef.current = performance.now();
          const durationMs = endedAtRef.current - startedAtRef.current;
          const durationSec = durationMs / 1000;
          const iso = new Date().toISOString();
          const overran = durationSec > ROUND_SECONDS + 0.05;
          // eslint-disable-next-line no-console
          console.log(
            `[TimerTest] round_end    iso=${iso}  perf=${endedAtRef.current.toFixed(1)}ms  duration=${durationSec.toFixed(3)}s  cap=${ROUND_SECONDS}s  ${overran ? "❌ EXCEEDED" : "✅ within cap"}`
          );
          setTestElapsed(Math.min(ROUND_SECONDS, durationSec));
        }
        return;
      }

      // Live elapsed read-out for the on-screen timer-test badge.
      if (timerTestRef.current && startedAtRef.current > 0) {
        const elapsed = (now - startedAtRef.current) / 1000;
        setTestElapsed(elapsed);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Keyboard — arrow keys only. The game surface owns focus so browser behavior
  // outside the game remains normal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.phase !== "playing" && state.phase !== "ready") return;
      if (e.key === "ArrowUp") { e.preventDefault(); setDir("up"); }
      if (e.key === "ArrowDown") { e.preventDefault(); setDir("down"); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setDir("left"); }
      if (e.key === "ArrowRight") { e.preventDefault(); setDir("right"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, setDir]);

  return {
    state,
    items,
    hazards,
    player,
    collectFx,
    powerFx,
    start,
    reset,
    setDir,
    goTutorial,
    goStart,
    rank: rankFor(state.score, state.bcArtifactCount),
    timerTest: timerTestRef.current,
    testElapsed,
  };
}

export { ROUND_SECONDS, POWER_OVERLAY };
