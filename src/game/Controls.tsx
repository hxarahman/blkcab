import { useEffect, useRef, useState } from "react";
import { Dir } from "@/game/types";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  onDir: (d: Dir) => void;
  surfaceRef: React.RefObject<HTMLElement>;
}

/**
 * Full-screen swipe controller.
 * - Listens to pointer events on the entire game surface.
 * - No visible D-pad. A subtle, fading hint appears on idle.
 * - Lightweight haptic on direction change (where supported).
 */
export const Controls = ({ onDir, surfaceRef }: Props) => {
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastDirRef = useRef<Dir | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [flashDir, setFlashDir] = useState<Dir | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const TH = 22;       // px swipe threshold
    const FAST_TH = 14;  // px fast-flick threshold

    const triggerDir = (d: Dir) => {
      if (lastDirRef.current !== d) {
        try { (navigator as any).vibrate?.(8); } catch {}
      }
      lastDirRef.current = d;
      onDir(d);
      setFlashDir(d);
      setHintVisible(false);
      window.setTimeout(() => setFlashDir(null), 220);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => setHintVisible(true), 4000);
    };

    const onPointerDown = (e: PointerEvent) => {
      startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = startRef.current;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      const dt = performance.now() - s.t;
      const isFast = dt < 220;
      const th = isFast ? FAST_TH : TH;
      if (Math.max(ax, ay) < th) return;
      if (ax > ay) triggerDir(dx > 0 ? "right" : "left");
      else triggerDir(dy > 0 ? "down" : "up");
      // reset baseline so user can drag continuously to change direction
      startRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    };

    const onPointerUp = () => {
      startRef.current = null;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    idleTimerRef.current = window.setTimeout(() => setHintVisible(true), 3500);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [onDir, surfaceRef]);

  return (
    <>
      {/* Idle swipe hint — center, very subtle */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-1 animate-swipe-hint">
          <div className="grid grid-cols-3 gap-1 text-olive/70">
            <div /><ChevronUp className="w-4 h-4" /><div />
            <ChevronLeft className="w-4 h-4" />
            <div className="w-4 h-4 rounded-full border border-olive/50" />
            <ChevronRight className="w-4 h-4" />
            <div /><ChevronDown className="w-4 h-4" /><div />
          </div>
          <span className="text-[9px] font-mono-brand uppercase tracking-[0.3em] text-olive/70 mt-1">
            Swipe anywhere
          </span>
        </div>
      </div>

      {/* Direction flash on each swipe */}
      {flashDir && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-olive-glow opacity-90 animate-fade-in">
            {flashDir === "up" && <ChevronUp className="w-24 h-24 drop-shadow-[0_0_16px_hsl(var(--olive-glow))]" strokeWidth={2.5} />}
            {flashDir === "down" && <ChevronDown className="w-24 h-24 drop-shadow-[0_0_16px_hsl(var(--olive-glow))]" strokeWidth={2.5} />}
            {flashDir === "left" && <ChevronLeft className="w-24 h-24 drop-shadow-[0_0_16px_hsl(var(--olive-glow))]" strokeWidth={2.5} />}
            {flashDir === "right" && <ChevronRight className="w-24 h-24 drop-shadow-[0_0_16px_hsl(var(--olive-glow))]" strokeWidth={2.5} />}
          </div>
        </div>
      )}
    </>
  );
};
