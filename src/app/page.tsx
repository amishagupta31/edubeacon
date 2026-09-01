import Hero from "@/components/Hero";
import CommunityStats from "@/components/CommunityStats";
import TwoExperiences from "@/components/TwoExperiences";
import ExploreEvents from "@/components/ExploreEvents";
import FeaturedEvent from "@/components/FeaturedEvent";
import Speakers from "@/components/Speakers";
import Agenda from "@/components/Agenda";
import SponsorLogos from "@/components/SponsorLogos";
import WhySponsor from "@/components/WhySponsor";
import ExhibitorSection from "@/components/ExhibitorSection";
import Testimonials from "@/components/Testimonials";
import EventExperience from "@/components/EventExperience";
import Insights from "@/components/Insights";
import VideoSection from "@/components/VideoSection";
import GetInvolved from "@/components/GetInvolved";
import CorporateCta from "@/components/CorporateCta";
import Faqs from "@/components/Faqs";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <CommunityStats />
      <TwoExperiences />
      <ExploreEvents />
      <FeaturedEvent />
      <Speakers />
      <Agenda />
      <SponsorLogos />
      <WhySponsor />
      <ExhibitorSection />
      <Testimonials />
      <EventExperience />
      <Insights />
      <VideoSection />
      <GetInvolved />
      <CorporateCta />
      <Faqs />
      <FinalCta />
    </>
  );
}
