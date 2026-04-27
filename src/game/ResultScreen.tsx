import { Button } from "@/components/ui/button";
import { Rank } from "@/game/types";
import { useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";

interface Props {
  score: number;
  rank: Rank;
  hasArtifact: boolean;
  onReplay: () => void;
  onHome: () => void;
}

const RANK_COPY: Record<string, string> = {
  Passenger: "Catch the next one. The street’s still warm.",
  Regular: "You know the corner. Order the usual.",
  "House Regular": "The cabbies nod. You belong here.",
  Cabbie: "You drive the room now. Coffee. Matcha. People.",
  "Cult Driver": "Cult status. The street whispers your name.",
  "BC Insider": "BC DROP — you saw what others missed.",
};

const NO_REWARD_COPY: Record<string, string> = {
  Passenger: "No code yet. Hop back in — House Regular unlocks the first sticker.",
  Regular: "Close. Push to House Regular for your first reward code.",
};

export const ResultScreen = ({ score, rank, hasArtifact, onReplay, onHome }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);
  const caption = `I scored ${score} on Mind The Cab — built for & around people · est. 2017 #CabbieStories`;

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-5 px-5 py-6 animate-fade-in">
      <div className="text-center mt-4">
        <p className="text-[11px] font-mono-brand uppercase tracking-[0.3em] text-muted-foreground">Round complete</p>
        <h2 className="font-display text-4xl font-bold mt-2 tracking-tight">{rank.name}</h2>
        <p className="text-foreground/80 mt-2 max-w-xs mx-auto text-balance">{RANK_COPY[rank.name]}</p>
      </div>

      <div className="rounded-sm border border-border bg-card p-5 text-center">
        <div className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground">Score</div>
        <div className="font-display text-6xl font-bold tabular-nums text-olive">{score}</div>
        {hasArtifact && (
          <div className="mt-2 inline-block sticker-pill bg-bc-blue text-[hsl(0_0%_6%)]">BC ARTIFACT</div>
        )}
      </div>

      {rank.code ? (
        <div className="rounded-sm border border-border bg-secondary/40 p-4">
          <div className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground">Reward Code</div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono-brand font-bold text-lg text-orange-sticker tracking-wider">{rank.code}</span>
            <button
              aria-label="Copy reward code"
              onClick={() => copy(rank.code!, "code")}
              className="text-foreground/80 hover:text-foreground p-2 rounded-sm border border-border bg-card"
            >
              {copied === "code" ? <Check className="w-4 h-4 text-matcha" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-[11px] font-mono-brand uppercase tracking-[0.22em] text-cream/80">
            Show this screen at the counter.
          </p>
        </div>
      ) : (
        <div className="rounded-sm border border-border bg-secondary/40 p-4 text-sm text-muted-foreground text-center">
          {NO_REWARD_COPY[rank.name] ?? "No reward this round. Keep riding."}
        </div>
      )}

      <button
        onClick={() => copy(caption, "caption")}
        className="rounded-sm border border-border bg-card p-4 text-left hover:border-olive transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground">Caption</span>
          {copied === "caption" ? <Check className="w-4 h-4 text-matcha" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
        </div>
        <p className="text-sm mt-1">{caption}</p>
      </button>

      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={onReplay}
          className="w-auto px-10 h-12 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold uppercase tracking-widest rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Play Again
        </Button>
        <Button
          variant="ghost"
          onClick={onHome}
          className="w-auto px-6 h-10 text-muted-foreground hover:text-foreground font-mono-brand uppercase tracking-widest text-xs"
        >
          Back to start
        </Button>
      </div>

      <p className="text-center text-[10px] font-mono-brand uppercase tracking-[0.3em] text-muted-foreground mt-2">
        Mind The Cab · built for &amp; around people · est. 2017
      </p>
    </div>
  );
};
