"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, Loader2, ChevronRight, ChevronDown,
  UserCheck, XCircle, ClipboardList, FileText,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";

// ── Types ──────────────────────────────────────────────────────────────────

interface Applicant {
  _id: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  resumeUrl: string;
  coverNote: string;
  currentStage: string;
  stageIndex: number;
  stages: string[];
  status: "active" | "rejected" | "withdrawn" | "offered";
  aiScore: number | null;
  schoolNotes: string;
  appliedAt: string;
}

interface PipelineData {
  job: { title: string; stages: string[] };
  applications: Applicant[];
}

// ── Score circle ───────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number | null }) {
  if (score === null) return (
    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400">—</span>
    </div>
  );
  const color = score >= 80 ? "bg-emerald-500" : score >= 70 ? "bg-amber-400" : "bg-slate-300";
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center`}>
      <span className="text-[11px] font-bold text-white tabular-nums">{score}</span>
    </div>
  );
}

// ── Stage Action Menu ──────────────────────────────────────────────────────

function StageActions({
  app,
  stages,
  authHeader,
  onUpdated,
}: {
  app: Applicant;
  stages: string[];
  authHeader: () => Promise<Record<string, string>>;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const moveStage = async (idx: number) => {
    setWorking(true);
    setOpen(false);
    try {
      const headers = await authHeader();
      await fetch(`${API}/api/recruitment/applications/${app._id}/stage`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ stageIndex: idx }),
      });
      onUpdated();
    } finally { setWorking(false); }
  };

  const reject = async () => {
    setWorking(true);
    setOpen(false);
    try {
      const headers = await authHeader();
      await fetch(`${API}/api/recruitment/applications/${app._id}/status`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      onUpdated();
    } finally { setWorking(false); }
  };

  if (app.status !== "active") {
    return <span className="text-[11px] text-slate-400 font-semibold italic">{app.status}</span>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={working}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-line bg-white text-[11.5px] font-semibold text-charcoal hover:bg-slate-50 transition-all disabled:opacity-40"
      >
        {working ? <Loader2 className="w-3 h-3 animate-spin" /> : "Actions"}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-line shadow-lg z-20 overflow-hidden">
          <div className="px-3 py-2 border-b border-line">
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Move to stage</p>
          </div>
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => moveStage(idx)}
              className={`w-full text-left px-3 py-2 text-[12.5px] font-semibold transition-colors flex items-center gap-2 ${
                idx === app.stageIndex ? "bg-emerald-50 text-emerald-700" : "text-charcoal hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="w-3 h-3 opacity-40" />
              {stage}
              {idx === app.stageIndex && <span className="ml-auto text-[10px] font-bold text-emerald-600">Current</span>}
            </button>
          ))}
          <div className="border-t border-line">
            <button
              onClick={reject}
              className="w-full text-left px-3 py-2.5 text-[12.5px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> Do not proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function JobPipeline({
  jobId,
  authHeader,
  onBack,
  onViewCandidate,
}: {
  jobId: string;
  authHeader: () => Promise<Record<string, string>>;
  onBack: () => void;
  onViewCandidate: (candidateId: string) => void;
}) {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${jobId}/applications`, { headers });
      if (!res.ok) throw new Error("Could not load pipeline");
      const d = await res.json() as PipelineData;
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [jobId, authHeader]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        <span className="ml-3 text-[14px] text-slate-500">Loading pipeline…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-[13.5px] text-red-800">
        {error} <button onClick={load} className="ml-3 font-bold underline underline-offset-2">Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const { job, applications } = data;
  const stages = job.stages.length
    ? job.stages
    : ["Applied", "AI screened", "Assessment", "Panel interview", "Demo lesson"];

  // Group applicants by stage
  const byStage: Applicant[][] = stages.map((_, idx) =>
    applications.filter((a) => a.stageIndex === idx && a.status === "active")
  );
  const rejected = applications.filter((a) => a.status === "rejected");
  const offered = applications.filter((a) => a.status === "offered");

  const stageApps = byStage[activeStage] || [];

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0E733B] hover:underline underline-offset-2 mb-1">
            <ChevronLeft className="w-4 h-4" /> Back to jobs
          </button>
          <h1 className="font-display font-bold text-[26px] text-charcoal leading-tight tracking-tight">{job.title}</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{applications.length} total applications · {applications.filter(a => a.status === "active").length} active</p>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 shrink-0 flex-wrap">
          {offered.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[12px] font-bold text-blue-700">
              {offered.length} offered
            </span>
          )}
          {rejected.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[12px] font-bold text-red-600">
              {rejected.length} rejected
            </span>
          )}
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {stages.map((stage, idx) => {
          const count = (byStage[idx] || []).length;
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                activeStage === idx
                  ? "bg-[#0C2A1B] text-white border-transparent shadow-sm"
                  : "bg-white text-slate-600 border-line hover:border-slate-300"
              }`}
            >
              {stage}
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeStage === idx ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applicant cards */}
      {stageApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-10 text-center">
          <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-bold text-[15px] text-charcoal mb-1">No applicants in this stage</p>
          <p className="text-[13px] text-slate-500">Move candidates here using the Actions button on their card.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {stageApps.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border border-line shadow-sm p-5">
              <div className="flex items-start gap-4">
                <ScoreCircle score={app.aiScore} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-[16px] text-charcoal leading-tight">{app.teacherName}</h3>
                      <p className="text-[12.5px] text-slate-500 mt-0.5">{app.teacherEmail} {app.teacherPhone && `· ${app.teacherPhone}`}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11.5px] font-bold text-blue-700 hover:bg-blue-100 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" /> Resume PDF
                        </a>
                      ) : (
                        <span
                          title="No resume uploaded by candidate"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11.5px] font-semibold text-slate-400 cursor-not-allowed"
                        >
                          <FileText className="w-3.5 h-3.5" /> No resume
                        </span>
                      )}
                      <button
                        onClick={() => onViewCandidate(app._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11.5px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> View profile
                      </button>
                      <StageActions app={app} stages={stages} authHeader={authHeader} onUpdated={load} />
                    </div>
                  </div>

                  {app.coverNote && (
                    <p className="mt-2.5 text-[13px] text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 leading-relaxed line-clamp-3 border border-slate-100">
                      {app.coverNote}
                    </p>
                  )}

                  <p className="text-[11.5px] text-slate-400 mt-2">
                    Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
