"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, Loader2, FileText, MapPin, Mail, Phone,
  Briefcase, GraduationCap, ClipboardList, ChevronRight,
  ChevronDown, XCircle, ExternalLink, Sparkles, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";
import { Screening, VERDICT, scoreBg } from "./screeningTypes";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Qualification { degree?: string; institution?: string; year?: string }
interface Experience    { school?: string; role?: string; from?: string; to?: string }

interface TeacherProfile {
  _id?: string;
  bio?: string;
  qualifications?: Qualification[];
  experience?: Experience[];
  currentCTC?: number;
  expectedCTC?: number;
  subjectSpecialisations?: string[];
  ctetStatus?: string;
  stetStatus?: string;
  availableFrom?: string;
  preferredCities?: string[];
}

interface ApplicationDetail {
  _id: string;
  jobId: string;
  jobTitle: string;
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
  screening?: Screening | null;
  schoolNotes: string;
  appliedAt: string;
  teacherProfile?: TeacherProfile;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function fmt(n?: number) {
  if (!n) return null;
  return n >= 100000
    ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L / month`
    : `₹${n.toLocaleString("en-IN")} / month`;
}

// ── Stage actions dropdown ────────────────────────────────────────────────────

function StageMenu({
  app,
  authHeader,
  onUpdated,
}: {
  app: ApplicationDetail;
  authHeader: () => Promise<Record<string, string>>;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const moveStage = async (idx: number) => {
    setBusy(true); setOpen(false);
    const headers = await authHeader();
    await fetch(`${API}/api/recruitment/applications/${app._id}/stage`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ stageIndex: idx }),
    });
    setBusy(false); onUpdated();
  };

  const reject = async () => {
    setBusy(true); setOpen(false);
    const headers = await authHeader();
    await fetch(`${API}/api/recruitment/applications/${app._id}/status`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    setBusy(false); onUpdated();
  };

  if (app.status !== "active") {
    return (
      <span className="px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-slate-400 capitalize">
        {app.status}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-40"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Move stage"}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-xl border border-line shadow-lg z-30 overflow-hidden">
          <div className="px-3 py-2 border-b border-line">
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide">Move to stage</p>
          </div>
          {app.stages.map((s, idx) => (
            <button
              key={idx}
              onClick={() => moveStage(idx)}
              className={`w-full text-left px-3 py-2 text-[12.5px] font-semibold transition-colors flex items-center gap-2 ${
                idx === app.stageIndex
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-charcoal hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="w-3 h-3 opacity-40" />
              {s}
              {idx === app.stageIndex && (
                <span className="ml-auto text-[10px] font-bold text-emerald-600">Current</span>
              )}
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function CandidateProfile({
  applicationId,
  jobId,
  authHeader,
  onBack,
}: {
  applicationId: string;
  jobId: string;
  authHeader: () => Promise<Record<string, string>>;
  onBack: () => void;
}) {
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/applications/${applicationId}`, { headers });
      if (!res.ok) throw new Error(await res.text());
      setApp(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load candidate");
    } finally {
      setLoading(false);
    }
  }, [applicationId, authHeader]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        <span className="ml-3 text-[14px] text-slate-500">Loading candidate…</span>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-[13.5px] text-red-800">
        {error || "Not found"}{" "}
        <button onClick={load} className="ml-3 font-bold underline underline-offset-2">Retry</button>
      </div>
    );
  }

  const tp = app.teacherProfile;
  const currentIdx = app.stageIndex;
  const stages = app.stages.length
    ? app.stages
    : ["Applied", "AI screened", "Assessment", "Panel interview", "Demo lesson", "Offer", "Onboarding"];

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <p className="text-[13px] text-slate-500 mb-1">
        <button
          onClick={onBack}
          className="text-[#0E733B] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {app.jobTitle || "Pipeline"}
        </button>
        <span className="mx-1.5">/</span>
        <span>{app.teacherName}</span>
      </p>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mt-4 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
            <span className="text-[16px] font-bold text-emerald-800">{initials(app.teacherName)}</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-[26px] sm:text-[30px] text-charcoal leading-tight tracking-tight">
              {app.teacherName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              {tp?.subjectSpecialisations?.length ? (
                <span className="text-[13px] text-slate-600">{tp.subjectSpecialisations.slice(0, 2).join(", ")}</span>
              ) : null}
              {tp?.experience?.length ? (
                <span className="text-[13px] text-slate-500">
                  {tp.experience.length} role{tp.experience.length !== 1 ? "s" : ""} experience
                </span>
              ) : null}
              {app.teacherEmail && (
                <span className="text-[12.5px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {app.teacherEmail}
                </span>
              )}
              {app.teacherPhone && (
                <span className="text-[12.5px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {app.teacherPhone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {tp?._id && (
            <Link
              href={`/recruitment/teachers/${tp._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Public profile
            </Link>
          )}
          {app.resumeUrl && (
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-[13px] font-bold text-blue-700 hover:bg-blue-100 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" /> Resume PDF
            </a>
          )}
          <StageMenu app={app} authHeader={authHeader} onUpdated={load} />
        </div>
      </div>

      {/* Stage progress */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {stages.map((stage, i) => {
          const isCurrent = i === currentIdx;
          const isCompleted = i < currentIdx;
          return (
            <span
              key={i}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold ${
                isCurrent
                  ? "bg-[#0C2A1B] text-white"
                  : isCompleted
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {stage}
            </span>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Left */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Screening */}
          {app.aiScore !== null && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-[17px] text-charcoal flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0E733B]" /> Screening
                  </h2>
                  <p className="text-[12.5px] text-slate-600 mt-0.5">
                    {app.screening?.method === "ai" ? "AI assessment" : "Smart screening"}
                    {app.screening?.screenedAt && ` · ${new Date(app.screening.screenedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    {" "}· supports your decision, never rejects automatically
                  </p>
                  {app.screening && (
                    <span className={`inline-block mt-2.5 text-[11.5px] font-bold px-2 py-0.5 rounded-full border ${VERDICT[app.screening.verdict].cls}`}>
                      {VERDICT[app.screening.verdict].label}
                    </span>
                  )}
                </div>
                <div className="text-center shrink-0">
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-display font-bold text-[26px] ${scoreBg(app.aiScore)}`}>
                    {app.aiScore}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">/ 100</p>
                </div>
              </div>

              {app.screening && (
                <>
                  <p className="text-[13.5px] text-slate-700 leading-relaxed">{app.screening.summary}</p>

                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {app.screening.criteria.map((c) => (
                      <div key={c.key} className="flex flex-col gap-1">
                        <div className="flex items-baseline justify-between gap-2 text-[12.5px]">
                          <span className="font-semibold text-charcoal">{c.label}</span>
                          <span className="tabular-nums text-slate-600">{c.points}/{c.max}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#0E733B]" style={{ width: `${(c.points / c.max) * 100}%` }} />
                        </div>
                        <span className="text-[11.5px] text-slate-600">{c.note}</span>
                      </div>
                    ))}
                  </div>

                  {app.screening.requirements.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Your requirements</p>
                      {app.screening.requirements.map((r) => (
                        <div key={r.text} className="flex items-start gap-2.5 text-[13px]">
                          {r.met
                            ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#0E733B] shrink-0" />
                            : <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />}
                          <div className="min-w-0">
                            <span className="font-semibold text-charcoal">{r.text}</span>
                            <span className={`ml-2 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${r.screening === "hard" ? "bg-[#0C2A1B] text-white" : "bg-emerald-50 text-emerald-800"}`}>
                              {r.screening === "hard" ? "Must-have" : "Preferred"}
                            </span>
                            <p className="text-[12px] text-slate-600 mt-0.5">{r.evidence}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* Cover note */}
          {app.coverNote && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="font-display font-bold text-[17px] text-charcoal mb-3">Cover note</h2>
              <p className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{app.coverNote}</p>
            </section>
          )}

          {/* Bio */}
          {tp?.bio && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="font-display font-bold text-[17px] text-charcoal mb-3">About</h2>
              <p className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{tp.bio}</p>
            </section>
          )}

          {/* Experience */}
          {tp?.experience?.length ? (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="font-display font-bold text-[17px] text-charcoal mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Experience
              </h2>
              <div className="space-y-4">
                {tp.experience.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-charcoal leading-tight">{e.role || "Teacher"}</p>
                      <p className="text-[12.5px] text-slate-500">{e.school}</p>
                      {(e.from || e.to) && (
                        <p className="text-[12px] text-slate-400 mt-0.5">{e.from}{e.from && e.to ? " – " : ""}{e.to || "Present"}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Qualifications */}
          {tp?.qualifications?.length ? (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
              <h2 className="font-display font-bold text-[17px] text-charcoal mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" /> Qualifications
              </h2>
              <div className="space-y-3">
                {tp.qualifications.map((q, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-charcoal leading-tight">{q.degree}</p>
                      {q.institution && <p className="text-[12.5px] text-slate-500">{q.institution}</p>}
                      {q.year && <p className="text-[12px] text-slate-400 mt-0.5">{q.year}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* School notes */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h2 className="font-display font-bold text-[17px] text-charcoal mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-400" /> Recruiter notes
            </h2>
            {app.schoolNotes ? (
              <p className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{app.schoolNotes}</p>
            ) : (
              <p className="text-[13px] text-slate-400 italic">No internal notes added yet.</p>
            )}
          </section>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-5">
          {/* Application meta */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">Application</h3>
            <div className="space-y-2.5">
              <Row label="Status" value={<span className="capitalize font-semibold">{app.status}</span>} />
              <Row label="Current stage" value={app.currentStage} />
              <Row
                label="Applied"
                value={new Date(app.appliedAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              />
              <Row label="Position" value={app.jobTitle} />
            </div>
          </section>

          {/* Compensation */}
          {(tp?.currentCTC || tp?.expectedCTC) && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
              <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">Compensation</h3>
              <div className="space-y-2.5">
                {fmt(tp.currentCTC) && <Row label="Current CTC" value={fmt(tp.currentCTC)!} />}
                {fmt(tp.expectedCTC) && <Row label="Expected CTC" value={fmt(tp.expectedCTC)!} />}
              </div>
            </section>
          )}

          {/* Certifications */}
          {(tp?.ctetStatus || tp?.stetStatus) && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
              <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">Certifications</h3>
              <div className="space-y-2.5">
                {tp?.ctetStatus && <Row label="CTET" value={tp.ctetStatus} />}
                {tp?.stetStatus && <Row label="STET" value={tp.stetStatus} />}
              </div>
            </section>
          )}

          {/* Preferences */}
          {(tp?.subjectSpecialisations?.length || tp?.availableFrom || tp?.preferredCities?.length) && (
            <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
              <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">Preferences</h3>
              <div className="space-y-2.5">
                {tp?.subjectSpecialisations?.length ? (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(tp.subjectSpecialisations as string[]).map((s, i) => (
                        <span key={i} className="text-[11.5px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tp?.availableFrom && <Row label="Available from" value={new Date(tp.availableFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />}
                {tp?.preferredCities?.length ? (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Preferred cities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tp.preferredCities.map((c, i) => (
                        <span key={i} className="text-[11.5px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{c}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-slate-500 shrink-0">{label}</span>
      <span className="text-[13px] font-semibold text-charcoal text-right">{value}</span>
    </div>
  );
}
