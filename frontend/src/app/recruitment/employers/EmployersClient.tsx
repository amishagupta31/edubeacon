"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Search, BarChart3, Users, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Wand2, Target, KanbanSquare, CalendarCheck, Columns3, NotebookPen, FileSignature, Handshake, ShieldCheck,
  AlertTriangle, TrendingUp, School, Briefcase, FileText, IndianRupee, GraduationCap, Building2,
} from "lucide-react";
import { API } from "@/features/recruitment/useRecruitmentProfile";
import { RecruitmentFooter } from "@/features/recruitment/landing/LandingParts";

interface LiveStats { schools: number; teachers: number; openJobs: number; applications: number; cities: number }

const SANS = { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' };
const HERO_PHOTO = "/images/recruitment/hero-teacher.jpg";

// ── Decorative bits ──────────────────────────────────────────────────────────

function Swoosh({ className = "", color = "#8FE3B0" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 220 14" className={className} fill="none" aria-hidden preserveAspectRatio="none">
      <path d="M3 10 C 60 2, 150 2, 217 7" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Hl({ children, color = "#0E733B" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="relative inline-block" style={{ color }}>
      {children}
      <Swoosh className="absolute left-0 -bottom-1.5 w-full h-2.5" color="#F5C451" />
    </span>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden>
      <path d="M10 0 l2.2 7.8 7.8 2.2 -7.8 2.2 L10 20 7.8 12.2 0 10 7.8 7.8z" />
    </svg>
  );
}

function DarkStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl bg-[#0C2A1B] overflow-hidden p-6 sm:p-10 min-h-[300px] flex items-center justify-center">
      <svg aria-hidden className="absolute inset-0 w-full h-full" viewBox="0 0 600 340" preserveAspectRatio="none" fill="none">
        <path d="M-10 300 C 120 240, 220 330, 360 290" stroke="#8FE3B0" strokeOpacity=".25" strokeDasharray="5 7" />
        <path d="M430 20 C 500 40, 540 10, 620 50" stroke="#8FE3B0" strokeOpacity=".25" strokeDasharray="5 7" />
      </svg>
      <Star className="absolute right-[12%] top-[14%] w-5 h-5 text-white/70" />
      <div className="relative w-full">{children}</div>
    </div>
  );
}

// ── Hero product mock ────────────────────────────────────────────────────────

function HeroDashboard() {
  const rows = [
    ["Arjun Mehta", "PGT Physics · 10 yrs", 93],
    ["Meera Joshi", "PGT Physics · 7 yrs", 81],
    ["Rohan Gupta", "TGT Science · 4 yrs", 68],
    ["Sana Qureshi", "PGT Physics · 6 yrs", 77],
    ["Vikram Das", "TGT Science · 9 yrs", 72],
  ] as const;
  return (
    <div className="rounded-xl bg-[#0F2318] ring-1 ring-white/10 shadow-2xl overflow-hidden text-white">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 text-[10.5px] text-white/70">
        <span>Select a job · <b className="text-white">PGT Physics</b></span>
        <span>Showing 1 – 5 of 38</span>
      </div>
      <div className="grid grid-cols-[120px_1fr]">
        <div className="border-r border-white/10 p-3 flex flex-col gap-2 text-[10px] text-white/60">
          {["Active candidates", "Shortlisted", "Demo lesson", "Interview", "Offer"].map((t, i) => (
            <span key={t} className={`rounded px-2 py-1 ${i === 0 ? "bg-[#0E733B] text-white" : ""}`}>{t}</span>
          ))}
        </div>
        <div className="p-3 flex flex-col gap-1.5">
          <div className="flex gap-1.5 mb-1">
            {["Physics", "CBSE", "CTET", "Noida", "5+ yrs"].map((c) => (
              <span key={c} className="rounded bg-white/10 px-1.5 py-0.5 text-[9.5px] text-white/80">{c}</span>
            ))}
          </div>
          {rows.map(([n, m, s]) => (
            <div key={n} className="flex items-center gap-2 rounded-md bg-white/[0.04] px-2 py-1.5">
              <span className={`w-6 h-6 rounded-full text-[9.5px] font-bold flex items-center justify-center ${s >= 75 ? "bg-[#0E733B]" : "bg-teal-700"}`}>{s}</span>
              <span className="text-[11px] font-semibold flex-1 truncate">{n}</span>
              <span className="text-[9.5px] text-white/55 truncate hidden sm:inline">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Slider (how schools use EduBeacon) ───────────────────────────────────────

const STORY_TABS = ["K-12 Schools", "School Groups", "Colleges & Coaching"] as const;
const STORIES: Record<(typeof STORY_TABS)[number], { tag: string; title: string; body: string; role: string }[]> = {
  "K-12 Schools": [
    { tag: "PG", title: "Replacing a PGT mid-session", body: "Post the role with M.Sc + B.Ed as must-haves. AI ranks every applicant on day one, so your shortlist is ready before the week is out.", role: "Senior secondary hiring" },
    { tag: "PR", title: "Expanding the primary wing", body: "Hire several PRTs at once from one post. Sort by match score and move the best candidates straight to a demo lesson.", role: "Primary hiring" },
    { tag: "BX", title: "Covering board-exam classes", body: "Filter to CTET-cleared candidates with board-class experience and compare finalists side by side before you decide.", role: "Classes IX–XII" },
    { tag: "CO", title: "Finding an academic coordinator", body: "Post a leadership role, set years of experience as a must-have, and review only the candidates who qualify.", role: "Leadership hiring" },
    { tag: "NT", title: "Non-teaching staff too", body: "Counsellors, librarians, lab assistants and admin roles run through the same pipeline as your teachers.", role: "Non-teaching roles" },
  ],
  "School Groups": [
    { tag: "MC", title: "One account, many campuses", body: "Post roles for different cities from the same institution account and track every campus pipeline separately.", role: "Multi-campus hiring" },
    { tag: "ST", title: "Standard stages everywhere", body: "Use the same stages — screening, demo lesson, principal round — so every campus hires to the same bar.", role: "Consistent process" },
    { tag: "OF", title: "Offers on the record", body: "Generate offer letters from the application and settle CTC in-app, so HR has every agreed term in writing.", role: "Central HR" },
    { tag: "CP", title: "Compare across campuses", body: "Shortlist finalists from any campus and compare them side by side before central approval.", role: "Group leadership" },
    { tag: "LP", title: "Lifetime plan for the group", body: "Pay once for long-term access instead of per-post or per-hire fees across every campus role.", role: "Cost control" },
  ],
  "Colleges & Coaching": [
    { tag: "FA", title: "Faculty with specialisations", body: "Set requirements like M.Sc, NET or JEE coaching experience. Must-have gaps are flagged before you spend time on calls.", role: "Faculty hiring" },
    { tag: "VG", title: "Visiting and guest faculty", body: "Post visiting or part-time roles and reach educators open to flexible work in your city.", role: "Flexible roles" },
    { tag: "SB", title: "Seasonal batch hiring", body: "Open several roles at once before a new batch and close them all from one pipeline view.", role: "Batch starts" },
    { tag: "DL", title: "Demo lecture before offer", body: "Add a demo lecture stage so every finalist teaches a sample class before you send the offer letter.", role: "Quality check" },
    { tag: "NG", title: "Fair salary conversations", body: "Counter-offers happen in-app with every figure on record — no lost emails, no confusion at joining.", role: "Offer stage" },
  ],
};

function StorySlider() {
  const [tab, setTab] = useState<(typeof STORY_TABS)[number]>("K-12 Schools");
  const [page, setPage] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPage(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * 2));
  };

  return (
    <section className="px-4 sm:px-6 py-14">
      <div className="max-w-[1180px] mx-auto rounded-3xl bg-[#FBF4E2] p-6 sm:p-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-[#F5D88A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#5C4A1E]">How schools use it</span>
          <h2 className="mt-4 text-[26px] font-bold leading-tight text-[#1B2A22]">
            Built for recruiters.<br /><Hl color="#1B2A22">Made for schools</Hl>
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-[#4B4A3F]">
            Whether you hire one teacher a year or forty a term, EduBeacon fits the way your school already hires.
          </p>
          <Link href="/recruitment/pricing?for=schools" className="mt-auto pt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0E733B] hover:gap-2.5 transition-all">
            See school plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STORY_TABS.map((t) => (
                <button key={t} onClick={() => { setTab(t); setPage(0); rail.current?.scrollTo({ left: 0 }); }}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${tab === t ? "bg-[#0C2A1B] text-white" : "bg-white/70 text-[#1B2A22] hover:bg-white"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => <span key={i} className={`w-2 h-2 rounded-full ${page === i ? "bg-[#1B2A22]" : "bg-[#1B2A22]/25"}`} />)}
            </div>
          </div>

          <div className="relative mt-5">
            <button onClick={() => go(-1)} aria-label="Previous" className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#ECFDF5] ring-1 ring-[#0E733B]/20 items-center justify-center text-[#0E733B] hover:bg-white"><ChevronLeft className="w-5 h-5" /></button>
            <div ref={rail} onScroll={onScroll} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STORIES[tab].map((s) => (
                <article key={s.tag} className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] rounded-2xl bg-white p-6 flex flex-col">
                  <span className="w-10 h-10 rounded-lg bg-[#0C2A1B] text-[#8FE3B0] text-[13px] font-bold flex items-center justify-center">{s.tag.slice(0, 2)}</span>
                  <h3 className="mt-4 text-[16px] font-bold text-[#1B2A22]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-slate-600">{s.body}</p>
                  <p className="mt-auto pt-5 text-[12.5px] font-semibold text-[#0E733B]">{s.role}</p>
                </article>
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next" className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#ECFDF5] ring-1 ring-[#0E733B]/20 items-center justify-center text-[#0E733B] hover:bg-white"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stage sections ───────────────────────────────────────────────────────────

interface Stage {
  tag: string; tagBg: string; bg: string; accent: string;
  title: [string, string, string?];
  items: { icon: React.ElementType; t: string; d: string }[];
  visual: React.ReactNode;
}

function StageSection({ s, flip }: { s: Stage; flip: boolean }) {
  const [open, setOpen] = useState(s.items.length - 1);
  return (
    <section className="relative overflow-hidden" style={{ background: s.bg }}>
      <div aria-hidden className={`absolute bottom-[-120px] ${flip ? "left-[-80px]" : "right-[-80px]"} w-[320px] h-[320px] rounded-full opacity-60`} style={{ background: s.tagBg + "33" }} />
      <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
          <span className="inline-block rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white" style={{ background: s.tagBg }}>{s.tag}</span>
          <h2 className="mt-4 text-[28px] sm:text-[32px] font-bold leading-[1.2] text-[#1B2A22]">
            {s.title[0]} <Hl color={s.accent}>{s.title[1]}</Hl>{s.title[2] ? ` ${s.title[2]}` : ""}
          </h2>
          <div className="mt-6 flex flex-col">
            {s.items.map(({ icon: Icon, t, d }, i) => {
              const isOpen = open === i;
              return (
                <div key={t} className="border-t border-dashed border-slate-400/60">
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="w-full flex items-center gap-3 py-4 text-left">
                    <Icon className="w-[18px] h-[18px] shrink-0" style={{ color: s.accent }} />
                    <span className="flex-1 text-[16px] font-semibold text-[#1B2A22]">{t}:</span>
                    <ChevronDown className={`w-5 h-5 text-[#1B2A22] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="-mt-1 pb-4 text-[14.5px] leading-[1.7] text-slate-600">{d}</p>}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{s.visual}</div>
      </div>
    </section>
  );
}

const card = "rounded-xl bg-white text-[#1B2A22] shadow-xl";

const STAGES: Stage[] = [
  {
    tag: "Source", tagBg: "#0E733B", bg: "#E7F5EC", accent: "#0E733B",
    title: ["Find the right", "teachers", "in minutes"],
    items: [
      { icon: Wand2, t: "Smart Match", d: "Every role reaches teachers whose subject, board and preferred city fit — so your applicants are relevant from the first day." },
      { icon: Search, t: "Talent Search", d: "Browse verified teacher profiles by name, subject or city and invite strong candidates before they apply anywhere else." },
    ],
    visual: (
      <DarkStage>
        <div className="grid sm:grid-cols-[1fr_0.8fr] gap-4 items-start">
          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between"><span className="text-[12.5px] font-semibold">Active Candidates</span><span className="rounded-full border border-[#0E733B]/40 px-2 py-0.5 text-[10.5px] text-[#0E733B]">Physics · CBSE</span></div>
            {[["Ananya Iyer", "PGT Physics · Pune"], ["Saurabh Verma", "TGT Science · Noida"], ["Kavya Nair", "PGT Chemistry · Kochi"]].map(([n, m]) => (
              <div key={n} className="flex items-center gap-2.5 mt-3"><span className="w-7 h-7 rounded-full bg-[#0C2A1B] text-[#8FE3B0] text-[10px] font-bold flex items-center justify-center">{n.split(" ").map((x) => x[0]).join("")}</span><div><p className="text-[12px] font-semibold leading-tight">{n}</p><p className="text-[10.5px] text-slate-500">{m}</p></div></div>
            ))}
          </div>
          <div className={`${card} p-4`}>
            <p className="text-[12px] font-semibold flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5 text-[#0E733B]" /> Smart Match</p>
            <p className="text-[10.5px] text-slate-500 mt-1">Matched on what you hire for</p>
            {[["Subject", "Physics"], ["Board", "CBSE"], ["City", "Noida"], ["CTET", "Cleared"]].map(([k, v]) => (
              <div key={k} className="mt-2 flex items-center justify-between text-[11px]"><span className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="w-3 h-3 text-[#0E733B]" />{k}</span><b>{v}</b></div>
            ))}
          </div>
        </div>
      </DarkStage>
    ),
  },
  {
    tag: "AI Screen", tagBg: "#0F766E", bg: "#E8F3F1", accent: "#0F766E",
    title: ["Let AI screen", "every applicant", ""],
    items: [
      { icon: Target, t: "AI Match Score", d: "Each applicant gets a score out of 100 across subject fit, experience, CTET/STET, qualifications, location and your requirements — with the reason behind every point." },
      { icon: ShieldCheck, t: "Must-have Checks", d: "Mark requirements like ‘M.Sc Physics with B.Ed’ as must-have. Anyone who doesn’t show them is flagged and never outranks a qualified candidate. Nobody is rejected automatically." },
    ],
    visual: (
      <DarkStage>
        <div className={`${card} p-4 max-w-md mx-auto`}>
          <p className="text-[12.5px] font-semibold">PGT Physics · AI screening</p>
          {[["Arjun Mehta", 93, "Strong match"], ["Meera Joshi", 81, "Strong match"], ["Rohan Gupta", 68, "Good match"], ["Kavita Nair", 54, "Missing a must-have"]].map(([n, s, v]) => (
            <div key={n as string} className="mt-2.5 flex items-center gap-2.5 rounded-lg border border-slate-100 px-2.5 py-2">
              <span className={`w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${(s as number) >= 75 ? "bg-[#0E733B]" : (s as number) >= 55 ? "bg-teal-600" : "bg-slate-400"}`}>{s}</span>
              <span className="flex-1 text-[12.5px] font-semibold">{n}</span>
              {v === "Missing a must-have"
                ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"><AlertTriangle className="w-3 h-3" />Must-have</span>
                : <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">{v}</span>}
            </div>
          ))}
        </div>
      </DarkStage>
    ),
  },
  {
    tag: "Engage", tagBg: "#15803D", bg: "#EDF6E8", accent: "#15803D",
    title: ["Build meaningful connections and", "shortlist top talent", ""],
    items: [
      { icon: KanbanSquare, t: "One Hiring Pipeline", d: "Every applicant for a role in one place. Sort by best match, filter to must-haves only, and move candidates forward in one click." },
      { icon: CalendarCheck, t: "Custom Stages & Demo Lessons", d: "Set your own stages for each job — screening, demo lesson, panel interview, principal round — and see exactly where every candidate stands." },
    ],
    visual: (
      <DarkStage>
        <div className="relative max-w-md mx-auto">
          <div className={`${card} p-4`}>
            <p className="text-[12.5px] font-semibold">Arjun Mehta · Hiring stages</p>
            {[["Applied", "8 Oct", true], ["Shortlisted", "9 Oct", true], ["Demo lesson", "Thu, 11:00 AM", true], ["Panel interview", "Next", false], ["Offer", "—", false]].map(([s, d, done]) => (
              <div key={s as string} className="mt-2.5 flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-[#0E733B]" : "border-2 border-slate-300"}`}>{done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}</span>
                <span className={`flex-1 text-[12.5px] ${done ? "font-semibold" : "text-slate-500"}`}>{s as string}</span>
                <span className="text-[11px] text-slate-500">{d as string}</span>
              </div>
            ))}
          </div>
          <div className={`${card} absolute -left-4 sm:-left-10 -bottom-6 p-3 w-[190px] ring-2 ring-[#8FE3B0]`}>
            <p className="text-[11.5px] font-semibold flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5 text-[#0E733B]" /> Demo lesson</p>
            <p className="text-[10.5px] text-slate-500 mt-1">Class XI · Thermodynamics · 40 min</p>
          </div>
        </div>
      </DarkStage>
    ),
  },
  {
    tag: "Interview", tagBg: "#166534", bg: "#E6F0EA", accent: "#166534",
    title: ["Compare finalists and make", "confident decisions", ""],
    items: [
      { icon: Columns3, t: "Side-by-side Comparison", d: "Put up to three candidates next to each other on score, subjects, experience, CTET, qualifications, preferred city, expected CTC and every requirement." },
      { icon: NotebookPen, t: "Recruiter Notes & Full Profiles", d: "Open any candidate for their full profile — qualifications, experience, certifications, cover note — and keep internal notes your panel can see." },
    ],
    visual: (
      <DarkStage>
        <div className={`${card} p-4 max-w-md mx-auto`}>
          <p className="text-[12.5px] font-semibold mb-2">Compare candidates</p>
          <table className="w-full text-[11.5px]">
            <thead><tr className="text-left text-slate-500"><th className="font-medium pb-1.5" /><th className="font-bold text-[#1B2A22] pb-1.5">Arjun</th><th className="font-bold text-[#1B2A22] pb-1.5">Meera</th></tr></thead>
            <tbody className="[&>tr]:border-t [&>tr]:border-slate-100 [&_td]:py-1.5">
              <tr><td className="text-slate-500">Match score</td><td className="font-bold text-[#0E733B]">93</td><td className="font-bold text-[#0E733B]">81</td></tr>
              <tr><td className="text-slate-500">Experience</td><td>10 yrs</td><td>7 yrs</td></tr>
              <tr><td className="text-slate-500">Expected CTC</td><td>₹82,000</td><td>₹70,000</td></tr>
              <tr><td className="text-slate-500">M.Sc + B.Ed</td><td><CheckCircle2 className="w-4 h-4 text-[#0E733B]" /></td><td><CheckCircle2 className="w-4 h-4 text-[#0E733B]" /></td></tr>
            </tbody>
          </table>
        </div>
      </DarkStage>
    ),
  },
  {
    tag: "Offer", tagBg: "#0E5A34", bg: "#E9F5EE", accent: "#0E5A34",
    title: ["Send the offer and", "close the hire", ""],
    items: [
      { icon: FileSignature, t: "Offer Letter Builder", d: "Create a structured offer — CTC, joining date, probation and terms — straight from the candidate’s application." },
      { icon: Handshake, t: "In-app Salary Negotiation", d: "Candidates can accept or counter. Every message and revised figure stays in one thread, so the final terms are on record." },
    ],
    visual: (
      <DarkStage>
        <div className={`${card} max-w-sm mx-auto overflow-hidden`}>
          <div className="bg-[#0E733B] px-4 py-3 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-[#C7F2D8]">Offer · PGT Physics</p><p className="text-[15px] font-bold">Arjun Mehta</p></div>
          <div className="p-4 flex flex-col gap-2 text-[12px]">
            {[["Monthly CTC", "₹78,000"], ["Joining date", "1 April"], ["Probation", "6 months"]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">{k}</span><b>{v}</b></div>)}
            <p className="mt-1 rounded-lg bg-emerald-50 px-2.5 py-2 text-[11.5px] font-bold text-[#0E733B] flex items-center gap-1.5"><Handshake className="w-3.5 h-3.5" /> Accepted after one counter-offer</p>
          </div>
        </div>
      </DarkStage>
    ),
  },
];

const COMPARE = [
  { icon: Target, t: "AI match score for every applicant", d: "Scored against your own requirements, with reasons.", other: "Not available" },
  { icon: ShieldCheck, t: "Must-have requirement checks", d: "Gaps flagged before you spend time on calls.", other: "Not available" },
  { icon: GraduationCap, t: "Teacher-specific profiles", d: "CTET/STET, boards, classes taught and subjects built in.", other: "Generic CVs" },
  { icon: KanbanSquare, t: "Built-in hiring pipeline", d: "Custom stages from application to offer.", other: "Spreadsheets & email" },
  { icon: Columns3, t: "Side-by-side comparison", d: "Up to three finalists on one screen.", other: "Not available" },
  { icon: FileSignature, t: "Offer letters & negotiation", d: "Offers and counter-offers kept on record.", other: "Not available" },
  { icon: IndianRupee, t: "One-time pricing", d: "No per-hire fee or agency commission.", other: "Per-post or per-hire fees" },
];

const FAQ = [
  { q: "How much does EduBeacon cost for schools?", a: "School plans are paid once: ₹11,000 for 1 year, ₹21,000 for 5 years, or ₹51,000 for lifetime access — with unlimited job posts on every plan." },
  { q: "How does AI screening work?", a: "Every applicant is scored against your job: subject fit, experience, CTET/STET, qualifications, location and the requirements you set. You see the reasons behind every score, and it never rejects anyone automatically." },
  { q: "How are candidates verified?", a: "Every account verifies its email before access, and candidate profiles carry qualifications, experience and CTET/STET status that you review before shortlisting." },
  { q: "Can we use our own interview stages?", a: "Yes. Each job has its own stages — for example Applied, Demo lesson, Panel interview, Offer — and candidates move through them in one click." },
];

function CountUp({ value }: { value: number | null }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value === null) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{value === null ? "—" : n.toLocaleString("en-IN")}</>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EmployersClient() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  useEffect(() => {
    fetch(`${API}/api/recruitment/stats`).then((r) => (r.ok ? r.json() : null)).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="bg-white overflow-x-hidden" style={SANS}>
      {/* ═════════ Hero ═════════ */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg, #071A10 0%, #0C2A1B 45%, #0E3524 100%)" }}>
        <div aria-hidden className="absolute -top-40 right-[-120px] w-[560px] h-[560px] rounded-full bg-[#0E733B]/30 blur-3xl" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-14 pb-28 lg:pt-20 lg:pb-36 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="min-w-0">
            <h1 className="text-[36px] sm:text-[44px] xl:text-[48px] font-bold leading-[1.1] tracking-tight">
              Find the right teachers.
              <span className="block relative w-fit bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #8FE3B0, #34D399 55%, #A7F3D0)" }}>
                Faster. Smarter. Fairer.
                <Swoosh className="absolute left-[30%] -bottom-2 w-[70%] h-3" color="#34D399" />
              </span>
            </h1>
            <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.65] text-white/85 max-w-[34em]">
              From smart matching to AI screening to offer letters, EduBeacon gives your school one hiring workflow — so the right teacher joins, every time.
            </p>
            <Link href="/recruitment/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#34D399] px-6 py-3 text-[15px] font-bold text-[#062013] transition-colors">
              Start Hiring <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {[
                { icon: Users, t: "Smart sourcing", d: "Find relevant teachers" },
                { icon: Sparkles, t: "AI screening", d: "Save time, hire better" },
                { icon: BarChart3, t: "Data-driven hiring", d: "Decide with confidence" },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-[#8FE3B0]" /></span>
                  <span><span className="block text-[13.5px] font-semibold">{t}</span><span className="block text-[12px] text-white/65">{d}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 max-w-[560px] mx-auto w-full">
            <div className="w-[80%]"><HeroDashboard /></div>
            <div className="absolute right-0 bottom-[-16%] w-[36%] aspect-[272/420] rounded-2xl overflow-hidden ring-4 ring-[#0C2A1B] shadow-2xl">
              <Image src={HERO_PHOTO} alt="A teacher hired through EduBeacon" fill priority sizes="240px" className="object-cover object-top" />
            </div>
            <div className="absolute -top-5 right-2 sm:-right-4 flex items-center gap-2.5 rounded-xl bg-white text-[#1B2A22] shadow-xl px-3.5 py-2.5">
              <span className="w-8 h-8 rounded-full bg-[#0E733B] flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></span>
              <span><span className="block text-[12.5px] font-bold leading-tight">Match score 93/100</span><span className="block text-[11px] text-slate-500">AI-screened against your requirements</span></span>
            </div>
            <div className="absolute left-[-6px] sm:-left-8 bottom-[-10%] rounded-xl bg-white text-[#1B2A22] shadow-xl px-4 py-3">
              <span className="block text-[11px] text-slate-500">Teacher candidates</span>
              <span className="flex items-center gap-2 text-[22px] font-bold leading-tight"><Users className="w-5 h-5 text-[#0E733B]" /><CountUp value={stats?.teachers ?? null} /></span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0E733B]"><TrendingUp className="w-3 h-3" /> Live on EduBeacon</span>
            </div>
          </div>
        </div>
        <svg aria-hidden className="absolute bottom-0 left-0 w-full h-16 sm:h-24 text-white" viewBox="0 0 1440 96" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 96 V60 C 240 20, 480 90, 760 70 S 1200 10, 1440 40 V96z" />
        </svg>
      </section>

      {/* ═════════ Live numbers ═════════ */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 rounded-2xl border border-slate-200 py-8">
          {[
            { icon: Users, v: stats?.teachers ?? null, l: "Teacher candidates" },
            { icon: School, v: stats?.schools ?? null, l: "Schools on EduBeacon" },
            { icon: Briefcase, v: stats?.openJobs ?? null, l: "Open roles right now" },
            { icon: FileText, v: stats?.applications ?? null, l: "Applications received" },
          ].map(({ icon: Icon, v, l }, i) => (
            <div key={l} className={`flex flex-col items-center text-center gap-1.5 ${i ? "lg:border-l lg:border-slate-200" : ""}`}>
              <Icon className="w-5 h-5 text-[#0E733B]" />
              <span className="text-[36px] sm:text-[42px] font-bold leading-none text-[#0C2A1B] tabular-nums"><CountUp value={v} /></span>
              <span className="text-[13.5px] text-slate-600">{l}</span>
            </div>
          ))}
        </div>
      </section>

      <StorySlider />

      <div className="flex justify-center px-5 pb-12">
        <p className="rounded-full bg-slate-100 px-6 py-3 text-[17px] sm:text-[19px] font-semibold text-[#1B2A22] text-center">
          One platform. Every step. <span className="text-[#0E733B]">Better hires, <Hl color="#0E733B">faster.</Hl></span>
        </p>
      </div>

      {STAGES.map((s, i) => <StageSection key={s.tag} s={s} flip={i % 2 === 1} />)}

      {/* ═════════ vs other job boards ═════════ */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 py-20">
        <div className="flex justify-center mb-10">
          <p className="rounded-full bg-[#ECFDF5] px-6 py-3 text-[19px] sm:text-[22px] font-semibold text-[#1B2A22]">
            <Hl color="#0E733B">EduBeacon</Hl> vs Other Job Boards
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#0E733B]">Features</th>
                <th className="w-[200px] bg-[#0C2A1B] px-4 py-4 text-center text-[18px] font-bold text-white">edu<span className="text-[#8FE3B0]">Beacon</span></th>
                <th className="w-[200px] px-4 py-4 text-center text-[14px] font-semibold text-slate-600">Other Job Boards</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(({ icon: Icon, t, d, other }) => (
                <tr key={t} className="border-t border-slate-100">
                  <td className="px-6 py-4">
                    <div className="flex gap-3.5">
                      <span className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-[#0E733B]" /></span>
                      <span><span className="block text-[14.5px] font-semibold text-[#1B2A22]">{t}</span><span className="block text-[13px] text-slate-600">{d}</span></span>
                    </div>
                  </td>
                  <td className="bg-[#F3FAF6] text-center"><CheckCircle2 className="w-5 h-5 text-[#0E733B] mx-auto" /></td>
                  <td className="text-center"><XCircle className="w-5 h-5 text-slate-400 mx-auto" /><span className="block mt-1 text-[12px] text-slate-500">{other}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═════════ Pricing teaser ═════════ */}
      <section className="max-w-[1180px] mx-auto px-5 sm:px-8 pb-20">
        <div className="rounded-3xl bg-[#0C2A1B] text-white p-8 sm:p-12 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center relative overflow-hidden">
          <div aria-hidden className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#0E733B]/45 blur-3xl" />
          <div className="relative">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8FE3B0]">School plans</p>
            <h2 className="mt-3 text-[28px] sm:text-[34px] font-bold leading-tight">Pay once. Hire all year.</h2>
            <p className="mt-3 text-[15px] text-white/80 max-w-sm">Unlimited job posts, AI screening, pipeline and offer letters — on every plan.</p>
            <Link href="/recruitment/pricing?for=schools" className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#8FE3B0] hover:text-white">Compare plans <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="relative grid sm:grid-cols-3 gap-3">
            {[["1 Year", "₹11,000"], ["5 Years", "₹21,000"], ["Lifetime", "₹51,000"]].map(([n, p]) => {
              const best = n === "5 Years";
              return (
                <div key={n} className={`rounded-2xl p-5 ${best ? "bg-white text-[#0C2A1B]" : "bg-white/[0.06] ring-1 ring-white/15"}`}>
                  <p className={`text-[13px] font-semibold ${best ? "text-[#0E733B]" : "text-white/80"}`}>{n}{best && " · Best value"}</p>
                  <p className="mt-2 text-[26px] font-bold tabular-nums">{p}</p>
                  <p className={`text-[12px] ${best ? "text-slate-600" : "text-white/60"}`}>one-time</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="bg-[#F5F7F5] py-20">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8">
          <h2 className="text-center text-[28px] font-bold text-[#0C2A1B] mb-8">Questions schools ask</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-slate-200 px-5 py-4">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[15px] font-semibold text-[#1B2A22] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-[14px] leading-[1.7] text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ Final CTA ═════════ */}
      <section className="py-20 text-center px-5">
        <Building2 className="w-8 h-8 text-[#0E733B] mx-auto" />
        <h2 className="mt-4 text-[30px] sm:text-[40px] font-bold leading-tight text-[#0C2A1B] max-w-2xl mx-auto">Your next great teacher is one shortlist away.</h2>
        <p className="mt-3 text-[16px] text-slate-600">
          {stats ? `${stats.teachers.toLocaleString("en-IN")} teacher candidates are already on EduBeacon.` : "Teacher candidates are already on EduBeacon."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/recruitment/register" className="inline-flex items-center gap-2 rounded-full bg-[#0E733B] hover:bg-[#0B5C2F] px-7 py-3.5 text-[15px] font-semibold text-white">Start Hiring <ArrowRight className="w-4 h-4" /></Link>
          <Link href="/recruitment/teachers" className="inline-flex items-center gap-2 rounded-full border border-slate-300 hover:border-[#0E733B] px-7 py-3.5 text-[15px] font-semibold text-[#0C2A1B]">Browse candidates</Link>
        </div>
      </section>

      <RecruitmentFooter />
    </div>
  );
}
