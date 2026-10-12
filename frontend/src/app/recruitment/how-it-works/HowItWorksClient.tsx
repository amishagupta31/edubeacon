"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap, School, UserPlus, IdCard, Search, Send, ListChecks, FileSignature, Building2, BadgeCheck,
  PenSquare, Sparkles, Columns3, ArrowRight, CheckCircle2, ShieldCheck, Lock, IndianRupee, ChevronDown,
  AlertTriangle, Handshake, MapPin, CalendarClock,
} from "lucide-react";
import { RecruitmentFooter } from "@/features/recruitment/landing/LandingParts";

type Aud = "teachers" | "schools";
const SANS = { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' };

function Swoosh({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 14" className={className} fill="none" aria-hidden preserveAspectRatio="none">
      <path d="M3 10 C 60 2, 150 2, 217 7" stroke="#F5C451" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

const card = "rounded-xl bg-white text-[#1B2A22] shadow-[0_18px_40px_-18px_rgba(12,42,27,0.35)] ring-1 ring-slate-100";

// ── Step visuals ─────────────────────────────────────────────────────────────

function V({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl bg-[#0C2A1B] p-6 sm:p-8 overflow-hidden">
      <svg aria-hidden className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="none" fill="none">
        <path d="M-10 230 C 90 180, 160 250, 260 220" stroke="#8FE3B0" strokeOpacity=".25" strokeDasharray="5 7" />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5 text-[12px] last:border-0"><span className="text-slate-500">{k}</span><span className="font-semibold text-right">{v}</span></div>
);

const TEACHER_STEPS = [
  {
    icon: UserPlus, title: "Create your account", time: "1 minute",
    desc: "Sign up with your email and verify it with a one-time code. No passwords to remember.",
    visual: (
      <V><div className={`${card} p-5 max-w-xs mx-auto`}>
        <p className="text-[13px] font-semibold">Verify your email</p>
        <p className="text-[11.5px] text-slate-500 mt-1">Code sent to priya@…</p>
        <div className="mt-3 flex gap-1.5">{["4", "8", "2", "9", "1", "6"].map((d, i) => <span key={i} className="w-9 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-[16px] font-bold">{d}</span>)}</div>
        <p className="mt-3 rounded-lg bg-[#0E733B] py-2 text-center text-[12.5px] font-semibold text-white">Verify & continue</p>
      </div></V>
    ),
  },
  {
    icon: IdCard, title: "Build your teaching profile", time: "5 minutes",
    desc: "Add subjects, classes taught, qualifications, CTET/STET status, experience, expected salary and the cities you’d move to. Your profile is your application.",
    visual: (
      <V><div className={`${card} p-5 max-w-sm mx-auto`}>
        <div className="flex items-center justify-between"><p className="text-[13px] font-semibold">Profile strength</p><span className="text-[12px] font-bold text-[#0E733B]">90%</span></div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full w-[90%] rounded-full bg-[#0E733B]" /></div>
        <div className="mt-3"><Row k="Subjects" v="Physics, Mathematics" /><Row k="Qualifications" v="M.Sc, B.Ed" /><Row k="CTET" v={<span className="text-[#0E733B]">Cleared</span>} /><Row k="Preferred cities" v="Noida, Delhi" /></div>
      </div></V>
    ),
  },
  {
    icon: Search, title: "Find roles that fit", time: "Ongoing",
    desc: "Search verified schools by subject, board, city and employment type. Every listing shows the school, salary context, requirements and deadline.",
    visual: (
      <V><div className="flex flex-col gap-2.5 max-w-sm mx-auto">
        {[["Greenfield Public School - PGT Physics", "Gurugram"], ["Delhi Public School Noida - PGT Computer Science", "Noida"]].map(([t, c]) => (
          <div key={t} className={`${card} p-3.5`}><p className="text-[12.5px] font-semibold leading-snug">{t}</p><p className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#F3F8F1] px-1.5 py-0.5 text-[11px]"><MapPin className="w-3 h-3 text-[#0E733B]" />{c}</p></div>
        ))}
      </div></V>
    ),
  },
  {
    icon: Send, title: "Apply in one click", time: "Seconds",
    desc: "Add an optional cover note and apply. Your profile goes to the school, scored against their requirements so strong candidates stand out.",
    visual: (
      <V><div className={`${card} p-5 max-w-xs mx-auto text-center`}>
        <span className="mx-auto w-12 h-12 rounded-full bg-[#0E733B] flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-white" /></span>
        <p className="mt-3 text-[14px] font-bold">Application submitted!</p>
        <p className="text-[11.5px] text-slate-500 mt-1">PGT Physics · Greenfield Public School</p>
      </div></V>
    ),
  },
  {
    icon: ListChecks, title: "Track every stage", time: "Live",
    desc: "See exactly where you stand — applied, shortlisted, demo lesson, interview — from your dashboard. No more chasing schools for updates.",
    visual: (
      <V><div className={`${card} p-5 max-w-xs mx-auto`}>
        {[["Applied", true], ["Shortlisted", true], ["Demo lesson", true], ["Interview", false]].map(([s, d]) => (
          <div key={s as string} className="flex items-center gap-2.5 py-1.5"><span className={`w-5 h-5 rounded-full flex items-center justify-center ${d ? "bg-[#0E733B]" : "border-2 border-slate-300"}`}>{d && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}</span><span className={`text-[12.5px] ${d ? "font-semibold" : "text-slate-500"}`}>{s as string}</span></div>
        ))}
      </div></V>
    ),
  },
  {
    icon: FileSignature, title: "Receive your offer", time: "The finish line",
    desc: "Get a structured offer letter in-app. Accept it, or counter-offer and agree the final CTC with the school — every figure stays on record.",
    visual: (
      <V><div className={`${card} max-w-xs mx-auto overflow-hidden`}>
        <div className="bg-[#0E733B] px-4 py-3 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-[#C7F2D8]">Offer received</p><p className="text-[14px] font-bold">PGT Physics</p></div>
        <div className="p-4"><Row k="Monthly CTC" v="₹78,000" /><Row k="Joining" v="1 April" />
          <div className="mt-3 flex gap-2"><span className="flex-1 rounded-lg bg-[#0E733B] py-1.5 text-center text-[11.5px] font-semibold text-white">Accept</span><span className="flex-1 rounded-lg border border-slate-200 py-1.5 text-center text-[11.5px] font-semibold">Negotiate</span></div>
        </div>
      </div></V>
    ),
  },
];

const SCHOOL_STEPS = [
  {
    icon: Building2, title: "Register your institution", time: "2 minutes",
    desc: "Create a school account with your official email and verify it with a one-time code.",
    visual: (
      <V><div className={`${card} p-5 max-w-xs mx-auto`}>
        <p className="text-[13px] font-semibold">School / Institution account</p>
        <div className="mt-3"><Row k="Institution" v="Greenfield Public School" /><Row k="Official email" v="hr@greenfield…" /><Row k="Email" v={<span className="text-[#0E733B]">Verified</span>} /></div>
      </div></V>
    ),
  },
  {
    icon: BadgeCheck, title: "Complete your school profile", time: "5 minutes",
    desc: "Add your board, type, address and a short introduction. Our team reviews it, and verified schools get a badge on every job they post.",
    visual: (
      <V><div className={`${card} p-5 max-w-sm mx-auto`}>
        <div className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg bg-[#0C2A1B] text-[#8FE3B0] text-[13px] font-bold flex items-center justify-center">GP</span><div><p className="text-[13px] font-semibold flex items-center gap-1">Greenfield Public School <BadgeCheck className="w-4 h-4 text-[#0E733B]" /></p><p className="text-[11px] text-slate-500">CBSE · K–12 · Gurugram</p></div></div>
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] font-semibold text-[#0E733B]">Verified institution</p>
      </div></V>
    ),
  },
  {
    icon: PenSquare, title: "Post a role", time: "3 minutes",
    desc: "Subject, classes, board, employment type and deadline — plus the must-have and preferred requirements you want every applicant checked against.",
    visual: (
      <V><div className={`${card} p-5 max-w-sm mx-auto`}>
        <Row k="Role" v="PGT Physics" /><Row k="Board · Classes" v="CBSE · XI–XII" />
        {[["M.Sc Physics with B.Ed", "Must"], ["CTET qualified", "Pref"]].map(([t, k]) => <div key={t} className="mt-2 flex items-center justify-between rounded-lg bg-[#F6F9F7] px-2.5 py-1.5 text-[11.5px]"><span>{t}</span><span className={`text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded ${k === "Must" ? "bg-[#0C2A1B] text-white" : "bg-emerald-50 text-emerald-800"}`}>{k}</span></div>)}
      </div></V>
    ),
  },
  {
    icon: Sparkles, title: "AI screens every applicant", time: "Instant",
    desc: "Each applicant gets a match score out of 100 with the reasons behind it. Anyone missing a must-have is flagged — nobody is rejected automatically.",
    visual: (
      <V><div className={`${card} p-4 max-w-sm mx-auto flex flex-col gap-2`}>
        {[["Arjun Mehta", 93], ["Meera Joshi", 81], ["Kavita Nair", 54]].map(([n, s]) => (
          <div key={n as string} className="flex items-center gap-2.5 rounded-lg border border-slate-100 px-2.5 py-2">
            <span className={`w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${(s as number) >= 75 ? "bg-[#0E733B]" : "bg-slate-400"}`}>{s}</span>
            <span className="flex-1 text-[12.5px] font-semibold">{n}</span>
            {(s as number) < 60 && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"><AlertTriangle className="w-3 h-3" />Must-have</span>}
          </div>
        ))}
      </div></V>
    ),
  },
  {
    icon: Columns3, title: "Shortlist, compare, demo lesson", time: "Your pace",
    desc: "Move candidates through your own stages, compare up to three finalists side by side, and run demo lessons and interviews.",
    visual: (
      <V><div className={`${card} p-4 max-w-sm mx-auto`}>
        <p className="text-[12.5px] font-semibold mb-1">Compare candidates</p>
        <Row k="Match score" v="93 · 81" /><Row k="Experience" v="10 yrs · 7 yrs" /><Row k="Expected CTC" v="₹82k · ₹70k" />
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E733B]"><CalendarClock className="w-3.5 h-3.5" />Demo lesson Thu, 11:00 AM</p>
      </div></V>
    ),
  },
  {
    icon: Handshake, title: "Send the offer & close", time: "Done",
    desc: "Generate the offer letter from the application, negotiate CTC in-app if needed, and close the hire when the teacher accepts.",
    visual: (
      <V><div className={`${card} max-w-xs mx-auto overflow-hidden`}>
        <div className="bg-[#0C2A1B] px-4 py-3 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8FE3B0]">Offer letter</p><p className="text-[14px] font-bold">Arjun Mehta</p></div>
        <div className="p-4"><Row k="Monthly CTC" v="₹78,000" /><p className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-2 text-[11.5px] font-bold text-[#0E733B] flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Accepted</p></div>
      </div></V>
    ),
  },
];

const TRUST = [
  { icon: ShieldCheck, t: "Verified accounts", d: "Every teacher and school verifies their email before they can apply or post." },
  { icon: Sparkles, t: "Explainable AI screening", d: "Scores come with reasons, and never auto-reject. Contact details are never used in scoring." },
  { icon: Lock, t: "Contact details stay private", d: "Public profiles never show a teacher’s phone, email or resume — only schools they apply to see them." },
  { icon: IndianRupee, t: "No commission", d: "One-time plans. No agency takes a cut of a teacher’s salary or charges a school per hire." },
];

const FAQ: Record<Aud, { q: string; a: string }[]> = {
  teachers: [
    { q: "What does it cost for teachers?", a: "Teacher plans are paid once: ₹1,100 for 1 year, ₹2,100 for 5 years or ₹5,100 for lifetime access. There are no fees per application." },
    { q: "Do schools see my phone number?", a: "Only schools you apply to see your contact details, inside their hiring pipeline. Public profile pages never show your phone, email or resume." },
    { q: "Can I apply to several schools?", a: "Yes — apply to as many roles as you like and track every application from your dashboard." },
  ],
  schools: [
    { q: "What does it cost for schools?", a: "School plans are paid once: ₹11,000 for 1 year, ₹21,000 for 5 years or ₹51,000 for lifetime access, with unlimited job posts." },
    { q: "Does AI decide who we hire?", a: "No. AI screening scores and explains — your team makes every decision. Candidates missing a must-have are flagged, never auto-rejected." },
    { q: "Can we use our own interview stages?", a: "Yes. Every job has its own stages, for example screening, demo lesson, panel interview and principal round." },
  ],
};

export default function HowItWorksClient() {
  const params = useSearchParams();
  const [aud, setAud] = useState<Aud>(params.get("for") === "schools" ? "schools" : "teachers");
  const steps = aud === "teachers" ? TEACHER_STEPS : SCHOOL_STEPS;

  return (
    <div className="bg-white" style={SANS}>
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg, #071A10 0%, #0C2A1B 50%, #0E3524 100%)" }}>
        <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#0E733B]/30 blur-3xl" />
        <div className="relative max-w-[900px] mx-auto px-5 pt-14 pb-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#8FE3B0]">How EduBeacon works</span>
          <h1 className="mt-5 text-[36px] sm:text-[48px] font-bold leading-[1.1] tracking-tight">
            From profile to offer letter,{" "}
            <span className="relative inline-block text-[#8FE3B0]">step by step.<Swoosh className="absolute left-0 -bottom-2 w-full h-3" /></span>
          </h1>
          <p className="mt-5 text-[16.5px] leading-[1.65] text-white/85 max-w-[620px] mx-auto">
            One platform where teachers find the right school and schools find the right teacher — with every step visible to both sides.
          </p>
          <div role="tablist" aria-label="Choose your side" className="mt-9 inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15">
            {(["teachers", "schools"] as const).map((a) => (
              <button key={a} role="tab" aria-selected={aud === a} onClick={() => setAud(a)}
                className={`inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 text-[14px] font-semibold transition-colors ${aud === a ? "bg-white text-[#0C2A1B]" : "text-white/85 hover:text-white"}`}>
                {a === "teachers" ? <GraduationCap className="w-4 h-4" /> : <School className="w-4 h-4" />}
                I’m a {a === "teachers" ? "teacher" : "school"}
              </button>
            ))}
          </div>
        </div>
        <svg aria-hidden className="absolute bottom-0 left-0 w-full h-14 sm:h-20 text-white" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 80 V50 C 300 10, 600 75, 900 50 S 1300 10, 1440 30 V80z" />
        </svg>
      </section>

      {/* Step overview strip */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 -mt-4 relative z-10">
        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map(({ icon: Icon, title }, i) => (
            <li key={title}>
              <a href={`#step-${i + 1}`} className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3 hover:border-[#0E733B]/40 hover:shadow-sm transition">
                <span className="flex items-center justify-between"><Icon className="w-4.5 h-4.5 text-[#0E733B]" /><span className="text-[11px] font-bold text-slate-400">0{i + 1}</span></span>
                <span className="text-[13px] font-semibold leading-snug text-[#1B2A22]">{title}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Timeline */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 py-16 lg:py-24">
        <div className="relative">
          <div aria-hidden className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#0E733B]/0 via-[#0E733B]/30 to-[#0E733B]/0" />
          <div className="flex flex-col gap-16 lg:gap-24">
            {steps.map(({ icon: Icon, title, desc, time, visual }, i) => {
              const flip = i % 2 === 1;
              return (
                <div key={title} id={`step-${i + 1}`} className="relative grid lg:grid-cols-2 gap-8 lg:gap-20 items-center scroll-mt-24">
                  <span aria-hidden className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white ring-4 ring-[#ECFDF5] border border-[#0E733B]/30 items-center justify-center text-[14px] font-bold text-[#0E733B] z-10">{i + 1}</span>
                  <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center"><Icon className="w-5 h-5 text-[#0E733B]" /></span>
                      <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0E733B]">Step {i + 1} · {time}</span>
                    </div>
                    <h2 className="mt-4 text-[26px] sm:text-[30px] font-bold leading-tight text-[#1B2A22]">{title}</h2>
                    <p className="mt-3 text-[15.5px] leading-[1.75] text-slate-600 max-w-[30em]">{desc}</p>
                  </div>
                  <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{visual}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Link href="/recruitment/register" className="inline-flex items-center gap-2 rounded-full bg-[#0E733B] hover:bg-[#0B5C2F] px-7 py-3.5 text-[15px] font-semibold text-white">
            {aud === "teachers" ? "Create your teacher profile" : "Register your school"} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={aud === "teachers" ? "/recruitment/jobs" : "/recruitment/employers"} className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-[#0E733B] px-7 py-3.5 text-[15px] font-semibold text-[#0C2A1B]">
            {aud === "teachers" ? "Browse open jobs" : "See hiring features"}
          </Link>
        </div>
      </section>

      {/* Behind the scenes */}
      <section className="bg-[#F5F7F5] py-20">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <p className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-[#0E733B]">Behind every step</p>
          <h2 className="mt-3 text-center text-[28px] sm:text-[34px] font-bold text-[#1B2A22]">Built on trust, not guesswork.</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-3">
                <span className="w-11 h-11 rounded-full bg-[#ECFDF5] flex items-center justify-center"><Icon className="w-5 h-5 text-[#0E733B]" /></span>
                <h3 className="text-[16.5px] font-bold text-[#1B2A22]">{t}</h3>
                <p className="text-[14px] leading-[1.65] text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[760px] mx-auto px-5 sm:px-8 py-20">
        <h2 className="text-center text-[26px] font-bold text-[#1B2A22] mb-8">Questions {aud === "teachers" ? "teachers" : "schools"} ask</h2>
        <div className="flex flex-col gap-3">
          {FAQ[aud].map((f) => (
            <details key={f.q} className="group bg-white rounded-xl border border-slate-200 px-5 py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[15px] font-semibold text-[#1B2A22] [&::-webkit-details-marker]:hidden">
                {f.q}<ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <p className="mt-3 text-[14px] leading-[1.7] text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-[14px] text-slate-600">
          See all plans on the <Link href={`/recruitment/pricing?for=${aud}`} className="font-semibold text-[#0E733B] hover:underline">pricing page</Link>.
        </p>
      </section>

      <RecruitmentFooter />
    </div>
  );
}
