import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-primary md:min-h-screen md:flex md:items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="relative block aspect-video w-full object-cover md:absolute md:inset-0 md:h-full md:aspect-auto"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/50" />
      
      <div className="absolute inset-0 flex items-end px-4 pb-8 md:relative md:block md:w-full md:py-32 md:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl space-y-4 md:space-y-6 md:mt-[30%]">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">
              WINTER 2025
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              The season changes, but your to-dos don't. Our Winter 2025 drinks make festive traditions feel chic and indulgent.
            </p>
            <a href="https://blkcablondon.square.site/#most-popular" target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
              <Button 
                variant="pebble" 
                size="default" 
                className="text-sm font-semibold tracking-wide group"
              >
                ORDER NOW
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
