import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Eyebrow, Ticker } from "@/components/careers/CareersUI";
import est2017 from "@/assets/est-2017-sticker.png";
import { ApplicationForm } from "@/components/careers/ApplicationForm";

const CareerApply = () => (
  <div className="min-h-screen">
    <Seo title="Apply — Careers at BLK CAB® Coffee, London" description="Send BLK CAB® your CV. Apply for an open role or make a general application to work with us in London." path="/careers/apply" />
    <Header />
    <main className="pt-16">
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="relative container mx-auto px-4 max-w-4xl pt-10 pb-12 md:pt-16 md:pb-16 space-y-5 careers-anim animate-slide-up">
          <img src={est2017} alt="" width={110} height={110} className="absolute right-4 top-6 w-16 md:w-24 rotate-12" />
          <Eyebrow className="text-accent">Careers</Eyebrow>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight uppercase leading-[0.9]">Send us<br />your CV.</h1>
          <p className="max-w-xl text-primary-foreground/80">Apply for an open role, or choose "General application" and tell us what you're looking for.</p>
        </div>
        <Ticker />
      </section>
      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-2xl bg-card border border-border p-5 md:p-10"><ApplicationForm /></div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);
export default CareerApply;
