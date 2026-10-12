"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, MapPin, Briefcase, Flag, School, Users, X, SlidersHorizontal, CheckCircle2, Info,
} from "lucide-react";
import { API, useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";
import OrgLogo from "@/features/recruitment/OrgLogo";

// ── Types ────────────────────────────────────────────────────────────────────

interface Job {
  _id: string;
  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;
  institutionId?: string;
  institutionName: string;
  institutionType?: string | null;
  establishedYear?: string | null;
  city: string;
  state: string;
  deadline: string | null;
  publishedAt: string;
}

interface Org { name: string; institutionId: string | null; city: string; board: string; openRoles: number }

const ROLE_TYPES = ["All", "Teaching", "Non-teaching", "Administrative", "Leadership"];
const BOARDS = ["All", "CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS"];
const EMPLOYMENT_TYPES = ["All", "Full-time, permanent", "Full-time, contract", "Part-time", "Visiting / guest faculty", "Internship"];
const PAGE_SIZE = 20;

// ── Small pieces ─────────────────────────────────────────────────────────────

function Chip({ icon: Icon, children, tone }: { icon: React.ElementType; children: React.ReactNode; tone: "loc" | "a" | "b" }) {
  const cls = {
    loc: "bg-[#F3F8F1] text-[#1E3A2B] [&>svg]:text-[#0E733B]",
    a: "bg-[#ECFDF5] text-[#14532D] [&>svg]:text-[#0E733B]",
    b: "bg-[#F0F7F3] text-[#1E3A2B] [&>svg]:text-[#0F766E]",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] ${cls}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" /> {children}
    </span>
  );
}

