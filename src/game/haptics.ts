// Haptic feedback helper. Uses the browser Vibration API where available.
// Intensity is user-controlled via Settings: off | low | high.
// Channels map to gameplay events so each one can be tuned independently.

export type HapticIntensity = "off" | "low" | "high";
export type HapticChannel = "hazard" | "collect" | "power";

type Pattern = number | number[];

// Tactile vocabulary per channel & intensity.
// - hazard:  sharp double jolt (negative) — punchy so it really registers
// - collect: short tap (positive, frequent)
// - power:   layered buzz (rare, celebratory)
const PATTERNS: Record<HapticChannel, Record<Exclude<HapticIntensity, "off">, Pattern>> = {
  hazard: {
    low: [25, 30, 25],
    high: [60, 40, 90, 40, 60],
  },
  collect: {
    low: 8,
    high: 18,
  },
  power: {
    low: [12, 30, 12],
    high: [40, 50, 80, 40, 60],
  },
};

const supportsVibrate = (): boolean =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

export function triggerHaptic(channel: HapticChannel, intensity: HapticIntensity) {
  if (intensity === "off") return;
  if (!supportsVibrate()) return;
  const pattern = PATTERNS[channel][intensity];
  try {
    navigator.vibrate(pattern);
  } catch {
    // ignore — some browsers throw under user-gesture restrictions
  }
}
