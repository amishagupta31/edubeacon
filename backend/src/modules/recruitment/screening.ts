import type { IJob } from "./job.model";
import type { IRecruitmentProfile } from "./model";

export type Verdict = "strong" | "good" | "partial" | "missing_must_have";

export interface CriterionResult {
  key: string;
  label: string;
  points: number;
  max: number;
  note: string;
}

export interface RequirementResult {
  text: string;
  screening: "hard" | "scored";
  met: boolean;
  evidence: string;
}

export interface ScreeningFacts {
  subjects: string[];
  experienceYears: number;
  ctetStatus: string;
  qualifications: string[];
  preferredCities: string[];
  expectedCTC: number | null;
  availableFrom: string | null;
}

export interface ScreeningResult {
  score: number;
  verdict: Verdict;
  summary: string;
  criteria: CriterionResult[];
  requirements: RequirementResult[];
  facts: ScreeningFacts;
  method: "ai" | "rules";
  model: string | null;
  screenedAt: Date;
}

type Profile = Pick<
  IRecruitmentProfile,
  "subjectSpecialisations" | "qualifications" | "experience" | "achievements" | "ctetStatus" |
  "stetStatus" | "expectedCTC" | "preferredCities" | "availableFrom" | "bio" | "fullName"
>;
type JobLike = Pick<IJob, "title" | "roleType" | "board" | "classes" | "description" | "city" | "state" | "requirements">;

// A candidate missing a must-have never outranks one who meets them all.
const MUST_HAVE_CAP = 59;

const STOP = new Set([
  "and", "the", "for", "with", "must", "have", "has", "should", "least", "minimum", "years", "year", "yrs",
  "experience", "teacher", "teaching", "candidate", "required", "preferred", "able", "good", "strong",
  "knowledge", "skills", "ability", "plus", "any", "from", "into", "our", "your", "will", "who", "are",
]);

