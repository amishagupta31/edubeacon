import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us — EduBeacon",
  description: "Get in touch with the EduBeacon team.",
};

export default function ContactPage() {
  return <ContactSection />;
}
