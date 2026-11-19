import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type JobRole = Tables<"job_roles">;
export type JobApplication = Tables<"job_applications">;
export const TEAMS = ["Front of House", "Kitchen", "Management"] as const;
export const STATUSES = ["new", "shortlisted", "interviewed", "offered", "rejected"] as const;
export const SITE_URL = "https://blkcab.com";

export const employmentLabel = (t?: string | null) =>
  ({ FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACTOR: "Contract", TEMPORARY: "Temporary" } as Record<string, string>)[t ?? ""] ?? t ?? "";

export async function fetchOpenRoles(): Promise<JobRole[]> {
  const { data, error } = await supabase.from("job_roles").select("*").eq("is_open", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchRole(slug: string): Promise<JobRole | null> {
  const { data, error } = await supabase.from("job_roles").select("*").eq("slug", slug).eq("is_open", true).maybeSingle();
  if (error) throw error;
  return data;
}

/** Google for Jobs JobPosting JSON-LD. baseSalary only when pay contains digits. */
export function jobPostingJsonLd(role: JobRole) {
  const posted = role.date_posted ?? new Date().toISOString().slice(0, 10);
  const valid = new Date(posted);
  valid.setDate(valid.getDate() + 60);
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const list = (items?: string[] | null) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");
  const html = `<p>${esc(role.description ?? role.summary ?? "")}</p>` +
    (role.responsibilities?.length ? `<p><strong>Responsibilities</strong></p>${list(role.responsibilities)}` : "") +
    (role.requirements?.length ? `<p><strong>Requirements</strong></p>${list(role.requirements)}` : "");
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: html,
    datePosted: posted,
    validThrough: valid.toISOString().slice(0, 10),
    employmentType: role.employment_type ?? "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "BLK CAB Coffee", sameAs: SITE_URL, logo: `${SITE_URL}/favicon.ico` },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: role.location ?? "London", addressCountry: "GB" } },
    directApply: true,
  };
  if (role.pay && /\d/.test(role.pay)) {
    ld.baseSalary = { "@type": "MonetaryAmount", currency: "GBP", value: { "@type": "QuantitativeValue", value: role.pay } };
  }
  return ld;
}
