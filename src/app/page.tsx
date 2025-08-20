import About from "@/components/About";
import Contact from "@/components/Contact";
import FeaturedSection from "@/components/FeaturedSection";
import FeaturedSection2 from "@/components/FeaturedSection2";
import { HeroSection } from "@/components/HeroSection";

import { TrustSection } from "@/components/TrustSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <About />
      <FeaturedSection2 />
      <TrustSection />
      <Contact />
    </>
  );
}
