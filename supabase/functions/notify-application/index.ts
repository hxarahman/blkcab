import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({ application_id: z.string().uuid() });
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: "Invalid body" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: settings } = await admin.from("careers_settings").select("*").eq("id", 1).maybeSingle();
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("CAREERS_FROM_EMAIL");
    if (!settings?.notifications_enabled || !apiKey || !from || !settings.notification_email) {
      return json({ sent: false, reason: "disabled" });
    }

    // Only notify for fresh applications (created in the last 10 minutes) to prevent replay abuse.
    const { data: app } = await admin.from("job_applications").select("*").eq("id", parsed.data.application_id).maybeSingle();
    if (!app || Date.now() - new Date(app.created_at).getTime() > 10 * 60 * 1000) return json({ sent: false, reason: "not found" });

    const send = (to: string, subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], subject, html }),
      });

    const alert = await send(settings.notification_email, `New application: ${app.role_title} — ${app.full_name}`,
      `<h2>New application</h2><p><b>Role:</b> ${esc(app.role_title)}</p><p><b>Name:</b> ${esc(app.full_name)}</p><p><b>Email:</b> ${esc(app.email)}</p><p><b>Phone:</b> ${esc(app.phone)}</p><p><b>Right to work UK:</b> ${app.right_to_work_uk ? "Yes" : "No"}</p><p><b>Availability:</b> ${esc(app.availability)}</p><p><b>About:</b> ${esc(app.about)}</p><p>View the CV in the careers admin.</p>`);
    const confirm = await send(app.email, "Thanks for applying to BLK CAB",
      `<p>Hi ${esc(app.full_name)},</p><p>Thanks for applying to BLK CAB for <b>${esc(app.role_title)}</b>. We've got your application and will be in touch if there's a fit.</p><p>— BLK CAB® (Coffee&amp;People)</p>`);
    if (!alert.ok || !confirm.ok) {
      const details = `${alert.status} ${await alert.text()} | ${confirm.status} ${await confirm.text()}`;
      console.error("Resend failed:", details);
      return json({ sent: false, error: "Provider request failed", details }, 502);
    }
    return json({ sent: true });
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error" }, 500);
  }
});
