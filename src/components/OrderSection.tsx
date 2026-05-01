import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import orderAheadImage from "@/assets/order-ahead.jpg";
import bcStackSticker from "@/assets/bc-stack-sticker.png";

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
        <img
          src={bcStackSticker}
          alt="BC Coffee & People / Mind the Cab / Cabbie Stories"
          className="absolute bottom-6 left-4 md:bottom-10 md:left-10 w-32 md:w-48 -rotate-[30deg] origin-bottom-left drop-shadow-xl pointer-events-none select-none z-10"
        />
        <div className="relative h-full flex flex-col items-center justify-center px-4">
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

      {/* Order Ahead Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={orderAheadImage}
              alt="Order ahead at BLK CAB"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Order Ahead
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Make frictionless ordering even easier through the BLK CAB® app. Swing by, grab your drink, and go. Easy. Find your nearest location and experience coffee culture at its finest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button variant="cta" size="lg" className="group">
                  EXPLORE MENU
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
              <Link to="/locations">
                <Button variant="cta" size="lg" className="group">
                  FIND LOCATIONS
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
