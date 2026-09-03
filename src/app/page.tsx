import Hero from "@/components/eduwecan/Hero";
import HeroStats from "@/components/HeroStats";
import AboutSection from "@/components/AboutSection";
import GridPanels from "@/components/eduwecan/GridPanels";
import SolutionsGrid from "@/components/SolutionsGrid";
import FeaturedVendors from "@/components/FeaturedVendors";
import ForSchools from "@/components/ForSchools";
import ForVendors from "@/components/ForVendors";
import CuratedMeetings from "@/components/CuratedMeetings";
import AwardsSection from "@/components/AwardsSection";
import Testimonials from "@/components/eduwecan/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* Community Stats Bar */}
      <HeroStats />

      {/* 2. About Section */}
      <AboutSection />

      {/* Visual Grid Panels */}
      <GridPanels />

      {/* 3. Solutions Grid */}
      <SolutionsGrid />

      {/* 4. Featured Vendors */}
      <FeaturedVendors />

      {/* 5. For Schools */}
      <ForSchools />

      {/* 6. For Vendors */}
      <ForVendors />

      {/* 7. Curated Meetings */}
      <CuratedMeetings />

      {/* 8. Awards Section */}
      <AwardsSection />

      {/* 9. Testimonials & Stories */}
      <Testimonials />

      {/* 10. Contact */}
      <ContactSection />
    </>
  );
}
