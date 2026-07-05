import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { LazyVideo } from "./LazyVideo";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { z } from "zod";
import orderAheadImage from "@/assets/order-ahead.jpg";
import bcStackSticker from "@/assets/bc-stack-sticker.png";
import upcomingLondon from "@/assets/upcoming-london-storefront.jpeg";
import upcomingCairo from "@/assets/upcoming-cairo-interior.jpeg";

const emailSchema = z.string().trim().email().max(255);

export const OrderSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const { error } = await supabase.from("players").insert({
        email: parsed.data.toLowerCase(),
        marketing_opt_in: true,
      });
      // 23505 = already on the list — treat as success
      if (error && error.code !== "23505") throw error;
      trackEvent("email_signup", { source: "skip_the_queue" });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-background">
      {/* Hero Video */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <LazyVideo
          src="/order-hero.mp4"
          poster="/posters/order-hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        <img
          src={bcStackSticker}
          alt="BC Coffee & People / Mind the Cab / Cabbie Stories"
          width={420}
          height={273}
          loading="lazy"
          className="absolute bottom-2 left-10 md:bottom-4 md:left-20 w-24 md:w-36 h-auto -rotate-[30deg] origin-bottom-left drop-shadow-xl pointer-events-none select-none z-10"
        />
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* SKIP THE QUEUE — email capture (online ordering not live yet) */}
          <div className="w-full max-w-md text-center space-y-4 rounded-lg border border-primary-foreground/30 bg-black/50 backdrop-blur-sm p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold tracking-wide text-primary-foreground">
              SKIP THE QUEUE — SOON
            </h3>
            <p className="text-sm md:text-base text-primary-foreground/90 leading-relaxed">
              Order-ahead is coming to Little Portland Street. First in line hears first.
            </p>
            {status === "success" ? (
              <p className="text-lg font-semibold text-primary-foreground py-2">You're on the list.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="bg-background/90 text-foreground"
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  variant="pebble"
                  size="lg"
                  className="w-full text-base font-semibold tracking-wide"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "SAVING..." : "PUT ME FIRST IN LINE"}
                </Button>
                {status === "error" && (
                  <p className="text-sm text-primary-foreground/90" role="alert">
                    Couldn't save your email — please check it and try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Order Ahead Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Now Open */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              Now Open!
            </h3>
            <div className="space-y-3 max-w-2xl mx-auto">
              <h4 className="text-lg md:text-xl font-semibold">• London - Little Portland st</h4>
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={orderAheadImage}
                  alt="BLK CAB London - Little Portland st"
                  width={1320}
                  height={710}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Locations */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              Upcoming
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-semibold">• London - Covent Garden (Earlham st)</h4>
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={upcomingLondon}
                    alt="Upcoming BLK CAB London - Covent Garden, Earlham st"
                    width={942}
                    height={742}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-semibold">• Cairo - Tamara Haus</h4>
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={upcomingCairo}
                    alt="Upcoming BLK CAB Cairo - Tamara Haus location"
                    width={1320}
                    height={926}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
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
