import { Button } from "@/components/ui/button";
import { Rank } from "@/game/types";
import { useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Leaderboard } from "@/game/Leaderboard";

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

const formSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60, "Name too long"),
  email: z.string().trim().email("Enter a valid email").max(255),
  initials: z.string().regex(/^[A-Z]{3}$/, "Initials: 3 letters"),
});

const initialsSchema = z.string().regex(/^[A-Z]{3}$/, "Initials: 3 letters");

interface RewardInfo {
  code: string;
  reward_label: string;
  expires_at: string;
  existing?: boolean;
}

const inputCls =
  "w-full rounded-sm border border-border bg-card px-3 py-2.5 text-sm font-mono-brand text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-olive transition-colors";

export const ResultScreen = ({ score, rank, hasArtifact, onReplay, onHome }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<RewardInfo | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);
  const queryClient = useQueryClient();

  const qualifies = rank.code !== null;
  const caption = `I scored ${score} on Mind The Cab — built for & around people · est. 2017 #CabbieStories`;

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const onInitialsChange = (v: string) =>
    setInitials(v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3));

  const submitScore = async (ini: string) => {
    if (scoreSaved) return;
    const { error: insErr } = await supabase
      .from("game_scores")
      .insert({ initials: ini, score, rank_name: rank.name });
    if (!insErr) {
      setScoreSaved(true);
      queryClient.invalidateQueries({ queryKey: ["top-scores"] });
    }
    return insErr;
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = formSchema.safeParse({ firstName, email, initials });
    if (!v.success) {
      setError(v.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    try {
      // Post to leaderboard (best effort — reward flow continues regardless)
      await submitScore(v.data.initials);
      const { data, error: fnError } = await supabase.functions.invoke("issue-reward", {
        body: {
          first_name: v.data.firstName,
          email: v.data.email.toLowerCase(),
          score,
          rank_name: rank.name,
          marketing_opt_in: optIn,
        },
      });
      if (fnError || !data?.code) throw fnError ?? new Error("No code returned");
      setReward(data as RewardInfo);
    } catch {
      setError("Couldn't issue code — try again");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = initialsSchema.safeParse(initials);
    if (!v.success) {
      setError(v.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const insErr = await submitScore(v.data);
    setSubmitting(false);
    if (insErr) setError("Couldn't save your score — try again");
  };

  const expiryLabel = reward
    ? new Date(reward.expires_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex-1 flex flex-col gap-5 px-5 py-6 animate-fade-in overflow-y-auto">
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

      {/* Reward flow */}
      {qualifies && reward && (
        <div className="rounded-sm border border-border bg-secondary/40 p-4">
          <div className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground">
            Reward Code — {reward.reward_label}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono-brand font-bold text-lg text-orange-sticker tracking-wider">{reward.code}</span>
            <button
              aria-label="Copy reward code"
              onClick={() => copy(reward.code, "code")}
              className="text-foreground/80 hover:text-foreground p-2 rounded-sm border border-border bg-card"
            >
              {copied === "code" ? <Check className="w-4 h-4 text-matcha" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs font-mono-brand uppercase tracking-widest text-foreground/70">
            Valid until {expiryLabel}
          </p>
          {reward.existing && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              This is your active code — one live code at a time.
            </p>
          )}
          <p className="mt-2 text-[11px] font-mono-brand uppercase tracking-[0.22em] text-cream/80">
            Show this screen at the counter.
          </p>
          <p className="mt-1 text-[10px] font-mono-brand uppercase tracking-[0.18em] text-muted-foreground">
            One per person. Staff will scan/verify.
          </p>
        </div>
      )}

      {qualifies && !reward && (
        <form onSubmit={handleUnlock} className="rounded-sm border border-border bg-secondary/40 p-4 space-y-3">
          <div className="text-[11px] font-mono-brand uppercase tracking-widest text-orange-sticker">
            You earned a reward — claim it
          </div>
          <div className="grid grid-cols-[1fr_84px] gap-2">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={60}
              className={inputCls}
              autoComplete="given-name"
            />
            <input
              type="text"
              placeholder="AAA"
              aria-label="Leaderboard initials"
              value={initials}
              onChange={(e) => onInitialsChange(e.target.value)}
              maxLength={3}
              className={`${inputCls} text-center tracking-[0.35em] uppercase`}
            />
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className={inputCls}
            autoComplete="email"
            inputMode="email"
          />
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[hsl(var(--olive))]"
            />
            <span className="text-[11px] text-foreground/75 leading-snug">
              Keep me posted — BLK CAB drops &amp; new locations
            </span>
          </label>
          {error && (
            <p className="text-xs font-mono-brand uppercase tracking-widest text-orange-sticker">{error}</p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold uppercase tracking-[0.2em] rounded-full"
          >
            {submitting ? "Unlocking…" : "Unlock My Reward"}
          </Button>
        </form>
      )}

      {/* No reward tier — leaderboard entry only */}
      {!qualifies && !scoreSaved && (
        <form onSubmit={handleJoinBoard} className="rounded-sm border border-border bg-secondary/40 p-4 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {NO_REWARD_COPY[rank.name] ?? "No reward this round. Keep riding."}
          </p>
          <div className="flex items-center gap-2 justify-center">
            <input
              type="text"
              placeholder="AAA"
              aria-label="Leaderboard initials"
              value={initials}
              onChange={(e) => onInitialsChange(e.target.value)}
              maxLength={3}
              className={`${inputCls} max-w-[110px] text-center tracking-[0.35em] uppercase`}
            />
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 px-5 bg-olive hover:bg-olive/90 text-[hsl(0_0%_6%)] font-display font-bold uppercase tracking-[0.16em] rounded-full text-xs"
            >
              {submitting ? "Saving…" : "Join the Leaderboard"}
            </Button>
          </div>
          {error && (
            <p className="text-xs font-mono-brand uppercase tracking-widest text-orange-sticker text-center">{error}</p>
          )}
        </form>
      )}

      {!qualifies && scoreSaved && (
        <div className="rounded-sm border border-border bg-secondary/40 p-4 text-center">
          <p className="text-sm font-mono-brand uppercase tracking-widest text-matcha">
            {initials} is on the board.
          </p>
        </div>
      )}

      <Leaderboard />

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
