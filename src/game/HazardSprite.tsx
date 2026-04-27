import { HazardKind } from "@/game/types";

// Hazards never use pure black — that's reserved for the player's cab,
// so the eye can always lock onto "you" at a glance. Copycat used to be
// near-black, which clashed with the cab; it's now a hot magenta sticker.
const COLORS: Record<HazardKind, { fill: string; stroke: string; label: string }> = {
  burnt_beans:  { fill: "hsl(20 70% 32%)",  stroke: "hsl(20 90% 55%)",  label: "BB" },
  bad_reviews:  { fill: "hsl(0 78% 42%)",   stroke: "hsl(0 95% 65%)",   label: "★" },
  queue_chaos:  { fill: "hsl(40 70% 38%)",  stroke: "hsl(40 90% 60%)",  label: "Q" },
  dead_energy:  { fill: "hsl(265 45% 38%)", stroke: "hsl(265 80% 70%)", label: "✕" },
  copycat:      { fill: "hsl(320 70% 42%)", stroke: "hsl(320 95% 70%)", label: "©" },
};

export const HazardSprite = ({ kind, size, frozen }: { kind: HazardKind; size: number; frozen?: boolean }) => {
  const c = COLORS[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ filter: frozen ? "saturate(0.4) brightness(0.7)" : undefined }}>
      <path
        d="M3 10a7 7 0 0 1 14 0v6l-2-1.5L13 16l-2-1.5L9 16l-2-1.5L5 16l-2-1.5z"
        fill={c.fill}
        stroke={c.stroke}
        strokeWidth="1"
      />
      <circle cx="7.5" cy="9" r="1.3" fill="white" />
      <circle cx="12.5" cy="9" r="1.3" fill="white" />
      <circle cx="7.5" cy="9" r="0.6" fill={c.stroke} />
      <circle cx="12.5" cy="9" r="0.6" fill={c.stroke} />
      <text x="10" y="6" fontSize="3.5" fontWeight="900" textAnchor="middle" fill={c.stroke} fontFamily="Inter, sans-serif">{c.label}</text>
    </svg>
  );
};
