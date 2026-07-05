import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

// =====================================================================
// OWNER TODO: replace with the real structured opening hours for the
// Little Portland Street shop, e.g. ["Mo-Sa 08:00-22:00", "Su 10:00-22:00"]
// (format: https://schema.org/openingHours). Search engines read this.
// =====================================================================
const LITTLE_PORTLAND_OPENING_HOURS: string[] = [
  "PLACEHOLDER — e.g. Mo-Sa 08:00-22:00",
  "PLACEHOLDER — e.g. Su 10:00-22:00",
];

const littlePortlandJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "BLK CAB Coffee",
  servesCuisine: "Coffee, Matcha",
  priceRange: "££",
  url: "https://blkcab.com/locations",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12A Little Portland St",
    addressLocality: "London",
    postalCode: "W1W 8BJ",
    addressCountry: "GB",
  },
  openingHours: LITTLE_PORTLAND_OPENING_HOURS,
};

const Locations = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="Locations — BLK CAB® Coffee, London"
        description="Find BLK CAB® Coffee in London — St Christopher's Place & 12A Little Portland Street, with Covent Garden & Cairo coming soon. Mind the Cab."
        path="/locations"
        jsonLd={littlePortlandJsonLd}
      />
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Visit Us
              </h1>
              <p className="text-xl md:text-2xl font-light">
                Mind the Cab - Find your nearest BLK CAB® location
              </p>
            </div>
          </div>
        </section>

        {/* Location Details */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Current Location - St Christopher's Place */}
              <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
                {/* Location Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-6">
                      St Christopher's Place
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Experience coffee culture at its finest in the heart of London's West End.
                    </p>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Address</h3>
                      <p className="text-muted-foreground">
                        1 Barrett St<br />
                        London W1U 1AX<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Opening Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Monday - Saturday: 8:00 AM - 10:45 PM</p>
                        <p>Sunday: 10:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact</h3>
                      <p className="text-muted-foreground">
                        Phone: Coming soon<br />
                        Email: info@blkcab.co.uk
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button size="lg" className="w-full md:w-auto">
                      ORDER NOW FOR PICKUP
                    </Button>
                  </div>
                </div>

                {/* Map */}
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-2xl border border-border h-[500px]">
                    <iframe
                      src="https://www.google.com/maps?q=1+Barrett+St,+London+W1U+1AX,+United+Kingdom&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="BLK CAB® Location Map"
                    />
                  </div>
                  <a
                    href="https://maps.app.goo.gl/beuvuBtQ4yRDR2zW8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Now Open - 12 Little Portland Street */}
              <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
                {/* Location Info */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-4">
                      Now Open
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-6">
                      12 Little Portland Street
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      Our newest spot, bringing BLK CAB® coffee culture to Fitzrovia.
                    </p>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Address</h3>
                      <p className="text-muted-foreground">
                        12A Little Portland St<br />
                        London W1W 8BJ<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Opening Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Monday - Saturday: 8:00 AM - 10:00 PM</p>
                        <p>Sunday: 10:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact</h3>
                      <p className="text-muted-foreground">
                        Phone: Coming soon<br />
                        Email: info@blkcab.co.uk
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button size="lg" className="w-full md:w-auto">
                      ORDER NOW FOR PICKUP
                    </Button>
                  </div>
                </div>

                {/* Map */}
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-2xl border border-border h-[500px]">
                    <iframe
                      src="https://www.google.com/maps?q=12A+Little+Portland+St,+London+W1W+8BJ,+United+Kingdom&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="BLK CAB® Little Portland Street Map"
                    />
                  </div>
                  <a
                    href="https://maps.app.goo.gl/ZrFRNai5L54BVy9AA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </div>
              </div>


              {/* Coming Soon Locations */}
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
                  Coming Soon
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Earlham Street - Covent Garden */}
                  <div className="p-8 bg-secondary/30 border border-border rounded-lg">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-2">
                        Coming Soon
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">
                        Covent Garden - 18 Earlham Street
                      </h3>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-accent mt-0.5" />
                        <p className="text-muted-foreground">
                          18 Earlham Street<br />
                          London<br />
                          United Kingdom
                        </p>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/rLF8U3ttRzqZpUXM7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
                      >
                        <MapPin className="h-4 w-4" />
                        View on Google Maps
                      </a>
                    </div>
                  </div>

                  {/* Cairo - Tamara Haus */}
                  <div className="p-8 bg-secondary/30 border border-border rounded-lg">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-2">
                        Coming Soon
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">
                        Cairo - Tamara Haus
                      </h3>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-accent mt-0.5" />
                        <p className="text-muted-foreground">
                          Tamara Haus<br />
                          Cairo<br />
                          Egypt
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-16 p-8 bg-accent/10 border border-accent/20 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Getting Here</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Underground</h4>
                    <p className="text-muted-foreground text-sm">
                      Bond Street Station (Central & Elizabeth Lines)<br />
                      Oxford Circus Station (Central, Bakerloo & Victoria Lines)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bus</h4>
                    <p className="text-muted-foreground text-sm">
                      Multiple bus routes serve Oxford Street<br />
                      Routes: 3, 6, 12, 13, 23, 88, 94, 139, 159
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Parking</h4>
                    <p className="text-muted-foreground text-sm">
                      NCP Car Park on Cavendish Square<br />
                      Q-Park Oxford Street
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;