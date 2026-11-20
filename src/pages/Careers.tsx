import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Coffee, GraduationCap, MapPin, Music, Sparkles, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { CareersVideo, Eyebrow, Reveal, Ticker } from "@/components/careers/CareersUI";
import { employmentLabel, fetchOpenRoles, TEAMS, type JobRole } from "@/lib/careers";
import est2017 from "@/assets/est-2017-sticker.png";
import bcSticker from "@/assets/blk-cab-sticker.png";
import bcStack from "@/assets/bc-stack-sticker.png";
import stickerBadge from "@/assets/sticker-badge.png";
import brandCup from "@/assets/brand-cup.jpg";
import brandDrink from "@/assets/brand-drink.jpg";
import brandMemories from "@/assets/brand-memories.jpg";
import cabbistaSticker from "@/assets/game/sticker-cabista.png";
import storefront from "@/assets/upcoming-london-storefront.jpeg";

const PERKS = [
  { icon: Coffee, title: "Craft & training", text: "Learn specialty coffee properly — from dial-in to latte art — with hands-on training on the bar." },
  { icon: GraduationCap, title: "Grow with us", text: "We promote from within. Barista today, shift lead or manager tomorrow." },
  { icon: Users, title: "Team & culture", text: "Coffee & People isn't a slogan. Our Cabbistas look after guests and each other." },
  { icon: Music, title: "Music on the bar", text: "Every shift has a soundtrack. Our playlists are part of the BLK CAB experience." },
  { icon: MapPin, title: "London locations", text: "Work in the heart of central London, with new sites on the way." },
  { icon: Sparkles, title: "Competitive perks", text: "Competitive pay and perks, plus all the coffee you can handle." },
];

const PLAYER_SRC = "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F2108164967&color=%23000000&visual=false&show_artwork=true";

