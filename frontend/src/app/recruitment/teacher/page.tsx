"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Settings } from "lucide-react";
import JobSearch from "@/features/recruitment/JobSearch";
import DashboardGuard from "@/features/recruitment/DashboardGuard";
import TeacherDashboardShell, { TeacherNavId } from "@/features/recruitment/TeacherDashboardShell";
import MyApplications from "@/features/recruitment/MyApplications";
import TeacherProfile from "@/features/recruitment/TeacherProfile";
import TeacherActivity from "@/features/recruitment/TeacherActivity";
import { useRecruitmentProfile, API } from "@/features/recruitment/useRecruitmentProfile";

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TeacherDashboardPage() {
  const [active, setActive] = useState<TeacherNavId>("opportunities");
  const { authHeader } = useRecruitmentProfile();
  const [appCount, setAppCount] = useState(0);

  const loadAppCount = useCallback(async () => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/applications/mine`, { headers });
      if (res.ok) {
        const apps = await res.json();
        setAppCount(Array.isArray(apps) ? apps.length : 0);
      }
    } catch { /* silent */ }
  }, [authHeader]);

  useEffect(() => { loadAppCount(); }, [loadAppCount]);

  return (
    <DashboardGuard allow="TEACHER">
      {() => (
        <TeacherDashboardShell
          active={active}
          onNavigate={setActive}
          badges={{ applications: appCount || undefined }}
          fullBleed={active === "opportunities"}
        >
          {active === "opportunities" ? (
            <Suspense><JobSearch /></Suspense>

          ) : active === "activity" ? (
            <TeacherActivity authHeader={authHeader} />

          ) : active === "applications" ? (
            <MyApplications authHeader={authHeader} />

          ) : active === "profile" ? (
            <TeacherProfile authHeader={authHeader} />

          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Settings className="w-10 h-10 text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-display font-bold text-[16px] text-[#1a2332] mb-1.5">Settings coming soon</p>
              <p className="text-[13.5px] text-slate-500">Notification preferences and account settings will appear here.</p>
            </div>
          )}
        </TeacherDashboardShell>
      )}
    </DashboardGuard>
  );
}