const norm = (s: string) =>
  s.toLowerCase()
    .replace(/b\.\s?ed\.?/g, "bed").replace(/m\.\s?ed\.?/g, "med")
    .replace(/m\.\s?sc\.?/g, "msc").replace(/b\.\s?sc\.?/g, "bsc")
    .replace(/m\.\s?a\.?\b/g, "ma").replace(/ph\.\s?d\.?/g, "phd")
    .replace(/[^a-z0-9+#\s]/g, " ");

const tokens = (s: string) => norm(s).split(/\s+/).filter((t) => t.length >= 3 && !STOP.has(t));

function yearsOf(exp: Profile["experience"]): number {
  const now = new Date().getFullYear();
  let total = 0;
  for (const e of exp ?? []) {
    const from = parseInt(String(e.from).match(/\d{4}/)?.[0] ?? "", 10);
    const toRaw = String(e.to ?? "");
    const to = /present|current|now/i.test(toRaw) || !toRaw.trim() ? now : parseInt(toRaw.match(/\d{4}/)?.[0] ?? "", 10);
    if (from && to && to >= from) total += to - from;
  }
  return Math.min(total, 45);
}

export function profileFacts(p: Profile): ScreeningFacts {
  return {
    subjects: p.subjectSpecialisations ?? [],
    experienceYears: yearsOf(p.experience),
    ctetStatus: p.ctetStatus || "",
    qualifications: (p.qualifications ?? []).map((q) => [q.degree, q.institution].filter(Boolean).join(", ")).filter(Boolean),
    preferredCities: p.preferredCities ?? [],
    expectedCTC: p.expectedCTC ?? null,
    availableFrom: p.availableFrom ? new Date(p.availableFrom).toISOString() : null,
  };
}

function profileText(p: Profile, coverNote: string): string {
  return norm([
    p.bio,
    (p.subjectSpecialisations ?? []).join(" "),
    (p.qualifications ?? []).map((q) => `${q.degree} ${q.institution}`).join(" "),
    (p.experience ?? []).map((e) => `${e.role} ${e.school}`).join(" "),
    (p.achievements ?? []).map((a) => `${a.title} ${a.issuer} ${a.description}`).join(" "),
    p.ctetStatus === "cleared" ? "ctet cleared qualified" : "",
    p.stetStatus ? `stet ${p.stetStatus}` : "",
    coverNote,
  ].join(" "));
}

const DEGREES = new Set(["bed", "med", "msc", "bsc", "ma", "ba", "mcom", "bcom", "mtech", "btech", "phd", "mba", "mphil", "bca", "mca", "dled", "ntt"]);

function checkRequirement(text: string, p: Profile, haystack: string, years: number): { met: boolean; evidence: string } {
  const t = norm(text);
  const degreeTokens = t.split(/\s+/).filter((w) => DEGREES.has(w));
  if (degreeTokens.length) {
    const quals = (p.qualifications ?? []).map((q) => norm(`${q.degree} ${q.institution}`));
    const subjectWords = tokens(text).filter((w) => !DEGREES.has(w));
    const missingDeg = degreeTokens.filter((d) => !quals.some((q) => q.split(/\s+/).includes(d)));
    if (missingDeg.length) {
      return { met: false, evidence: `Qualifications don't list ${missingDeg.map((d) => d.toUpperCase()).join(", ")}` };
    }
    if (subjectWords.length) {
      const withSubject = quals.some((q) => degreeTokens.some((d) => q.split(/\s+/).includes(d)) && subjectWords.some((w) => q.includes(w)));
      if (!withSubject) return { met: false, evidence: `Has the degree, but not in ${subjectWords.join(", ")}` };
    }
    return { met: true, evidence: `Qualifications: ${(p.qualifications ?? []).map((q) => q.degree).filter(Boolean).join(", ")}` };
  }
  const yrs = t.match(/(\d+)\s*\+?\s*(?:years|yrs|year)/);
  if (yrs) {
    const need = parseInt(yrs[1], 10);
    return { met: years >= need, evidence: `${years} year${years === 1 ? "" : "s"} of listed experience (needs ${need})` };
  }
  if (/\b(ctet|tet)\b/.test(t)) {
    const ok = p.ctetStatus === "cleared";
    return { met: ok, evidence: ok ? "CTET marked as cleared" : "CTET not marked as cleared" };
  }
  const words = tokens(text);
  if (!words.length) return { met: true, evidence: "No checkable keywords" };
  const found = words.filter((w) => haystack.includes(w));
  const ratio = found.length / words.length;
  return {
    met: ratio >= 0.6,
    evidence: found.length ? `Profile mentions: ${found.slice(0, 5).join(", ")}` : "No matching details in profile",
  };
}

/** Deterministic, explainable scoring used when no AI provider is configured (and as the AI's fallback). */
export function screenWithRules(job: JobLike, p: Profile, coverNote = ""): ScreeningResult {
  const facts = profileFacts(p);
  const haystack = profileText(p, coverNote);
  const teaching = (job.roleType || "Teaching") === "Teaching";
  const criteria: CriterionResult[] = [];

  // Subject fit — 30
  const jobWords = tokens(`${job.title} ${job.description}`);
  const subjWords = tokens(facts.subjects.join(" "));
  const subjHit = subjWords.filter((w) => jobWords.includes(w));
  const titleHit = tokens(job.title).some((w) => haystack.includes(w));
  const subjPts = subjHit.length ? 30 : titleHit ? 18 : facts.subjects.length ? 6 : 0;
  criteria.push({
    key: "subject", label: "Subject fit", points: subjPts, max: 30,
    note: subjHit.length ? `Teaches ${[...new Set(subjHit)].join(", ")}` : titleHit ? "Related experience mentioned in profile" : "Subjects don't match this role",
  });

  // Experience — 20
  const expPts = Math.round(Math.min(facts.experienceYears, 8) / 8 * 20);
  criteria.push({ key: "experience", label: "Experience", points: expPts, max: 20, note: `${facts.experienceYears} year${facts.experienceYears === 1 ? "" : "s"} listed` });

  // Eligibility — 15
  let eligPts = 0; let eligNote = "";
  if (!teaching) { eligPts = 15; eligNote = "Not required for this role"; }
  else if (p.ctetStatus === "cleared") { eligPts = 15; eligNote = "CTET cleared"; }
  else if (p.stetStatus) { eligPts = 10; eligNote = `STET: ${p.stetStatus}`; }
  else if (p.ctetStatus === "not_applicable") { eligPts = 6; eligNote = "Marked not applicable"; }
  else { eligNote = "No CTET/STET status"; }
  criteria.push({ key: "eligibility", label: "Teacher eligibility", points: eligPts, max: 15, note: eligNote });

  // Qualifications — 10
  const hasBEd = /\b(bed|med)\b/.test(haystack);
  const hasPG = /\b(msc|ma|mcom|mtech|phd|post graduate|postgraduate)\b/.test(haystack);
  const qualPts = (hasBEd ? 6 : 0) + (hasPG ? 4 : facts.qualifications.length ? 2 : 0);
  criteria.push({
    key: "qualification", label: "Qualifications", points: Math.min(qualPts, 10), max: 10,
    note: [hasBEd && "B.Ed/M.Ed", hasPG && "Postgraduate"].filter(Boolean).join(" · ") || (facts.qualifications.length ? "Graduate" : "None listed"),
  });

  // Location — 10
  const city = (job.city || "").toLowerCase();
  const prefers = facts.preferredCities.map((c) => c.toLowerCase());
  const locPts = !city ? 10 : prefers.some((c) => c.includes(city) || city.includes(c)) ? 10 : prefers.length ? 2 : 5;
  criteria.push({
    key: "location", label: "Location", points: locPts, max: 10,
    note: locPts === 10 ? `Open to ${job.city || "this location"}` : prefers.length ? `Prefers ${facts.preferredCities.slice(0, 3).join(", ")}` : "No city preference set",
  });

  // School requirements — 15
  // Requirements are judged on profile evidence only — a cover note can't prove a degree or credential.
  const profileOnly = profileText(p, "");
  const requirements: RequirementResult[] = (job.requirements ?? []).map((r) => ({
    text: r.text, screening: r.screening, ...checkRequirement(r.text, p, profileOnly, facts.experienceYears),
  }));
  const scored = requirements.filter((r) => r.screening === "scored");
  const reqPts = scored.length ? Math.round(scored.filter((r) => r.met).length / scored.length * 15) : 15;
  criteria.push({
    key: "requirements", label: "Preferred requirements", points: reqPts, max: 15,
    note: scored.length ? `${scored.filter((r) => r.met).length} of ${scored.length} met` : "None set for this job",
  });

  const missingHard = requirements.filter((r) => r.screening === "hard" && !r.met);
  const raw = criteria.reduce((s, c) => s + c.points, 0);
  const score = missingHard.length ? Math.min(raw, MUST_HAVE_CAP) : raw;
  const verdict: Verdict = missingHard.length ? "missing_must_have" : score >= 75 ? "strong" : score >= 55 ? "good" : "partial";

  const strengths = criteria.filter((c) => c.points >= c.max * 0.8).map((c) => c.label.toLowerCase());
  const gaps = criteria.filter((c) => c.points <= c.max * 0.3).map((c) => c.label.toLowerCase());
  const summary = [
    strengths.length ? `Strong on ${strengths.join(", ")}.` : "",
    gaps.length ? `Gaps in ${gaps.join(", ")}.` : "",
    missingHard.length ? `Does not show ${missingHard.length} must-have requirement${missingHard.length > 1 ? "s" : ""}.` : "",
  ].filter(Boolean).join(" ") || "Average fit across criteria.";

  return { score, verdict, summary, criteria, requirements, facts, method: "rules", model: null, screenedAt: new Date() };
}

/**
 * Claude-assisted screening. Only runs when ANTHROPIC_API_KEY is set; any failure falls back to rules.
 * Contact details (email, phone, resume link) are never sent.
 */
export async function screenApplication(job: JobLike, p: Profile, coverNote = ""): Promise<ScreeningResult> {
  const base = screenWithRules(job, p, coverNote);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return base;

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
  const candidate = {
    subjects: base.facts.subjects,
    experience: (p.experience ?? []).map((e) => ({ role: e.role, school: e.school, from: e.from, to: e.to })),
    qualifications: base.facts.qualifications,
    achievements: (p.achievements ?? []).map((a) => a.title).slice(0, 10),
    ctetStatus: p.ctetStatus || "unknown",
    stetStatus: p.stetStatus || "",
    preferredCities: base.facts.preferredCities,
    expectedMonthlyCTC: base.facts.expectedCTC,
    bio: (p.bio || "").slice(0, 1500),
    coverNote: coverNote.slice(0, 1000),
  };
  const role = {
    title: job.title, roleType: job.roleType, board: job.board, classes: job.classes,
    city: job.city, description: (job.description || "").slice(0, 2500),
    requirements: (job.requirements ?? []).map((r) => ({ text: r.text, type: r.screening === "hard" ? "must-have" : "preferred" })),
  };

  const prompt = `You are screening a teacher's application for an Indian school. Judge only on the evidence given; do not assume facts that are not stated, and do not consider name, gender, age, religion or other personal characteristics.

ROLE:
${JSON.stringify(role, null, 2)}

CANDIDATE:
${JSON.stringify(candidate, null, 2)}

Return ONLY a JSON object, no prose, with this shape:
{"score": <integer 0-100 overall fit>,
 "summary": "<2 sentences for the hiring team: main strengths and main gaps>",
 "requirements": [{"text": "<requirement text exactly as given>", "met": <true|false>, "evidence": "<short reason citing the candidate data>"}]}`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const data = await res.json() as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as {
      score?: number; summary?: string; requirements?: { text: string; met: boolean; evidence: string }[];
    };

    const score = Math.max(0, Math.min(100, Math.round(Number(json.score))));
    if (!Number.isFinite(score)) throw new Error("No score in AI response");

    const requirements = base.requirements.map((r) => {
      const ai = json.requirements?.find((x) => x.text?.trim().toLowerCase() === r.text.trim().toLowerCase());
      return ai ? { ...r, met: Boolean(ai.met), evidence: String(ai.evidence || r.evidence).slice(0, 300) } : r;
    });
    const missingHard = requirements.some((r) => r.screening === "hard" && !r.met);
    const verdict: Verdict = missingHard ? "missing_must_have" : score >= 75 ? "strong" : score >= 55 ? "good" : "partial";

    return {
      ...base, score: missingHard ? Math.min(score, MUST_HAVE_CAP) : score, verdict, requirements,
      summary: String(json.summary || base.summary).slice(0, 600),
      method: "ai", model, screenedAt: new Date(),
    };
  } catch (err) {
    console.error("AI screening failed, using rules:", err instanceof Error ? err.message : err);
    return base;
  }
}
