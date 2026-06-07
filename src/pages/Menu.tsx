import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        { name: "Spiced Latte", price: "5.50" },
        { name: "OG-Spanish*", price: "6.00" },
        { name: "Pistachio Latte", price: "6.00" },
        { name: "Mocha", price: "6.00" },
      ],
    },
    {
      title: "Matcha Series",
      items: [
        { name: "Original Matcha", price: "5.90" },
        { name: "OG-Matcha*", price: "6.00" },
        { name: "Strawberry Matcha", price: "6.00" },
        { name: "UBE Matcha*", price: "6.00" },
        { name: "Mango Matcha", price: "5.90" },
        { name: "Lavender & Pistachio*", price: "6.00" },
        { name: "Coconut Matcha", price: "6.00" },
        { name: "Lychee Matcha", price: "5.90" },
        { name: "Honey Dew Melon", price: "6.00" },
        { name: "Osaka (Cherry Blossom)", price: "5.90" },
        { name: "White Choc Matcha*", price: "7.00" },
      ],
    },
    {
      title: "Signature",
      items: [
        { name: "BLK Sesame*", price: "6.50" },
        { name: "UBE Latte*", price: "6.00" },
        { name: "Burnt Honey*", price: "6.50" },
      ],
    },
    {
      title: "Brew Bar",
      items: [
        { name: "V60", price: "8.50" },
        { name: "Cold Brew", price: "5.00" },
        { name: "Lavender", price: "5.90" },
        { name: "Seasalt Maple", price: "5.90" },
        { name: "Matcha Horchata", price: "6.00" },
        { name: "Coconut Cloud*", price: "5.90" },
      ],
    },
    {
      title: "Tea",
      items: [
        { name: "Tea Selection", price: "4.00" },
        { name: "Dubai Karak*", price: "4.90" },
      ],
    },
    {
      title: "Hot Chocolate",
      items: [
        { name: "White, Milk, Dark", price: "7.00" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
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
