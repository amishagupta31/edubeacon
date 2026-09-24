import type { Metadata } from "next";
import SolutionsGrid from "@/components/SolutionsGrid";

export const metadata: Metadata = {
  title: "Our Solutions, EduBeacon",
  description: "Explore the solution categories EduBeacon brings to schools across India.",
};

export default function SolutionsPage() {
  return <SolutionsGrid />;
}
