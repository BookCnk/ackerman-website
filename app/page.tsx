import UrbanIntroCurtain from "@/components/home/UrbanIntroCurtain";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import UrbanShowcaseSections from "@/components/home/UrbanShowcaseSections";
import {
  PopularCatalogSection,
  ShopByCategoryAndVehicleSection,
} from "@/components/home/IndDiscoverySections";
import FeaturedBuilds from "@/components/home/FeaturedBuilds";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";
import Faq from "@/components/home/Faq";
import InstagramGrid from "@/components/home/InstagramGrid";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      {/* 1. Top Header Navigation with IND Mega-Menus */}
      <Header />

      <main>
        {/* 3. Urban Automotive Fullscreen Video Hero (urban-hero.mp4) + IND Fitment Dock */}
        <Hero />

        {/* 4. Urban Automotive Fullscreen Bespoke Banners, Video Showcase & One of One Carousel */}
        <UrbanShowcaseSections />

        {/* 5. IND Distribution 8 Categories, 12 Brands & Chassis Selector */}
        <ShopByCategoryAndVehicleSection />

        {/* 6. Featured Builds with BOM & Direct ERP Booking */}
        <FeaturedBuilds />

        {/* 7. Direct ERP Popular Catalog & Pricing */}
        <PopularCatalogSection />

        {/* 8. Workshop Services & Engineering Standards */}
        <Services />
        <About />
        <WhyChoose />
        <Testimonials />
        <Faq />
        <InstagramGrid />
      </main>

      <Footer />
    </>
  );
}
