import HeroSection from "@/components/HeroSection";
import HeroStats from "@/components/HeroStats";
import AboutSection from "@/components/AboutSection";
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
import MagazineSection from "@/components/MagazineSection";
import FinalCta from "@/components/FinalCta";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Community stats bar */}
      <HeroStats />

      {/* Section 2: About */}
      <AboutSection />

      {/* Section 3: Solutions */}
      <SolutionsGrid />

      {/* Section 4: Featured Vendors */}
      <FeaturedVendors />

      {/* Section 5: For Schools */}
      <ForSchools />

      {/* Section 6: For Vendors */}
      <ForVendors />

      {/* Section 7: Conference + Countdown */}
      <ConferenceSection />

      {/* Section 8: Why Attend */}
      <WhyAttend />

      {/* Section 9: Speakers */}
      <SpeakersSection />

      {/* Conference Agenda */}
      <AgendaSection />

      {/* Section 11: Sponsorship */}
      <SponsorshipPackages />

      {/* Section 12: Curated Meetings */}
      <CuratedMeetings />

      {/* Section 13: Partners */}
      <PartnersSection />

      {/* Section 14: Awards */}
      <AwardsSection />

      {/* Section 15: Testimonials */}
      <TestimonialsSection />

      {/* Section 16: Magazine */}
      <MagazineSection />

      {/* Section 17: Final CTA */}
      <FinalCta />

      {/* Section 18: Contact */}
      <ContactSection />
    </>
  );
}
