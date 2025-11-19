import { Button } from "./ui/button";
import locationImage from "@/assets/location.jpg";

export const LocationsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold tracking-tight">
              Visit Us
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wherever you go, there we are. Find your nearest BLK Cab location and experience coffee culture at its finest.
            </p>
            <Button variant="default" size="lg" className="group">
              FIND LOCATIONS
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
          <div>
            <img
              src={locationImage}
              alt="BLK Cab coffee shop location"
              className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
