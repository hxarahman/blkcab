import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      
      <div className="relative w-full py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl space-y-6" style={{ marginTop: '30%' }}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-primary-foreground">
              WINTER 2025
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              The season changes, but your to-dos don't. Our Winter 2025 drinks make festive traditions feel chic and indulgent.
            </p>
            <a href="https://blkcablondon.square.site/#most-popular" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="pebble" 
                size="lg" 
                className="text-base font-semibold tracking-wide group"
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
