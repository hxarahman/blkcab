import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Below-the-fold video that only attaches its source (and starts loading)
 * when it scrolls near the viewport, via IntersectionObserver.
 */
export const LazyVideo = ({ src, poster, className }: LazyVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const el = ref.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {
      /* autoplay may be blocked — poster stays visible */
    });
  }, [visible]);

  return (
    <video ref={ref} loop muted playsInline preload="none" poster={poster} className={className}>
      {visible && <source src={src} type="video/mp4" />}
    </video>
  );
};
