"use client";

import { ArrowUpRight } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   PLACEHOLDER DATA — nothing below is real.

   The recruitment backend currently exposes only the institution profile;
   there are no job, candidate, interview or offer models yet, and
   GET /recruitment/school/overview returns hardcoded zeros.

   These constants exist so the dashboard layout can be reviewed. Replace
   each with the real API response as those endpoints land, and delete the
   `demo` flag on <InstitutionOverview /> to drop back to empty states.
   ─────────────────────────────────────────────────────────────────────────── */

const DEMO_STATS = [
  { label: "Open roles",          value: 6,   caption: "2 closing this month" },
  { label: "Active candidates",   value: 112, caption: "Across all open roles" },
  { label: "Interviews this week", value: 9,  caption: "3 demo lessons included" },
  { label: "Offers out",          value: 3,   caption: "1 in negotiation" },
];

type Stage = "Applied" | "Assessment" | "Panel interview" | "Demo lesson" | "Offer";

const DEMO_ROLES: { role: string; board: string; applicants: number; stage: Stage; openFor: string }[] = [
  { role: "PGT Physics",              board: "CBSE · XI–XII",  applicants: 46, stage: "Offer",           openFor: "21 days" },
  { role: "TGT Mathematics",          board: "CBSE · VI–X",    applicants: 38, stage: "Demo lesson",     openFor: "14 days" },
  { role: "PRT English",              board: "CBSE · I–V",     applicants: 29, stage: "Panel interview", openFor: "10 days" },
  { role: "Special Educator",         board: "All levels",     applicants: 12, stage: "Assessment",      openFor: "8 days"  },
  { role: "Lab Assistant (Chemistry)", board: "Non-teaching",  applicants: 9,  stage: "Applied",         openFor: "3 days"  },
];

type ActionKind = "Approval" | "Review" | "Overdue";

const DEMO_ACTIONS: { title: string; detail: string; kind: ActionKind }[] = [
  { title: "Approve offer — Ananya Iyer",        detail: "PGT Physics · ₹78,000",  kind: "Approval" },
  { title: "Counter-offer sign-off — Meera Joshi", detail: "Above target band",    kind: "Approval" },
  { title: "Document review — Imran Qureshi",    detail: "STET certificate missing", kind: "Review" },
  { title: "3 panel scorecards pending",         detail: "TGT Mathematics",        kind: "Overdue" },
];

const DEMO_TODAY = [
  { time: "10:00", title: "Demo lesson — TGT Maths",    detail: "Rohan Gupta · Class VIII-A" },
  { time: "11:30", title: "Panel interview — PRT English", detail: "Fatima Sheikh · Google Meet" },
  { time: "15:00", title: "Offer call — PGT Physics",   detail: "Meera Joshi · phone" },
];

/* ─── Theme-aligned tokens ───────────────────────────────────────────────── */

// Pipeline stages read as a progression through the brand green scale.
const STAGE_STYLE: Record<Stage, string> = {
  "Applied":         "bg-slate-100 text-slate-600",
  "Assessment":      "bg-emerald-50 text-emerald-700",
  "Panel interview": "bg-emerald-100 text-emerald-800",
  "Demo lesson":     "bg-emerald-100 text-emerald-800",
  "Offer":           "bg-[#0E733B] text-white",
};

const ACTION_STYLE: Record<ActionKind, string> = {
  "Approval": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Review":   "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Overdue":  "bg-red-50 text-red-700 ring-red-600/20",
};

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function InstitutionOverview({
  name,
  demo = false,
  onPostJob,
  onViewCandidates,
}: {
  name: string;
  /** Render the placeholder figures above. Off → honest empty states. */
  demo?: boolean;
  onPostJob?: () => void;
  onViewCandidates?: () => void;
}) {
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  const stats = demo
    ? DEMO_STATS
    : DEMO_STATS.map((s) => ({ ...s, value: 0, caption: "No data yet" }));

  const roles   = demo ? DEMO_ROLES   : [];
  const actions = demo ? DEMO_ACTIONS : [];
  const today   = demo ? DEMO_TODAY   : [];

  return (
    <div className="max-w-[1400px]">
      {/* ── Greeting row ── */}
      <div className="flex items-start justify-between gap-6 flex-wrap mb-7">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 mb-1">{dateLabel}</p>
          <h1 className="font-display font-bold text-[30px] sm:text-[36px] text-charcoal leading-tight tracking-tight">
            {greeting(now)}, {name}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onViewCandidates}
            className="px-5 py-2.5 rounded-xl bg-white border border-line text-[13.5px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
          >
            View all candidates
          </button>
          <button
            onClick={onPostJob}
            className="px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
          >
            Post a job
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-line p-5 shadow-sm">
            <p className="text-[13px] text-slate-500 mb-2">{s.label}</p>
            <p className="font-display text-[34px] font-bold text-charcoal leading-none tabular-nums mb-2.5">
              {s.value}
            </p>
            <p className="text-[12px] text-slate-400">{s.caption}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column body ── */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-start">
        {/* Open roles */}
        <section className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h2 className="font-display font-bold text-[17px] text-charcoal">Open roles</h2>
            <button className="text-[13px] font-semibold text-[#0E733B] hover:underline underline-offset-2 inline-flex items-center gap-1">
              All jobs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {roles.length === 0 ? (
            <div className="px-6 pb-10 pt-4 text-center">
              <p className="text-[14px] font-semibold text-slate-600 mb-1">No open roles yet</p>
              <p className="text-[13px] text-slate-400">
                Roles you post will appear here with their pipeline progress.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="border-y border-line bg-slate-50/60">
                    {["Role", "Board", "Applicants", "Furthest stage", "Open for"].map((h) => (
                      <th key={h} className="px-6 py-2.5 text-left text-[12px] font-semibold text-slate-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {roles.map((r) => (
                    <tr key={r.role} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-charcoal whitespace-nowrap">{r.role}</td>
                      <td className="px-6 py-3.5 text-slate-600 whitespace-nowrap">{r.board}</td>
                      <td className="px-6 py-3.5 text-slate-600 tabular-nums">{r.applicants}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STAGE_STYLE[r.stage]}`}>
                          {r.stage}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 whitespace-nowrap">{r.openFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Needs your action */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h2 className="font-display font-bold text-[17px] text-charcoal mb-4">Needs your action</h2>

            {actions.length === 0 ? (
              <p className="text-[13px] text-slate-400 py-2">Nothing needs your attention right now.</p>
            ) : (
              <div className="divide-y divide-line -mb-1">
                {actions.map((a) => (
                  <div key={a.title} className="flex items-start justify-between gap-3 py-3.5 first:pt-0">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-charcoal leading-snug">{a.title}</p>
                      <p className="text-[12.5px] text-slate-500 mt-0.5">{a.detail}</p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ring-1 ring-inset ${ACTION_STYLE[a.kind]}`}>
                      {a.kind}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Today */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[17px] text-charcoal">Today</h2>
              <button className="text-[13px] font-semibold text-[#0E733B] hover:underline underline-offset-2">
                Calendar
              </button>
            </div>

            {today.length === 0 ? (
              <p className="text-[13px] text-slate-400 py-2">Nothing scheduled today.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {today.map((t) => (
                  <div key={t.time} className="flex gap-4">
                    <span className="text-[13px] font-bold text-charcoal tabular-nums shrink-0 w-11 pt-0.5">
                      {t.time}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-charcoal leading-snug">{t.title}</p>
                      <p className="text-[12.5px] text-slate-500 mt-0.5">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
