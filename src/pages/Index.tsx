import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStorySection } from "@/components/BrandStorySection";
import { ShopSection } from "@/components/ShopSection";
import { SoundsSection } from "@/components/SoundsSection";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import "./../index.css";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BrandStorySection />
        <OrderSection />
        <ShopSection />
        <SoundsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
