import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { LocationsSection } from "@/components/LocationsSection";
import { BrandStickers } from "@/components/BrandStickers";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BrandStickers />
        <MenuSection />
        <LocationsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
