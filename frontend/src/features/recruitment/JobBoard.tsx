"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, MapPin, Briefcase, GraduationCap, Clock, Building2,
  ChevronLeft, ChevronRight, Users, CalendarDays, Filter, X,
  Loader2,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";

// ── Types ──────────────────────────────────────────────────────────────────

interface Job {
  _id: string;
  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;
  institutionName: string;
  city: string;
  state: string;
  deadline: string | null;
  publishedAt: string;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
}

interface JobDetailFull extends Job {
  requirements: { text: string; screening: "hard" | "scored" }[];
  stages: string[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const ROLE_TYPES = ["All", "Teaching", "Non-teaching", "Administrative", "Leadership"];
const BOARDS = ["All", "CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS"];

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function deadlineLabel(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days < 0) return "Expired";
  if (days === 0) return "Closes today";
  if (days <= 7) return `${days}d left`;
  return `Until ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function JobBoard({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  // Filters
  const [search, setSearch] = useState("");
  const [roleType, setRoleType] = useState("All");
  const [board, setBoard] = useState("All");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Data
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail view
  const [selected, setSelected] = useState<JobDetailFull | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch jobs list ──
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (search.trim()) params.set("search", search.trim());
      if (roleType !== "All") params.set("roleType", roleType);
      if (board !== "All") params.set("board", board);

      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs?${params}`, { headers });
      if (!res.ok) throw new Error("Failed to load jobs");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleType, board, authHeader]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [search, roleType, board]);

  // ── Fetch single job detail ──
  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${id}`, { headers });
      if (!res.ok) throw new Error("Could not load job details");
      setSelected(await res.json());
    } catch {
      // Fallback: use the list data
      const j = data?.jobs.find((j) => j._id === id);
      if (j) setSelected({ ...j, requirements: [], stages: [] });
    } finally {
      setDetailLoading(false);
    }
  };

  const activeFilters = (roleType !== "All" ? 1 : 0) + (board !== "All" ? 1 : 0);

  // ── Detail View ──────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="max-w-[900px]">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0E733B] hover:underline underline-offset-2 mb-5"
        >
          <ChevronLeft className="w-4 h-4" /> Back to jobs
        </button>

        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-line">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="font-display font-bold text-[26px] sm:text-[30px] text-charcoal leading-tight tracking-tight">
                  {selected.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[13.5px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {selected.institutionName || "School"}
                  </span>
                  {(selected.city || selected.state) && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {[selected.city, selected.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> Posted {relativeDate(selected.publishedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[selected.roleType, selected.board, selected.employment, selected.classes].filter(Boolean).map((t) => (
                <span key={t} className="text-[12px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
              {selected.openings > 1 && (
                <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {selected.openings} openings
                </span>
              )}
              {selected.deadline && (
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                  deadlineLabel(selected.deadline) === "Expired"
                    ? "text-red-700 bg-red-50"
                    : "text-amber-700 bg-amber-50"
                }`}>
                  {deadlineLabel(selected.deadline)}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {selected.description && (
              <div className="mb-6">
                <h2 className="font-display font-bold text-[16px] text-charcoal mb-3">About the role</h2>
                <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {selected.description}
                </p>
              </div>
            )}

            {selected.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="font-display font-bold text-[16px] text-charcoal mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {selected.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600">
                      <span className={`shrink-0 mt-0.5 text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        r.screening === "hard"
                          ? "bg-[#0C2A1B] text-white"
                          : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {r.screening === "hard" ? "Required" : "Preferred"}
                      </span>
                      <span>{r.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.stages.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-[16px] text-charcoal mb-3">Hiring process</h2>
                <div className="flex flex-wrap gap-2">
                  {selected.stages.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-[12.5px] font-semibold text-emerald-800"
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200 text-[11px] font-bold text-emerald-900">
                        {i + 1}
                      </span>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">
          Browse Jobs
        </h1>
        <p className="text-[13.5px] text-slate-500 mt-1">
          Explore teaching and school positions posted by verified institutions.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject, or school name…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white text-[13.5px] text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all"
          />
        </div>

        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13.5px] font-semibold transition-all shrink-0 ${
            filtersOpen || activeFilters
              ? "border-[#0E733B] bg-emerald-50 text-[#0E733B]"
              : "border-line bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilters > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#0E733B] text-white text-[11px] font-bold">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter chips */}
      {filtersOpen && (
        <div className="bg-white rounded-2xl border border-line shadow-sm p-5 mb-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-[13px] font-bold text-charcoal uppercase tracking-wide">Filter by</h3>
            {activeFilters > 0 && (
              <button
                onClick={() => { setRoleType("All"); setBoard("All"); }}
                className="text-[12.5px] font-semibold text-red-600 hover:underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 mb-2">Role type</p>
              <div className="flex flex-wrap gap-2">
                {ROLE_TYPES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleType(r)}
                    className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
                      roleType === r
                        ? "bg-[#0C2A1B] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-slate-500 mb-2">Board</p>
              <div className="flex flex-wrap gap-2">
                {BOARDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBoard(b)}
                    className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
                      board === b
                        ? "bg-[#0C2A1B] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active filter pills (always visible) */}
      {activeFilters > 0 && !filtersOpen && (
        <div className="flex flex-wrap gap-2 mb-5">
          {roleType !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[12.5px] font-semibold text-emerald-800">
              {roleType}
              <button onClick={() => setRoleType("All")} className="hover:text-red-600 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {board !== "All" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[12.5px] font-semibold text-emerald-800">
              {board}
              <button onClick={() => setBoard("All")} className="hover:text-red-600 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
          <span className="ml-3 text-[14px] text-slate-500">Loading jobs…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-[13.5px] text-red-800">
          {error}
          <button onClick={fetchJobs} className="ml-3 font-bold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && data && data.jobs.length === 0 && (
        <div className="bg-white rounded-2xl border border-line p-10 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-bold text-[16px] text-charcoal mb-1.5">No jobs found</p>
          <p className="text-[13.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            {search || activeFilters
              ? "Try adjusting your search or filters."
              : "No positions have been posted yet. Check back soon!"}
          </p>
        </div>
      )}

      {/* Job cards */}
      {!loading && !error && data && data.jobs.length > 0 && (
        <>
          <p className="text-[12.5px] text-slate-400 font-semibold mb-3">
            {data.total} {data.total === 1 ? "position" : "positions"} found
          </p>

          <div className="grid gap-3">
            {data.jobs.map((job) => (
              <button
                key={job._id}
                onClick={() => openDetail(job._id)}
                className="w-full text-left bg-white rounded-2xl border border-line shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-5 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-[17px] text-charcoal leading-tight group-hover:text-[#0E733B] transition-colors">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-2 text-[12.5px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {job.institutionName || "School"}
                      </span>
                      {(job.city || job.state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {[job.city, job.state].filter(Boolean).join(", ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {relativeDate(job.publishedAt)}
                      </span>
                      {job.openings > 1 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {job.openings} openings
                        </span>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-[13px] text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[job.roleType, job.board, job.employment?.split(",")[0], job.classes].filter(Boolean).map((t) => (
                        <span key={t} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deadline badge */}
                  {job.deadline && deadlineLabel(job.deadline) && (
                    <span className={`shrink-0 text-[11.5px] font-bold px-2.5 py-1 rounded-lg ${
                      deadlineLabel(job.deadline) === "Expired"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {deadlineLabel(job.deadline)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[13px] text-slate-500 font-semibold px-3">
                Page {data.page} of {data.pages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(data!.pages, p + 1))}
                disabled={page >= data.pages}
                className="p-2 rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {detailLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        </div>
      )}
    </div>
  );
}
