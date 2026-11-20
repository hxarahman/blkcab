import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Fades/slides children in once they enter the viewport. Reduced motion: shown immediately (see index.css). */
export const Reveal = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={cn("careers-reveal transition-all duration-700 ease-out", shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6", className)}>
      {children}
    </div>
  );
};

const WORDS = ["COFFEE", "PEOPLE", "MUSIC", "GOOD VIBES", "LONDON", "CRAFT", "HOSPITALITY"];
export const Ticker = ({ className }: { className?: string }) => (
  <div className={cn("overflow-hidden border-y border-primary-foreground/20 py-3", className)} aria-hidden="true">
    <div className="careers-marquee flex w-max animate-marquee whitespace-nowrap">
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="px-4 text-sm md:text-base font-bold tracking-widest">{w} <span className="text-accent pl-4">•</span></span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  shortlisted: "bg-[hsl(var(--pale-blue))] text-foreground",
  interviewed: "bg-[hsl(var(--brass))] text-foreground",
  offered: "bg-accent text-accent-foreground",
  rejected: "bg-destructive/15 text-destructive",
};
export const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider", STATUS_STYLES[status] ?? "bg-muted text-foreground")}>{status}</span>
);

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("text-xs font-bold tracking-[0.25em] uppercase", className)}>{children}</p>
);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Decorative muted looping clip. Poster sits underneath (fixed box from the parent → no CLS).
 * Reduced motion: poster only. Pauses off-screen. `lazy` mounts the <video> only near the viewport.
 * `fadeLoop` fades the video out over the last ~0.4s so the restart crossfades with the poster.
 */
export const CareersVideo = ({ src, poster, lazy = false, fadeLoop = false, className }: { src: string; poster: string; lazy?: boolean; fadeLoop?: boolean; className?: string }) => {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [mounted, setMounted] = useState(!lazy);
  const [visible, setVisible] = useState(false);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (reduced || !box.current || typeof IntersectionObserver === "undefined") { setMounted(true); setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.isIntersecting) setMounted(true); }, { rootMargin: "200px 0px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (visible) v.play().catch(() => {}); else v.pause();
  }, [visible, mounted]);

  const onTime = () => {
    const v = vid.current; if (!v || !fadeLoop || !v.duration) return;
    const fade = v.duration - v.currentTime < 0.4 || v.currentTime < 0.15;
    if (fade !== faded) setFaded(fade);
  };

  return (
    <div ref={box} aria-hidden="true" className={cn("relative overflow-hidden", className)}>
      <img src={poster} alt="" width={720} height={1280} loading={lazy ? "lazy" : "eager"} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {!reduced && mounted && (
        <video ref={vid} src={src} poster={poster} autoPlay muted loop playsInline preload={lazy ? "none" : "metadata"}
          onTimeUpdate={fadeLoop ? onTime : undefined} tabIndex={-1} disablePictureInPicture
          className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-300", faded ? "opacity-0" : "opacity-100")} />
      )}
    </div>
  );
};
