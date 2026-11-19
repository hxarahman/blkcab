import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { employmentLabel, fetchOpenRoles, TEAMS, type JobRole } from "@/lib/careers";

const Careers = () => {
  const [roles, setRoles] = useState<JobRole[] | null>(null);
  const [team, setTeam] = useState<string>("All");
  useEffect(() => { fetchOpenRoles().then(setRoles).catch(() => setRoles([])); }, []);
  const shown = (roles ?? []).filter((r) => team === "All" || r.team === team);

  return (
    <div className="min-h-screen">
      <Seo title="Careers — Work with BLK CAB® Coffee, London" description="Join BLK CAB® — premium specialty coffee in London. Open barista, kitchen and management roles. Coffee & People." path="/careers" />
      <Header />
      <main className="pt-16">
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <p className="text-sm font-medium tracking-wide">CAREERS</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase">Work with us</h1>
            <p className="text-lg md:text-xl font-light">
              BLK CAB® is premium specialty coffee in the heart of London, built on Coffee &amp; People. We care about hospitality, craft and each other — and we grow our team from within. If you love great coffee and looking after people, come build it with us.
            </p>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Open roles</h2>
              <div className="flex flex-wrap gap-2">
                {["All", ...TEAMS].map((t) => (
                  <Button key={t} size="sm" variant={team === t ? "default" : "outline"} onClick={() => setTeam(t)}>{t.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            {roles === null ? (
              <p className="text-muted-foreground">Loading roles…</p>
            ) : shown.length === 0 ? (
              <p className="text-muted-foreground">No open roles here right now — send us your CV below.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {shown.map((r) => (
                  <Link key={r.id} to={`/careers/${r.slug}`} className="group border border-border p-8 space-y-4 hover:border-accent transition-colors">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{r.team} · {r.location} · {employmentLabel(r.employment_type)}</p>
                    <h3 className="text-2xl font-bold tracking-tight">{r.title}</h3>
                    {r.summary && <p className="text-muted-foreground">{r.summary}</p>}
                    <span className="text-sm font-medium group-hover:text-accent transition-colors">VIEW ROLE →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-24 bg-muted">
          <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Don't see your role? Send us your CV</h2>
            <p className="text-muted-foreground">We're always keen to meet great people. Send a general application and we'll keep you in mind.</p>
            <Link to="/careers/apply"><Button variant="cta">SEND YOUR CV</Button></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Careers;
