import type { Metadata } from "next";
import FeaturedVendors from "@/components/FeaturedVendors";
import ForVendors from "@/components/ForVendors";

export const metadata: Metadata = {
  title: "Vendors — EduBeacon",
  description: "Solution providers on EduBeacon, and how to list your solution.",
};

export default function VendorsPage() {
  return (
    <>
      <FeaturedVendors />
      <ForVendors />
    </>
  );
}
