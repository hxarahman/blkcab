import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchOpenRoles, fetchQuestions, isRequiredFor, type JobRole, type QuizQuestion } from "@/lib/careers";

const MAX = 5 * 1024 * 1024;
const EXT = ["pdf", "doc", "docx"];
const GENERAL = "general";

const schema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(6, "Enter a phone number").max(30),
  role: z.string().min(1),
  right_to_work: z.enum(["yes", "no"], { required_error: "Please choose one" }),
  availability: z.enum(["Full-time", "Part-time", "Weekends", "Flexible"], { required_error: "Please choose one" }),
  start_date: z.string().trim().max(100).optional(),
  about: z.string().trim().max(3000).optional(),
  cv: z
    .custom<File>((v) => v instanceof File, "Please attach your CV")
    .refine((f) => f && EXT.includes(f.name.split(".").pop()?.toLowerCase() ?? ""), "CV must be PDF, DOC or DOCX")
    .refine((f) => f && f.size <= MAX, "CV must be 5 MB or smaller"),
  gdpr: z.literal(true, { errorMap: () => ({ message: "Please agree to continue" }) }),
});
type Values = z.infer<typeof schema>;

const Err = ({ m }: { m?: string }) => (m ? <p className="text-sm text-destructive mt-1">{m}</p> : null);

