"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, MapPin, Building2, ChevronRight, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { API } from "./useRecruitmentProfile";

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  institutionName: string;
  city: string;
  state: string;
  board: string;
  currentStage: string;
  stageIndex: number;
  stages: string[];
  status: "active" | "rejected" | "withdrawn" | "offered";
  appliedAt: string;
}

function statusBadge(status: Application["status"]) {
  switch (status) {
    case "active":    return { label: "In progress", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "offered":   return { label: "Offer received", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    case "rejected":  return { label: "Not selected", cls: "bg-red-50 text-red-700 border-red-200" };
    case "withdrawn": return { label: "Withdrawn", cls: "bg-slate-100 text-slate-500 border-slate-200" };
  }
}

function relDate(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d < 1) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MyApplications({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/applications/mine`, { headers });
      if (!res.ok) throw new Error("Could not load applications");
      setApps(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        <span className="ml-3 text-[14px] text-slate-500">Loading your applications…</span>
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

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">My Applications</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">Track your job applications and where you are in each process.</p>
        </div>
        {apps.length > 0 && (
          <div className="flex gap-4 text-center shrink-0">
            {(["active", "offered", "rejected"] as const).map((s) => {
              const count = apps.filter((a) => a.status === s).length;
              const badge = statusBadge(s);
              return (
                <div key={s} className={`px-4 py-2 rounded-xl border text-[13px] font-bold ${badge.cls}`}>
                  {count} {badge.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {apps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-bold text-[16px] text-charcoal mb-1.5">No applications yet</p>
          <p className="text-[13.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Browse open positions and apply to get started. Your applications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {apps.map((app) => {
            const badge = statusBadge(app.status);
            const progress = app.stages.length > 0
              ? Math.round(((app.stageIndex + 1) / app.stages.length) * 100)
              : 0;

            return (
              <div key={app._id} className="bg-white rounded-2xl border border-line shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-[17px] text-charcoal leading-tight">{app.jobTitle}</h3>
                      <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] text-slate-500">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {app.institutionName}</span>
                      {(app.city || app.state) && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{[app.city, app.state].filter(Boolean).join(", ")}</span>
                      )}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Applied {relDate(app.appliedAt)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Current stage</p>
                    <p className="text-[14px] font-bold text-charcoal">{app.currentStage || "—"}</p>
                  </div>
                </div>

                {/* Stage progress bar */}
                {app.stages.length > 0 && app.status === "active" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Progress</p>
                      <p className="text-[11.5px] font-bold text-slate-500">
                        Stage {app.stageIndex + 1} of {app.stages.length}
                      </p>
                    </div>

                    {/* Stage pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {app.stages.map((stage, idx) => {
                        const done = idx < app.stageIndex;
                        const current = idx === app.stageIndex;
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              done
                                ? "bg-emerald-100 text-emerald-700"
                                : current
                                ? "bg-[#0C2A1B] text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {done && <CheckCircle2 className="w-3 h-3" />}
                            {stage}
                          </span>
                        );
                      })}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0E733B] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {app.status === "offered" && (
                  <div className="mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-[13px] text-blue-800 font-semibold">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                    You have received an offer from this school. Check your Offers section.
                  </div>
                )}

                {app.status === "rejected" && (
                  <div className="mt-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-[13px] text-slate-500">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    This application was not taken forward. Keep applying!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
