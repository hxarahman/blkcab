import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStorySection } from "@/components/BrandStorySection";
import { ShopSection } from "@/components/ShopSection";
import { SoundsSection } from "@/components/SoundsSection";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Seo
        title="BLK CAB® Coffee — Specialty Coffee & Matcha, London & Dubai"
        description="Specialty coffee & matcha, built for & around people. Est. 2017. Find us in London at Little Portland Street & St Christopher's Place. Mind the Cab."
        path="/"
      />
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
