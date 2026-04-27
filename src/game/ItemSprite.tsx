import { ItemKind } from "@/game/types";
import cupMatcha from "@/assets/game/cup-matcha.png";
import cupCoffee from "@/assets/game/cup-coffee.png";
import bcStack from "@/assets/game/sticker-bc-stack.png";
import est2017 from "@/assets/game/sticker-est2017.png";
import hailCoffee from "@/assets/game/sticker-hail-coffee.png";
import cabista from "@/assets/game/sticker-cabista.png";
import mindTheCabPill from "@/assets/game/sticker-mind-the-cab.png";
import bcBar from "@/assets/game/sticker-bc-bar.png";
import bcCpCream from "@/assets/game/sticker-bc-coffee-people-cream.png";
import bcTagCream from "@/assets/game/sticker-bc-tag-cream.png";
import bcTagOrange from "@/assets/game/sticker-bc-tag-orange.png";

interface Props { kind: ItemKind; size: number; }

// Aspect ratios for the imported brand stickers (width / height)
const STICKER_AR: Partial<Record<ItemKind, number>> = {
  bc_stack: 210 / 138,
  est2017_pill: 192 / 61,
  hail_coffee: 276 / 55,
  cabista: 182 / 81,
  mind_the_cab_pill: 240 / 86,
  bc_bar: 339 / 53,
  bc_cp_cream: 203 / 67,
  bc_tag_cream: 181 / 93,
  bc_tag_orange: 232 / 162,
};

const StickerImg = ({ src, size, kind, alt }: { src: string; size: number; kind: ItemKind; alt: string }) => {
  const ar = STICKER_AR[kind] ?? 1;
  // size is the visual height target; scale up a bit so they read on the board
  const h = size * 1.05;
  const w = h * ar;
  return (
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      style={{
        width: w,
        height: h,
        objectFit: "contain",
        filter: "drop-shadow(0 0 6px hsl(var(--olive-glow) / 0.45))",
        imageRendering: "auto",
      }}
      draggable={false}
    />
  );
};

