import type { Metadata } from "next";
import ForSchools from "@/components/ForSchools";

export const metadata: Metadata = {
  title: "Schools, EduBeacon",
  description: "How EduBeacon helps schools find the right solutions, and how to register your school.",
};

export default function SchoolsPage() {
  return <ForSchools />;
}
