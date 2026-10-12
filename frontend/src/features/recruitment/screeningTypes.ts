export type Verdict = "strong" | "good" | "partial" | "missing_must_have";

export interface Screening {
  score: number;
  verdict: Verdict;
  summary: string;
  criteria: { key: string; label: string; points: number; max: number; note: string }[];
  requirements: { text: string; screening: "hard" | "scored"; met: boolean; evidence: string }[];
  facts: {
    subjects: string[];
    experienceYears: number;
    ctetStatus: string;
    qualifications: string[];
    preferredCities: string[];
    expectedCTC: number | null;
    availableFrom: string | null;
  };
  method: "ai" | "rules";
  model: string | null;
  screenedAt: string;
}

export const VERDICT: Record<Verdict, { label: string; cls: string }> = {
  strong: { label: "Strong match", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  good: { label: "Good match", cls: "bg-teal-50 text-teal-800 border-teal-200" },
  partial: { label: "Partial match", cls: "bg-slate-100 text-slate-700 border-slate-200" },
  missing_must_have: { label: "Missing a must-have", cls: "bg-amber-50 text-amber-800 border-amber-200" },
};

export const scoreBg = (s: number | null) =>
  s === null ? "bg-slate-100 text-slate-500" : s >= 75 ? "bg-[#0E733B] text-white" : s >= 55 ? "bg-teal-600 text-white" : "bg-slate-400 text-white";

export const CTET_LABEL: Record<string, string> = {
  cleared: "Cleared", not_cleared: "Not cleared", not_applicable: "Not applicable", "": "Not stated",
};
