import UrbanIntroCurtain from "@/components/home/UrbanIntroCurtain";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import UrbanShowcaseSections from "@/components/home/UrbanShowcaseSections";
import {
  PopularCatalogSection,
  ShopByCategoryAndVehicleSection,
} from "@/components/home/IndDiscoverySections";
import FeaturedBuilds from "@/components/home/FeaturedBuilds";
import Services from "@/components/home/Services";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <UrbanIntroCurtain />
      {/* 1. Top Header Navigation with Mega-Menus */}
      <Header />

      <main>
        {/* 2. Fullscreen Video Hero + Quick Fitment Dock */}
        <Hero />

        {/* 3. Bespoke Banners, Video Showcase & One of One Builds */}
        <UrbanShowcaseSections />

        {/* 4. Shop by Category & Chassis Selector */}
        <ShopByCategoryAndVehicleSection />

        {/* 5. Signature Builds with BOM & Direct Booking */}
        <FeaturedBuilds />

        {/* 6. Direct Popular Catalog with All-Inclusive Pricing */}
        <PopularCatalogSection />

        {/* 7. Workshop Engineering Standards & Diagnostics */}
        <Services />
      </main>

      <Footer />
    </>
  );
}
