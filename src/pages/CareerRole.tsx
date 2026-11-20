import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Eyebrow, Ticker } from "@/components/careers/CareersUI";
import est2017 from "@/assets/est-2017-sticker.png";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { employmentLabel, fetchRole, jobPostingJsonLd, type JobRole } from "@/lib/careers";

const List = ({ title, items }: { title: string; items?: string[] | null }) =>
  items?.length ? (
    <div className="space-y-3">
      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{title}</h2>
      <ul className="space-y-3">{items.map((i) => <li key={i} className="flex gap-3 text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{i}</li>)}</ul>
    </div>
  ) : null;

const CareerRole = () => {
  const { slug = "" } = useParams();
  const [role, setRole] = useState<JobRole | null | undefined>(undefined);
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => { fetchRole(slug).then(setRole).catch(() => setRole(null)); }, [slug]);

  if (role === undefined) return <div className="min-h-screen"><Header /><main className="pt-40 text-center text-muted-foreground">Loading…</main></div>;

  if (role === null) {
    return (
      <div className="min-h-screen">
        <Helmet><title>Role not found — BLK CAB® Careers</title><meta name="robots" content="noindex" /></Helmet>
        <Header />
        <main className="pt-16 py-24 container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase pt-24">Role not found</h1>
          <p className="text-muted-foreground">This role doesn't exist or is no longer open.</p>
          <Link to="/careers"><Button variant="cta">SEE OPEN ROLES</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Seo title={`${role.title} — Careers at BLK CAB® Coffee, London`} description={role.summary ?? `Join BLK CAB as a ${role.title} in London.`} path={`/careers/${role.slug}`} jsonLd={jobPostingJsonLd(role)} />
      <Header />
      <main className="pt-16">
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-5xl pt-10 pb-12 md:pt-16 md:pb-20 space-y-6 careers-anim animate-slide-up">
            <img src={est2017} alt="" width={110} height={110} className="absolute right-4 top-6 w-16 md:w-24 rotate-12" />
            <Link to="/careers" className="inline-block text-xs font-bold tracking-[0.25em] hover:text-accent transition-colors">← ALL ROLES</Link>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">{role.team}</span>
              <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{role.location}</span>
              <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{employmentLabel(role.employment_type)}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight uppercase leading-[0.9]">{role.title}</h1>
            {role.summary && <p className="max-w-2xl text-lg md:text-xl font-light text-primary-foreground/85">{role.summary}</p>}
            <Button variant="pebble" size="lg" className="hidden md:inline-flex" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>APPLY NOW</Button>
          </div>
          <Ticker />
        </section>
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-3 gap-10 md:gap-12">
            <div className="md:col-span-2 space-y-10">
              {role.description && <p className="text-lg md:text-xl leading-relaxed">{role.description}</p>}
              <List title="Responsibilities" items={role.responsibilities} />
              <List title="Requirements" items={role.requirements} />
            </div>
            <aside className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-8 space-y-6 h-fit md:sticky md:top-24">
              <Eyebrow className="text-accent">The details</Eyebrow>
              <div><h2 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/60">Pay</h2><p className="text-lg font-bold">{role.pay}</p></div>
              <div><h2 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/60">Hours</h2><p className="text-lg font-bold">{role.hours}</p></div>
              <div><h2 className="text-xs font-bold tracking-widest uppercase text-primary-foreground/60">Perks</h2><ul className="space-y-1 mt-1">{(role.perks ?? []).map((p) => <li key={p}>{p}</li>)}</ul></div>
            </aside>
          </div>
        </section>
        <section ref={formRef} id="apply" className="py-16 md:py-24 bg-muted scroll-mt-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-8">
            <div><Eyebrow className="text-muted-foreground mb-3">Apply</Eyebrow><h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">Apply for {role.title}</h2></div>
            <div className="rounded-2xl bg-card border border-border p-5 md:p-10"><ApplicationForm defaultRoleId={role.id} /></div>
          </div>
        </section>
      </main>
      <div className="h-20 md:hidden" aria-hidden />
      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur p-3 md:hidden">
        <Button variant="cta" size="lg" className="w-full" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>APPLY NOW</Button>
      </div>
    </div>
  );
};
export default CareerRole;
