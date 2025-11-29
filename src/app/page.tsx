import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Footer/>
    </div>
  );
}
