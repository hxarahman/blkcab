import { Button } from "./ui/button";
import est2017Sticker from "@/assets/est-2017-sticker.png";

export const BrandStorySection = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
            <span>Mind The Cab,</span>
            <img src={est2017Sticker} alt="Est 2017" width={382} height={119} loading="lazy" className="h-8 md:h-10 w-auto inline-block -ml-1" />
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
