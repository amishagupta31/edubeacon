import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "Our Story — EduBeacon",
  description: "The story behind EduBeacon and what we do for schools and solution providers.",
};

export default function OurStoryPage() {
  return <AboutSection />;
}
