import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Join the Recruitment Portal, EduBeacon",
  description:
    "Register as a teacher or as a school to use the EduBeacon recruitment portal.",
};

export default function RecruitmentRegisterPage() {
  return <RegisterClient />;
}
