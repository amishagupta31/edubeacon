import type { Metadata } from "next";
import PartnerRegisterClient from "./PartnerRegisterClient";

export const metadata: Metadata = {
  title: "List Your Solution, EduBeacon",
  description: "List your solution on EduBeacon and reach schools looking for innovation.",
};

export default function PartnerRegisterPage() {
  return <PartnerRegisterClient />;
}
