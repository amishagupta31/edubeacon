import type { Metadata } from "next";
import EmployersClient from "./EmployersClient";

export const metadata: Metadata = {
  title: "Hire Teachers, EduBeacon Recruitment",
  description:
    "Post teaching roles, review verified candidates, run your hiring pipeline and send offer letters — all in one place for schools.",
};

export default function EmployersPage() {
  return <EmployersClient />;
}
