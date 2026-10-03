import HeroCarousel from "@/components/HeroCarousel";
import EventTicker from "@/components/EventTicker";
import HeroStats from "@/components/HeroStats";
import AboutSection from "@/components/AboutSection";
import SolutionsGrid from "@/components/SolutionsGrid";
import FeaturedVendors from "@/components/FeaturedVendors";
import CuratedMeetings from "@/components/CuratedMeetings";
import AwardsSection from "@/components/AwardsSection";

export default function Home() {
  return (
    <>
      {/* Running ticker strip — latest event */}
      <EventTicker />

      {/* 1. Introduction of the organisation — carousel with home + conference hero */}
      <HeroCarousel />

      {/* 2. Key Metrics */}
      <HeroStats />

      {/* 3. Our Specialities */}
      <AboutSection />

      {/* 4. Our Solutions overview */}
      <SolutionsGrid />

      {/* 5. Solution Providers */}
      <FeaturedVendors />

      {/* 6. Our Process */}
      <CuratedMeetings />

      {/* 7. Awards */}
      <AwardsSection />
    </>
  );
}
