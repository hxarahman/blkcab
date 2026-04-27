import { Button } from "@/components/ui/button";
import { ItemSprite } from "./ItemSprite";
import { HazardSprite } from "./HazardSprite";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-secondary/60 border border-border text-[10px] font-mono-brand uppercase tracking-wider whitespace-nowrap">
    {children}
  </span>
);

const Row = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="relative inline-flex items-center justify-center w-6 h-6 shrink-0">
      {icon}
    </span>
    {children}
  </div>
);

export const TutorialScreen = ({ onGo }: { onGo: () => void }) => {
  return (
    <div className="flex-1 flex flex-col gap-4 px-5 pt-4 pb-5 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono-brand text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            The rules
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight leading-none mt-1">
            How to ride
          </h2>
        </div>
        <span className="font-display font-black uppercase tracking-tight text-orange-sticker text-lg leading-none">
          BLK CAB
        </span>
      </div>

      {/* Main instruction — the only thing a queue actually reads */}
      <div className="rounded-md border border-olive/40 bg-card/70 backdrop-blur-sm p-4">
        <p className="font-display font-bold text-[15px] leading-snug text-cream tracking-tight">
          Swipe to ride. Collect good energy. Avoid the noise.
          Hit power modes. Highest score wins.
        </p>
        <p className="text-[11px] font-mono-brand uppercase tracking-[0.28em] text-muted-foreground mt-2">
          60 seconds · clock starts on first swipe
        </p>
      </div>

      {/* Secondary scoring — clean, scannable */}
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-mono-brand uppercase tracking-[0.3em] text-olive mb-1.5">
            Collect
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Row icon={<ItemSprite kind="matcha" size={20} />}>
              <Chip>Matcha +10</Chip>
            </Row>
            <Row icon={<ItemSprite kind="coffee" size={20} />}>
              <Chip>Coffee +10</Chip>
            </Row>
            <Row icon={<ItemSprite kind="people" size={20} />}>
              <Chip>People +15</Chip>
            </Row>
            <Row icon={<ItemSprite kind="bc_artifact" size={18} />}>
              <Chip>BC Artifact +100</Chip>
            </Row>
          </div>
          <p className="text-[10px] font-mono-brand uppercase tracking-[0.25em] text-muted-foreground mt-1.5">
            Real BC stickers drop rarely — bigger points, bigger powers.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-mono-brand uppercase tracking-[0.3em] text-orange-sticker mb-1.5">
            Avoid
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <Row icon={<HazardSprite kind="burnt_beans" size={20} />}>
              <Chip>−20</Chip>
            </Row>
            <Row icon={<HazardSprite kind="bad_reviews" size={20} />}>
              <Chip>−30</Chip>
            </Row>
            <Row icon={<HazardSprite kind="copycat" size={20} />}>
              <Chip>−40</Chip>
            </Row>
            <Row icon={<HazardSprite kind="queue_chaos" size={20} />}>
              <Chip>Slow</Chip>
            </Row>
            <Row icon={<HazardSprite kind="dead_energy" size={20} />}>
              <Chip>Resets ×</Chip>
            </Row>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono-brand uppercase tracking-[0.3em] text-cream mb-1.5">
            Power modes
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="sticker-pill bg-matcha text-[hsl(0_0%_6%)] text-[10px] px-2 py-0.5">Matcha Hypnosis</span>
            <span className="sticker-pill bg-orange-sticker text-[hsl(0_0%_6%)] text-[10px] px-2 py-0.5">No Compromise</span>
            <span className="sticker-pill bg-bc-blue text-[hsl(0_0%_6%)] text-[10px] px-2 py-0.5">Cabbie Stories</span>
            <span className="sticker-pill bg-cream text-[hsl(0_0%_6%)] text-[10px] px-2 py-0.5">BC Drop</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2 flex justify-center">
        <Button
          onClick={onGo}
          className="w-auto px-10 h-12 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold uppercase tracking-widest rounded-full shadow-olive"
        >
          Start Ride
        </Button>
      </div>
    </div>
  );
};
