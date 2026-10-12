"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft, Loader2, ChevronRight, ChevronDown,
  UserCheck, XCircle, ClipboardList, FileText, Sparkles, AlertTriangle, Columns3, X, Check, Minus,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";
import { Screening, VERDICT, scoreBg, CTET_LABEL } from "./screeningTypes";

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
  screening: Screening | null;
  schoolNotes: string;
  appliedAt: string;
}

interface PipelineData {
  job: { title: string; stages: string[]; requirements: { text: string; screening: "hard" | "scored" }[] };
  applications: Applicant[];
  aiEnabled: boolean;
}

// ── Score circle ───────────────────────────────────────────────────────────

function ScoreCircle({ score }: { score: number | null }) {
  if (score === null) return (
    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0" title="Not screened yet">
      <span className="text-[11px] font-bold text-slate-500">—</span>
    </div>
  );
  return (
    <div className={`w-11 h-11 rounded-full ${scoreBg(score)} flex flex-col items-center justify-center shrink-0`} title="Match score out of 100">
      <span className="text-[14px] font-bold leading-none tabular-nums">{score}</span>
      <span className="text-[8px] font-semibold opacity-80 leading-none mt-0.5">/100</span>
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

// ── Side-by-side comparison ────────────────────────────────────────────────

function CompareModal({ apps, onClose }: { apps: Applicant[]; onClose: () => void }) {
  const reqs = apps.find((a) => a.screening)?.screening?.requirements.map((r) => ({ text: r.text, screening: r.screening })) ?? [];
  const fmt = (n: number | null) => (n ? `₹${n.toLocaleString("en-IN")}` : "—");
  const rows: { label: string; render: (a: Applicant) => React.ReactNode }[] = [
    { label: "Match score", render: (a) => <span className={`inline-flex px-2.5 py-1 rounded-lg text-[13px] font-bold tabular-nums ${scoreBg(a.aiScore)}`}>{a.aiScore ?? "—"}</span> },
    { label: "Verdict", render: (a) => a.screening ? <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full border ${VERDICT[a.screening.verdict].cls}`}>{VERDICT[a.screening.verdict].label}</span> : "—" },
    { label: "Subjects", render: (a) => a.screening?.facts.subjects.join(", ") || "—" },
    { label: "Experience", render: (a) => a.screening ? `${a.screening.facts.experienceYears} yrs` : "—" },
    { label: "CTET", render: (a) => a.screening ? CTET_LABEL[a.screening.facts.ctetStatus] ?? a.screening.facts.ctetStatus : "—" },
    { label: "Qualifications", render: (a) => a.screening?.facts.qualifications.join("; ") || "—" },
    { label: "Preferred cities", render: (a) => a.screening?.facts.preferredCities.join(", ") || "—" },
    { label: "Expected CTC", render: (a) => fmt(a.screening?.facts.expectedCTC ?? null) },
    { label: "Current stage", render: (a) => a.currentStage || "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/40 modal-backdrop" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-5xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <div>
            <h2 className="font-display font-bold text-[19px] text-charcoal">Compare candidates</h2>
            <p className="text-[12.5px] text-slate-600">Side by side on the points you hire on</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-[13px] border-collapse min-w-[560px]">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left font-semibold text-slate-500 px-6 py-3 w-[170px]"></th>
                {apps.map((a) => (
                  <th key={a._id} className="text-left px-4 py-3 font-display font-bold text-[15px] text-charcoal">{a.teacherName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line align-top">
                  <td className="px-6 py-3 text-[12px] font-bold uppercase tracking-wide text-slate-500">{r.label}</td>
                  {apps.map((a) => <td key={a._id} className="px-4 py-3 text-slate-800">{r.render(a)}</td>)}
                </tr>
              ))}
              {reqs.map((q) => (
                <tr key={q.text} className="border-t border-line align-top">
                  <td className="px-6 py-3 text-[12.5px] text-slate-700">
                    <span className={`mr-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${q.screening === "hard" ? "bg-[#0C2A1B] text-white" : "bg-emerald-50 text-emerald-800"}`}>
                      {q.screening === "hard" ? "Must" : "Pref"}
                    </span>
                    {q.text}
                  </td>
                  {apps.map((a) => {
                    const r = a.screening?.requirements.find((x) => x.text === q.text);
                    return (
                      <td key={a._id} className="px-4 py-3">
                        {!r ? <Minus className="w-4 h-4 text-slate-400" /> : r.met
                          ? <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><Check className="w-4 h-4" /> Met</span>
                          : <span className="inline-flex items-center gap-1 text-amber-700 font-semibold"><X className="w-4 h-4" /> Not shown</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
  const [sortBy, setSortBy] = useState<"score" | "newest">("score");
  const [mustHaveOnly, setMustHaveOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [screening, setScreening] = useState(false);
  const [screenMsg, setScreenMsg] = useState<string | null>(null);

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

  const runScreening = async () => {
    setScreening(true);
    setScreenMsg(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/jobs/${jobId}/screen`, { method: "POST", headers });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Screening failed");
      setScreenMsg(`Screened ${body.screened} applicant${body.screened === 1 ? "" : "s"}${body.method === "ai" ? " with AI" : ""}.`);
      await load();
    } catch (err) {
      setScreenMsg(err instanceof Error ? err.message : "Screening failed");
    } finally {
      setScreening(false);
    }
  };

  const toggleCompare = (id: string) =>
    setCompareIds((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 3 ? ids : [...ids, id]);

  if (loading && !data) {
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

  const stageApps = (byStage[activeStage] || [])
    .filter((a) => !mustHaveOnly || (a.screening && a.screening.verdict !== "missing_must_have"))
    .sort((a, b) => sortBy === "score"
      ? (b.aiScore ?? -1) - (a.aiScore ?? -1)
      : new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  const unscreened = applications.filter((a) => a.aiScore === null).length;
  const compareApps = applications.filter((a) => compareIds.includes(a._id));

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
        <div className="flex gap-2 shrink-0 flex-wrap items-center">
          <button
            onClick={runScreening}
            disabled={screening || applications.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C2A1B] text-white text-[13px] font-bold hover:bg-[#0E733B] transition-colors disabled:opacity-50"
          >
            {screening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#8FE3B0]" />}
            {screening ? "Screening…" : unscreened ? `Screen ${unscreened} new` : "Re-run AI screening"}
          </button>
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

      {/* Screening info + toolbar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 px-4 py-3 text-[12.5px] text-emerald-900">
          <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-[#0E733B]" />
          <p className="leading-relaxed">
            {data.aiEnabled
              ? "AI screening is on: each applicant is scored against this job's requirements, with a written summary."
              : "Smart screening scores each applicant on subject fit, experience, CTET, qualifications, location and your requirements. Add an Anthropic API key on the server to upgrade to AI-written assessments."}
            {" "}Scores support your judgement — they never reject anyone automatically.
            {screenMsg && <span className="block mt-1 font-semibold">{screenMsg}</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-line bg-white p-0.5">
            {(["score", "newest"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setSortBy(k)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors ${sortBy === k ? "bg-[#0C2A1B] text-white" : "text-slate-600 hover:text-charcoal"}`}
              >
                {k === "score" ? "Best match" : "Newest"}
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-line bg-white text-[12.5px] font-semibold text-slate-700 cursor-pointer select-none">
            <input type="checkbox" checked={mustHaveOnly} onChange={(e) => setMustHaveOnly(e.target.checked)} className="accent-[#0E733B]" />
            Meets all must-haves
          </label>
          <button
            onClick={() => setShowCompare(true)}
            disabled={compareIds.length < 2}
            className="ml-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#0E733B]/40 bg-white text-[12.5px] font-bold text-[#0E733B] hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Columns3 className="w-4 h-4" /> Compare ({compareIds.length}/3)
          </button>
        </div>
      </div>

      {showCompare && compareApps.length >= 2 && <CompareModal apps={compareApps} onClose={() => setShowCompare(false)} />}

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

                  {app.screening && (
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full border ${VERDICT[app.screening.verdict].cls}`}>
                          {VERDICT[app.screening.verdict].label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {app.screening.method === "ai" ? "AI assessment" : "Smart screening"}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-700 leading-relaxed">{app.screening.summary}</p>
                      {app.screening.requirements.some((r) => r.screening === "hard" && !r.met) && (
                        <p className="flex items-start gap-1.5 text-[12.5px] text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          Not shown: {app.screening.requirements.filter((r) => r.screening === "hard" && !r.met).map((r) => r.text).join("; ")}
                        </p>
                      )}
                    </div>
                  )}

                  {app.coverNote && (
                    <p className="mt-2.5 text-[13px] text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 leading-relaxed line-clamp-3 border border-slate-100">
                      {app.coverNote}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-2.5">
                    <p className="text-[11.5px] text-slate-500">
                      Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <label className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={compareIds.includes(app._id)}
                        disabled={!compareIds.includes(app._id) && compareIds.length >= 3}
                        onChange={() => toggleCompare(app._id)}
                        className="accent-[#0E733B]"
                      />
                      Compare
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
