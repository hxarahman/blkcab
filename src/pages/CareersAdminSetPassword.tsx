import { useEffect, useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CAREERS_PASSWORD_MIN_LENGTH, validateCareersPassword } from "@/lib/careersPassword";

// Capture the recovery callback before the auth client clears the fragment.
const openedFromRecoveryLink = (() => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  return window.location.pathname === "/careers/admin/set-password"
    && fragment.get("type") === "recovery" && fragment.has("access_token");
})();

export default function CareersAdminSetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let recoveryReceived = false;
    let signedOut = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        recoveryReceived = true;
        setStatus("ready");
      } else if (event === "SIGNED_OUT") {
        signedOut = true;
        setStatus("invalid");
      }
    });

    void (async () => {
      const { error: initError } = await supabase.auth.initialize();
      if (!active || signedOut || recoveryReceived) return;
      if (initError || !openedFromRecoveryLink) {
        setStatus("invalid");
        return;
      }
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (active && !signedOut && !recoveryReceived) setStatus(user && !userError ? "ready" : "invalid");
    })().catch(() => { if (active && !recoveryReceived) setStatus("invalid"); });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "ready" || busy) return;
    const validationError = validateCareersPassword(password, confirmation);
    setError(validationError ?? "");
    if (validationError) return;

    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (!updateError) {
        navigate("/careers/admin", { replace: true });
      } else if (updateError.status === 401 || updateError.status === 403 || updateError.code === "session_not_found" || updateError.name === "AuthSessionMissingError") {
        setStatus("invalid");
      } else {
        setError(updateError.status === 422 ? updateError.message : "Could not save your password. Please try again.");
      }
    } catch {
      setError("Could not save your password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet><title>Set your Careers admin password — BLK CAB®</title><meta name="robots" content="noindex" /><meta name="referrer" content="no-referrer" /></Helmet>
      <Header />
      <main className="min-h-screen bg-muted pt-16"><div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-4 mt-16 rounded-2xl border border-border bg-card p-6 md:p-10 shadow-xl">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-accent">BLK CAB® Careers admin</p>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Set your password</h1>
          {status === "checking" && <p role="status">Checking your link…</p>}
          {status === "invalid" && <>
            <p role="alert">This password link is invalid or has expired.</p>
            <Button asChild variant="outline"><Link to="/careers/admin" state={{ requestPassword: true }}>Request a new link</Link></Button>
          </>}
          {status === "ready" && (
            <form className="space-y-4" onSubmit={save}>
              <div><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={CAREERS_PASSWORD_MIN_LENGTH} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
              <div><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={CAREERS_PASSWORD_MIN_LENGTH} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button variant="cta" type="submit" disabled={busy}>{busy ? "Saving…" : "Save password"}</Button>
            </form>
          )}
        </div>
      </div></main>
    </div>
  );
}