function FilterGroup({ label, options, value, onChange, vertical = false }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="mb-5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-1.5 px-1">{label}</p>
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => {
            const on = value === opt;
            return (
              <button key={opt} onClick={() => onChange(opt)} aria-pressed={on}
                className={`flex items-center gap-2.5 text-left rounded-md px-2 py-1.5 text-[13px] transition-colors ${
                  on ? "bg-[#ECFDF5] text-[#0E733B] font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}>
                <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${on ? "border-[#0E733B] bg-[#0E733B] shadow-[inset_0_0_0_2px_white]" : "border-slate-300"}`} />
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="mb-5">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              value === opt ? "bg-[#0E733B] border-[#0E733B] text-white" : "border-slate-200 text-slate-700 hover:border-[#0E733B]/40"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Job card (list) ──────────────────────────────────────────────────────────

function JobCard({ job, applied }: { job: Job; applied: boolean }) {
  const tags = [job.roleType, job.board, job.employment, job.classes ? `Classes ${job.classes}` : ""].filter(Boolean);
  return (
    <article className="bg-white border border-slate-200 rounded-md hover:shadow-[0_6px_24px_rgba(12,42,27,0.08)] transition-shadow">
      <div className="p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-6">
          <OrgLogo name={job.institutionName} className="w-14 h-14 sm:w-[88px] sm:h-[88px] text-[18px] sm:text-[26px] rounded-lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1B2A22] leading-snug">
              <Link href={`/recruitment/jobs/${job._id}`} className="hover:text-[#0E733B] transition-colors">
                {job.institutionName} - {job.title}
              </Link>
              {applied && (
                <span className="ml-2 align-middle inline-flex items-center gap-1 text-[11px] font-bold text-[#0E733B] bg-emerald-50 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Applied
                </span>
              )}
            </h3>
            {(job.city || job.state) && (
              <div className="mt-2.5"><Chip icon={MapPin} tone="loc">{[job.city, job.state].filter(Boolean).join(", ")}</Chip></div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {job.establishedYear && <Chip icon={Flag} tone="a">Founded in {job.establishedYear}</Chip>}
              {job.institutionType && <Chip icon={School} tone="b">{job.institutionType}</Chip>}
              <Chip icon={Users} tone="b">{job.openings} opening{job.openings === 1 ? "" : "s"}</Chip>
            </div>
          </div>
          <div className="hidden sm:flex items-start border-l border-dashed border-slate-200 pl-6 shrink-0">
            <Link
              href={`/recruitment/jobs/${job._id}`}
              className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-[#0E733B] hover:bg-[#0B5C2F] px-4 py-2.5 text-[15px] font-semibold text-white shadow-[0_3px_0_#0A4A27] active:translate-y-px transition-colors"
            >
              <Briefcase className="w-4 h-4" /> View job »
            </Link>
          </div>
        </div>

        {job.description && (
          <p className="mt-4 text-[14.5px] leading-[1.7] text-slate-600 line-clamp-2">{job.description}</p>
        )}

        <div className="mt-3.5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-md bg-slate-100 px-2.5 py-1 text-[13px] text-slate-700">{t}</span>
          ))}
        </div>

        <Link
          href={`/recruitment/jobs/${job._id}`}
          className="sm:hidden mt-4 flex items-center justify-center gap-1.5 rounded-md bg-[#0E733B] py-2.5 text-[14.5px] font-semibold text-white"
        >
          <Briefcase className="w-4 h-4" /> View job »
        </Link>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 flex gap-6 animate-skeleton">
      <div className="w-[88px] h-[88px] rounded-lg bg-slate-100 shrink-0" />
      <div className="flex-1 flex flex-col gap-3">
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-6 w-28 rounded bg-slate-100" />
        <div className="flex gap-2"><div className="h-6 w-32 rounded bg-slate-100" /><div className="h-6 w-28 rounded bg-slate-100" /></div>
        <div className="h-3 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PublicJobsPage() {
  return (
    <Suspense>
      <JobsBrowser />
    </Suspense>
  );
}

function JobsBrowser() {
  const params = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [draft, setDraft] = useState(() => params.get("q") ?? "");
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [roleType, setRoleType] = useState(() => {
    const r = params.get("role");
    return r && ROLE_TYPES.includes(r) ? r : "All";
  });
  const [board, setBoard] = useState("All");
  const [employment, setEmployment] = useState("All");
  const [city, setCity] = useState(() => params.get("city") ?? "");
  const [institution, setInstitution] = useState(() => params.get("institution") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [orgQuery, setOrgQuery] = useState("");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const { state, authHeader } = useRecruitmentProfile();
  const isTeacher = state.status === "ready" && state.profile.accountType === "TEACHER";

  useEffect(() => {
    if (!isTeacher) return;
    authHeader()
      .then((headers) => fetch(`${API}/api/recruitment/applications/mine`, { headers }))
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { jobId: string }[]) => setApplied(new Set(rows.map((r) => String(r.jobId)))))
      .catch(() => {});
  }, [isTeacher, authHeader]);

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(pg), limit: String(PAGE_SIZE) });
      if (search) q.set("search", search);
      if (roleType !== "All") q.set("roleType", roleType);
      if (board !== "All") q.set("board", board);
      if (employment !== "All") q.set("employment", employment);
      if (city) q.set("city", city);
      if (institution) q.set("institution", institution);
      const res = await fetch(`${API}/api/recruitment/jobs?${q}`);
      if (!res.ok) return;
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
      setPage(pg);
      if (pg > 1) window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { /* keep previous results */ } finally { setLoading(false); }
  }, [search, roleType, board, employment, city, institution]);

  useEffect(() => {
    fetch(`${API}/api/recruitment/jobs/organizations`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Org[]) => setOrgs(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchJobs(1), 250);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  const filterChips = [
    institution && { label: institution, clear: () => setInstitution("") },
    city && { label: `City: ${city}`, clear: () => setCity("") },
    roleType !== "All" && { label: roleType, clear: () => setRoleType("All") },
    board !== "All" && { label: board, clear: () => setBoard("All") },
    employment !== "All" && { label: employment, clear: () => setEmployment("All") },
    search && { label: `“${search}”`, clear: () => { setSearch(""); setDraft(""); } },
  ].filter(Boolean) as { label: string; clear: () => void }[];
  const activeFilterCount = filterChips.length - (search ? 1 : 0);
  const clearAll = () => {
    setRoleType("All"); setBoard("All"); setEmployment("All"); setCity(""); setInstitution(""); setSearch(""); setDraft("");
  };

  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, total);
  const visibleOrgs = orgs.filter((o) => !orgQuery || `${o.name} ${o.city}`.toLowerCase().includes(orgQuery.toLowerCase()));

  const orgList = (
    <ul className="flex flex-col gap-1">
      {visibleOrgs.length === 0 && <li className="px-3 py-6 text-center text-[12.5px] text-slate-500">No schools match</li>}
      {visibleOrgs.map((o) => {
        const active = institution === o.name;
        return (
          <li key={o.name} className={`flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors ${active ? "bg-emerald-50 ring-1 ring-[#0E733B]/25" : "hover:bg-slate-50"}`}>
            <button onClick={() => { setInstitution(active ? "" : o.name); setFiltersOpen(false); }} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
              <OrgLogo name={o.name} className="w-9 h-9 text-[12px] rounded-md" />
              <span className="min-w-0">
                <span className={`block text-[13px] font-semibold leading-tight truncate ${active ? "text-[#0E733B]" : "text-[#1B2A22]"}`}>{o.name}</span>
                <span className="block text-[11.5px] text-slate-600 truncate">{o.city} · {o.openRoles} open role{o.openRoles === 1 ? "" : "s"}</span>
              </span>
            </button>
            {o.institutionId && (
              <Link href={`/recruitment/schools/${o.institutionId}`} aria-label={`About ${o.name}`} title="School profile"
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-[#0E733B] hover:bg-white shrink-0">
                <Info className="w-4 h-4" />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      {/* ── Header band ── */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(180deg, #0C2A1B 0%, #0E3524 70%, #0F3A27 100%)" }}>
        <svg aria-hidden className="absolute left-0 bottom-0 w-[180px] h-[120px] text-[#8FE3B0]/40" viewBox="0 0 180 120" fill="none">
          <path d="M0 40 C 60 20, 120 30, 150 70 S 140 120, 120 125" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
          <path d="M140 52 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" fill="#8FE3B0" fillOpacity="0.55" />
        </svg>
        <svg aria-hidden className="absolute right-0 bottom-0 w-[170px] h-[110px] text-[#0E733B]" viewBox="0 0 170 110" fill="none">
          <path d="M20 110 C 0 60, 50 30, 80 60 S 140 60, 175 20" stroke="currentColor" strokeWidth="14" strokeLinecap="round" opacity="0.55" />
        </svg>
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 bottom-[-160px] w-[520px] h-[260px] rounded-full bg-[#10B981]/15 blur-3xl" />

        <div className="relative max-w-[760px] mx-auto px-5 pt-10 pb-16 text-center">
          <h1 className="inline-flex items-start gap-1 text-[26px] sm:text-[28px] font-bold tracking-tight">
            Search jobs
            <svg viewBox="0 0 20 20" className="w-5 h-5 -mt-2 text-[#8FE3B0]" fill="currentColor" aria-hidden>
              <path d="M10 0 l2.2 7.8 7.8 2.2 -7.8 2.2 L10 20 7.8 12.2 0 10 7.8 7.8z" />
            </svg>
          </h1>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-white/90 max-w-[500px] mx-auto">
            Want to grow your teaching career? View the best roles and apply to verified schools in one click, only on EduBeacon!
          </p>
          <p className="mt-5 text-[16px] font-semibold">
            {loading && !total ? "Loading jobs…" : total ? `Showing ${from} - ${to} out of ${total} active jobs` : "No active jobs match"}
          </p>
        </div>
      </section>

      {/* ── Search bar (overlaps band) ── */}
      <div className="relative z-10 max-w-[760px] mx-auto px-4 -mt-7">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearch(draft.trim()); }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-[0_4px_18px_rgba(12,42,27,0.10)] p-1.5 pl-3.5"
        >
          <Search className="w-[18px] h-[18px] text-slate-500 shrink-0" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Enter subject or role, e.g. Physics, PRT"
            aria-label="Search jobs"
            className="flex-1 min-w-0 bg-transparent py-2 text-[15px] text-[#1B2A22] placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Filters"
            className="xl:hidden relative inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[13.5px] font-semibold text-slate-700 hover:border-[#0E733B]/40"
          >
            <SlidersHorizontal className="w-4 h-4" /> <span className="hidden sm:inline lg:hidden">Filters</span><span className="hidden lg:inline">Schools</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0E733B] text-[10px] text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button type="submit" className="rounded-md bg-[#0E733B] hover:bg-[#0B5C2F] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_3px_0_#0A4A27] active:translate-y-px transition-colors">
            Search
          </button>
        </form>

        {filterChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {filterChips.map((c) => (
              <button key={c.label} onClick={c.clear}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#0E733B]/30 px-3 py-1 text-[12.5px] font-semibold text-[#0E733B] hover:bg-emerald-50 max-w-full">
                <span className="truncate">{c.label}</span> <X className="w-3 h-3 shrink-0" />
              </button>
            ))}
            <button onClick={clearAll} className="text-[12.5px] font-semibold text-slate-600 hover:text-[#1B2A22] underline underline-offset-2">Clear all</button>
          </div>
        )}
      </div>

      {/* ── Results + organisations ── */}
      <div className="mx-auto px-4 pt-5 pb-16 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,760px)_260px] lg:gap-6 justify-center max-w-[1400px]">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white border border-slate-200 rounded-md">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
              <p className="text-[14px] font-semibold text-[#1B2A22]">
                Filters{activeFilterCount > 0 && <span className="text-[#0E733B]"> ({activeFilterCount})</span>}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-[12px] font-semibold text-[#0E733B] hover:underline underline-offset-2">Clear all</button>
              )}
            </div>
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto scroll-rail px-3 pt-4 pb-1">
              <div className="mb-5 px-1">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-1.5">City</p>
                <label className="relative block">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Noida" aria-label="Filter by city"
                    className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-[#0E733B]" />
                </label>
              </div>
              <FilterGroup vertical label="Role type" options={ROLE_TYPES} value={roleType} onChange={setRoleType} />
              <FilterGroup vertical label="Board" options={BOARDS} value={board} onChange={setBoard} />
              <FilterGroup vertical label="Employment" options={EMPLOYMENT_TYPES} value={employment} onChange={setEmployment} />
            </div>
          </div>
        </aside>

        <main className="max-w-[760px] mx-auto w-full flex flex-col gap-5">
          {loading && !jobs.length ? (
            [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md px-6 py-14 text-center">
              <p className="text-[17px] font-semibold text-[#1B2A22]">No jobs match your search</p>
              <p className="mt-1.5 text-[14px] text-slate-600">Try another subject, a different city, or clear the filters.</p>
              {filterChips.length > 0 && (
                <button onClick={clearAll} className="mt-5 rounded-md bg-[#0E733B] px-5 py-2.5 text-[14px] font-semibold text-white">Clear filters</button>
              )}
            </div>
          ) : (
            <>
              <div className={`flex flex-col gap-5 transition-opacity ${loading ? "opacity-60" : ""}`}>
                {jobs.map((job) => <JobCard key={job._id} job={job} applied={applied.has(job._id)} />)}
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button onClick={() => fetchJobs(page - 1)} disabled={page <= 1}
                    className="px-4 py-2 rounded-md border border-slate-200 bg-white text-[13.5px] font-semibold text-slate-700 disabled:opacity-40">← Previous</button>
                  <span className="text-[13.5px] text-slate-600">Page {page} of {pages}</span>
                  <button onClick={() => fetchJobs(page + 1)} disabled={page >= pages}
                    className="px-4 py-2 rounded-md border border-slate-200 bg-white text-[13.5px] font-semibold text-slate-700 disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-[88px] bg-white border border-slate-200 rounded-md overflow-hidden max-w-[300px]">
            <div className="px-4 pt-4 pb-3 border-b border-slate-100">
              <p className="text-[14px] font-semibold text-[#1B2A22]">Hiring organisations</p>
              <label className="relative block mt-2.5">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input value={orgQuery} onChange={(e) => setOrgQuery(e.target.value)} placeholder="Find a school…" aria-label="Find a school"
                  className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-[12.5px] placeholder:text-slate-500 focus:outline-none focus:border-[#0E733B]" />
              </label>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto scroll-rail p-2">{orgList}</div>
          </div>
        </aside>
      </div>

      {/* ── Filters drawer ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/40 modal-backdrop" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-[16px] font-semibold text-[#1B2A22]">Filters</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="lg:hidden">
              <div className="mb-5">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">City</p>
                <label className="relative block">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Noida"
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-[13.5px] placeholder:text-slate-500 focus:outline-none focus:border-[#0E733B]" />
                </label>
              </div>
              <FilterGroup label="Role type" options={ROLE_TYPES} value={roleType} onChange={setRoleType} />
              <FilterGroup label="Board" options={BOARDS} value={board} onChange={setBoard} />
              <FilterGroup label="Employment" options={EMPLOYMENT_TYPES} value={employment} onChange={setEmployment} />
              </div>
              <div className="xl:hidden">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-2">Hiring organisations</p>
                {orgList}
              </div>
            </div>
            <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
              <button onClick={clearAll} className="flex-1 rounded-md border border-slate-200 py-2.5 text-[14px] font-semibold text-slate-700">Clear all</button>
              <button onClick={() => setFiltersOpen(false)} className="flex-1 rounded-md bg-[#0E733B] py-2.5 text-[14px] font-semibold text-white">Show {total} jobs</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
