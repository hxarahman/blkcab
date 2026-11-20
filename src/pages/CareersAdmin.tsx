import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { STATUSES, TEAMS, QUIZ_SLUGS, formatScore, type JobApplication, type JobRole, type QuizQuestion, type QuizOption } from "@/lib/careers";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <Helmet><title>Careers admin — BLK CAB®</title><meta name="robots" content="noindex" /></Helmet>
    <Header />
    <main className="pt-16 py-16 container mx-auto px-4 max-w-6xl">{children}</main>
  </div>
);

const PasswordLinkRequest = ({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) => {
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-sm mx-auto space-y-4 pt-16">
      <h1 className="text-2xl md:text-3xl font-bold uppercase">Set or reset your password</h1>
      {submitted ? <p role="status">If that email has admin access, we've sent a link to set your password.</p> : (
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          setBusy(true);
          try {
            await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
              redirectTo: `${window.location.origin}/careers/admin/set-password`,
            });
          } catch {
            // Never reveal whether an address has access or a message was sent.
          } finally {
            setBusy(false);
            setSubmitted(true);
          }
        }}>
          <div><Label htmlFor="recovery-email">Email</Label><Input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <Button type="submit" variant="cta" disabled={busy}>{busy ? "Requesting…" : "Send password link"}</Button>
        </form>
      )}
      <Button type="button" variant="link" className="px-0" onClick={onBack}>Back to sign in</Button>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const [requestPassword, setRequestPassword] = useState(false);
  if (requestPassword) return <PasswordLinkRequest initialEmail={email} onBack={() => setRequestPassword(false)} />;
  return (
    <form className="max-w-sm mx-auto space-y-4 pt-16" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr("Sign in failed. Check your email and password.");
      setBusy(false);
    }}>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Careers admin</h1>
      <div><Label htmlFor="em">Email</Label><Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" variant="cta" disabled={busy}>SIGN IN</Button>
        <Button type="button" variant="link" className="px-0" onClick={() => setRequestPassword(true)}>Set or reset your password</Button>
      </div>
    </form>
  );
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

