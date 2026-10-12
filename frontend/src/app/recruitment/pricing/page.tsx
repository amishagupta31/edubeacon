import type { Metadata } from "next";
import { Suspense } from "react";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing, EduBeacon Recruitment",
  description: "Simple plans for teachers and schools — 1 year, 5 years or lifetime access to EduBeacon Recruitment.",
};

export default function PricingPage() {
  return (
    <Suspense>
      <PricingClient />
    </Suspense>
  );
}
