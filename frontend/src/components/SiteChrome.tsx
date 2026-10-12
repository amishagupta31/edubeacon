"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import RecruitmentHeader from "@/components/RecruitmentHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Full-screen app shells — no chrome at all
  // Match whole segments: "/recruitment/teacher" is the dashboard, "/recruitment/teachers" is public.
  const under = (base: string) => pathname === base || pathname?.startsWith(base + "/");
  const isAppShell =
    pathname?.startsWith("/admin") ||
    under("/recruitment/teacher") ||
    under("/recruitment/school");

  if (isAppShell) return <>{children}</>;

  // Recruitment marketing / register pages — use recruitment header, no footer
  const isRecruitmentPublic =
    pathname?.startsWith("/recruitment") ||
    pathname === "/solutions/recruitment";

  if (isRecruitmentPublic) {
    return (
      <>
        <RecruitmentHeader />
        <main className="flex-1">{children}</main>
      </>
    );
  }

  // All other public pages — site header + footer
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
