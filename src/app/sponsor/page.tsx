import type { Metadata } from "next";
import SponsorHero from "@/components/sponsor/SponsorHero";
import AudienceOverview from "@/components/sponsor/AudienceOverview";
import OpportunityGrid from "@/components/sponsor/OpportunityGrid";
import PackagesSection from "@/components/sponsor/PackagesSection";
import PreviousPartners from "@/components/sponsor/PreviousPartners";
import SponsorTestimonials from "@/components/sponsor/SponsorTestimonials";
import EnquiryForm from "@/components/sponsor/EnquiryForm";
import FinalCta from "@/components/FinalCta";

export const metadata: Metadata = {
  title: "Become a Sponsor — Convene",
  description:
    "Partner with Convene to reach technology leaders, decision-makers and professionals across our event portfolio.",
};

export default function SponsorPage() {
  return (
    <>
      <SponsorHero />
      <AudienceOverview />
      <OpportunityGrid />
      <PackagesSection />
      <PreviousPartners />
      <SponsorTestimonials />
      <EnquiryForm />
      <FinalCta />
    </>
  );
}
