"use client";

import { useState } from "react";
import { Search, Share2, UserPlus, ChevronLeft } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type TagVariant = "green" | "dark" | "amber" | "red" | "gray";

interface CandidateCard {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  score: number | null;
  notes: string;
  tags: { label: string; variant: TagVariant }[];
}

interface PipelineStage {
  id: string;
  label: string;
  count: number | null;
  candidates: CandidateCard[];
}

// ── Demo data — matches the design mockup exactly ──────────────────────────

const DEMO_JOB = {
  title: "PGT Physics — Senior Secondary",
  tags: ["CBSE", "Full-time", "Classes XI–XII", "Budget ₹[MIN]–₹[MAX] / month"],
};

const DEMO_FILTERS = [
  { id: "ai-fit", label: "AI fit ≥ 70", active: true },
  { id: "bed", label: "B.Ed verified", active: false },
  { id: "ctet", label: "CTET / STET", active: false },
  { id: "exp", label: "Experience 3+ yrs", active: false },
];

const DEMO_STAGES: PipelineStage[] = [
  {
    id: "applied",
    label: "Applied",
    count: 18,
    candidates: [
      {
        id: "c-ritika",
        name: "Ritika Sharma",
        initials: "RS",
        subtitle: "TGT Physics · 4 yrs",
        score: 82,
        notes: "Strong board-exam result history; teaches XI–XII mechanics already.",
        tags: [
          { label: "B.Ed verified", variant: "green" },
          { label: "CBSE", variant: "gray" },
        ],
      },
      {
        id: "c-arjun",
        name: "Arjun Mehta",
        initials: "AM",
        subtitle: "M.Sc fresher",
        score: 61,
        notes: "Subject depth good, no classroom experience yet.",
        tags: [{ label: "B.Ed pending", variant: "amber" }],
      },
    ],
  },
  {
    id: "ai-screened",
    label: "AI screened",
    count: 11,
    candidates: [
      {
        id: "c-kavya",
        name: "Kavya Nair",
        initials: "KN",
        subtitle: "PGT Physics · 6 yrs",
        score: 88,
        notes: "Matches board, level and lab-practical requirement.",
        tags: [
          { label: "CTET", variant: "dark" },
          { label: "B.Ed verified", variant: "green" },
        ],
      },
      {
        id: "c-imran",
        name: "Imran Qureshi",
        initials: "IQ",
        subtitle: "PGT Physics · 3 yrs",
        score: 74,
        notes: "On hold: STET certificate not uploaded.",
        tags: [{ label: "Needs review", variant: "red" }],
      },
    ],
  },
  {
    id: "assessment",
    label: "Assessment",
    count: 7,
    candidates: [
      {
        id: "c-sneha",
        name: "Sneha Pillai",
        initials: "SP",
        subtitle: "PGT Physics · 5 yrs",
        score: 79,
        notes: "Subject test 41/50 · pedagogy scenarios rated strong.",
        tags: [{ label: "Test done", variant: "green" }],
      },
    ],
  },
  {
    id: "panel-interview",
    label: "Panel interview",
    count: 5,
    candidates: [
      {
        id: "c-rahul",
        name: "Rahul Verma",
        initials: "RV",
        subtitle: "PGT Physics · 8 yrs",
        score: 85,
        notes: "Panel slot Thu 11:00 · 3 of 3 scorecards pending.",
        tags: [{ label: "Scheduled", variant: "gray" }],
      },
    ],
  },
  {
    id: "demo-lesson",
    label: "Demo lesson",
    count: null,
    candidates: [
      {
        id: "c-ananya",
        name: "Ananya Iyer",
        initials: "AN",
        subtitle: "PGT Physics · 7 yrs",
        score: null,
        notes: "Demo on Ohm's law, Class XI-B · rubric 4.4 / 5.",
        tags: [{ label: "Rubric done", variant: "green" }],
      },
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return { border: "border-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 70) return { border: "border-amber-300", text: "text-amber-700", bg: "bg-amber-50" };
  return { border: "border-slate-300", text: "text-slate-500", bg: "bg-slate-50" };
}

const TAG_STYLES: Record<TagVariant, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  dark: "bg-[#0C2A1B] text-white border-transparent",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-600 border-red-200",
  gray: "bg-slate-100 text-slate-600 border-slate-200",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function JobPipeline({
  onBack,
  onViewCandidate,
}: {
  onBack: () => void;
  onViewCandidate?: (candidateId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["ai-fit"]));

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-full">
      {/* ── Breadcrumb ── */}
      <p className="text-[13px] text-slate-500 mb-1">
        <button
          onClick={onBack}
          className="text-[#0E733B] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Jobs
        </button>
        <span className="mx-1.5">/</span>
        <span>PGT Physics</span>
      </p>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-[28px] sm:text-[32px] text-charcoal leading-tight tracking-tight">
            {DEMO_JOB.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {DEMO_JOB.tags.map((t) => (
              <span
                key={t}
                className="text-[12px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
            <Share2 className="w-3.5 h-3.5" /> Share job
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all">
            <UserPlus className="w-3.5 h-3.5" /> Invite to assessment
          </button>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex items-center gap-3 flex-wrap mb-2">
        <div className="relative flex-1 min-w-[200px] max-w-[340px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, subject, college…"
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-line bg-white text-[13px] text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all"
          />
        </div>

        {DEMO_FILTERS.map((f) => {
          const isActive = activeFilters.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border transition-all ${
                isActive
                  ? "bg-[#0E733B] text-white border-[#0E733B]"
                  : "bg-white text-slate-600 border-line hover:border-slate-300"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-slate-400 italic mb-5">
        AI ranks and explains. Your team decides.
      </p>

      {/* ── Kanban Board ── */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-3 min-w-max">
          {DEMO_STAGES.map((stage) => (
            <div key={stage.id} className="w-[230px] shrink-0">
              {/* Column header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <h3 className="text-[13px] font-bold text-charcoal">{stage.label}</h3>
                {stage.count !== null && (
                  <span className="text-[11.5px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                    {stage.count}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5">
                {stage.candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onViewCandidate?.(c.id)}
                    className="w-full text-left bg-white rounded-xl border border-line shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-3.5 group"
                  >
                    {/* Name row + score */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-charcoal leading-tight group-hover:text-[#0E733B] transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-[11.5px] text-slate-500 mt-0.5 truncate">
                          {c.subtitle}
                        </p>
                      </div>
                      {c.score !== null && (
                        <div
                          className={`shrink-0 w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center ${scoreColor(c.score).border} ${scoreColor(c.score).bg}`}
                        >
                          <span className={`text-[13px] font-bold tabular-nums ${scoreColor(c.score).text}`}>
                            {c.score}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <p className="text-[11.5px] text-slate-500 leading-relaxed mt-1.5 line-clamp-3">
                      {c.notes}
                    </p>

                    {/* Tags */}
                    {c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {c.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TAG_STYLES[tag.variant]}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
