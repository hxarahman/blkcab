import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { ApplicationForm } from "@/components/careers/ApplicationForm";

const CareerApply = () => (
  <div className="min-h-screen">
    <Seo title="Apply — Careers at BLK CAB® Coffee, London" description="Send BLK CAB® your CV. Apply for an open role or make a general application to work with us in London." path="/careers/apply" />
    <Header />
    <main className="pt-16">
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <p className="text-sm font-medium tracking-wide">CAREERS</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">Send us your CV</h1>
          <p className="text-muted-foreground">Apply for an open role, or choose "General application" and tell us what you're looking for.</p>
          <ApplicationForm />
        </div>
      </section>
    </main>
    <Footer />
  </div>
);
export default CareerApply;
