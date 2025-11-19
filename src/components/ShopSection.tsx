import { Button } from "./ui/button";
import merchHero from "@/assets/merch-hero.jpg";
import merchTanks from "@/assets/merch-tanks.jpg";
import merchUmbrella from "@/assets/merch-umbrella.jpg";
import merchFlask from "@/assets/merch-flask.jpg";
import merchTote from "@/assets/merch-tote.jpg";
import shopMatcha from "@/assets/shop-matcha.jpg";

export const ShopSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4">
          Shop - Coming Soon
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          We're working on bringing you exclusive BLK CAB® merchandise, coffee, and more. Stay tuned!
        </p>
        
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Community Merch */}
          <div className="space-y-8">
            {/* Hero Image */}
            <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
              <img
                src={merchHero}
                alt="BLK CAB Community Merch - I'M BLK CAB (Coffee&People)"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Community Merch
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Represent the culture. Exclusive apparel and accessories designed for the BLK CAB® community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <img
                src={merchTanks}
                alt="BLK CAB Tank Tops"
                className="w-full h-auto object-cover rounded-lg"
              />
              <img
                src={merchUmbrella}
                alt="BLK CAB Umbrella & Wool Scarf"
                className="w-full h-auto object-cover rounded-lg"
              />
              <img
                src={merchFlask}
                alt="BLK CAB Stainless Flask"
                className="w-full h-auto object-cover rounded-lg"
              />
              <img
                src={merchTote}
                alt="BLK CAB Tote Bag & Keychain"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            
            <div className="text-center">
              <Button variant="cta" size="lg" className="group" disabled>
                COMING SOON
              </Button>
            </div>
          </div>

          {/* BLK CAB Starter Kit */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                BLK CAB Starter Kit
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Everything you need to bring the BLK CAB® experience home.
              </p>
            </div>
            
            <div className="aspect-[16/9] bg-secondary/30 rounded-lg flex items-center justify-center max-w-4xl mx-auto">
              <span className="text-6xl font-bold text-muted-foreground/20">STARTER KIT</span>
            </div>
            
            <div className="text-center">
              <Button variant="cta" size="lg" className="group" disabled>
                COMING SOON
              </Button>
            </div>
          </div>

          {/* Shop Coffee */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Shop Coffee
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Premium coffee blends sourced and roasted for the BLK CAB® community.
              </p>
            </div>
            
            <div className="aspect-[16/9] bg-secondary/30 rounded-lg flex items-center justify-center max-w-4xl mx-auto">
              <span className="text-6xl font-bold text-muted-foreground/20">COFFEE</span>
            </div>
            
            <div className="text-center">
              <Button variant="cta" size="lg" className="group" disabled>
                COMING SOON
              </Button>
            </div>
          </div>

          {/* Shop Matcha */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Shop Matcha
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Handcrafted in London for BLK CAB® Coffee & People.
              </p>
            </div>
            
            <div className="aspect-[16/9] overflow-hidden rounded-lg max-w-4xl mx-auto">
              <img
                src={shopMatcha}
                alt="BLK CAB Matcha containers"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <Button variant="cta" size="lg" className="group" disabled>
                COMING SOON
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
