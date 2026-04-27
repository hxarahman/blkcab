import { GameState, Rank } from "@/game/types";
import { POWER_OVERLAY } from "@/game/useGameEngine";
import { Settings as SettingsIcon } from "lucide-react";

export const HUD = ({
  state,
  rank,
  onOpenSettings,
  timerTest,
  testElapsed,
}: {
  state: GameState;
  rank: Rank;
  onOpenSettings?: () => void;
  timerTest?: boolean;
  testElapsed?: number;
}) => {
  const pct = Math.min(100, (state.timeLeft / 60) * 100);
  const lowTime = state.timeLeft <= 10;
  const critical = state.timeLeft <= 5;

  return (
    <div
      className="relative w-full flex flex-col gap-2 px-3 pt-3 pb-2.5 border-b border-olive/30"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 6% / 0.95) 70%, hsl(0 0% 4% / 0.85) 100%)",
        boxShadow: "0 8px 24px -12px hsl(var(--olive-glow) / 0.35)",
      }}
    >
      {/* Subtle scanline layer */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-30" />

      {/* Top row: brand + tagline */}
      <div className="relative flex items-center justify-between gap-2">
        <span className="font-display font-black text-[13px] uppercase tracking-[0.18em] text-olive neon-text leading-none">
          Mind The Cab
        </span>
        <span className="hidden xs:inline text-[9px] font-mono-brand uppercase tracking-[0.32em] text-muted-foreground leading-none">
          built · for · people · est&nbsp;2017
        </span>
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open settings"
            className="ml-auto p-1.5 rounded-md text-muted-foreground hover:text-olive hover:bg-secondary/60 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stat chips */}
      <div className="relative grid grid-cols-4 gap-1.5">
        <Stat label="Score" value={state.score.toLocaleString()} />
        <Stat
          label="Mult"
          value={`×${state.multiplier.toFixed(1)}`}
          accent={state.multiplier > 1 ? "orange" : undefined}
        />
        <Stat label="Rank" value={rank.name.split(" ")[0]} accent="olive" />
        <Stat
          label="Time"
          value={`${Math.ceil(state.timeLeft)}s`}
          accent={critical ? "orange-pulse" : lowTime ? "orange" : undefined}
          tabular
        />
      </div>

      {/* Time bar — single source of truth, glows red under 10s */}
      <div className="relative h-2 w-full rounded-full bg-black/60 overflow-hidden ring-1 ring-olive/25">
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-100 ease-linear rounded-full"
          style={{
            width: `${pct}%`,
            background: lowTime
              ? "linear-gradient(90deg, hsl(var(--orange-sticker)) 0%, hsl(22 100% 65%) 100%)"
              : "linear-gradient(90deg, hsl(var(--olive)) 0%, hsl(var(--olive-glow)) 100%)",
            boxShadow: lowTime
              ? "0 0 14px hsl(var(--orange-sticker) / 0.85), inset 0 1px 0 hsl(0 0% 100% / 0.25)"
              : "0 0 12px hsl(var(--olive-glow) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.2)",
          }}
        />
        {/* moving shimmer */}
        <div
          className="absolute inset-y-0 w-1/3 opacity-50 pointer-events-none animate-headlight-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.35) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Active power readout */}
      {state.power !== "none" && (
        <div className="relative flex items-center justify-between text-[10px] font-mono-brand uppercase tracking-[0.25em]">
          <span
            className={
              state.power === "matcha_hypnosis"
                ? "text-matcha font-bold"
                : state.power === "no_compromise"
                ? "text-orange-sticker font-bold neon-orange-text"
                : state.power === "cabbie_stories"
                ? "text-bc-blue font-bold"
                : "text-cream font-bold"
            }
          >
            ▶ {POWER_OVERLAY[state.power as Exclude<typeof state.power, "none">]}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {state.powerLeft.toFixed(1)}s
          </span>
        </div>
      )}

      {/* Timer HUD test mode — visible when ?timerTest=1 */}
      {timerTest && (
        <div
          className="relative flex items-center justify-between text-[9px] font-mono-brand uppercase tracking-[0.28em] px-2 py-1 rounded-sm border border-orange-sticker/60 bg-black/70"
          aria-label="Timer test mode"
        >
          <span className="text-orange-sticker font-bold">⏱ TIMER TEST</span>
          <span
            className={`tabular-nums font-bold ${
              (testElapsed ?? 0) > 60 ? "text-orange-sticker neon-orange-text" : "text-cream"
            }`}
          >
            {(testElapsed ?? 0).toFixed(2)}s / {60}s
          </span>
        </div>
      )}
    </div>
  );
};

const Stat = ({
  label,
  value,
  accent,
  tabular,
}: {
  label: string;
  value: string;
  accent?: "olive" | "orange" | "orange-pulse";
  tabular?: boolean;
}) => {
  const valueClass =
    accent === "olive"
      ? "text-olive"
      : accent === "orange"
      ? "text-orange-sticker neon-orange-text"
      : accent === "orange-pulse"
      ? "text-orange-sticker neon-orange-text animate-ticker-pulse"
      : "text-foreground";
  return (
    <div
      className={`rounded-md border border-olive/25 bg-black/40 backdrop-blur-sm px-2 py-1.5 flex flex-col items-center justify-center leading-none ${
        accent === "orange-pulse" ? "border-orange-sticker/60" : ""
      }`}
    >
      <span className="text-[8px] font-mono-brand uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`mt-1 font-display font-black text-sm uppercase ${valueClass} ${
          tabular ? "tabular-nums" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
};
