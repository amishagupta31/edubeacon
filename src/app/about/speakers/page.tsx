import type { Metadata } from "next";
import SpeakersSection from "@/components/SpeakersSection";

export const metadata: Metadata = {
  title: "Speakers — EduBeacon",
  description: "Meet the speakers shaping the future of education at EduBeacon events.",
};

export default function SpeakersPage() {
  return <SpeakersSection />;
}
