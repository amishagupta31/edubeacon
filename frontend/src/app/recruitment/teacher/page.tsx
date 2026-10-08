"use client";

import { useState } from "react";
import {
  LayoutGrid, User, FileText, Bookmark, Settings, ClipboardCheck,
  CalendarDays, Briefcase,
} from "lucide-react";
import DashboardGuard from "@/features/recruitment/DashboardGuard";
import DashboardShell, { EmptySection, NavItem } from "@/features/recruitment/DashboardShell";
import JobBoard from "@/features/recruitment/JobBoard";
import { useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";

const NAV: NavItem[] = [
  { id: "overview",     label: "Overview",      icon: LayoutGrid,     available: true },
  { id: "jobs",         label: "Browse Jobs",   icon: Briefcase,      available: true },
  { id: "profile",      label: "My Profile",    icon: User,           available: false },
  { id: "applications", label: "Applications",  icon: FileText,       available: false },
  { id: "saved",        label: "Saved Jobs",    icon: Bookmark,       available: false },
  { id: "interviews",   label: "Interviews",    icon: CalendarDays,   available: false },
  { id: "assessments",  label: "Assessments",   icon: ClipboardCheck, available: false },
  { id: "settings",     label: "Settings",      icon: Settings,       available: false },
];

export default function TeacherDashboardPage() {
  const [active, setActive] = useState("overview");
  const { authHeader } = useRecruitmentProfile();

  return (
    <DashboardGuard allow="TEACHER">
      {(profile) => (
        <DashboardShell
          title={profile.fullName ? `Welcome, ${profile.fullName.split(" ")[0]}` : "Teacher Dashboard"}
          subtitle={profile.email}
          nav={NAV}
          active={active}
          onNavigate={setActive}
        >
          {active === "jobs" ? (
            <JobBoard authHeader={authHeader} />
          ) : active === "overview" ? (
            <>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Applications", value: 0 },
                  { label: "Saved jobs", value: 0 },
                  { label: "Interviews", value: 0 },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-line p-5">
                    <p className="font-display text-[28px] font-bold text-charcoal leading-none tabular-nums">
                      {s.value}
                    </p>
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mt-2">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick action to browse jobs */}
              <div className="bg-white rounded-2xl border border-line shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#0E733B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-[16px] text-charcoal">
                      Find your next role
                    </h3>
                    <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                      Browse teaching and school positions posted by verified institutions across India.
                    </p>
                    <button
                      onClick={() => setActive("jobs")}
                      className="mt-3 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
                    >
                      Browse jobs
                    </button>
                  </div>
                </div>
              </div>

              <EmptySection
                title="More features coming soon"
                body="Profile, applications, saved jobs and interview tracking will appear here as each is built."
              />
            </>
          ) : (
            <EmptySection
              title={`${NAV.find((n) => n.id === active)?.label ?? "This section"} is coming soon`}
              body="This part of the portal has no backend yet. It will appear here as soon as it is built."
            />
          )}
        </DashboardShell>
      )}
    </DashboardGuard>
  );
}
