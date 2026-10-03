import type { Metadata } from "next";
import PartnersSection from "@/components/PartnersSection";
import SponsorshipPackages from "@/components/SponsorshipPackages";

export const metadata: Metadata = {
  title: "Sponsors, EduBeacon",
  description: "The partners and sponsors behind EduBeacon, and how to become one.",
};

export default function SponsorsPage() {
  return (
    <>
      <PartnersSection />
      <SponsorshipPackages />
    </>
  );
}
