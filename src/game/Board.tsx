import { useEffect, useRef, useState } from "react";
import { COLS, ROWS, grid } from "@/game/maze";
import { CabSprite } from "@/game/CabSprite";
import { HazardSprite } from "@/game/HazardSprite";
import { ItemSprite } from "@/game/ItemSprite";
import { Hazard, ItemKind, Phase, PowerMode } from "@/game/types";
import { ITEM_POINTS, type CollectFx } from "@/game/useGameEngine";

interface ItemView { id: string; kind: any; pos: { x: number; y: number }; collected: boolean; hidden?: boolean }

interface Props {
  player: { x: number; y: number; dir: any };
  hazards: Hazard[];
  items: ItemView[];
  power: PowerMode;
  shakeKey: number;
  phase: Phase;
  collectFx: CollectFx[];
  /** Visual-only cab scale multiplier (does NOT affect hitboxes). */
  cabScale?: number;
}

/**
 * SINGLE SOURCE OF TRUTH for the cab's render size.
 * Multiplies whatever scale comes in from settings (or the default fallback).
 * Bump this number to grow the cab globally — it cannot be overridden by
 * stored settings, migrations, or component prop defaults.
 */
const CAB_RENDER_BOOST = 2.6;

export const Board = ({ player, hazards, items, power, shakeKey, phase, collectFx, cabScale = 30.8 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(20);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      const h = ref.current.clientHeight;
      // Dynamic cell sizing rule:
      //   cell = floor( min(containerW / COLS, containerH / ROWS) )
      // Cells are ALWAYS square. The grid is then centered in the container.
      // This keeps the item-to-cell ratio identical across every breakpoint,
      // so sprite anchoring (translate -50%/-50%) lands in the exact center
      // of a cell regardless of portrait viewport size.
      const next = Math.max(8, Math.floor(Math.min(w / COLS, h / ROWS)));
      setCell(next);
    };
    update();
    window.addEventListener("resize", update);
    // Re-measure on orientation change too.
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // One canonical cell size drives both axes — the sprite scale is now a
  // pure function of `cell`, so every collectible/hazard renders at the
  // same proportion of its cell on phones, tablets, and large screens.
  const cellW = cell;
  const cellH = cell;
  const sprite = cell;
  const w = cell * COLS;
  const h = cell * ROWS;

  const tint =
    power === "matcha_hypnosis" ? "bg-matcha/15" :
    power === "no_compromise" ? "bg-orange-sticker/15" :
    power === "cabbie_stories" ? "bg-bc-blue/15" :
    power === "bc_drop" ? "bg-black/50" : "";

  // Headlight cone direction & offset based on player.dir
  const headlightTransform = (() => {
    const dir = player.dir;
    const base = "translate(-50%, -50%)";
    const rot =
      dir === "up" ? "rotate(-90deg)" :
      dir === "down" ? "rotate(90deg)" :
      dir === "left" ? "rotate(180deg)" :
      "rotate(0deg)";
    return `${base} ${rot}`;
  })();

  return (
    <div
      ref={ref}
      className="relative flex-1 w-full flex items-center justify-center"
      style={{ background: "var(--gradient-street)" }}
    >
      {/* Animated street FX layers — behind the maze (toned down for editorial premium feel) */}
      <div className="absolute inset-0 halftone opacity-25 pointer-events-none" />
      <div className="absolute inset-0 rain opacity-15 pointer-events-none mix-blend-screen" />
      {/* Drifting fog */}
      <div
        className="absolute inset-0 pointer-events-none animate-fog-drift"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, hsl(var(--olive) / 0.07) 0%, transparent 45%), radial-gradient(ellipse at 70% 70%, hsl(var(--matcha) / 0.05) 0%, transparent 50%)",
          filter: "blur(20px)",
        }}
      />
      {/* Sweeping headlights from off-frame */}
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-0 w-[80%] h-24 animate-headlight-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(var(--cream) / 0.11) 50%, transparent 100%)",
            filter: "blur(14px)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-[80%] h-20 animate-headlight-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(var(--orange-sticker) / 0.09) 50%, transparent 100%)",
            filter: "blur(18px)",
            animationDelay: "2.5s",
            animationDuration: "7s",
          }}
        />
      </div>

      <div
        key={shakeKey}
        className="relative animate-shake"
        style={{ width: w, height: h, animationIterationCount: 1 }}
      >
        {/* Maze walls — neon edge */}
        <svg width={w} height={h} className="absolute inset-0 animate-wall-hum">
          <defs>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--maze-wall))" />
              <stop offset="100%" stopColor="hsl(0 0% 6%)" />
            </linearGradient>
            <filter id="wallGlow">
              <feGaussianBlur stdDeviation="0.75" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {grid.map((row, y) =>
            row.map((c, x) => {
              if (c !== 1) return null;
              return (
                <rect
                  key={`${x}-${y}`}
                  x={x * cellW + 1}
                  y={y * cellH + 1}
                  width={cellW - 2}
                  height={cellH - 2}
                  rx={Math.min(cellW, cellH) * 0.22}
                  fill="url(#wallGrad)"
                  stroke="hsl(var(--maze-wall-edge))"
                  strokeWidth={Math.max(1, sprite * 0.07)}
                  filter="url(#wallGlow)"
                />
              );
            })
          )}
        </svg>

        {/* Power tint */}
        {tint && <div className={`absolute inset-0 pointer-events-none ${tint} mix-blend-screen`} />}
        {/* Scanlines on top */}
        <div className="absolute inset-0 pointer-events-none scanline opacity-60" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none crt-vignette" />

        {/* Items */}
        {items.map((it) => {
          if (it.collected) return null;
          const isBrandSticker = it.kind === "bc_stack" || it.kind === "est2017_pill" || it.kind === "hail_coffee" || it.kind === "cabista" || it.kind === "mind_the_cab_pill" || it.kind === "bc_bar" || it.kind === "bc_cp_cream" || it.kind === "bc_tag_cream" || it.kind === "bc_tag_orange";
          const isBig = it.kind === "bc_artifact" || it.kind.endsWith("_sticker") || isBrandSticker;
          // Keep all collectible sprites visually balanced — premium read on
          // the darker editorial board (no oversized portrait scaling).
          const itemSize = sprite * (isBrandSticker ? 1.15 : isBig ? 1.0 : 0.78);
          const isShiny = it.kind === "bc_artifact" || isBrandSticker;
          return (
            <div
              key={it.id}
              className={`absolute flex items-center justify-center pointer-events-none ${
                isShiny ? "animate-pulse-glow" : ""
              }`}
              style={{
                left: it.pos.x * cellW,
                top: it.pos.y * cellH,
                width: cellW,
                height: cellH,
              }}
            >
              {/* base coin glow for tiny pickups — softened for premium feel */}
              {!isBig && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: sprite * 0.6,
                    height: sprite * 0.6,
                    background:
                      it.kind === "matcha"
                        ? "radial-gradient(circle, hsl(var(--matcha) / 0.32) 0%, transparent 65%)"
                        : it.kind === "coffee"
                        ? "radial-gradient(circle, hsl(var(--cream) / 0.22) 0%, transparent 65%)"
                        : "radial-gradient(circle, hsl(var(--cream) / 0.2) 0%, transparent 65%)",
                    filter: "blur(2px)",
                  }}
                />
              )}
              <ItemSprite kind={it.kind} size={itemSize} />
            </div>
          );
        })}

        {/* Hazards */}
        {hazards.map((hz) => (
          <div
            key={hz.id}
            className="absolute pointer-events-none"
            style={{
              left: hz.pos.x * cellW,
              top: hz.pos.y * cellH,
              width: cellW,
              height: cellH,
            }}
          >
            <HazardSprite kind={hz.kind} size={sprite * 0.95} frozen={power === "matcha_hypnosis"} />
          </div>
        ))}

        {/* Headlight cone tied to player */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: (player.x + 0.5) * cellW,
            top: (player.y + 0.5) * cellH,
            width: sprite * 6,
            height: sprite * 3,
            transform: headlightTransform,
            transformOrigin: "left center",
            background: "var(--gradient-headlight)",
            mixBlendMode: "screen",
            opacity: 0.75,
            filter: "blur(3px)",
          }}
        />

        {/* Ready-phase spotlight halo on the cab */}
        {phase === "ready" && (
          <div
            className="absolute pointer-events-none animate-spotlight-pulse"
            style={{
              left: (player.x + 0.5) * cellW,
              top: (player.y + 0.5) * cellH,
              width: sprite * 6,
              height: sprite * 6,
              borderRadius: "9999px",
              background: "radial-gradient(circle, hsl(var(--olive-glow) / 0.55) 0%, hsl(var(--olive-glow) / 0.18) 30%, transparent 65%)",
              mixBlendMode: "screen",
              filter: "blur(2px)",
              zIndex: 5,
            }}
          />
        )}

        {/* Player */}
        <div
          className={`absolute pointer-events-none flex items-center justify-center ${phase === "ready" ? "animate-cab-bounce" : ""}`}
          style={{
            left: player.x * cellW,
            top: player.y * cellH,
            width: cellW,
            height: cellH,
            zIndex: 6,
          }}
        >
          <CabSprite
            size={sprite * cabScale * CAB_RENDER_BOOST}
            dir={player.dir}
            glow={
              power === "no_compromise" ? "hsl(22 95% 55%)" :
              power === "matcha_hypnosis" ? "hsl(82 60% 50%)" :
              power === "cabbie_stories" ? "hsl(212 90% 62%)" :
              power === "bc_drop" ? "hsl(212 90% 62%)" :
              "hsl(60 60% 60%)"
            }
          />
        </div>

        {/* Floating "you are here" arrow during ready phase */}
        {phase === "ready" && (
          <div
            className="absolute pointer-events-none whitespace-nowrap flex flex-col items-center gap-0.5"
            style={{
              left: (player.x + 0.5) * cellW,
              top: (player.y - 1.9) * cellH,
              transform: "translateX(-50%)",
              zIndex: 7,
            }}
          >
            <span
              className="font-display font-black uppercase leading-none text-cream animate-you-pulse"
              style={{
                fontSize: Math.max(16, sprite * 0.95),
                letterSpacing: "0.1em",
                textShadow:
                  "0 0 4px hsl(var(--cream) / 0.95), 0 0 12px hsl(var(--olive-glow) / 0.9), 0 0 22px hsl(var(--olive-glow) / 0.7), 0 1px 0 hsl(0 0% 0%)",
              }}
            >
              YOU
            </span>
            <span
              className="text-olive-glow leading-none animate-you-pulse"
              style={{
                fontSize: Math.max(18, sprite * 1.0),
                textShadow: "0 0 8px hsl(var(--olive-glow) / 0.9), 0 1px 2px hsl(0 0% 0% / 0.9)",
                animationDelay: "0.15s",
              }}
            >
              ▼
            </span>
          </div>
        )}

        {/* Floating collect FX (sticker-pop / fly-up).
            The wrapper MUST be a sized, centered box because some sprites
            (matcha / coffee / person portraits) anchor themselves with
            position:absolute + translate(-50%,-50%) inside their parent.
            Without explicit width/height the parent collapses to 0×0 and
            the anchored sprite becomes invisible. */}
        {collectFx.map((f) => {
          // Brand stickers get the punchier sticker-pop; classic dots
          // (matcha/coffee/people) get the cleaner fly-up.
          const isClassic =
            f.kind === "matcha" ||
            f.kind === "coffee" ||
            f.kind === "people" ||
            f.kind === "person_boy" ||
            f.kind === "person_girl";
          const baseSize = sprite * (isClassic ? 1.4 : 1.54);
          return (
            <div
              key={f.id}
              className={`absolute pointer-events-none ${isClassic ? "animate-fly-up" : "animate-sticker-pop"}`}
              style={{
                left: (f.pos.x + 0.5) * cellW,
                top: (f.pos.y + 0.5) * cellH,
                width: cellW * 2.4,
                height: cellH * 2.4,
                zIndex: 50,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative w-full h-full">
                <ItemSprite kind={f.kind} size={baseSize} />
                {/* Floating "+N" score label — every collected item shows
                    its point value popping out alongside the sticker so the
                    player feels the reward. */}
                <span
                  className="absolute left-1/2 -top-2 -translate-x-1/2 font-extrabold tracking-tight whitespace-nowrap"
                  style={{
                    fontSize: Math.max(18, sprite * 0.95),
                    color: "hsl(var(--cream))",
                    textShadow:
                      "0 1px 2px hsl(0 0% 0% / 0.85), 0 0 10px hsl(var(--olive-glow) / 0.95)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  +{ITEM_POINTS[f.kind] ?? 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outer noise grain */}
      <div className="absolute inset-0 pointer-events-none grain" />
    </div>
  );
};
