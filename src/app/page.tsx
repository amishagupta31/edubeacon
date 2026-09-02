import Hero from "@/components/eduwecan/Hero";
import HeroStats from "@/components/HeroStats";
import AboutSection from "@/components/AboutSection";
import GridPanels from "@/components/eduwecan/GridPanels";
import SolutionsGrid from "@/components/SolutionsGrid";
import FeaturedVendors from "@/components/FeaturedVendors";
import ForSchools from "@/components/ForSchools";
import ForVendors from "@/components/ForVendors";
import ConferenceSection from "@/components/ConferenceSection";
import WhyAttend from "@/components/WhyAttend";
import SpeakersSection from "@/components/SpeakersSection";
import AgendaSection from "@/components/AgendaSection";
import SponsorshipPackages from "@/components/SponsorshipPackages";
import CuratedMeetings from "@/components/CuratedMeetings";
import PartnersSection from "@/components/PartnersSection";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Testimonials from "@/components/eduwecan/Testimonials";
import MagazineSection from "@/components/MagazineSection";
import FinalCta from "@/components/FinalCta";
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

      {/* 7. Conference Spotlight & Countdown */}
      <ConferenceSection />

      {/* 8. Why Attend */}
      <WhyAttend />

      {/* 9. Speakers */}
      <SpeakersSection />

      {/* Conference Agenda */}
      <AgendaSection />

      {/* 10. Sponsorship Packages */}
      <SponsorshipPackages />

      {/* 11. Curated Meetings */}
      <CuratedMeetings />

      {/* 12. Partners Section */}
      <PartnersSection />

      {/* 13. Awards Section */}
      <AwardsSection />

      {/* 14. Testimonials & Stories */}
      <TestimonialsSection />
      <Testimonials />

      {/* 15. Magazine */}
      <MagazineSection />

      {/* 16. Final CTA */}
      <FinalCta />

      {/* 17. Contact */}
      <ContactSection />
    </>
  );
}


