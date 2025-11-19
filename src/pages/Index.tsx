import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStorySection } from "@/components/BrandStorySection";
import { ShopSection } from "@/components/ShopSection";
import { SoundsSection } from "@/components/SoundsSection";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BrandStorySection />
        <ShopSection />
        <SoundsSection />
        <OrderSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