const MusicPlayer = () => {
  const [loaded, setLoaded] = useState(false);
  if (loaded) return <iframe title="BLK CAB BC playlist on SoundCloud" src={PLAYER_SRC} className="w-full h-[400px] rounded-2xl" allow="autoplay" loading="lazy" />;
  return (
    <button type="button" onClick={() => setLoaded(true)}
      className="group relative w-full h-[260px] md:h-[400px] overflow-hidden rounded-2xl border border-primary-foreground/20 text-left">
      <img src={brandMemories} alt="" loading="lazy" decoding="async" width={800} height={600} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-8 gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground text-xl transition-transform group-hover:scale-110" aria-hidden>▶</span>
        <div><p className="text-2xl font-bold uppercase">Play our BC playlist</p><p className="text-sm text-primary-foreground/70">Loads the SoundCloud player</p></div>
      </div>
    </button>
  );
};

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
        {/* HERO */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="relative container mx-auto px-4 max-w-6xl md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-center min-h-[calc(100svh-4rem)] md:min-h-0 flex flex-col justify-end pt-24 pb-10 md:pt-20 md:pb-20">
            <CareersVideo src="/careers/clip2.mp4" poster="/careers/clip2-poster.jpg" fadeLoop
              className="absolute inset-0 md:relative md:inset-auto md:order-2 md:w-[300px] lg:w-[340px] md:aspect-[9/16] md:rounded-[2.25rem] md:border-[6px] md:border-primary-foreground/15 md:shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/60 to-primary md:hidden" aria-hidden />
            <img src={est2017} alt="Est. 2017" width={120} height={120} className="careers-anim absolute right-4 top-8 z-10 w-20 md:w-28 rotate-12 animate-fade-in md:right-[260px] lg:right-[300px] md:top-14" />
            <div className="relative z-10 space-y-6 careers-anim animate-slide-up">
              <Eyebrow className="text-accent">Careers at BLK CAB®</Eyebrow>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tight">Join<br />the cab.</h1>
              <p className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-accent">Become a Cabbista.</p>
              <p className="max-w-xl text-lg md:text-xl font-light text-primary-foreground/85">
                BLK CAB® is premium specialty coffee in the heart of London, built on Coffee &amp; People. We care about hospitality, craft and each other — and we grow our team from within.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="pebble" size="lg"><a href="#roles">SEE OPEN ROLES</a></Button>
                <Button asChild variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/careers/apply">SEND YOUR CV →</Link></Button>
              </div>
            </div>
          </div>
          <Ticker />
        </section>

        {/* STATEMENT */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <Reveal>
              <Eyebrow className="text-muted-foreground mb-4">House rule</Eyebrow>
              <p className="text-4xl md:text-6xl font-bold uppercase leading-[0.95] tracking-tight">Good vibes.<br /><span className="text-accent">Always served free</span><br />as standard.</p>
            </Reveal>
            <Reveal delay={150} className="relative">
              <img src={brandCup} alt="BLK CAB coffee cup" loading="lazy" decoding="async" width={600} height={750} className="w-full aspect-[4/5] object-cover rounded-2xl" />
              <CareersVideo src="/careers/clip1.mp4" poster="/careers/clip1-poster.jpg" lazy className="absolute -top-5 -right-3 md:-right-6 w-24 md:w-32 aspect-[9/16] rounded-2xl border-4 border-background shadow-2xl rotate-3" />
              <img src={bcSticker} alt="" loading="lazy" width={140} height={140} className="absolute -bottom-6 -left-6 w-24 md:w-32 -rotate-12 drop-shadow-xl" />
            </Reveal>
          </div>
        </section>

        {/* CABBISTA */}
        <section className="relative overflow-hidden bg-accent text-accent-foreground py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
            <Reveal className="flex justify-center">
              <img src={cabbistaSticker} alt="Cabbista sticker" loading="lazy" decoding="async" width={260} height={260} className="w-40 md:w-60 -rotate-6 drop-shadow-2xl transition-transform duration-500 hover:rotate-3 hover:scale-105" />
            </Reveal>
            <Reveal delay={120} className="space-y-4">
              <Eyebrow>Say it with us</Eyebrow>
              <h2 className="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tight">Cab·bis·ta</h2>
              <p className="text-xl md:text-2xl font-medium max-w-2xl">We call our baristas Cabbistas — a nod to London's legendary cabbies. Because we're cool like that.</p>
            </Reveal>
          </div>
        </section>

        {/* WHY */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-6xl space-y-10">
            <Reveal className="flex items-end justify-between gap-6">
              <div><Eyebrow className="text-accent mb-3">Why BLK CAB</Eyebrow><h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">Why work with us</h2></div>
              <img src={stickerBadge} alt="" loading="lazy" width={120} height={120} className="hidden md:block w-24 rotate-6" />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PERKS.map((p, i) => (
                <Reveal key={p.title} delay={i * 70}>
                  <div className="h-full rounded-2xl border border-primary-foreground/15 p-6 md:p-8 space-y-4 transition-colors hover:border-accent hover:bg-primary-foreground/5">
                    <p.icon className="h-7 w-7 text-accent" aria-hidden />
                    <h3 className="text-xl font-bold uppercase">{p.title}</h3>
                    <p className="text-primary-foreground/70">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" className="py-16 md:py-24 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div><Eyebrow className="text-muted-foreground mb-3">Now hiring</Eyebrow><h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">Open roles</h2></div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                {["All", ...TEAMS].map((t) => (
                  <Button key={t} size="sm" className="rounded-full shrink-0" variant={team === t ? "default" : "outline"} onClick={() => setTeam(t)}>{t.toUpperCase()}</Button>
                ))}
              </div>
            </div>
            {roles === null ? (
              <div className="grid md:grid-cols-2 gap-4">{[0, 1].map((i) => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse border border-border" />)}</div>
            ) : shown.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No open roles here right now — send us your CV below.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {shown.map((r, i) => (
                  <Reveal key={r.id} delay={i * 60}>
                    <Link to={`/careers/${r.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 md:p-8 gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">{r.team}</span>
                        <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" aria-hidden />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">{r.title}</h3>
                      {r.summary && <p className="text-muted-foreground line-clamp-3">{r.summary}</p>}
                      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden />{r.location}</span>
                        <span>{employmentLabel(r.employment_type)}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* GALLERY */}
        <section className="bg-background pb-16 md:pb-24">
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-3 gap-2 md:gap-4">
            {[storefront, brandDrink, brandMemories].map((src, i) => (
              <Reveal key={i} delay={i * 100}><img src={src} alt="" loading="lazy" decoding="async" width={600} height={750} className="w-full aspect-[4/5] object-cover rounded-xl md:rounded-2xl" /></Reveal>
            ))}
          </div>
        </section>

        {/* MUSIC */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-10 items-center">
            <Reveal className="space-y-6">
              <Eyebrow className="text-accent">BLK CAB sounds</Eyebrow>
              <h2 className="text-5xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tight">We love<br />music.</h2>
              <p className="text-lg text-primary-foreground/80 max-w-md">Music is part of every BLK CAB shift. Here's where to find our exclusive playlists.</p>
              <Button asChild variant="pebble" size="lg"><a href="https://soundcloud.com/blk-cab-r" target="_blank" rel="noopener noreferrer">LISTEN ON SOUNDCLOUD</a></Button>
            </Reveal>
            <Reveal delay={150}><MusicPlayer /></Reveal>
          </div>
        </section>

        {/* CV CTA */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-accent text-accent-foreground">
          <img src={bcStack} alt="" loading="lazy" width={200} height={200} className="absolute -right-6 -bottom-8 w-36 md:w-56 rotate-[-20deg] opacity-90" />
          <Reveal className="relative container mx-auto px-4 max-w-4xl space-y-6">
            <h2 className="text-4xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tight">Don't see your role?<br />Send us your CV.</h2>
            <p className="text-lg max-w-xl">We're always keen to meet great people. Send a general application and we'll keep you in mind.</p>
            <Button asChild size="lg" className="rounded-full"><Link to="/careers/apply">SEND YOUR CV →</Link></Button>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Careers;
