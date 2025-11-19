import { Button } from "./ui/button";
import locationImage from "@/assets/brand-memories.jpg";
import coffeeMenuImage from "@/assets/brand-drink.jpg";

export const OrderSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
          Order Now
        </h2>
        
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
            <Button variant="default" size="lg" className="group">
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
            <Button variant="default" size="lg" className="group">
              FIND LOCATIONS
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
