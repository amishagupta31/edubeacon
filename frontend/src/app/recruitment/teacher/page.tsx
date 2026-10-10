"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase, MapPin, Building2, ArrowRight, Loader2,
  BookmarkPlus, Bookmark, X, Search, Filter, Settings,
} from "lucide-react";
import DashboardGuard from "@/features/recruitment/DashboardGuard";
import TeacherDashboardShell, { TeacherNavId } from "@/features/recruitment/TeacherDashboardShell";
import MyApplications from "@/features/recruitment/MyApplications";
import TeacherProfile from "@/features/recruitment/TeacherProfile";
import TeacherActivity from "@/features/recruitment/TeacherActivity";
import { useRecruitmentProfile, API } from "@/features/recruitment/useRecruitmentProfile";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Job {
  _id: string;
  title: string;
  institutionName: string;
  city: string;
  state: string;
  roleType: string;
  board: string;
  employment: string;
  deadline: string | null;
  publishedAt: string;
  subjects?: string[];
  description?: string;
}

// ── Saved job helpers ──────────────────────────────────────────────────────────
function getSavedIds(): string[] {
  try { return JSON.parse(localStorage.getItem("recruitment_saved_jobs") ?? "[]"); }
  catch { return []; }
}
function toggleSaved(id: string): string[] {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  try { localStorage.setItem("recruitment_saved_jobs", JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onToggleSave }: { job: Job; saved: boolean; onToggleSave: () => void }) {
  const daysAgo = Math.round((Date.now() - new Date(job.publishedAt).getTime()) / 86400000);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 flex gap-4">
      {/* School initial avatar */}
      <div
        className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-[15px] shadow-sm"
        style={{ background: `hsl(${(job.institutionName.charCodeAt(0) * 47) % 360},55%,42%)` }}
      >
        {job.institutionName[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-0.5">
          <h3 className="font-display font-bold text-[15px] text-[#1a2332] leading-tight">{job.title}</h3>
          <button
            onClick={onToggleSave}
            title={saved ? "Remove from saved" : "Save job"}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${saved ? "text-[#0E733B] bg-emerald-50" : "text-slate-400 hover:text-[#0E733B] hover:bg-emerald-50"}`}
          >
            {saved ? <Bookmark className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[13px] text-slate-600 flex items-center gap-1.5 mb-0.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {job.institutionName}
        </p>
        <p className="text-[12px] text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" /> {job.city}{job.state ? `, ${job.state}` : ""}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {job.roleType && <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{job.roleType}</span>}
          {job.board && <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{job.board}</span>}
          {job.employment && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{job.employment}</span>}
          {job.deadline && (
            <span className="text-[11px] bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-full">
              Deadline: {new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
          <span className="ml-auto text-[11px] text-slate-400">{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
        </div>
      </div>
    </div>
  );
}

// ── Opportunities panel (recommended jobs) ─────────────────────────────────────
function OpportunitiesPanel({ authHeader }: { authHeader: () => Promise<Record<string, string>> }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { setSavedIds(getSavedIds()); }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/recruitment/jobs?limit=20`)
      .then((r) => r.ok ? r.json() : { jobs: [] })
      .then((d) => { setJobs(Array.isArray(d) ? d : d.jobs ?? []); })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      j.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setSavedIds(toggleSaved(id));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-[22px] text-[#1a2332] leading-tight">
            {loading ? "Loading jobs…" : `Showing ${filtered.length} opportunity${filtered.length !== 1 ? "ies" : "y"} for you`}
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Jobs recommended based on your profile and preferences.</p>
        </div>
        <Link
          href="/recruitment/jobs"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0E733B] hover:underline underline-offset-2"
        >
          Advanced search <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, school or city…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px] text-[#1a2332] focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 placeholder:text-slate-400 transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
          <span className="ml-3 text-[14px] text-slate-500">Finding the best opportunities for you…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Filter className="w-10 h-10 text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-display font-bold text-[16px] text-[#1a2332] mb-1.5">
            {search ? "No matches found" : "No jobs posted yet"}
          </p>
          <p className="text-[13.5px] text-slate-500 max-w-sm mx-auto">
            {search ? "Try a different search term." : "Check back soon or complete your profile to get better recommendations."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              saved={savedIds.includes(job._id)}
              onToggleSave={() => handleToggle(job._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
        >
          {active === "opportunities" ? (
            <OpportunitiesPanel authHeader={authHeader} />

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

