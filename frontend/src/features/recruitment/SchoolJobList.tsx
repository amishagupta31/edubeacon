"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Briefcase, Clock, MapPin, Users, Eye, Pencil, Trash2, Loader2,
  Plus, CheckCircle2, FileText, XCircle,
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
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  deadline: string | null;
  publishedAt: string | null;
  applicantCount: number;
  createdAt: string;
}

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

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-red-50 text-red-700",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  DRAFT: FileText,
  PUBLISHED: CheckCircle2,
  CLOSED: XCircle,
};

// ── Component ──────────────────────────────────────────────────────────────

export default function SchoolJobList({
  authHeader,
  onPostJob,
  onViewPipeline,
}: {
  authHeader: () => Promise<Record<string, string>>;
  onPostJob: () => void;
  onViewPipeline?: (jobId: string) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/mine`, { headers });
      if (!res.ok) throw new Error("Failed to load jobs");
      setJobs(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // ── Actions ──

  const publishJob = async (id: string) => {
    setActionLoading(id);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not publish");
      }
      await fetchJobs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const closeJob = async (id: string) => {
    if (!confirm("Close this job? It will no longer appear in the teacher job board.")) return;
    setActionLoading(id);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "CLOSED" }),
      });
      if (!res.ok) throw new Error("Could not close job");
      await fetchJobs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete");
      }
      await fetchJobs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Counts ──
  const counts = {
    DRAFT: jobs.filter((j) => j.status === "DRAFT").length,
    PUBLISHED: jobs.filter((j) => j.status === "PUBLISHED").length,
    CLOSED: jobs.filter((j) => j.status === "CLOSED").length,
  };

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">
            Jobs &amp; pipeline
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Roles you have posted and where each candidate stands.
          </p>
        </div>
        <button
          onClick={onPostJob}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Post a job
        </button>
      </div>

      {/* Stats row */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {([
            { label: "Drafts", value: counts.DRAFT, color: "text-slate-600" },
            { label: "Published", value: counts.PUBLISHED, color: "text-emerald-700" },
            { label: "Closed", value: counts.CLOSED, color: "text-red-600" },
          ] as const).map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-line p-4">
              <p className={`font-display text-[24px] font-bold leading-none tabular-nums ${s.color}`}>
                {s.value}
              </p>
              <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wide mt-1.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
          <span className="ml-3 text-[14px] text-slate-500">Loading your jobs…</span>
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

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <div className="bg-white rounded-2xl border border-line p-10 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-bold text-[16px] text-charcoal mb-1.5">No jobs posted yet</p>
          <p className="text-[13.5px] text-slate-500 max-w-sm mx-auto leading-relaxed mb-4">
            Post your first role to start receiving applications from qualified teachers.
          </p>
          <button
            onClick={onPostJob}
            className="px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
          >
            Post a job
          </button>
        </div>
      )}

      {/* Job list */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-3">
          {jobs.map((job) => {
            const SIcon = STATUS_ICON[job.status] || FileText;
            const isLoading = actionLoading === job._id;

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-line shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        className="font-display font-bold text-[17px] text-charcoal leading-tight hover:text-[#0E733B] cursor-pointer transition-colors"
                        onClick={() => onViewPipeline?.(job._id)}
                      >
                        {job.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[job.status]}`}>
                        <SIcon className="w-3 h-3" /> {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-2 text-[12.5px] text-slate-500">
                      {(job.city || job.state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {[job.city, job.state].filter(Boolean).join(", ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Created {relativeDate(job.createdAt)}
                      </span>
                      {job.openings > 1 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {job.openings} openings
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[job.roleType, job.board, job.employment?.split(",")[0], job.classes].filter(Boolean).map((t) => (
                        <span key={t} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}

                    {job.status === "DRAFT" && !isLoading && (
                      <>
                        <button
                          onClick={() => publishJob(job._id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0E733B] text-white text-[12px] font-bold hover:bg-[#0B5C2F] transition-all"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {job.status === "PUBLISHED" && !isLoading && (
                      <button
                        onClick={() => closeJob(job._id)}
                        className="px-3 py-1.5 rounded-lg border border-line text-[12px] font-semibold text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
