import { Button } from "@/components/ui/button";
import blkcabLogo from "@/assets/game/blkcab-logo.png";
import mtcPill from "@/assets/game/sticker-mtc-orange-pill.png";
import est2017Pill from "@/assets/game/sticker-est2017-green-pill.png";
import { Link } from "react-router-dom";

export const StartScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-between px-6 py-10 animate-fade-in text-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-street)" }} />
      <div className="absolute inset-0 -z-10 halftone opacity-40" />
      <div className="absolute inset-0 -z-10 rain opacity-20 mix-blend-screen" />
      <div className="absolute inset-0 -z-10 scanline opacity-50 pointer-events-none" />
      <div className="absolute inset-0 -z-10 crt-vignette pointer-events-none" />

      {/* BLK CAB logo header */}
      <div className="w-full flex items-center justify-center pt-2">
        <Link to="/">
          <img
            src={blkcabLogo}
            alt="BLK CAB"
            className="h-7 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 14px hsl(var(--olive-glow) / 0.35))" }}
          />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-5 mt-4">
        {/* Mind the Cab orange pill sticker + animated "The Game" stamp */}
        <div className="relative w-full flex items-center justify-center">
          <img
            src={mtcPill}
            alt="Mind the Cab"
            className="w-[92%] max-w-[360px] h-auto object-contain"
            style={{ filter: "drop-shadow(0 4px 18px hsl(var(--orange-sticker) / 0.4))" }}
          />
          {/* Rubber-stamp style "The Game" — bold, transparent bg, ink outline, animated stamping */}
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-4 sm:right-8 inline-block font-display font-black uppercase text-cream px-3 py-1.5 text-base sm:text-lg tracking-[0.2em] border-[4px] border-cream rounded-sm animate-stamp-loop origin-center"
            style={{
              background: "transparent",
              fontWeight: 900,
              textShadow: "0 0 2px hsl(0 0% 0% / 0.6)",
              boxShadow: "inset 0 0 0 1px hsl(0 0% 0% / 0.25)",
              filter: "drop-shadow(0 2px 4px hsl(0 0% 0% / 0.6))",
            }}
          >
            The Game
          </span>
        </div>

        <div className="mt-4 font-mono-brand uppercase text-foreground/85 flex flex-col items-center gap-2">
          <p className="text-sm tracking-[0.28em] whitespace-nowrap">built for &amp; around people</p>
          <img
            src={est2017Pill}
            alt="est 2017"
            className="h-9 w-auto object-contain"
            style={{ transform: "rotate(-6deg)", filter: "drop-shadow(0 3px 10px hsl(var(--olive) / 0.35))" }}
          />
        </div>

        <p className="text-base text-foreground/80 max-w-xs text-balance mt-3 leading-snug">
          Move through the streets. Collect the good energy. <span className="text-olive">Avoid the noise.</span>
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        <Button
          onClick={onStart}
          className="w-auto px-10 h-12 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold text-base uppercase tracking-[0.25em] shadow-neon rounded-full border border-olive-glow/40"
        >
          ▶ Start Ride
        </Button>
      </div>
    </div>
  );
};
