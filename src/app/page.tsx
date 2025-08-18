import About from "@/components/About";
import Contact from "@/components/Contact";
import FeaturedSection from "@/components/FeaturedSection";

import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <About />
      <TrustSection />
      <Contact />
    </>
  );
}
