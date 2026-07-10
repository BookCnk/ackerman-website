import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
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
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <WhyChoose />
        <Faq />
        <InstagramGrid />
      </main>
      <Footer />
    </>
  );
}
