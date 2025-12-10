import { Button } from "./ui/button";

export const LocationsSection = () => {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/locations-hero.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Visit Us
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Wherever you go, there we are. Find your nearest BLK CAB® location and experience coffee culture at its finest. Mind the Cab.
          </p>
          <Button variant="outline" size="lg" className="group border-white text-white hover:bg-white hover:text-primary">
            FIND LOCATIONS
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
