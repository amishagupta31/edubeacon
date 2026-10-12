"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search, MapPin, CheckCircle2, ArrowRight, X, SlidersHorizontal, Briefcase, GraduationCap, CalendarClock,
  IndianRupee, Users, Sparkles,
} from "lucide-react";
import { API, useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";
import OrgLogo from "@/features/recruitment/OrgLogo";

interface Teacher {
  _id: string;
  fullName: string;
  bio?: string;
  subjectSpecialisations?: string[];
  ctetStatus?: string;
  preferredCities?: string[];
  expectedCTC?: number | null;
  availableFrom?: string | null;
  qualifications?: { degree?: string; institution?: string }[];
  experience?: { role?: string; school?: string; from?: string; to?: string }[];
}

const EXPERIENCE = [
  { label: "Any", min: 0, max: Infinity },
  { label: "0 – 2 years", min: 0, max: 2 },
  { label: "3 – 5 years", min: 3, max: 5 },
  { label: "6 – 10 years", min: 6, max: 10 },
  { label: "10+ years", min: 11, max: Infinity },
];
const AVAILABILITY = ["Any", "Available now", "Within 30 days"] as const;
const CTET = ["Any", "CTET cleared"] as const;

function yearsOf(exp: Teacher["experience"]) {
  const now = new Date().getFullYear();
  let total = 0;
  for (const e of exp ?? []) {
    const from = parseInt(String(e.from ?? "").match(/\d{4}/)?.[0] ?? "", 10);
    const toRaw = String(e.to ?? "");
    const to = /present|current|now/i.test(toRaw) || !toRaw.trim() ? now : parseInt(toRaw.match(/\d{4}/)?.[0] ?? "", 10);
    if (from && to && to >= from) total += to - from;
  }
  return total;
}

function availability(iso?: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return { text: "Available now", days: 0 };
  if (days <= 30) return { text: `Available in ${days} days`, days };
  return { text: `From ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, days };
}

function Chip({ icon: Icon, children, tone = "a" }: { icon: React.ElementType; children: React.ReactNode; tone?: "a" | "b" | "loc" }) {
  const cls = {
    loc: "bg-[#F3F8F1] text-[#1E3A2B] [&>svg]:text-[#0E733B]",
    a: "bg-[#ECFDF5] text-[#14532D] [&>svg]:text-[#0E733B]",
    b: "bg-[#F0F7F3] text-[#1E3A2B] [&>svg]:text-[#0F766E]",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] ${cls}`}><Icon className="w-3.5 h-3.5 shrink-0" />{children}</span>;
}

function Radio({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-5">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-1.5 px-1">{label}</p>
      <div className="flex flex-col gap-0.5">
        {options.map((opt) => {
          const on = value === opt;
          return (
            <button key={opt} onClick={() => onChange(opt)} aria-pressed={on}
              className={`flex items-center gap-2.5 text-left rounded-md px-2 py-1.5 text-[13px] transition-colors ${on ? "bg-[#ECFDF5] text-[#0E733B] font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
              <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${on ? "border-[#0E733B] bg-[#0E733B] shadow-[inset_0_0_0_2px_white]" : "border-slate-300"}`} />
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TeacherDirectoryPage() {
  return <Suspense><TeacherDirectory /></Suspense>;
}

function TeacherDirectory() {
  const params = useSearchParams();
  const { state } = useRecruitmentProfile();
  const isSchool = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(() => params.get("q") ?? "");
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [city, setCity] = useState(() => params.get("city") ?? "");
  const [subject, setSubject] = useState("Any");
  const [ctet, setCtet] = useState<string>("Any");
  const [exp, setExp] = useState("Any");
  const [avail, setAvail] = useState<string>("Any");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/recruitment/teachers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Teacher[]) => setTeachers(Array.isArray(d) ? d.filter((t) => t.fullName?.trim()) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const subjects = useMemo(() => {
    const counts = new Map<string, number>();
    teachers.forEach((t) => t.subjectSpecialisations?.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return ["Any", ...[...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s]) => s)];
  }, [teachers]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const c = city.toLowerCase();
    const range = EXPERIENCE.find((e) => e.label === exp) ?? EXPERIENCE[0];
    return teachers.filter((t) => {
      const yrs = yearsOf(t.experience);
      const av = availability(t.availableFrom);
      return (
        (!q || [t.fullName, t.bio, ...(t.subjectSpecialisations ?? []), ...(t.preferredCities ?? [])].some((x) => x?.toLowerCase().includes(q))) &&
        (!c || t.preferredCities?.some((pc) => pc.toLowerCase().includes(c))) &&
        (subject === "Any" || t.subjectSpecialisations?.includes(subject)) &&
        (ctet === "Any" || t.ctetStatus === "cleared") &&
        (exp === "Any" || (yrs >= range.min && yrs <= range.max)) &&
        (avail === "Any" || (av && (avail === "Available now" ? av.days === 0 : av.days <= 30)))
      );
    });
  }, [teachers, search, city, subject, ctet, exp, avail]);

  const chips = [
    search && { label: `“${search}”`, clear: () => { setSearch(""); setDraft(""); } },
    city && { label: `City: ${city}`, clear: () => setCity("") },
    subject !== "Any" && { label: subject, clear: () => setSubject("Any") },
    ctet !== "Any" && { label: ctet, clear: () => setCtet("Any") },
    exp !== "Any" && { label: exp, clear: () => setExp("Any") },
    avail !== "Any" && { label: avail, clear: () => setAvail("Any") },
  ].filter(Boolean) as { label: string; clear: () => void }[];
  const activeCount = chips.length - (search ? 1 : 0);
  const clearAll = () => { setSearch(""); setDraft(""); setCity(""); setSubject("Any"); setCtet("Any"); setExp("Any"); setAvail("Any"); };

  const filterBody = (
    <>
      <div className="mb-5 px-1">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-1.5">Preferred city</p>
        <label className="relative block">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Noida" aria-label="Filter by city"
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 text-[13px] placeholder:text-slate-500 focus:outline-none focus:border-[#0E733B]" />
        </label>
      </div>
      <Radio label="Subject" options={subjects} value={subject} onChange={setSubject} />
      <Radio label="CTET status" options={CTET} value={ctet} onChange={setCtet} />
      <Radio label="Experience" options={EXPERIENCE.map((e) => e.label)} value={exp} onChange={setExp} />
      <Radio label="Availability" options={AVAILABILITY} value={avail} onChange={setAvail} />
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      {/* ── Header band ── */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(180deg, #0C2A1B 0%, #0E3524 70%, #0F3A27 100%)" }}>
        <svg aria-hidden className="absolute left-0 bottom-0 w-[180px] h-[120px] text-[#8FE3B0]/40" viewBox="0 0 180 120" fill="none">
          <path d="M0 40 C 60 20, 120 30, 150 70 S 140 120, 120 125" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
        </svg>
        <svg aria-hidden className="absolute right-0 bottom-0 w-[170px] h-[110px] text-[#0E733B]" viewBox="0 0 170 110" fill="none">
          <path d="M20 110 C 0 60, 50 30, 80 60 S 140 60, 175 20" stroke="currentColor" strokeWidth="14" strokeLinecap="round" opacity="0.55" />
        </svg>
        <div className="relative max-w-[760px] mx-auto px-5 pt-10 pb-16 text-center">
          <h1 className="inline-flex items-start gap-1 text-[26px] sm:text-[28px] font-bold tracking-tight">
            Browse teachers
            <svg viewBox="0 0 20 20" className="w-5 h-5 -mt-2 text-[#8FE3B0]" fill="currentColor" aria-hidden><path d="M10 0 l2.2 7.8 7.8 2.2 -7.8 2.2 L10 20 7.8 12.2 0 10 7.8 7.8z" /></svg>
          </h1>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-white/90 max-w-[520px] mx-auto">
            Meet verified educators across subjects and boards. Shortlist the right fit for your school in minutes.
          </p>
          <p className="mt-5 text-[16px] font-semibold">
            {loading ? "Loading teachers…" : `Showing ${filtered.length} of ${teachers.length} teacher profiles`}
          </p>
        </div>
      </section>

      {/* ── Search ── */}
      <div className="relative z-10 max-w-[760px] mx-auto px-4 -mt-7">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(draft.trim()); }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-md shadow-[0_4px_18px_rgba(12,42,27,0.10)] p-1.5 pl-3.5">
          <Search className="w-[18px] h-[18px] text-slate-500 shrink-0" />
          <input value={draft} onChange={(e) => { setDraft(e.target.value); if (!e.target.value) setSearch(""); }}
            placeholder="Search by name, subject or city, e.g. Physics" aria-label="Search teachers"
            className="flex-1 min-w-0 bg-transparent py-2 text-[15px] text-[#1B2A22] placeholder:text-slate-500 focus:outline-none" />
          <button type="button" onClick={() => setFiltersOpen(true)} aria-label="Filters"
            className="lg:hidden relative inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[13.5px] font-semibold text-slate-700">
            <SlidersHorizontal className="w-4 h-4" /><span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0E733B] text-[10px] text-white flex items-center justify-center">{activeCount}</span>}
          </button>
          <button type="submit" className="rounded-md bg-[#0E733B] hover:bg-[#0B5C2F] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_3px_0_#0A4A27] active:translate-y-px">Search</button>
        </form>
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button key={c.label} onClick={c.clear} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#0E733B]/30 px-3 py-1 text-[12.5px] font-semibold text-[#0E733B] hover:bg-emerald-50">
                {c.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={clearAll} className="text-[12.5px] font-semibold text-slate-600 underline underline-offset-2">Clear all</button>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="mx-auto px-4 pt-5 pb-16 lg:grid lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,760px)_260px] lg:gap-6 justify-center max-w-[1400px]">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white border border-slate-200 rounded-md">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
              <p className="text-[14px] font-semibold text-[#1B2A22]">Filters{activeCount > 0 && <span className="text-[#0E733B]"> ({activeCount})</span>}</p>
              {activeCount > 0 && <button onClick={clearAll} className="text-[12px] font-semibold text-[#0E733B] hover:underline">Clear all</button>}
            </div>
            <div className="max-h-[calc(100vh-150px)] overflow-y-auto scroll-rail px-3 pt-4 pb-1">{filterBody}</div>
          </div>
        </aside>

        <main className="max-w-[760px] mx-auto w-full flex flex-col gap-5">
          {loading ? (
            [0, 1, 2].map((i) => <div key={i} className="h-[190px] rounded-md border border-slate-200 bg-white animate-skeleton" />)
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md px-6 py-14 text-center">
              <p className="text-[17px] font-semibold text-[#1B2A22]">No teachers match these filters</p>
              <p className="mt-1.5 text-[14px] text-slate-600">Try another subject or city, or clear the filters.</p>
              {chips.length > 0 && <button onClick={clearAll} className="mt-5 rounded-md bg-[#0E733B] px-5 py-2.5 text-[14px] font-semibold text-white">Clear filters</button>}
            </div>
          ) : (
            filtered.map((t) => {
              const yrs = yearsOf(t.experience);
              const av = availability(t.availableFrom);
              const degree = t.qualifications?.map((q) => q.degree).filter(Boolean).slice(0, 2).join(", ");
              const role = t.experience?.find((e) => /present|current|now/i.test(String(e.to ?? "")) || !e.to)?.role ?? t.experience?.[0]?.role;
              return (
                <article key={t._id} className="bg-white border border-slate-200 rounded-md hover:shadow-[0_6px_24px_rgba(12,42,27,0.08)] transition-shadow">
                  <div className="p-5 sm:p-6">
                    <div className="flex gap-4 sm:gap-6">
                      <OrgLogo name={t.fullName} className="w-14 h-14 sm:w-[76px] sm:h-[76px] text-[18px] sm:text-[24px] rounded-full" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#1B2A22] leading-snug">
                          <Link href={`/recruitment/teachers/${t._id}`} className="hover:text-[#0E733B]">{t.fullName}</Link>
                        </h3>
                        <p className="text-[13.5px] text-slate-600 mt-0.5 truncate">
                          {[role, yrs ? `${yrs} yr${yrs === 1 ? "" : "s"} experience` : null].filter(Boolean).join(" · ") || "Teacher"}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {!!t.preferredCities?.length && <Chip icon={MapPin} tone="loc">{t.preferredCities.slice(0, 3).join(", ")}</Chip>}
                          {t.ctetStatus === "cleared" && <Chip icon={CheckCircle2}>CTET cleared</Chip>}
                          {degree && <Chip icon={GraduationCap} tone="b">{degree}</Chip>}
                          {av && <Chip icon={CalendarClock} tone="b">{av.text}</Chip>}
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-2 border-l border-dashed border-slate-200 pl-6 shrink-0">
                        <Link href={`/recruitment/teachers/${t._id}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#0E733B] hover:bg-[#0B5C2F] px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-[0_3px_0_#0A4A27] active:translate-y-px">
                          View profile »
                        </Link>
                        {!!t.expectedCTC && (
                          <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1B2A22]"><IndianRupee className="w-3.5 h-3.5 text-[#0E733B]" />{t.expectedCTC.toLocaleString("en-IN")}/mo expected</span>
                        )}
                      </div>
                    </div>
                    {t.bio && <p className="mt-4 text-[14.5px] leading-[1.7] text-slate-600 line-clamp-2">{t.bio}</p>}
                    {!!t.subjectSpecialisations?.length && (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {t.subjectSpecialisations.slice(0, 6).map((s) => <span key={s} className="rounded-md bg-slate-100 px-2.5 py-1 text-[13px] text-slate-700">{s}</span>)}
                      </div>
                    )}
                    <Link href={`/recruitment/teachers/${t._id}`} className="sm:hidden mt-4 flex items-center justify-center rounded-md bg-[#0E733B] py-2.5 text-[14.5px] font-semibold text-white">View profile »</Link>
                  </div>
                </article>
              );
            })
          )}
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-[88px] flex flex-col gap-4 max-w-[280px]">
            <div className="rounded-md bg-[#0C2A1B] text-white p-5 relative overflow-hidden">
              <div aria-hidden className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#0E733B]/50 blur-2xl" />
              <Sparkles className="relative w-5 h-5 text-[#8FE3B0]" />
              <p className="relative mt-3 text-[16px] font-bold leading-snug">Let applicants come to you</p>
              <p className="relative mt-1.5 text-[13px] text-white/75 leading-relaxed">Post a role and AI scores every applicant against your requirements.</p>
              <Link href={isSchool ? "/recruitment/school" : "/recruitment/register"} className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#8FE3B0] hover:bg-white px-4 py-2 text-[13px] font-bold text-[#0C2A1B]">
                {isSchool ? "Post a job" : "Start hiring"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="rounded-md bg-white border border-slate-200 p-5">
              <p className="text-[14px] font-semibold text-[#1B2A22]">Why schools hire here</p>
              {[
                [CheckCircle2, "Email-verified teacher accounts"],
                [Briefcase, "CTET, experience and quals on every profile"],
                [Users, "Compare finalists side by side"],
              ].map(([Icon, t]) => {
                const I = Icon as React.ElementType;
                return <p key={t as string} className="mt-3 flex gap-2.5 text-[13px] text-slate-700"><I className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />{t as string}</p>;
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Filters drawer ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 modal-backdrop" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-[16px] font-semibold text-[#1B2A22]">Filters</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">{filterBody}</div>
            <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
              <button onClick={clearAll} className="flex-1 rounded-md border border-slate-200 py-2.5 text-[14px] font-semibold text-slate-700">Clear all</button>
              <button onClick={() => setFiltersOpen(false)} className="flex-1 rounded-md bg-[#0E733B] py-2.5 text-[14px] font-semibold text-white">Show {filtered.length} teachers</button>
            </div>
          </div>
        </div>
      )}

      {state.status === "signed-out" && (
        <section className="bg-[#0C2A1B] py-14 px-5 text-center">
          <h2 className="text-[26px] font-bold text-white">Ready to hire verified teachers?</h2>
          <p className="mt-2 text-white/75 text-[15px]">Register your school to contact candidates and run your hiring pipeline.</p>
          <Link href="/recruitment/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#34D399] px-7 py-3 text-[15px] font-bold text-[#062013]">
            Register your school <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
