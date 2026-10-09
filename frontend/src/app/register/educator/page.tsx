import type { Metadata } from "next";
import EducatorRegisterClient from "./EducatorRegisterClient";

export const metadata: Metadata = {
  title: "Register Your School, EduBeacon",
  description: "Register your school on EduBeacon and discover innovative solutions.",
};

export default function EducatorRegisterPage() {
  return <EducatorRegisterClient />;
}
