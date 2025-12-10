import { Button } from "./ui/button";
import coffeeMenuImage from "@/assets/brand-drink.jpg";

export const MenuSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-1">
            <img
              src={coffeeMenuImage}
              alt="Premium coffee drinks"
              className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              Crafted for You
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every cup at BLK CAB® is crafted with precision and care. From our signature espresso to seasonal specialties, we bring you the finest coffee experience built for and around people.
            </p>
            <Button variant="default" size="lg" className="group">
              EXPLORE MENU
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
