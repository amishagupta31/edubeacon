"use client";

import { Suspense } from "react";
import JobSearch from "@/features/recruitment/JobSearch";

export default function PublicJobsPage() {
  return (
    <Suspense>
      <JobSearch />
    </Suspense>
  );
}