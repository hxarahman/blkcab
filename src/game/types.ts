// Game type definitions for BLK CAB: MIND THE CAB

export type Dir = "up" | "down" | "left" | "right";

export type Cell = 0 | 1; // 0 = path, 1 = wall

export type ItemKind =
  | "matcha"
  | "coffee"
  | "people"
  | "person_boy"      // photographic boy portrait sticker
  | "person_girl"     // photographic girl portrait sticker
  | "mtc_sticker"     // Mind the Cab sticker (orange)
  | "cp_sticker"      // BC Coffee&People sticker (olive)
  | "est_sticker"     // Est 2017
  | "cabbie_sticker"  // Cabbie Stories
  | "bc_artifact"
  | "bc_stack"        // BC / Coffee&People / Mind the Cab / Cabbie Stories stack
  | "est2017_pill"    // est 2017 → orange pill
  | "hail_coffee"     // Hail a Coffee, Est (2017) cream pill
  | "cabista"         // #Cabista olive pill
  | "mind_the_cab_pill"      // "Mind the Cab" → orange pill
  | "bc_bar"                 // BC® (Coffee&People) est 2017 → long orange bar
  | "bc_cp_cream"            // BC® (Coffee&People) → cream pill
  | "bc_tag_cream"           // BC® (Coffee&People) cream tag
  | "bc_tag_orange";         // BC® (Coffee&People) orange tag

export type HazardKind =
  | "burnt_beans"
  | "bad_reviews"
  | "queue_chaos"
  | "dead_energy"
  | "copycat";

export type PowerMode =
  | "none"
  | "matcha_hypnosis"
  | "no_compromise"
  | "cabbie_stories"
  | "bc_drop";

export interface GridPos { x: number; y: number; }

export interface Collectible {
  id: string;
  kind: ItemKind;
  pos: GridPos;
  collected: boolean;
}

export interface Hazard {
  id: string;
  kind: HazardKind;
  pos: GridPos;     // float positions allowed for smoothness
  dir: Dir;
  speed: number;    // cells per second
  cooldown: number; // for re-activating after being smashed
}

export type Phase = "start" | "tutorial" | "ready" | "playing" | "result";

export interface GameState {
  phase: Phase;
  score: number;
  timeLeft: number;
  combo: number;          // streak of clean pickups
  multiplier: number;     // 1, 1.2, 1.5, 2, 3
  power: PowerMode;
  powerLeft: number;      // seconds remaining
  collectedBcArtifact: boolean;
  bcArtifactCount: number; // total BC artifacts collected this round (BC Insider needs 3+)
  matchaStreak: number;
  coffeeStreak: { count: number; firstAt: number };
  flashHazard: number;    // for screen shake/flash
  shakeKey: number;       // increment to retrigger shake animation
}

export interface Rank {
  name: string;
  min: number;
  code: string | null;
  /** Minimum BC artifacts collected required for this rank. */
  requiresArtifacts?: number;
}

// Re-tuned for harder progression. Codes only kick in at House Regular and up.
// BC Insider also requires 3+ BC artifacts (cannot be reached on score alone).
export const RANKS: Rank[] = [
  { name: "Passenger",     min: 0,    code: null },
  { name: "Regular",       min: 250,  code: null },
  { name: "House Regular", min: 600,  code: "STICKER" },
  { name: "Cabbie",        min: 1000, code: "MIND-CAB" },
  { name: "Cult Driver",   min: 1600, code: "CABBIE-STORIES" },
  { name: "BC Insider",    min: 2500, code: "BC-DROP", requiresArtifacts: 3 },
];

export function rankFor(score: number, artifactCount: number): Rank {
  let chosen: Rank = RANKS[0];
  for (const r of RANKS) {
    if (score >= r.min) {
      if (r.requiresArtifacts && artifactCount < r.requiresArtifacts) continue;
      chosen = r;
    }
  }
  return chosen;
}

// Lightweight analytics hook stub for future wiring
export const track = (event: string, props: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  if ((window as any).__BLKCAB_DEBUG__) console.log("[track]", event, props);
};
