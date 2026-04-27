import { useEffect } from "react";
import { Settings as SettingsIcon, X, RotateCcw, Vibrate } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  CAB_SCALE_MAX,
  CAB_SCALE_MIN,
  GameSettings,
  HAPTIC_CHANNELS,
  HAPTIC_INTENSITIES,
} from "./useSettings";
import { CabSprite } from "./CabSprite";
import { triggerHaptic, type HapticChannel, type HapticIntensity } from "./haptics";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: GameSettings;
  setCabScale: (v: number) => void;
  setHaptic: (channel: HapticChannel, intensity: HapticIntensity) => void;
  reset: () => void;
}

export const SettingsPanel = ({ open, onClose, settings, setCabScale, setHaptic, reset }: Props) => {
  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Game settings"
    >
      {/* Backdrop */}
      <button
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
      />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl border border-olive/40 bg-card p-5 pb-7 animate-slide-up max-h-[92vh] overflow-y-auto"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)",
          boxShadow: "0 -20px 60px -10px hsl(var(--olive-glow) / 0.35)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-olive" />
            <h2 className="font-display font-bold uppercase tracking-[0.22em] text-sm text-foreground">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cab size slider */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] font-mono-brand uppercase tracking-[0.3em] text-muted-foreground">
                Display
              </div>
              <h3 className="font-display font-bold text-base">Cab visual size</h3>
            </div>
            <span className="font-mono-brand tabular-nums text-olive font-bold">
              ×{settings.cabScale.toFixed(2)}
            </span>
          </div>

          {/* Live preview — uses the actual CabSprite at proportional size */}
          <div className="rounded-md border border-olive/25 bg-black/40 h-24 flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center">
              <CabSprite
                size={28 * settings.cabScale}
                dir="right"
                glow="hsl(60 60% 60%)"
              />
            </div>
          </div>

          <Slider
            value={[settings.cabScale]}
            min={CAB_SCALE_MIN}
            max={CAB_SCALE_MAX}
            step={0.05}
            onValueChange={(v) => setCabScale(v[0] ?? settings.cabScale)}
            aria-label="Cab visual size"
          />

          <div className="flex items-center justify-between text-[10px] font-mono-brand uppercase tracking-[0.25em] text-muted-foreground">
            <span>×{CAB_SCALE_MIN.toFixed(1)}</span>
            <span className="text-foreground/70">
              Visual only · hitboxes unchanged
            </span>
            <span>×{CAB_SCALE_MAX.toFixed(1)}</span>
          </div>
        </section>

        {/* Haptics section */}
        <section className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Vibrate className="w-3.5 h-3.5 text-olive" />
            <div className="text-[10px] font-mono-brand uppercase tracking-[0.3em] text-muted-foreground">
              Feel
            </div>
          </div>
          <h3 className="font-display font-bold text-base -mt-1">Haptic feedback</h3>
          <p className="text-[11px] text-muted-foreground leading-snug -mt-1">
            Tap a strength per channel. Tapping a value also previews the buzz.
            Requires a device that supports vibration.
          </p>

          <div className="space-y-2.5">
            {HAPTIC_CHANNELS.map(({ key, label, hint }) => (
              <div
                key={key}
                className="rounded-md border border-olive/25 bg-black/40 p-2.5"
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="font-display font-bold text-sm uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-[9px] font-mono-brand uppercase tracking-[0.25em] text-muted-foreground">
                    {hint}
                  </span>
                </div>
                <div role="radiogroup" aria-label={`${label} haptic intensity`} className="grid grid-cols-3 gap-1.5">
                  {HAPTIC_INTENSITIES.map((level) => {
                    const active = settings.haptics[key] === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setHaptic(key, level);
                          // Preview the chosen strength immediately so the user can feel it
                          triggerHaptic(key, level);
                        }}
                        className={`h-9 rounded-sm font-display font-bold text-[11px] uppercase tracking-[0.18em] border transition-colors ${
                          active
                            ? "bg-olive text-[hsl(0_0%_6%)] border-olive shadow-olive"
                            : "bg-transparent text-muted-foreground border-olive/30 hover:text-foreground hover:border-olive/60"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Button
            onClick={onClose}
            className="px-8 h-10 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold uppercase tracking-widest rounded-full"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