const Applications = ({ roles }: { roles: JobRole[] }) => {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [status, setStatus] = useState("all"); const [role, setRole] = useState("all");
  const [open, setOpen] = useState<JobApplication | null>(null);
  const [sort, setSort] = useState("newest"); const [minScore, setMinScore] = useState("0");
  const load = useCallback(async () => {
    const { data } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false });
    setApps(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);
  const update = async (id: string, patch: Partial<JobApplication>) => {
    const { error } = await supabase.from("job_applications").update(patch).eq("id", id);
    if (error) return toast.error("Could not save");
    toast.success("Saved"); load(); setOpen((o) => (o && o.id === id ? { ...o, ...patch } : o));
  };
  const downloadCv = async (path: string) => {
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(path, 60);
    if (error || !data) return toast.error("Could not open CV");
    window.open(data.signedUrl, "_blank", "noopener");
  };
  const shown = apps
    .filter((a) => (status === "all" || a.status === status) && (role === "all" || (role === "general" ? !a.role_id : a.role_id === role)))
    .filter((a) => Number(minScore) === 0 || (a.quiz_score_pct ?? -1) >= Number(minScore))
    .sort((x, y) => sort === "score" ? (y.quiz_score_pct ?? -1) - (x.quiz_score_pct ?? -1) : (y.created_at ?? "").localeCompare(x.created_at ?? ""));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={role} onValueChange={setRole}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All roles</SelectItem><SelectItem value="general">General application</SelectItem>{roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}</SelectContent></Select>
        <Select value={minScore} onValueChange={setMinScore}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{["0", "50", "70", "80", "90"].map((v) => <SelectItem key={v} value={v}>{v === "0" ? "Any score" : `Score ≥ ${v}%`}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="score">Sort by score</SelectItem></SelectContent></Select>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Right to work</TableHead><TableHead>Availability</TableHead><TableHead className="cursor-pointer" onClick={() => setSort(sort === "score" ? "newest" : "score")}>Quiz score {sort === "score" ? "↓" : ""}</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {shown.map((a) => (
            <TableRow key={a.id} className="cursor-pointer" onClick={() => setOpen(a)}>
              <TableCell>{a.created_at ? new Date(a.created_at).toLocaleDateString("en-GB") : ""}</TableCell>
              <TableCell>{a.full_name}</TableCell><TableCell>{a.role_title}</TableCell>
              <TableCell>{a.right_to_work_uk ? "Yes" : "No"}</TableCell><TableCell>{a.availability}</TableCell><TableCell>{formatScore(a)}</TableCell><TableCell>{a.status}</TableCell>
            </TableRow>
          ))}
          {shown.length === 0 && <TableRow><TableCell colSpan={7} className="text-muted-foreground">No applications.</TableCell></TableRow>}
        </TableBody>
      </Table>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {open && <AppDetail app={open} onSave={update} onCv={downloadCv} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AppDetail = ({ app, onSave, onCv }: { app: JobApplication; onSave: (id: string, p: Partial<JobApplication>) => void; onCv: (p: string) => void }) => {
  const [notes, setNotes] = useState(app.admin_notes ?? "");
  const [qa, setQa] = useState<{ q: QuizQuestion; ans: { answer_key: string | null; answer_text: string | null; is_correct: boolean | null } | null; correct?: string }[]>([]);
  useEffect(() => {
    (async () => {
      const [{ data: ans }, { data: qs }, { data: keys }] = await Promise.all([
        supabase.from("application_answers").select("*").eq("application_id", app.id),
        supabase.from("quiz_questions").select("*").order("sort_order"),
        supabase.from("quiz_answer_keys").select("*"),
      ]);
      const ids = new Set((ans ?? []).map((a) => a.question_id));
      setQa((qs ?? []).filter((q) => ids.has(q.id)).map((q) => ({ q, ans: (ans ?? []).find((a) => a.question_id === q.id) ?? null, correct: (keys ?? []).find((k) => k.question_id === q.id)?.correct_key })));
    })();
  }, [app.id]);
  const label = (q: QuizQuestion, k?: string | null) => (q.options as QuizOption[] | null)?.find((o) => o.key === k)?.label ?? k ?? "—";
  return (
    <>
      <DialogHeader><DialogTitle>{app.full_name} — {app.role_title}</DialogTitle></DialogHeader>
      <div className="space-y-2 text-sm">
        <p><b>Email:</b> {app.email}</p><p><b>Phone:</b> {app.phone}</p><p><b>Location:</b> {app.location}</p>
        <p><b>Right to work UK:</b> {app.right_to_work_uk ? "Yes" : "No"}</p><p><b>Availability:</b> {app.availability}</p>
        <p><b>About:</b> {app.about || "—"}</p>
        <p><b>Consent:</b> {app.consent_at ? new Date(app.consent_at).toLocaleString("en-GB") : ""}</p>
      </div>
      {app.cv_path && <Button variant="outline" onClick={() => onCv(app.cv_path!)}>DOWNLOAD CV</Button>}
      <div className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide uppercase">Quiz — {formatScore(app)}</h3>
        {qa.length === 0 && <p className="text-sm text-muted-foreground">No quiz answers.</p>}
        {qa.map(({ q, ans, correct }) => (
          <div key={q.id} className="text-sm border-b border-border pb-2">
            <p className="font-medium">{q.code}. {q.prompt}</p>
            {q.level === "free_text" ? <p className="whitespace-pre-wrap text-muted-foreground">{ans?.answer_text || "—"}</p> : (
              <p>{ans?.is_correct ? "✓" : "✗"} {label(q, ans?.answer_key)}{!ans?.is_correct && <span className="text-muted-foreground"> — correct: {label(q, correct)}</span>}</p>
            )}
          </div>
        ))}
      </div>
      <div><Label>Status</Label>
        <Select value={app.status} onValueChange={(s) => onSave(app.id, { status: s })}><SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
      <div><Label>Admin notes</Label><Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
      <Button variant="cta" onClick={() => onSave(app.id, { admin_notes: notes })}>SAVE NOTES</Button>
    </>
  );
};

const emptyRole = { slug: "", title: "", team: "Front of House", summary: "", description: "", responsibilities: "", requirements: "", pay: "Competitive", hours: "Competitive — flexible shift patterns", perks: "Competitive benefits package", employment_type: "FULL_TIME" };
type RoleForm = typeof emptyRole;
const toForm = (r: JobRole): RoleForm => ({ slug: r.slug, title: r.title, team: r.team ?? "", summary: r.summary ?? "", description: r.description ?? "", responsibilities: (r.responsibilities ?? []).join("\n"), requirements: (r.requirements ?? []).join("\n"), pay: r.pay ?? "", hours: r.hours ?? "", perks: (r.perks ?? []).join("\n"), employment_type: r.employment_type ?? "FULL_TIME" });

const Roles = ({ roles, reload }: { roles: JobRole[]; reload: () => void }) => {
  const [editing, setEditing] = useState<{ id?: string; form: RoleForm } | null>(null);
  const toggle = async (r: JobRole) => { await supabase.from("job_roles").update({ is_open: !r.is_open }).eq("id", r.id); reload(); };
  const save = async () => {
    if (!editing) return;
    const f = editing.form;
    const slug = (f.slug || f.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!f.title || !slug) return toast.error("Title is required");
    const row = { slug, title: f.title, team: f.team, summary: f.summary, description: f.description, responsibilities: lines(f.responsibilities), requirements: lines(f.requirements), pay: f.pay, hours: f.hours, perks: lines(f.perks), employment_type: f.employment_type };
    const { error } = editing.id
      ? await supabase.from("job_roles").update(row).eq("id", editing.id)
      : await supabase.from("job_roles").insert({ ...row, sort_order: roles.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Role saved"); setEditing(null); reload();
  };
  const set = (k: keyof RoleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditing((s) => s && { ...s, form: { ...s.form, [k]: e.target.value } });
  return (
    <div className="space-y-4">
      <Button variant="cta" onClick={() => setEditing({ form: { ...emptyRole } })}>ADD ROLE</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Team</TableHead><TableHead>Open</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>{roles.map((r) => (
          <TableRow key={r.id}><TableCell>{r.title}</TableCell><TableCell>{r.team}</TableCell>
            <TableCell><Switch checked={!!r.is_open} onCheckedChange={() => toggle(r)} /></TableCell>
            <TableCell><Button size="sm" variant="outline" onClick={() => setEditing({ id: r.id, form: toForm(r) })}>EDIT</Button></TableCell></TableRow>
        ))}</TableBody>
      </Table>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit role" : "New role"}</DialogTitle></DialogHeader>
          {editing && <div className="space-y-3">
            <div><Label>Title</Label><Input value={editing.form.title} onChange={set("title")} /></div>
            <div><Label>Slug (URL)</Label><Input value={editing.form.slug} onChange={set("slug")} placeholder="auto from title" /></div>
            <div><Label>Team</Label>
              <Select value={editing.form.team} onValueChange={(v) => setEditing((s) => s && { ...s, form: { ...s.form, team: v } })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TEAMS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Employment type</Label>
              <Select value={editing.form.employment_type} onValueChange={(v) => setEditing((s) => s && { ...s, form: { ...s.form, employment_type: v } })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["FULL_TIME", "PART_TIME", "TEMPORARY", "CONTRACTOR"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Summary</Label><Textarea rows={2} value={editing.form.summary} onChange={set("summary")} /></div>
            <div><Label>Description</Label><Textarea rows={4} value={editing.form.description} onChange={set("description")} /></div>
            <div><Label>Responsibilities (one per line)</Label><Textarea rows={4} value={editing.form.responsibilities} onChange={set("responsibilities")} /></div>
            <div><Label>Requirements (one per line)</Label><Textarea rows={4} value={editing.form.requirements} onChange={set("requirements")} /></div>
            <div><Label>Pay</Label><Input value={editing.form.pay} onChange={set("pay")} /></div>
            <div><Label>Hours</Label><Input value={editing.form.hours} onChange={set("hours")} /></div>
            <div><Label>Perks (one per line)</Label><Textarea rows={3} value={editing.form.perks} onChange={set("perks")} /></div>
            <Button variant="cta" onClick={save}>SAVE ROLE</Button>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Settings = () => {
  const [email, setEmail] = useState(""); const [enabled, setEnabled] = useState(false);
  useEffect(() => { supabase.from("careers_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => { if (data) { setEmail(data.notification_email ?? ""); setEnabled(!!data.notifications_enabled); } }); }, []);
  const save = async () => {
    const { error } = await supabase.from("careers_settings").upsert({ id: 1, notification_email: email.trim(), notifications_enabled: enabled });
    error ? toast.error("Could not save") : toast.success("Settings saved");
  };
  return (
    <div className="max-w-md space-y-4">
      <div><Label>Notification email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="flex items-center gap-3"><Switch checked={enabled} onCheckedChange={setEnabled} id="ne" /><Label htmlFor="ne">Email notifications enabled</Label></div>
      <p className="text-xs text-muted-foreground">Emails only send once the email service keys are added, even if enabled.</p>
      <Button variant="cta" onClick={save}>SAVE SETTINGS</Button>
    </div>
  );
};


type QForm = { id?: string; code: string; level: string; prompt: string; options: string; correct: string; applies_to: string[]; required: boolean; sort_order: number; is_active: boolean };
const QuizAdmin = () => {
  const [qs, setQs] = useState<QuizQuestion[]>([]); const [keys, setKeys] = useState<Record<string, string>>({});
  const [ed, setEd] = useState<QForm | null>(null);
  const load = useCallback(async () => {
    const [{ data }, { data: k }] = await Promise.all([supabase.from("quiz_questions").select("*").order("sort_order"), supabase.from("quiz_answer_keys").select("*")]);
    setQs(data ?? []); setKeys(Object.fromEntries((k ?? []).map((x) => [x.question_id, x.correct_key])));
  }, []);
  useEffect(() => { load(); }, [load]);
  const toForm = (q: QuizQuestion): QForm => ({ id: q.id, code: q.code, level: q.level, prompt: q.prompt, options: ((q.options as QuizOption[] | null) ?? []).map((o) => `${o.key}) ${o.label}`).join("\n"), correct: keys[q.id] ?? "", applies_to: q.applies_to, required: q.required !== false, sort_order: q.sort_order ?? 0, is_active: !!q.is_active });
  const save = async () => {
    if (!ed || !ed.code.trim() || !ed.prompt.trim()) return toast.error("Code and question are required");
    const options = ed.level === "free_text" ? null : lines(ed.options).map((l) => { const m = l.match(/^([a-z0-9]+)\)\s*(.+)$/i); return m ? { key: m[1].toLowerCase(), label: m[2] } : null; }).filter(Boolean) as QuizOption[];
    if (options && (options.length < 2 || !options.some((o) => o.key === ed.correct.trim().toLowerCase()))) return toast.error("Add at least 2 options like 'a) Answer' and a correct key that matches one");
    const row = { code: ed.code.trim(), level: ed.level, prompt: ed.prompt.trim(), options, applies_to: ed.applies_to, required: ed.required, sort_order: ed.sort_order, is_active: ed.is_active };
    const res = ed.id ? await supabase.from("quiz_questions").update(row).eq("id", ed.id).select().single() : await supabase.from("quiz_questions").insert(row).select().single();
    if (res.error || !res.data) return toast.error(res.error?.message ?? "Could not save");
    if (options) { const { error } = await supabase.from("quiz_answer_keys").upsert({ question_id: res.data.id, correct_key: ed.correct.trim().toLowerCase() }); if (error) return toast.error(error.message); }
    toast.success("Question saved"); setEd(null); load();
  };
  const toggle = async (q: QuizQuestion) => { await supabase.from("quiz_questions").update({ is_active: !q.is_active }).eq("id", q.id); load(); };
  return (
    <div className="space-y-4">
      <Button variant="cta" onClick={() => setEd({ code: "", level: "basic", prompt: "", options: "a) \nb) \nc) \nd) ", correct: "", applies_to: [...QUIZ_SLUGS], required: true, sort_order: qs.length + 1, is_active: true })}>ADD QUESTION</Button>
      <Table>
        <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Level</TableHead><TableHead>Question</TableHead><TableHead>Answer</TableHead><TableHead>Active</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>{qs.map((q) => (
          <TableRow key={q.id}><TableCell>{q.code}</TableCell><TableCell>{q.level}</TableCell><TableCell className="max-w-md">{q.prompt}</TableCell><TableCell>{keys[q.id] ?? "—"}</TableCell>
            <TableCell><Switch checked={!!q.is_active} onCheckedChange={() => toggle(q)} /></TableCell>
            <TableCell><Button size="sm" variant="outline" onClick={() => setEd(toForm(q))}>EDIT</Button></TableCell></TableRow>
        ))}</TableBody>
      </Table>
      <Dialog open={!!ed} onOpenChange={(o) => !o && setEd(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{ed?.id ? "Edit question" : "New question"}</DialogTitle></DialogHeader>
          {ed && <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Code</Label><Input value={ed.code} onChange={(e) => setEd({ ...ed, code: e.target.value })} /></div>
              <div><Label>Level</Label><Select value={ed.level} onValueChange={(v) => setEd({ ...ed, level: v })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["basic", "advanced", "free_text"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Order</Label><Input type="number" value={ed.sort_order} onChange={(e) => setEd({ ...ed, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Question</Label><Textarea rows={2} value={ed.prompt} onChange={(e) => setEd({ ...ed, prompt: e.target.value })} /></div>
            {ed.level !== "free_text" && <>
              <div><Label>Options (one per line, e.g. "a) 1:2")</Label><Textarea rows={5} value={ed.options} onChange={(e) => setEd({ ...ed, options: e.target.value })} /></div>
              <div><Label>Correct option key</Label><Input value={ed.correct} onChange={(e) => setEd({ ...ed, correct: e.target.value })} placeholder="e.g. b" /></div>
            </>}
            <div><Label>Applies to</Label><div className="grid grid-cols-2 gap-2 mt-2">{QUIZ_SLUGS.map((sl) => (
              <label key={sl} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ed.applies_to.includes(sl)} onChange={(e) => setEd({ ...ed, applies_to: e.target.checked ? [...ed.applies_to, sl] : ed.applies_to.filter((x) => x !== sl) })} />{sl}</label>
            ))}</div></div>
            <div className="flex items-center gap-3"><Switch checked={ed.required} onCheckedChange={(v) => setEd({ ...ed, required: v })} id="qreq" /><Label htmlFor="qreq">Required</Label></div>
            <div className="flex items-center gap-3"><Switch checked={ed.is_active} onCheckedChange={(v) => setEd({ ...ed, is_active: v })} id="qact" /><Label htmlFor="qact">Active</Label></div>
            <Button variant="cta" onClick={save}>SAVE QUESTION</Button>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CareersAdmin = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<JobRole[]>([]);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!!ok);
    });
  }, [session]);
  const loadRoles = useCallback(async () => {
    const { data } = await supabase.from("job_roles").select("*").order("sort_order");
    setRoles(data ?? []);
  }, []);
  useEffect(() => { if (isAdmin) loadRoles(); }, [isAdmin, loadRoles]);

  if (state?.requestPassword === true) return <Shell><PasswordLinkRequest initialEmail="" onBack={() => navigate("/careers/admin", { replace: true, state: null })} /></Shell>;
  if (session === undefined) return <Shell><p className="text-muted-foreground">Loading…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (isAdmin === null) return <Shell><p className="text-muted-foreground">Checking access…</p></Shell>;
  if (!isAdmin) return <Shell><div className="space-y-4 pt-16 text-center"><h1 className="text-2xl md:text-3xl font-bold uppercase">Not authorised</h1><Button variant="outline" onClick={() => supabase.auth.signOut()}>SIGN OUT</Button></div></Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Careers admin</h1>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>SIGN OUT</Button>
      </div>
      <Tabs defaultValue="applications">
        <TabsList><TabsTrigger value="applications">APPLICATIONS</TabsTrigger><TabsTrigger value="roles">ROLES</TabsTrigger><TabsTrigger value="quiz">QUIZ</TabsTrigger><TabsTrigger value="settings">SETTINGS</TabsTrigger></TabsList>
        <TabsContent value="applications" className="pt-6"><Applications roles={roles} /></TabsContent>
        <TabsContent value="roles" className="pt-6"><Roles roles={roles} reload={loadRoles} /></TabsContent>
        <TabsContent value="quiz" className="pt-6"><QuizAdmin /></TabsContent>
        <TabsContent value="settings" className="pt-6"><Settings /></TabsContent>
      </Tabs>
    </Shell>
  );
};
export default CareersAdmin;
