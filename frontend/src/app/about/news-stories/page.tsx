import type { Metadata } from "next";
import MagazineSection from "@/components/MagazineSection";
import Testimonials from "@/components/eduwecan/Testimonials";

export const metadata: Metadata = {
  title: "News Stories, EduBeacon",
  description: "Stories, articles and testimonials published by EduBeacon.",
};

export default function NewsStoriesPage() {
  return (
    <>
      <MagazineSection />
      <Testimonials />
    </>
  );
}
