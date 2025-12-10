import { Button } from "./ui/button";

export const BrandStorySection = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Mind the Cab, Est (2017)
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Built for & around (People & Coffee). Our identity is familiar, fresh, and far from ordinary.
          </p>
          <Button variant="cta" size="lg" className="group">
            LEARN MORE
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
