import type { Metadata } from "next";
import RecruitmentLandingClient from "./RecruitmentLandingClient";

export const metadata: Metadata = {
  title: "Teacher Recruitment, EduBeacon",
  description:
    "Connect with trusted institutions and build your teaching career. Verified profiles, trusted schools and secure credentials.",
};

export default function RecruitmentSolutionPage() {
  return <RecruitmentLandingClient />;
}