export const ApplicationForm = ({ defaultRoleId }: { defaultRoleId?: string }) => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizErr, setQuizErr] = useState<string | null>(null);
  const { register, handleSubmit, control, setValue, watch, trigger, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRoleId ?? GENERAL },
  });

  useEffect(() => { fetchOpenRoles().then(setRoles).catch(() => setRoles([])); }, []);
  useEffect(() => { if (defaultRoleId) setValue("role", defaultRoleId); }, [defaultRoleId, setValue]);
  const roleId = watch("role");
  const slug = roles.find((r) => r.id === roleId)?.slug ?? "general";
  useEffect(() => {
    let live = true;
    fetchQuestions(slug).then((q) => { if (live) { setQuestions(q); setAnswers({}); } }).catch(() => live && setQuestions([]));
    return () => { live = false; };
  }, [slug]);

  const next = async () => {
    if (step === 0) {
      const ok = await trigger(["full_name", "email", "phone", "role", "right_to_work", "availability", "start_date"]);
      if (ok) { setStep(1); window.scrollTo({ top: (document.getElementById("app-form")?.offsetTop ?? 0) - 80, behavior: "smooth" }); }
    } else if (step === 1) {
      const missing = questions.filter((q) => isRequiredFor(q, slug) && !answers[q.id]?.trim());
      if (missing.length) { setQuizErr(`Please answer all required questions (${missing.length} left).`); return; }
      setQuizErr(null); setStep(2);
    }
  };

  const onSubmit = async (v: Values) => {
    setError(null);
    try {
      const ext = v.cv.name.split(".").pop()?.toLowerCase();
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("cvs").upload(path, v.cv, { contentType: v.cv.type || undefined });
      if (up.error) throw up.error;
      const role = roles.find((r) => r.id === v.role);
      const { data: id, error: rpcErr } = await supabase.rpc("submit_application", {
        payload: {
          role_id: role?.id ?? null,
          full_name: v.full_name,
          email: v.email,
          phone: v.phone,
          right_to_work_uk: v.right_to_work === "yes",
          availability: v.start_date ? `${v.availability} — start: ${v.start_date}` : v.availability,
          about: v.about || null,
          cv_path: path,
          gdpr_consent: true,
          answers: questions.map((q) => q.level === "free_text"
            ? { question_id: q.id, answer_text: answers[q.id] ?? "" }
            : { question_id: q.id, answer_key: answers[q.id] ?? null }),
        },
      });
      if (rpcErr) throw rpcErr;
      supabase.functions.invoke("notify-application", { body: { application_id: id } }).catch(() => {});
      setDone(true);
    } catch {
      setError("Something went wrong sending your application. Please try again.");
    }
  };

  if (done) {
    return (
      <div className="border border-border p-10 text-center space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Thanks — we've got your application</h3>
        <p className="text-muted-foreground">We'll be in touch if there's a fit.</p>
      </div>
    );
  }

  return (
    <form id="app-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <ol className="grid grid-cols-3 gap-2" aria-label="Application steps">
        {["Your details", "Coffee questions", "CV & consent"].map((l, i) => (
          <li key={l} className="space-y-2" aria-current={i === step ? "step" : undefined}>
            <div className={`h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-accent" : "bg-border"}`} />
            <div className="flex items-center gap-2">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{i < step ? "✓" : i + 1}</span>
              <span className={`text-[11px] md:text-xs font-bold tracking-wide uppercase leading-tight ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{l}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className={step === 0 ? "space-y-6" : "hidden"}>
      <div className="grid md:grid-cols-2 gap-6">
        <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" {...register("full_name")} /><Err m={errors.full_name?.message} /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} /><Err m={errors.email?.message} /></div>
        <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" {...register("phone")} /><Err m={errors.phone?.message} /></div>
        <div><Label htmlFor="location">Location</Label><Input id="location" value="London" readOnly disabled /></div>
      </div>

      <div>
        <Label>Role</Label>
        <Controller control={control} name="role" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
              <SelectItem value={GENERAL}>General application / Other</SelectItem>
            </SelectContent>
          </Select>
        )} />
      </div>

      <div>
        <Label>Do you have the right to work in the UK?</Label>
        <Controller control={control} name="right_to_work" render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6 mt-2">
            <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="rtw-yes" /><Label htmlFor="rtw-yes">Yes</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="no" id="rtw-no" /><Label htmlFor="rtw-no">No</Label></div>
          </RadioGroup>
        )} />
        <Err m={errors.right_to_work?.message} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Availability</Label>
          <Controller control={control} name="availability" render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
              <SelectContent>
                {["Full-time", "Part-time", "Weekends", "Flexible"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
          <Err m={errors.availability?.message} />
        </div>
        <div><Label htmlFor="start_date">Earliest start date (optional)</Label><Input id="start_date" placeholder="e.g. 1 December" {...register("start_date")} /></div>
      </div>

      <Button type="button" variant="cta" onClick={next}>CONTINUE</Button>
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <p className="text-muted-foreground">A few quick questions so we can get to know your coffee knowledge. No pressure — answer as best you can.</p>
          {questions.map((q, i) => (
            <div key={q.id} className="space-y-3">
              <p className="font-medium">{i + 1}. {q.prompt}{!isRequiredFor(q, slug) && <span className="text-muted-foreground font-normal"> (optional)</span>}</p>
              {q.level === "free_text" ? (
                <Textarea rows={4} maxLength={3000} value={answers[q.id] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
              ) : (
                <RadioGroup value={answers[q.id] ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} className="space-y-2">
                  {(q.options as { key: string; label: string }[] | null ?? []).map((o) => (
                    <div key={o.key} className="flex items-start gap-3">
                      <RadioGroupItem value={o.key} id={`${q.id}-${o.key}`} className="mt-1" />
                      <Label htmlFor={`${q.id}-${o.key}`} className="font-normal leading-snug">{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
          {quizErr && <p className="text-sm text-destructive">{quizErr}</p>}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>BACK</Button>
            <Button type="button" variant="cta" onClick={next}>CONTINUE</Button>
          </div>
        </div>
      )}

      <div className={step === 2 ? "space-y-6" : "hidden"}>
      <div>
        <Label htmlFor="cv">CV (PDF, DOC or DOCX, max 5 MB)</Label>
        <Controller control={control} name="cv" render={({ field }) => (
          <Input id="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => field.onChange(e.target.files?.[0])} />
        )} />
        <Err m={errors.cv?.message as string | undefined} />
      </div>

      <div><Label htmlFor="about">Tell us about yourself</Label><Textarea id="about" rows={5} {...register("about")} /></div>

      <div className="space-y-2">
        <Controller control={control} name="gdpr" render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox id="gdpr" checked={field.value === true} onCheckedChange={(c) => field.onChange(c === true ? true : undefined)} />
            <Label htmlFor="gdpr" className="leading-snug">I agree to BLK CAB processing my details for this application.</Label>
          </div>
        )} />
        <p className="text-xs text-muted-foreground">
          We'll use your details only to assess your application and contact you about roles at BLK CAB. We keep applications for up to 12 months, then delete them. You can ask us to delete your data at any time by emailing hello@blkcab.coffee.
        </p>
        <Err m={errors.gdpr?.message} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>BACK</Button>
        <Button type="submit" variant="cta" disabled={isSubmitting}>{isSubmitting ? "SENDING…" : "SUBMIT APPLICATION"}</Button>
      </div>
      </div>
    </form>
  );
};
