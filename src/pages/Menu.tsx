import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import menuAsset from "@/assets/blk-cab-menu.jpeg.asset.json";

const Menu = () => {
  const menuCategories = [
    {
      title: "Coffee",
      items: [
        { name: "Espresso", price: "3.00" },
        { name: "Black", price: "3.90" },
        { name: "Cortado", price: "4.00" },
        { name: "Latte", price: "4.00" },
        { name: "Cappuccino", price: "4.00" },
        { name: "Flat White", price: "4.00" },
        { name: "OG-Spanish*", price: "6.00" },
        { name: "Pistachio Latte", price: "6.00" },
        { name: "Mocha*", price: "7.00" },
        { name: "Brown Sugar Latte", price: "5.50" },
      ],
    },
    {
      title: "Matcha Series",
      items: [
        { name: "The OG*", price: "6.00" },
        { name: "Strawberry", price: "6.00" },
        { name: "UBE*", price: "6.00" },
        { name: "Mango*", price: "6.00" },
        { name: "Lavender + Pistachio", price: "6.00" },
        { name: "White Choc*", price: "7.00" },
        { name: "Seasalt Maple", price: "5.90" },
        { name: "Coconut Cloud*", price: "5.90" },
        { name: "Brown Sugar", price: "5.90" },
        { name: "Blueberry", price: "6.50" },
      ],
    },
    {
      title: "Something Special",
      items: [
        { name: "Burnt Honey*", price: "6.50" },
        { name: "BLK Sesame*", price: "6.50" },
        { name: "UBE Latte*", price: "6.00" },
        { name: "Espresso Cloud*", price: "5.90" },
      ],
    },
    {
      title: "UBE Series",
      items: [
        { name: "UBE Cloud*", price: "6.00" },
        { name: "UBE & Mango*", price: "6.00" },
        { name: "UBE & Coconut*", price: "6.00" },
        { name: "UBE & Pandan*", price: "6.00" },
      ],
    },
    {
      title: "Brew Bar",
      items: [
        { name: "V60", price: "8.50" },
        { name: "Cold Brew", price: "5.00" },
      ],
    },
    {
      title: "Mojito",
      items: [
        { name: "Mango, Blueberry, Strawberry, Cubana", price: "4.90" },
      ],
    },
    {
      title: "Hot / Iced Choc",
      items: [
        { name: "White, Milk, Dark", price: "7.00" },
      ],
    },
    {
      title: "Tea",
      items: [
        { name: "Tea Selection", price: "4.00" },
        { name: "Dubai Karak*", price: "4.90" },
        { name: "Hibiscus", price: "5.00" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Seo
        title="Menu — BLK CAB® Coffee | Coffee, Matcha Series & Brew Bar"
        description="Espresso, flat whites, the Matcha Series, brew bar & signature drinks — crafted for you at BLK CAB® Coffee, London. Mind the Cab."
        path="/menu"
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Our Menu
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Crafted for you, built for & around people and coffee
              </p>
              <div className="mt-6 flex justify-center">
                <a href={menuAsset.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="cta" size="lg">VIEW FULL MENU</Button>
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {menuCategories.map((category, idx) => (
                <Card key={idx} className="shadow-lg">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <span className="text-foreground font-medium">
                            {item.name}
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            £{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                *Contains dairy which cannot be substituted
              </p>
              <p className="text-sm text-muted-foreground">
                *All iced drinks served with cold foam
              </p>
              <p className="text-sm text-muted-foreground">
                *Alternative milks available at 65p - please ask your server
              </p>
              <p className="text-lg font-semibold text-foreground mt-4">
                #CabbieStories
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
