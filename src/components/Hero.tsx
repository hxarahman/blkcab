import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/brand-cup.jpg";

export const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>
      
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-foreground mb-4">
            Mind the Cab, Est (2017)
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground font-light tracking-wide mb-2">
            (People & Coffee)
          </p>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Built for & around (People & Coffee)
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-base font-semibold tracking-wide group"
          >
            ORDER NOW
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
