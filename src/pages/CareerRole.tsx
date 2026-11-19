import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { employmentLabel, fetchRole, jobPostingJsonLd, type JobRole } from "@/lib/careers";

const List = ({ title, items }: { title: string; items?: string[] | null }) =>
  items?.length ? (
    <div className="space-y-3">
      <h2 className="text-sm font-medium tracking-wide uppercase">{title}</h2>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">{items.map((i) => <li key={i}>{i}</li>)}</ul>
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
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl space-y-6">
            <Link to="/careers" className="text-sm font-medium tracking-wide hover:text-accent transition-colors">← ALL ROLES</Link>
            <p className="text-sm font-medium tracking-wide uppercase">{role.team} · {role.location} · {employmentLabel(role.employment_type)}</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase">{role.title}</h1>
            {role.summary && <p className="text-lg md:text-xl font-light">{role.summary}</p>}
            <Button variant="cta" className="border border-primary-foreground" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>APPLY NOW</Button>
          </div>
        </section>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
              {role.description && <p className="text-lg leading-relaxed">{role.description}</p>}
              <List title="Responsibilities" items={role.responsibilities} />
              <List title="Requirements" items={role.requirements} />
            </div>
            <aside className="border border-border p-6 space-y-6 h-fit">
              <div><h2 className="text-sm font-medium tracking-wide uppercase">Pay</h2><p className="text-muted-foreground">{role.pay}</p></div>
              <div><h2 className="text-sm font-medium tracking-wide uppercase">Hours</h2><p className="text-muted-foreground">{role.hours}</p></div>
              <div><h2 className="text-sm font-medium tracking-wide uppercase">Perks</h2><ul className="text-muted-foreground list-disc pl-5">{(role.perks ?? []).map((p) => <li key={p}>{p}</li>)}</ul></div>
            </aside>
          </div>
        </section>
        <section ref={formRef} id="apply" className="py-24 bg-muted scroll-mt-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Apply for {role.title}</h2>
            <ApplicationForm defaultRoleId={role.id} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default CareerRole;
