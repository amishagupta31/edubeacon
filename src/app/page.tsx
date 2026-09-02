import Hero from "@/components/eduwecan/Hero";
import HeroStats from "@/components/HeroStats";
import AboutSection from "@/components/AboutSection";
import GridPanels from "@/components/eduwecan/GridPanels";
import SolutionsGrid from "@/components/SolutionsGrid";
import FeaturedVendors from "@/components/FeaturedVendors";
import ForSchools from "@/components/ForSchools";
import Opportunities from "@/components/eduwecan/Opportunities";
import ForVendors from "@/components/ForVendors";
import Ecosystem from "@/components/eduwecan/Ecosystem";
import ConferenceSection from "@/components/ConferenceSection";
import WhyAttend from "@/components/WhyAttend";
import SpeakersSection from "@/components/SpeakersSection";
import AgendaSection from "@/components/AgendaSection";
import SponsorshipPackages from "@/components/SponsorshipPackages";
import CuratedMeetings from "@/components/CuratedMeetings";
import PartnersSection from "@/components/PartnersSection";
import HorizontalScroll from "@/components/eduwecan/HorizontalScroll";
import AwardsSection from "@/components/AwardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Testimonials from "@/components/eduwecan/Testimonials";
import MagazineSection from "@/components/MagazineSection";
import FinalCta from "@/components/FinalCta";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* 1. Redesigned Minimal EduBeacon Hero */}
      <Hero />

      {/* Community stats bar */}
      <HeroStats />

      {/* 2. About Section */}
      <AboutSection />

      {/* Editorial Visual Grid Panels */}
      <GridPanels />

      {/* 3. Solutions Grid (Interactive Filter Categories & Cards) */}
      <SolutionsGrid />

      {/* 4. Featured Vendors */}
      <FeaturedVendors />

      {/* 5. For Schools */}
      <ForSchools />

      {/* Learning Opportunities & Support */}
      <Opportunities />

      {/* 6. For Vendors */}
      <ForVendors />

      {/* Ecosystem Track */}
      <Ecosystem />

      {/* 7. Conference + Countdown */}
      <ConferenceSection />

      {/* 8. Why Attend */}
      <WhyAttend />

      {/* 9. Speakers */}
      <SpeakersSection />

      {/* Conference Agenda */}
      <AgendaSection />

      {/* 11. Sponsorship Packages */}
      <SponsorshipPackages />

      {/* 12. Curated Meetings */}
      <CuratedMeetings />

      {/* The Journey Horizontal Cards */}
      <HorizontalScroll />

      {/* 13. Partners Section */}
      <PartnersSection />

      {/* 14. Awards Section */}
      <AwardsSection />

      {/* 15. Testimonials & Stories */}
      <TestimonialsSection />
      <Testimonials />

      {/* 16. Magazine */}
      <MagazineSection />

      {/* 17. Final CTA */}
      <FinalCta />

      {/* 18. Contact */}
      <ContactSection />
    </>
  );
}
