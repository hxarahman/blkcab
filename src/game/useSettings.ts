import { useEffect, useState, useCallback } from "react";
import type { HapticChannel, HapticIntensity } from "./haptics";

// Visual + feel settings. Persisted to localStorage so each device keeps
// its own dial. Hitboxes are NOT affected — they remain tied to grid coords.
export interface GameSettings {
  /** Multiplier applied to the cab sprite size only. 1.0 = baseline. */
  cabScale: number;
  /** Per-channel haptic intensity. */
  haptics: Record<HapticChannel, HapticIntensity>;
}

const STORAGE_KEY = "mtc.settings.v1";

export const SETTINGS_DEFAULTS: GameSettings = {
  // Cab is intentionally allowed to overflow its lane (visual only — the
  // hitbox is still tied to grid coords). The cab is the ONLY black icon
  // on the board, so we want it large and unmistakable. Doubled again so
  // players immediately see the change without needing to touch settings.
  cabScale: 30.8,
  haptics: {
    hazard: "high",
    collect: "low",
    power: "high",
  },
};

export const CAB_SCALE_MIN = 0.8;
export const CAB_SCALE_MAX = 40.0;

export const HAPTIC_INTENSITIES: HapticIntensity[] = ["off", "low", "high"];
export const HAPTIC_CHANNELS: { key: HapticChannel; label: string; hint: string }[] = [
  { key: "hazard", label: "Hazards", hint: "Bumps, copycats, slowdowns" },
  { key: "collect", label: "Collectibles", hint: "Stickers picked up" },
  { key: "power", label: "Power modes", hint: "BC Drop, No Compromise…" },
];

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const sanitizeIntensity = (v: unknown, fallback: HapticIntensity): HapticIntensity =>
  v === "off" || v === "low" || v === "high" ? v : fallback;

const load = (): GameSettings => {
  if (typeof window === "undefined") return SETTINGS_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SETTINGS_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<GameSettings> & {
      haptics?: Partial<Record<HapticChannel, unknown>>;
    };
    // One-shot migrations: bump anyone still on a previous default to the
    // current baseline. Custom values are left alone.
    const PREV_DEFAULTS = [1.85, 2.41, 3.15, 3.85, 7.7, 15.4];
    const rawScale = Number(parsed.cabScale ?? SETTINGS_DEFAULTS.cabScale);
    const cabScale = clamp(
      PREV_DEFAULTS.includes(rawScale) ? SETTINGS_DEFAULTS.cabScale : rawScale,
      CAB_SCALE_MIN,
      CAB_SCALE_MAX
    );
    return {
      cabScale,
      haptics: {
        hazard: sanitizeIntensity(parsed.haptics?.hazard, SETTINGS_DEFAULTS.haptics.hazard),
        collect: sanitizeIntensity(parsed.haptics?.collect, SETTINGS_DEFAULTS.haptics.collect),
        power: sanitizeIntensity(parsed.haptics?.power, SETTINGS_DEFAULTS.haptics.power),
      },
    };
  } catch {
    return SETTINGS_DEFAULTS;
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(SETTINGS_DEFAULTS);

  // Hydrate from storage on mount (avoids SSR mismatch and handles fresh tabs)
  useEffect(() => {
    setSettings(load());
  }, []);

  // Persist on every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore quota / privacy mode errors
    }
  }, [settings]);

  const setCabScale = useCallback((v: number) => {
    setSettings((s) => ({ ...s, cabScale: clamp(v, CAB_SCALE_MIN, CAB_SCALE_MAX) }));
  }, []);

  const setHaptic = useCallback((channel: HapticChannel, intensity: HapticIntensity) => {
    setSettings((s) => ({
      ...s,
      haptics: { ...s.haptics, [channel]: intensity },
    }));
  }, []);

  const reset = useCallback(() => setSettings(SETTINGS_DEFAULTS), []);

  return { settings, setCabScale, setHaptic, reset };
}
