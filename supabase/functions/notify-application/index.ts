import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const Body = z.object({ application_id: z.string().uuid() });
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: "Invalid body" }, 400);
    const id = parsed.data.application_id;

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: settings } = await db.from("careers_settings").select("*").eq("id", 1).maybeSingle();
    if (!settings?.notifications_enabled || !settings.notification_email) return json({ sent: false, reason: "disabled" });

    const { data: app } = await db.from("job_applications").select("*").eq("id", id).maybeSingle();
    // Only fresh applications (last 30 min) to stop replay abuse.
    if (!app || Date.now() - new Date(app.created_at).getTime() > 30 * 60 * 1000) return json({ sent: false, reason: "not found" });

    const role = app.role_title || "General application";
    const result: Record<string, string> = {};

    // Atomically claim each send so it only ever happens once.
    const claim = async (col: "admin_notified_at" | "applicant_notified_at") => {
      const { data } = await db.from("job_applications").update({ [col]: new Date().toISOString() }).eq("id", id).is(col, null).select("id");
      return (data ?? []).length > 0;
    };
    const release = (col: string) => db.from("job_applications").update({ [col]: null }).eq("id", id);

    if (await claim("admin_notified_at")) {
      try {
        const quiz = app.quiz_total ? `${app.quiz_correct ?? 0}/${app.quiz_total} · ${app.quiz_score_pct ?? 0}%` : "No quiz";
        const submitted = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" }).format(new Date(app.created_at));
        const r = await sendTemplateEmail("careers-new-application", settings.notification_email, {
          templateData: { id: app.id, role, name: app.full_name, email: app.email, phone: app.phone, rightToWork: app.right_to_work_uk == null ? "—" : app.right_to_work_uk ? "Yes" : "No", availability: app.availability, quiz, submitted },
          idempotencyKey: `careers-new-application-${app.id}`,
          replyTo: app.email,
        });
        result.admin = r.sent ? "sent" : r.reason;
      } catch (e) { console.error("admin alert failed", e); await release("admin_notified_at"); result.admin = "failed"; }
    } else result.admin = "already";

    if (await claim("applicant_notified_at")) {
      try {
        const r = await sendTemplateEmail("careers-application-received", app.email, {
          templateData: { firstName: String(app.full_name).trim().split(/\s+/)[0], role },
          idempotencyKey: `careers-application-received-${app.id}`,
          replyTo: "careers@blkcab.com",
        });
        result.applicant = r.sent ? "sent" : r.reason;
      } catch (e) { console.error("applicant email failed", e); await release("applicant_notified_at"); result.applicant = "failed"; }
    } else result.applicant = "already";

    return json(result);
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error" }, 500);
  }
});
