import { Button } from "./ui/button";
import locationImage from "@/assets/brand-memories.jpg";
import coffeeMenuImage from "@/assets/brand-drink.jpg";

export const OrderSection = () => {
  return (
    <section className="bg-background">
      {/* Hero Video */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/order-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        <div className="relative h-full flex items-center justify-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-foreground">
            Order Now
          </h2>
        </div>
      </div>

      {/* Order Cards */}
      <div className="container mx-auto px-4 py-24">
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Order Ahead */}
          <div className="space-y-6">
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={coffeeMenuImage}
                alt="Order ahead at BLK CAB"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Order Ahead
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Make frictionless ordering even easier through the BLK CAB® app. Swing by, grab your drink, and go. Easy.
            </p>
            <Button variant="cta" size="lg" className="group">
              EXPLORE MENU
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>

          {/* Pick up near you */}
          <div className="space-y-6">
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={locationImage}
                alt="BLK CAB locations"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Pick up near you
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wherever you go, there we are. Find your nearest BLK CAB® location and experience coffee culture at its finest.
            </p>
            <Button variant="cta" size="lg" className="group">
              FIND LOCATIONS
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
