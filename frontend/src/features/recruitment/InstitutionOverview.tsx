"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, ChevronRight, ArrowRight } from "lucide-react";
import { API } from "./useRecruitmentProfile";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RoleRow {
  _id: string;
  title: string;
  board: string;
  applicants: number;
  furthestStage: string;
  daysSincePublished: number;
}

interface OverviewData {
  openRoles: number;
  activeCandidates: number;
  offersOut: number;
  rolesList: RoleRow[];
}

// ── Pipeline stages ───────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  "Applied", "AI screened", "Screening call", "Assessment",
  "AI interview", "Panel interview", "Demo lesson", "Offer", "Onboarding",
];

function stagePercent(name: string) {
  const idx = PIPELINE_STAGES.findIndex(
    (s) => s.toLowerCase() === name.toLowerCase()
  );
  return idx < 0 ? 5 : Math.round(((idx + 1) / PIPELINE_STAGES.length) * 100);
}

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Animated number ───────────────────────────────────────────────────────────

function AnimNum({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to === 0) { setN(0); return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(to / 18));
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setN(cur);
      if (cur >= to) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [to]);
  return <>{n}</>;
}

// ── Stat bar card ─────────────────────────────────────────────────────────────

function StatBar({
  label,
  value,
  max,
  sub,
  loading,
}: {
  label: string;
  value: number;
  max: number;
  sub: string;
  loading: boolean;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2">
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
        {loading ? (
          <div className="h-8 w-12 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <p className="font-display text-[36px] font-bold text-charcoal leading-none tabular-nums">
            <AnimNum to={value} />
          </p>
        )}
      </div>

      {/* Bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        {loading ? (
          <div className="h-full w-1/3 bg-slate-200 rounded-full animate-pulse" />
        ) : (
          <div
            className="h-full bg-[#0E733B] rounded-full transition-all duration-700"
            style={{ width: `${Math.max(pct, value > 0 ? 6 : 0)}%` }}
          />
        )}
      </div>

      <p className="text-[12px] text-slate-400 leading-none">{sub}</p>
    </div>
  );
}

// ── Role pipeline bar ─────────────────────────────────────────────────────────

function RoleBar({
  role,
  maxApplicants,
  onClick,
}: {
  role: RoleRow;
  maxApplicants: number;
  onClick: () => void;
}) {
  const stagePct  = stagePercent(role.furthestStage);
  const countPct  = maxApplicants > 0 ? (role.applicants / maxApplicants) * 100 : 0;

  return (
    <div
      onClick={onClick}
      className="group px-5 py-4 hover:bg-slate-50/60 cursor-pointer transition-colors border-b border-line last:border-0"
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-semibold text-[14px] text-charcoal group-hover:text-[#0E733B] transition-colors truncate">
            {role.title}
          </p>
          {role.board && (
            <span className="shrink-0 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {role.board}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="font-display font-bold text-[18px] text-charcoal leading-none tabular-nums">{role.applicants}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">applicants</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-[13px] text-slate-500 leading-none">
              {role.daysSincePublished === 0 ? "Today" : `${role.daysSincePublished}d`}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">open for</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0E733B] transition-colors" />
        </div>
      </div>

      {/* Two stacked bars */}
      <div className="space-y-1.5">
        {/* Pipeline progress */}
        <div className="flex items-center gap-2">
          <p className="text-[10.5px] text-slate-400 w-20 shrink-0">Pipeline</p>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E733B] rounded-full transition-all duration-700"
              style={{ width: `${stagePct}%` }}
            />
          </div>
          <p className="text-[10.5px] font-semibold text-[#0E733B] w-24 shrink-0 truncate text-right">
            {role.furthestStage}
          </p>
        </div>

        {/* Applicant share */}
        <div className="flex items-center gap-2">
          <p className="text-[10.5px] text-slate-400 w-20 shrink-0">Applicants</p>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0E733B]/30 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(countPct, role.applicants > 0 ? 4 : 0)}%` }}
            />
          </div>
          <p className="text-[10.5px] text-slate-400 w-24 shrink-0 text-right">
            {maxApplicants > 0 ? `${Math.round(countPct)}% of total` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Bar chart: applicants by role ─────────────────────────────────────────────

function ApplicantChart({
  roles,
  onViewPipeline,
}: {
  roles: RoleRow[];
  onViewPipeline?: (id: string) => void;
}) {
  const max = Math.max(...roles.map((r) => r.applicants), 1);

  return (
    <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
      <p className="font-display font-bold text-[15px] text-charcoal mb-4">Applicants per role</p>
      <div className="space-y-3">
        {roles.map((r) => {
          const pct = (r.applicants / max) * 100;
          return (
            <div
              key={r._id}
              onClick={() => onViewPipeline?.(r._id)}
              className="group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[12.5px] font-semibold text-charcoal group-hover:text-[#0E733B] transition-colors truncate max-w-[60%]">
                  {r.title}
                </p>
                <p className="text-[12px] font-bold text-charcoal tabular-nums">{r.applicants}</p>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0E733B] rounded-full transition-all duration-700 group-hover:bg-[#0B5C2F]"
                  style={{ width: `${Math.max(pct, r.applicants > 0 ? 2 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InstitutionOverview({
  name,
  authHeader,
  onPostJob,
  onViewPipeline,
}: {
  name: string;
  authHeader: () => Promise<Record<string, string>>;
  onPostJob?: () => void;
  onViewPipeline?: (jobId: string) => void;
}) {
  const [data, setData]     = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const h = await authHeader();
      const r = await fetch(`${API}/api/recruitment/school/overview`, { headers: h });
      if (!r.ok) throw new Error("Could not load overview");
      setData(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const totalApplicants = data?.rolesList.reduce((s, r) => s + r.applicants, 0) ?? 0;
  const hasRoles = (data?.rolesList?.length ?? 0) > 0;
  const maxCount = Math.max(...(data?.rolesList.map((r) => r.applicants) ?? [0]), 1);

  // stat max for bar scaling
  const statMax = Math.max(data?.openRoles ?? 0, data?.activeCandidates ?? 0, data?.offersOut ?? 0, 1);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap mb-7">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 mb-1">{dateLabel}</p>
          <h1 className="font-display font-bold text-[32px] sm:text-[38px] text-charcoal leading-tight tracking-tight">
            {greeting(now)},{" "}
            <span className="text-[#0E733B]">{name}</span>
          </h1>
          {!loading && hasRoles && (
            <p className="text-[13.5px] text-slate-500 mt-1.5">
              <span className="font-bold text-charcoal">{data!.openRoles}</span> open role{data!.openRoles !== 1 ? "s" : ""} · {" "}
              <span className="font-bold text-charcoal">{totalApplicants}</span> applicant{totalApplicants !== 1 ? "s" : ""} in pipeline
            </p>
          )}
        </div>
        <button
          onClick={onPostJob}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Post a job
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-[13.5px] text-red-800 mb-6">
          {error}{" "}
          <button onClick={load} className="ml-3 font-bold underline underline-offset-2">Retry</button>
        </div>
      )}

      {/* Stat bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatBar label="Open roles"       value={data?.openRoles ?? 0}        max={statMax} sub="Published positions"       loading={loading} />
        <StatBar label="Active candidates" value={data?.activeCandidates ?? 0} max={statMax} sub="Across all open roles"      loading={loading} />
        <StatBar label="Offers out"        value={data?.offersOut ?? 0}        max={statMax} sub="Awaiting candidate response" loading={loading} />
      </div>

      {/* Body: role list + chart */}
      <div className={`grid gap-5 items-start ${hasRoles && !loading ? "lg:grid-cols-[1fr_280px]" : ""}`}>
        {/* Open roles */}
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <p className="font-display font-bold text-[17px] text-charcoal">Open roles</p>
              {hasRoles && (
                <span className="text-[11.5px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {data!.rolesList.length}
                </span>
              )}
            </div>
            {hasRoles && (
              <button
                onClick={onPostJob}
                className="text-[12.5px] font-bold text-[#0E733B] hover:underline underline-offset-2 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Post a job
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-5 space-y-5">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-100 rounded w-2/5" />
                    <div className="h-4 bg-slate-100 rounded w-12" />
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full" />
                  <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                </div>
              ))}
            </div>
          ) : !hasRoles ? (
            <div className="flex flex-col items-center py-14 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-display font-bold text-[15px] text-charcoal mb-1">No published roles yet</p>
              <p className="text-[13px] text-slate-400 max-w-xs leading-relaxed mb-5">
                Post your first teaching position to start receiving applications.
              </p>
              <button
                onClick={onPostJob}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Post a job
              </button>
            </div>
          ) : (
            <>
              {data!.rolesList.map((role) => (
                <RoleBar
                  key={role._id}
                  role={role}
                  maxApplicants={maxCount}
                  onClick={() => onViewPipeline?.(role._id)}
                />
              ))}
              <div className="px-5 py-3 bg-slate-50 flex items-center justify-between border-t border-line">
                <p className="text-[11.5px] text-slate-400">Click any role to open its pipeline</p>
                <button
                  onClick={onPostJob}
                  className="text-[12px] font-bold text-[#0E733B] hover:underline underline-offset-2 inline-flex items-center gap-1"
                >
                  Post another <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Applicant bar chart (right column) */}
        {!loading && hasRoles && (
          <ApplicantChart roles={data!.rolesList} onViewPipeline={onViewPipeline} />
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-[#0E733B] animate-spin" />
        </div>
      )}
    </div>
  );
}
