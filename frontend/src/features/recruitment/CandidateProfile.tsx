"use client";

import { ChevronLeft, Play } from "lucide-react";

// ── Demo data — matches the design mockup exactly ──────────────────────────

const DEMO = {
  name: "Ananya Iyer",
  initials: "AN",
  subtitle: "PGT Physics at [CURRENT SCHOOL] · 7 yrs · Pune · Notice 60 days",

  currentStage: "Demo lesson",
  stages: [
    "Applied",
    "AI screened",
    "Assessment",
    "AI interview",
    "Panel interview",
    "Demo lesson",
    "Offer",
    "Onboarding",
  ],

  fitScore: 91,
  factors: [
    {
      name: "Subject match",
      weight: "30%",
      detail: "M.Sc Physics; teaches mechanics, optics and modern physics at XI–XII.",
      score: 95,
    },
    {
      name: "Board & level",
      weight: "20%",
      detail: "7 yrs CBSE senior secondary, incl. practical exam duty.",
      score: 92,
    },
    {
      name: "Certifications",
      weight: "15%",
      detail: "B.Ed and CTET verified. One experience letter missing.",
      score: 90,
    },
    {
      name: "Assessment",
      weight: "15%",
      detail: "Subject test 44/50; pedagogy scenarios rated strong.",
      score: 86,
    },
    {
      name: "Demo lesson",
      weight: "20%",
      detail: "Rubric 4.4 / 5 from 3 panel members.",
      score: 88,
    },
  ],
  hardFilters: "all 4 passed (B.Ed, M.Sc Physics, CBSE XI–XII, Pune or relocating)",

  credentials: [
    { label: "B.Ed", status: "Verified", variant: "green" as const },
    { label: "CTET Paper II", status: "Verified", variant: "green" as const },
    { label: "M.Sc Physics", status: "Verified", variant: "green" as const },
    { label: "Experience letters", status: "2 of 3", variant: "amber" as const },
    { label: "Police verification", status: "At onboarding", variant: "muted" as const },
  ],

  demo: {
    topic: "Ohm's law · Class XI-B · 35 min · recorded",
    rubric: [
      { label: "Content accuracy", score: 4.6 },
      { label: "Classroom mgmt", score: 4.2 },
      { label: "Engagement", score: 4.5 },
      { label: "Clarity", score: 4.3 },
    ],
    panelNote:
      "[PANEL MEMBER NOTE — summary of strengths and one improvement area]. Student feedback forms: [N] received.",
  },

  compensation: {
    current: "₹[CURRENT] / month",
    expected: "₹[EXPECTED] / month",
    budget: "₹[MIN]–₹[MAX] / month",
  },

  audit: [
    { text: "Moved to Demo lesson", source: "[RECRUITER]", ago: "2 days ago" },
    { text: "Panel scorecards submitted (3/3)", source: "Panel", ago: "3 days ago" },
    { text: "Assessment auto-graded: 44/50", source: "System", ago: "6 days ago" },
    { text: "AI screened: shortlisted (score 87)", source: "System", ago: "9 days ago" },
  ],
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const CRED_STYLE = {
  green: "text-emerald-700 font-bold",
  amber: "text-amber-600 font-bold",
  muted: "text-slate-500 font-semibold",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CandidateProfile({
  onBack,
}: {
  onBack: () => void;
}) {
  const d = DEMO;
  const currentIdx = d.stages.indexOf(d.currentStage);

  return (
    <div className="max-w-[1100px]">
      {/* ── Breadcrumb ── */}
      <p className="text-[13px] text-slate-500 mb-1">
        <button
          onClick={onBack}
          className="text-[#0E733B] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          PGT Physics
        </button>
        <span className="mx-1.5">/</span>
        <span>{d.name}</span>
      </p>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mt-4 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shrink-0">
            <span className="text-[16px] font-bold text-emerald-800">{d.initials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-[26px] sm:text-[30px] text-charcoal leading-tight tracking-tight">
              {d.name}
            </h1>
            <p className="text-[13.5px] text-slate-500 mt-0.5 truncate">{d.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button className="px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
            Reject with reason
          </button>
          <button className="px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
            Schedule panel
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all">
            Move to offer
          </button>
        </div>
      </div>

      {/* ── Stage progress ── */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {d.stages.map((stage, i) => {
          const isCurrent = stage === d.currentStage;
          const isCompleted = i < currentIdx;
          const isFuture = i > currentIdx;
          return (
            <span
              key={stage}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                isCurrent
                  ? "bg-[#0C2A1B] text-white"
                  : isCompleted
                    ? "bg-emerald-100 text-emerald-800"
                    : isFuture
                      ? "bg-slate-100 text-slate-400"
                      : ""
              }`}
            >
              {stage}
            </span>
          );
        })}
      </div>

      {/* ── Two-column body ── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* ══════════ Left column ══════════ */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* AI fit score */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h2 className="font-display font-bold text-[17px] text-charcoal">AI fit score</h2>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  Every factor shows its reason. A recruiter can override with a logged note.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display font-bold text-[42px] text-emerald-600 leading-none tabular-nums">
                  {d.fitScore}
                </span>
                <span className="text-[16px] text-slate-400 font-semibold ml-0.5">/ 100</span>
              </div>
            </div>

            {/* Factor rows */}
            <div className="mt-5 space-y-4">
              {d.factors.map((f) => (
                <div key={f.name}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <span className="text-[12.5px] font-bold text-charcoal">{f.name}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5">Weight {f.weight}</span>
                    </div>
                    <span className="text-[13px] font-bold text-charcoal tabular-nums shrink-0">
                      {f.score}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed mb-1.5">{f.detail}</p>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E733B] rounded-full transition-all"
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hard filters */}
            <div className="mt-5 pt-4 border-t border-line">
              <p className="text-[12.5px] text-slate-600">
                Hard filters set by your school:{" "}
                <span className="font-bold text-charcoal">{d.hardFilters}</span>
              </p>
            </div>

            <button className="mt-4 px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
              Override score
            </button>
          </section>

          {/* Demo lesson */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <h2 className="font-display font-bold text-[17px] text-charcoal">Demo lesson</h2>
              <p className="text-[13px] text-slate-500">{d.demo.topic}</p>
            </div>

            {/* Rubric scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {d.demo.rubric.map((r) => (
                <div
                  key={r.label}
                  className="bg-slate-50 rounded-xl p-4 text-center"
                >
                  <p className="text-[11.5px] font-semibold text-slate-500 mb-1">{r.label}</p>
                  <p className="font-display font-bold text-[28px] text-charcoal leading-none tabular-nums">
                    {r.score.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">{d.demo.panelNote}</p>

            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
              <Play className="w-3.5 h-3.5" /> Watch recording
            </button>
          </section>
        </div>

        {/* ══════════ Right column ══════════ */}
        <div className="flex flex-col gap-5">
          {/* Credential check */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">
              Credential check
            </h3>
            <div className="space-y-3">
              {d.credentials.map((cred) => (
                <div key={cred.label} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-charcoal">{cred.label}</span>
                  <span className={`text-[12.5px] shrink-0 ${CRED_STYLE[cred.variant]}`}>
                    {cred.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all text-center">
              Request missing document
            </button>
          </section>

          {/* Compensation */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">
              Compensation
            </h3>
            <div className="space-y-2.5">
              {([
                ["Current", d.compensation.current],
                ["Expected", d.compensation.expected],
                ["Role budget", d.compensation.budget],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-slate-500">{label}</span>
                  <span className="text-[13px] font-bold text-charcoal">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Audit trail */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[15px] text-charcoal mb-4">
              Audit trail
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />

              <div className="space-y-4">
                {d.audit.map((entry, i) => (
                  <div key={i} className="flex gap-3.5 relative">
                    {/* Dot */}
                    <div className="w-[11px] h-[11px] rounded-full bg-white border-2 border-slate-300 shrink-0 mt-0.5 relative z-10" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-charcoal font-semibold leading-snug">
                        {entry.text}
                      </p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">
                        {entry.source} · {entry.ago}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