// SVG sprites — small, crisp, on-brand. No emojis.
export const ItemSprite = ({ kind, size }: Props) => {
  const s = size;
  switch (kind) {
    case "matcha": {
      // Anchor the cup to the cell center via absolute translate so it stays
      // perfectly centered at any portrait resolution, regardless of cellW/cellH ratio.
      const h = s;
      const w = h * (400 / 512);
      return (
        <img
          src={cupMatcha}
          alt="Matcha"
          width={w}
          height={h}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: w,
            height: h,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 6px hsl(var(--matcha) / 0.55)) drop-shadow(0 0 10px hsl(var(--matcha) / 0.35))",
          }}
          draggable={false}
        />
      );
    }
    case "coffee": {
      const h = s;
      const w = h * (440 / 512);
      return (
        <img
          src={cupCoffee}
          alt="Coffee"
          width={w}
          height={h}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: w,
            height: h,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 6px hsl(var(--cream) / 0.5)) drop-shadow(0 0 10px hsl(var(--olive-glow) / 0.35))",
          }}
          draggable={false}
        />
      );
    }
    case "people":
    case "person_boy":
    case "person_girl": {
      // Minimal premium "community" glyph — two abstract figures in cream
      // with an olive accent halo. Replaces the previous photo headshots
      // (no boy/girl distinction). Anchored to cell center via translate so
      // it lands dead-centre at every breakpoint.
      const d = s * 1.0;
      return (
        <svg
          width={d}
          height={d}
          viewBox="0 0 32 32"
          aria-label="People"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            filter:
              "drop-shadow(0 0 4px hsl(var(--olive-glow) / 0.45)) drop-shadow(0 1px 2px hsl(0 0% 0% / 0.55))",
          }}
        >
          {/* subtle olive backplate */}
          <circle cx="16" cy="16" r="14" fill="hsl(var(--olive) / 0.14)" stroke="hsl(var(--olive) / 0.55)" strokeWidth="0.8" />
          {/* back figure (olive) */}
          <circle cx="20.5" cy="12.5" r="3" fill="hsl(var(--olive))" />
          <path d="M13 24c0.6-3.6 3.6-5.6 7.5-5.6S27.4 20.4 28 24" fill="hsl(var(--olive))" />
          {/* front figure (cream) */}
          <circle cx="12" cy="13.5" r="3.4" fill="hsl(var(--cream))" />
          <path d="M4 25c0.7-3.9 3.7-6 8-6s7.3 2.1 8 6" fill="hsl(var(--cream))" />
        </svg>
      );
    }
    case "mtc_sticker":
      return (
        <svg width={s * 1.6} height={s} viewBox="0 0 26 16">
          <rect x="1" y="3" width="24" height="10" rx="5" fill="hsl(var(--orange-sticker))" />
          <path d="M7 8h10M14 5l3 3-3 3" stroke="hsl(0 0% 6%)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cp_sticker":
      return (
        <svg width={s * 1.6} height={s} viewBox="0 0 26 16">
          <rect x="1" y="3" width="24" height="10" rx="5" fill="hsl(var(--olive))" />
          <text x="13" y="11" textAnchor="middle" fontSize="6" fontWeight="800" fill="hsl(0 0% 6%)" fontFamily="Inter, sans-serif">C&P</text>
        </svg>
      );
    case "est_sticker":
      return (
        <svg width={s * 1.6} height={s} viewBox="0 0 26 16">
          <rect x="1" y="3" width="24" height="10" rx="2" fill="hsl(var(--cream))" />
          <text x="13" y="11" textAnchor="middle" fontSize="6" fontWeight="800" fill="hsl(0 0% 6%)" fontFamily="Inter, sans-serif">EST·17</text>
        </svg>
      );
    case "cabbie_sticker":
      return (
        <svg width={s * 1.6} height={s} viewBox="0 0 26 16">
          <rect x="1" y="3" width="24" height="10" rx="2" fill="hsl(0 0% 6%)" stroke="hsl(var(--olive))" />
          <text x="13" y="11" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="hsl(var(--olive))" fontFamily="Inter, sans-serif">CABBIE</text>
        </svg>
      );
    case "bc_artifact":
      return (
        <svg width={s * 1.2} height={s * 1.2} viewBox="0 0 20 20">
          <rect x="2" y="2" width="16" height="16" rx="2" fill="hsl(var(--bc-blue))" />
          <text x="10" y="14" textAnchor="middle" fontSize="9" fontWeight="900" fill="white" fontFamily="Inter, sans-serif">BC</text>
        </svg>
      );
    case "bc_stack":
      return <StickerImg src={bcStack} size={s} kind="bc_stack" alt="BC stack" />;
    case "est2017_pill":
      return <StickerImg src={est2017} size={s} kind="est2017_pill" alt="est 2017" />;
    case "hail_coffee":
      return <StickerImg src={hailCoffee} size={s} kind="hail_coffee" alt="Hail a Coffee, Est 2017" />;
    case "cabista":
      return <StickerImg src={cabista} size={s} kind="cabista" alt="#Cabista" />;
    case "mind_the_cab_pill":
      return <StickerImg src={mindTheCabPill} size={s} kind="mind_the_cab_pill" alt="Mind the Cab" />;
    case "bc_bar":
      return <StickerImg src={bcBar} size={s} kind="bc_bar" alt="BC Coffee&People est 2017" />;
    case "bc_cp_cream":
      return <StickerImg src={bcCpCream} size={s} kind="bc_cp_cream" alt="BC Coffee&People" />;
    case "bc_tag_cream":
      return <StickerImg src={bcTagCream} size={s} kind="bc_tag_cream" alt="BC Coffee&People tag" />;
    case "bc_tag_orange":
      return <StickerImg src={bcTagOrange} size={s} kind="bc_tag_orange" alt="BC Coffee&People tag" />;
  }
};
