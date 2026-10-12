import type { Metadata } from "next";
import { Suspense } from "react";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How it works, EduBeacon Recruitment",
  description: "How teachers get hired and how schools hire on EduBeacon — from profile to offer letter, step by step.",
};

export default function HowItWorksPage() {
  return (
    <Suspense>
      <HowItWorksClient />
    </Suspense>
  );
}
