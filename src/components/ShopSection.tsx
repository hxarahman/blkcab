import { Button } from "./ui/button";

export const ShopSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4">
          Shop
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Bring BLK CAB® everywhere.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Community Merch */}
          <div className="space-y-6">
            <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
              <span className="text-6xl font-bold text-muted-foreground/20">MERCH</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              Community Merch
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Represent the culture. Exclusive apparel and accessories designed for the BLK CAB® community.
            </p>
            <Button variant="cta" size="lg" className="group">
              SHOP MERCH
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>

          {/* Starter Kit */}
          <div className="space-y-6">
            <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
              <span className="text-6xl font-bold text-muted-foreground/20">KIT</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">
              BLK CAB Essentials Starter Kit
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to bring the BLK CAB® experience home. Premium coffee essentials curated for you.
            </p>
            <Button variant="cta" size="lg" className="group">
              SHOP KIT
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
