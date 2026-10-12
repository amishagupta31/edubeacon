"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, Flag, School, Users, Briefcase, FileText, Info, ChevronRight, ChevronLeft, CheckCircle2,
  GraduationCap, ClipboardList, Building2, Crown, Globe, CalendarClock, Loader2,
} from "lucide-react";
import { API, useRecruitmentProfile, DASHBOARD_PATH } from "@/features/recruitment/useRecruitmentProfile";
import OrgLogo from "@/features/recruitment/OrgLogo";
import ApplyModal from "@/features/recruitment/ApplyModal";

interface JobDetail {
  _id: string;
  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;
  institutionId?: string | null;
  institutionName: string;
  city: string;
  state: string;
  deadline: string | null;
  publishedAt: string;
  requirements?: { text: string; screening: "hard" | "scored" }[];
}

interface Institution {
  name: string;
  institutionType?: string;
  board?: string;
  establishedYear?: string;
  contactPerson?: string;
  website?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  description?: string;
  verificationStatus?: string;
}

interface SiblingJob { _id: string; roleType: string; title: string }

const DEPT_ICON: Record<string, React.ElementType> = {
  Teaching: GraduationCap, "Non-teaching": ClipboardList, Administrative: Building2, Leadership: Crown,
};

function Chip({ icon: Icon, children, tone = "a" }: { icon: React.ElementType; children: React.ReactNode; tone?: "loc" | "a" | "b" }) {
  const cls = {
    loc: "bg-[#F3F8F1] text-[#1E3A2B] [&>svg]:text-[#0E733B]",
    a: "bg-[#ECFDF5] text-[#14532D] [&>svg]:text-[#0E733B]",
    b: "bg-[#F0F7F3] text-[#1E3A2B] [&>svg]:text-[#0F766E]",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] ${cls}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" /> {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, children, tone }: { icon: React.ElementType; children: React.ReactNode; tone: "mint" | "green" }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-dashed border-slate-300">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center ${tone === "mint" ? "bg-[#ECFDF5]" : "bg-[#E6F4EA]"}`}>
        <Icon className="w-4 h-4 text-[#0E733B]" />
      </span>
      <h2 className="text-[17px] font-semibold text-[#1B2A22]">{children}</h2>
    </div>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { state, authHeader } = useRecruitmentProfile();
  const isTeacher = state.status === "ready" && state.profile.accountType === "TEACHER";
  const isSchool = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";

  const [job, setJob] = useState<JobDetail | null>(null);
  const [inst, setInst] = useState<Institution | null>(null);
  const [siblings, setSiblings] = useState<SiblingJob[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API}/api/recruitment/jobs/${id}`);
        if (!r.ok) { if (alive) setStatus("missing"); return; }
        const j = await r.json() as JobDetail;
        if (!alive) return;
        setJob(j);
        setStatus("ready");
        const [ir, sr] = await Promise.all([
          j.institutionId ? fetch(`${API}/api/recruitment/institutions/${j.institutionId}`) : Promise.resolve(null),
          fetch(`${API}/api/recruitment/jobs?limit=50&institution=${encodeURIComponent(j.institutionName)}`),
        ]);
        if (!alive) return;
        if (ir?.ok) setInst(await ir.json());
        if (sr.ok) setSiblings(((await sr.json()).jobs ?? []) as SiblingJob[]);
      } catch {
        if (alive) setStatus("missing");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (!isTeacher) return;
    authHeader()
      .then((headers) => fetch(`${API}/api/recruitment/applications/mine`, { headers }))
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { jobId: string }[]) => setApplied(rows.some((x) => String(x.jobId) === id)))
      .catch(() => {});
  }, [isTeacher, authHeader, id]);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F7F5]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0E733B]" />
      </div>
    );
  }

  if (status === "missing" || !job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-[#F5F7F5] px-5 text-center">
        <p className="text-[18px] font-semibold text-[#1B2A22]">This job is no longer open</p>
        <p className="text-[14px] text-slate-600">It may have been filled or closed by the school.</p>
        <Link href="/recruitment/jobs" className="mt-2 rounded-md bg-[#0E733B] px-5 py-2.5 text-[14px] font-semibold text-white">Browse open jobs</Link>
      </div>
    );
  }

  const orgName = inst?.name || job.institutionName;
  const depts = Object.entries(
    siblings.reduce<Record<string, number>>((acc, s) => { acc[s.roleType || "Other"] = (acc[s.roleType || "Other"] ?? 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);
  const fnLine = [job.roleType, job.classes && `Classes ${job.classes}`, job.board].filter(Boolean).join(" → ");
  const tags = [job.board, job.employment, job.classes && `Classes ${job.classes}`].filter(Boolean) as string[];
  const reqs = job.requirements ?? [];
  const poster = inst?.contactPerson || orgName;

  const applyButton = applied ? (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-[15px] font-semibold text-[#0E733B]">
      <CheckCircle2 className="w-4 h-4" /> Applied
    </span>
  ) : isSchool ? (
    <span className="inline-flex rounded-md bg-slate-100 px-4 py-2.5 text-[13.5px] font-semibold text-slate-600">Viewing as a school</span>
  ) : (
    <button
      onClick={() => (isTeacher ? setApplying(true) : router.push("/recruitment/register"))}
      className="inline-flex items-center gap-1.5 rounded-md bg-[#0E733B] hover:bg-[#0B5C2F] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_3px_0_#0A4A27] active:translate-y-px transition-colors"
    >
      <Briefcase className="w-4 h-4" /> {isTeacher ? "Apply now" : "Sign in to apply"}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      {applying && (
        <ApplyModal
          job={{ _id: job._id, title: job.title, institutionName: job.institutionName, city: job.city }}
          onClose={() => setApplying(false)}
          onSuccess={() => setApplied(true)}
          authHeader={authHeader}
          goToProfile={() => router.push(DASHBOARD_PATH.TEACHER + "?tab=profile")}
        />
      )}

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link href="/recruitment/jobs" className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#0E733B] hover:underline underline-offset-2 mb-4">
          <ChevronLeft className="w-4 h-4" /> All jobs
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* ── Main column ── */}
          <article className="bg-white border border-slate-200 rounded-md min-w-0">
            <header className="p-5 sm:p-7 flex flex-col sm:flex-row gap-5">
              <OrgLogo name={orgName} className="w-16 h-16 sm:w-[88px] sm:h-[88px] text-[20px] sm:text-[26px] rounded-lg" />
              <div className="flex-1 min-w-0">
                <h1 className="text-[20px] sm:text-[22px] font-semibold text-[#1B2A22] leading-snug">{orgName} - {job.title}</h1>
                {(job.city || job.state) && <div className="mt-2.5"><Chip icon={MapPin} tone="loc">{[job.city, job.state].filter(Boolean).join(", ")}</Chip></div>}
                <div className="mt-2 flex flex-wrap gap-2">
                  {inst?.establishedYear && <Chip icon={Flag}>Founded in {inst.establishedYear}</Chip>}
                  {inst?.institutionType && <Chip icon={School} tone="b">{inst.institutionType}</Chip>}
                  <Chip icon={Users} tone="b">{job.openings} opening{job.openings === 1 ? "" : "s"}</Chip>
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-600">
                  <span>Posted {fmtDate(job.publishedAt)}</span>
                  {job.deadline && <span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> Apply by {fmtDate(job.deadline)}</span>}
                </p>
              </div>
              <div className="shrink-0 sm:border-l sm:border-dashed sm:border-slate-200 sm:pl-6 flex sm:items-start">{applyButton}</div>
            </header>

            <div className="px-5 sm:px-7 pb-8 flex flex-col gap-8">
              <section className="flex flex-col gap-4">
                <SectionTitle icon={FileText} tone="mint">Job Description</SectionTitle>
                {fnLine && (
                  <p className="text-[15px] leading-[1.75] text-[#2A3A31]"><b className="font-semibold text-[#1B2A22]">Function:</b> {fnLine}</p>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => <span key={t} className="rounded-md bg-slate-100 px-2.5 py-1 text-[13.5px] text-slate-700">{t}</span>)}
                  </div>
                )}
                {job.description && (
                  <p className="text-[15px] leading-[1.8] text-[#2A3A31] whitespace-pre-line">{job.description}</p>
                )}
                {reqs.length > 0 && (
                  <div>
                    <p className="text-[15px] font-semibold text-[#1B2A22] mb-2">Requirements:</p>
                    <ul className="list-disc pl-5 flex flex-col gap-1.5 text-[15px] leading-[1.7] text-[#2A3A31] marker:text-[#0E733B]">
                      {reqs.map((r) => (
                        <li key={r.text}>{r.screening === "scored" ? "(Good to have) " : ""}{r.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section className="flex flex-col gap-4">
                <SectionTitle icon={Info} tone="green">About {orgName}</SectionTitle>
                <p className="text-[15px] leading-[1.8] text-[#2A3A31] whitespace-pre-line">
                  {inst?.description?.trim() || `${orgName} is hiring on EduBeacon. More details about the school will appear here once they complete their profile.`}
                </p>
                {inst && (
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
                    {inst.board && <div className="flex gap-2"><dt className="text-slate-600 w-28 shrink-0">Board</dt><dd className="text-[#1B2A22] font-medium">{inst.board}</dd></div>}
                    {inst.institutionType && <div className="flex gap-2"><dt className="text-slate-600 w-28 shrink-0">Type</dt><dd className="text-[#1B2A22] font-medium">{inst.institutionType}</dd></div>}
                    {(inst.addressLine || inst.city) && <div className="flex gap-2 sm:col-span-2"><dt className="text-slate-600 w-28 shrink-0">Address</dt><dd className="text-[#1B2A22] font-medium">{[inst.addressLine, inst.city, inst.state].filter(Boolean).join(", ")}</dd></div>}
                    {inst.website && (
                      <div className="flex gap-2 sm:col-span-2">
                        <dt className="text-slate-600 w-28 shrink-0">Website</dt>
                        <dd><a href={inst.website.startsWith("http") ? inst.website : `https://${inst.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#0E733B] hover:underline"><Globe className="w-3.5 h-3.5" />{inst.website.replace(/^https?:\/\//, "")}</a></dd>
                      </div>
                    )}
                  </dl>
                )}
                {job.institutionId && (
                  <Link href={`/recruitment/schools/${job.institutionId}`} className="inline-flex w-fit items-center gap-1 text-[14px] font-semibold text-[#0E733B] hover:underline underline-offset-2">
                    View full school profile <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </section>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-[88px]">
            <div className="bg-white border border-slate-200 rounded-md p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#4A6B5A] text-white text-[20px] font-medium flex items-center justify-center mx-auto">
                {poster.trim()[0]?.toUpperCase() ?? "?"}
              </div>
              <p className="mt-2.5 text-[15.5px] font-medium text-[#1B2A22]">Posted by {poster}</p>
              <p className="text-[13px] text-slate-600">{inst?.contactPerson ? `Hiring team at ${orgName}` : "School hiring team"}</p>
            </div>

            {depts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
                <p className="px-5 py-4 text-[16px] font-semibold text-[#1B2A22] leading-snug border-b border-slate-100">{orgName} Jobs by Department</p>
                <ul className="p-3 flex flex-col gap-2">
                  {depts.map(([dept, n]) => {
                    const Icon = DEPT_ICON[dept] ?? Briefcase;
                    return (
                      <li key={dept}>
                        <Link
                          href={`/recruitment/jobs?institution=${encodeURIComponent(job.institutionName)}&role=${encodeURIComponent(dept)}`}
                          className="flex items-center gap-2.5 rounded-md bg-[#F6F9F7] hover:bg-[#ECFDF5] px-3 py-2.5 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[#0E733B] shrink-0" />
                          <span className="flex-1 text-[14px] text-[#1B2A22]">{dept}</span>
                          <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#DDEFE3] text-[12px] font-semibold text-[#14532D] flex items-center justify-center">{n}</span>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
