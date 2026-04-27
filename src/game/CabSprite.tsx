import { Dir } from "@/game/types";
import londonCab from "@/assets/game/london-cab.png";

// Real London black cab photo. The source asset faces RIGHT (3/4 side view).
// IMPORTANT: a side-view vehicle must be MIRRORED to face left, not rotated
// 180° — rotating it would flip the roof/wheels and put the cab upside-down.
// We only rotate ±90° for up/down.
export const CabSprite = ({ size, dir, glow }: { size: number; dir: Dir; glow?: string }) => {
  let transform: string;
  switch (dir) {
    case "right": transform = "scaleX(1)"; break;
    case "left":  transform = "scaleX(-1)"; break;       // mirror, keep wheels down
    case "up":    transform = "rotate(-90deg)"; break;
    case "down":  transform = "rotate(90deg)"; break;
  }
  // Native ratio of processed asset is 593x369 (~1.607)
  const ratio = 593 / 369;
  const h = size;
  const w = h * ratio;
  return (
    <img
      src={londonCab}
      alt="London black cab"
      width={w}
      height={h}
      draggable={false}
      style={{
        width: w,
        height: h,
        objectFit: "contain",
        transform,
        transformOrigin: "center center",
        filter: glow
          ? `drop-shadow(0 2px 4px hsl(0 0% 0% / 0.6)) drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 14px ${glow})`
          : "drop-shadow(0 2px 4px hsl(0 0% 0% / 0.6)) drop-shadow(0 0 8px hsl(60 60% 60% / 0.6))",
      }}
    />
  );
};
