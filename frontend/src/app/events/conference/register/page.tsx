import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

const TITLE = "Register — Principal Conclave on AI in School Education";
const DESCRIPTION =
  "25th October 2026, 9:00 AM at Shivalik University, Dehradun. Free registration for principals, school leaders and educators. Organised by Edubeacon & India Genius Foundation.";

// Shared on WhatsApp and social, so the link preview carries the event details.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "EduBeacon",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ConferenceRegisterPage() {
  return <RegisterClient />;
}
