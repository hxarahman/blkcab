import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import "../MindTheCab.css";

type RedeemStatus =
  | "valid"
  | "redeemed"
  | "already_redeemed"
  | "expired"
  | "not_found"
  | "invalid_pin"
  | "error";

interface RedeemResult {
  status: RedeemStatus;
  rank_name?: string;
  reward_label?: string;
  expires_at?: string;
  redeemed_at?: string;
  redeemed_location?: string;
}

const inputCls =
  "w-full rounded-sm border border-border bg-card px-4 py-4 text-2xl font-mono-brand text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-olive text-center tracking-widest";

const fmt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const STATUS_UI: Record<string, { label: string; cls: string }> = {
  valid: { label: "VALID", cls: "text-matcha" },
  redeemed: { label: "REDEEMED ✓", cls: "text-matcha" },
  already_redeemed: { label: "ALREADY REDEEMED", cls: "text-orange-sticker" },
  expired: { label: "EXPIRED", cls: "text-orange-sticker" },
  not_found: { label: "NOT FOUND", cls: "text-destructive-foreground" },
  error: { label: "ERROR", cls: "text-orange-sticker" },
};

const Redeem = () => {
  const [pin, setPin] = useState("");
  const [pinConfirmed, setPinConfirmed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [location, setLocation] = useState("St Christopher's Place");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [loading, setLoading] = useState(false);

  const call = async (action: "check" | "redeem") => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-code", {
        body: { code: code.trim(), staff_pin: pin, location, action },
      });
      if (error || !data?.status) throw error ?? new Error("No response");
      if (data.status === "invalid_pin") {
        setPinConfirmed(false);
        setPinError(true);
        setResult(null);
        return;
      }
      setResult(data as RedeemResult);
    } catch {
      setResult({ status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForNext = () => {
    setCode("");
    setResult(null);
  };

  return (
    <div className="mtc dark min-h-screen bg-background text-foreground flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <p className="text-[11px] font-mono-brand uppercase tracking-[0.35em] text-muted-foreground">
            BLK CAB · Staff Only
          </p>
          <h1 className="font-display text-3xl font-bold mt-2 tracking-tight">Redeem Reward Code</h1>
        </header>

        {!pinConfirmed ? (
          <div className="rounded-sm border border-border bg-card p-5 flex flex-col gap-4">
            <label className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground text-center">
              Enter staff PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setPinError(false);
              }}
              className={inputCls}
              autoFocus
            />
            {pinError && (
              <p className="text-sm font-mono-brand uppercase tracking-widest text-orange-sticker text-center">
                Wrong PIN — try again
              </p>
            )}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-sm border border-border bg-card px-3 py-3 text-base font-mono-brand text-foreground focus:outline-none focus:border-olive"
              aria-label="Location"
            >
              <option>St Christopher's Place</option>
              <option>12 Little Portland Street</option>
            </select>
            <button
              onClick={() => pin.length === 4 && setPinConfirmed(true)}
              disabled={pin.length !== 4}
              className="w-full h-14 rounded-full bg-olive text-[hsl(0_0%_6%)] font-display font-bold text-lg uppercase tracking-[0.2em] disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim().length >= 4 && !loading) call("check");
              }}
              className="rounded-sm border border-border bg-card p-5 flex flex-col gap-4"
            >
              <label className="text-[11px] font-mono-brand uppercase tracking-widest text-muted-foreground text-center">
                Reward code
              </label>
              <input
                type="text"
                placeholder="BC-XXXX-XXXX"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setResult(null);
                }}
                className={inputCls}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || code.trim().length < 4}
                className="w-full h-14 rounded-full bg-olive text-[hsl(0_0%_6%)] font-display font-bold text-lg uppercase tracking-[0.2em] disabled:opacity-40"
              >
                {loading ? "Checking…" : "Check Code"}
              </button>
            </form>

            {result && (
              <div className="rounded-sm border border-border bg-card p-6 text-center flex flex-col gap-3">
                <div className={`font-display font-black text-5xl tracking-tight ${STATUS_UI[result.status]?.cls ?? ""}`}>
                  {STATUS_UI[result.status]?.label}
                </div>

                {result.status === "error" && (
                  <p className="text-base text-muted-foreground">Couldn't check the code — try again.</p>
                )}
                {result.status === "not_found" && (
                  <p className="text-base text-muted-foreground">No code matches. Check the spelling.</p>
                )}
                {result.status === "expired" && (
                  <p className="text-base text-muted-foreground">Expired {fmt(result.expires_at)}.</p>
                )}
                {result.status === "already_redeemed" && (
                  <p className="text-base text-muted-foreground">
                    Redeemed {fmt(result.redeemed_at)}
                    {result.redeemed_location ? ` at ${result.redeemed_location}` : ""}.
                  </p>
                )}

                {(result.status === "valid" || result.status === "redeemed") && (
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold">{result.reward_label}</p>
                    <p className="text-base font-mono-brand uppercase tracking-widest text-muted-foreground">
                      {result.rank_name}
                    </p>
                    {result.status === "valid" && result.expires_at && (
                      <p className="text-sm text-muted-foreground">Valid until {fmt(result.expires_at)}</p>
                    )}
                  </div>
                )}

                {result.status === "valid" && (
                  <button
                    onClick={() => call("redeem")}
                    disabled={loading}
                    className="w-full h-16 mt-2 rounded-full bg-orange-sticker text-[hsl(0_0%_6%)] font-display font-black text-xl uppercase tracking-[0.18em] disabled:opacity-40"
                  >
                    {loading ? "Redeeming…" : "Confirm & Redeem"}
                  </button>
                )}

                {result.status !== "valid" && (
                  <button
                    onClick={resetForNext}
                    className="w-full h-12 mt-1 rounded-full border border-border text-foreground font-mono-brand uppercase tracking-[0.2em] text-sm"
                  >
                    Next code
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Redeem;
