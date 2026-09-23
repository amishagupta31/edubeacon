"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  Trophy,
  GraduationCap,
  Cpu,
  Handshake,
  Mic,
  ChevronDown,
  TrendingUp,
  HeartHandshake,
  Award,
  Landmark,
  Rocket,
  Download,
  Coffee,
  ImageIcon,
  Compass,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { useModal } from "@/components/modals/ModalProvider";
import GridPanels from "@/components/eduwecan/GridPanels";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/data";

// ── Event Facts (single source of truth for this page) ──
const EVENT = {
  presenter: "EduBeacon presents",
  name: "AI, NEP & the Future of Learning",
  suffix: "An EduBeacon Conference",
  tagline: "Connecting Schools with the Startups Shaping the Future of Education",
  date: "11th October 2026",
  time: "10:00 AM – 5:00 PM",
  venue: "Shivalik University, Dehradun",
  titleSponsor: "Shivalik University",
  goldPartners: ["Deep Connection / KiddiCove Therapy Center", "India Genius Olympiad"],
  mapQuery: "https://maps.google.com/maps?q=Shivalik+University,+Dehradun,+Uttarakhand&t=&z=13&ie=UTF8&iwloc=&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Shivalik+University+Dehradun",
};

const CONFERENCE_DATE = new Date("2026-10-11T10:00:00+05:30");

// ── Three Conference Conversations ──
const focusPillars = [
  {
    num: "01",
    icon: Cpu,
    title: "AI in Education & Future of Employment",
    desc: "How artificial intelligence is reshaping classrooms, assessment and the future of work.",
    points: ["AI in Education", "Future of Employment", "Digital Transformation", "Smart Classrooms", "Responsible AI", "Automated Assessment", "Emerging Technologies"],
    image: img.aiLab,
  },
  {
    num: "02",
    icon: GraduationCap,
    title: "NEP 2020 Implementation in Schools",
    desc: "Bringing NEP 2020 to life inside real classrooms and institutions.",
    points: ["Institutional Transformation", "Curriculum Evolution", "Institutional Governance", "School-Level Implementation", "New Teaching & Learning Approaches"],
    image: img.smartClassroom,
  },
  {
    num: "03",
    icon: HeartHandshake,
    title: "Holistic Child Development",
    desc: "Supporting the whole child — academically, emotionally and developmentally.",
    points: ["Culture & Wellbeing", "Developmental & Learning Issues", "Child Development Strategies", "Holistic Progress Card", "Active Learning Approaches"],
    image: img.leadersMeeting,
  },
];

// ── Conference Timeline (agenda, unified with panel / presentation / round table / award detail) ──
const agendaItems = [
  { time: "10:00 – 10:30 AM", type: "Networking", icon: Users, title: "Registration & Networking", detail: "Attendees arrive, register and meet education leaders, startups, educators and fellow participants." },
  { time: "10:30 – 10:45 AM", type: "Opening", icon: Mic, title: "Welcome Address by EduBeacon & Lighting of Lamp", detail: "Opening and welcome by EduBeacon, followed by the inauguration." },
  { time: "10:45 – 11:00 AM", type: "Address", icon: Landmark, title: "Address by Title Sponsor — Shivalik University" },
  { time: "11:00 – 11:15 AM", type: "Address", icon: Award, title: "Chief Guest Address — To Be Announced" },
  { time: "11:15 AM – 12:15 PM", type: "Panel Discussion 1", icon: Cpu, title: "Future of Education & Employment in the Era of AI", detail: "How should schools prepare children? Moderator & panelists — To Be Announced." },
  { time: "12:15 – 12:45 PM", type: "Presentation", icon: Landmark, title: "Featured Presentation — Shivalik University", detail: "A Center of Excellence for Education." },
  { time: "12:45 – 1:15 PM", type: "Presentation", icon: HeartHandshake, title: "Featured Presentation — Deep Connection / KiddiCove", detail: "Presented by Monika Sharma." },
  { time: "1:15 – 2:00 PM", type: "Networking", icon: Coffee, title: "Lunch & Networking", detail: "A relaxed opportunity to connect with school leaders, educators, startups, founders and institutional representatives." },
  { time: "2:00 – 2:30 PM", type: "Presentation", icon: Trophy, title: "Featured Presentation — India Genius Olympiad", detail: "Presented by Amit Sehgal." },
  { time: "2:30 – 3:30 PM", type: "Panel Discussion 2", icon: HeartHandshake, title: "Holistic Development", detail: "Role of the Holistic Progress Card & ICSE Active Program; developmental & learning issues in children and proactive solutions. Moderator & panelists — To Be Announced." },
  { time: "3:30 – 4:15 PM", type: "Round Table", icon: Handshake, title: "Sponsor Startups × Eligible Schools", detail: "Curated, closed-door sessions connecting startups directly with school decision-makers and educators. Topics — To Be Announced based on confirmed sponsors." },
  { time: "4:15 – 4:45 PM", type: "Awards", icon: Trophy, title: "Excellence in Education Awards Ceremony", detail: "Recognising excellence and innovation in education. Award categories — To Be Announced.", cta: true },
  { time: "4:45 – 5:00 PM", type: "Closing", icon: CheckCircle2, title: "Closing Remarks & Vote of Thanks" },
];

// ── Four Conference Tracks ──
const conferenceTracks = [
  { num: "01", title: "Education Leadership", icon: GraduationCap, desc: "Leadership, institutional transformation and the future of education.", topics: ["Institutional Governance", "Curriculum Evolution", "Culture & Wellbeing"] },
  { num: "02", title: "AI & Emerging Tech", icon: Cpu, desc: "AI, digital transformation, smart classrooms and emerging technologies.", topics: ["Responsible AI", "Automated Assessment", "Smart Campus Infrastructure"] },
  { num: "03", title: "EdTech & Innovation", icon: Sparkles, desc: "Startups, solution providers, product showcases and school–startup collaboration.", topics: ["Institutional Pilots", "Product Validation", "Scalable Classroom Technology"] },
  { num: "04", title: "Investment & Partnership", icon: TrendingUp, desc: "VC conversations, university partnerships, founders and institutional opportunities.", topics: ["VC × Higher Education", "Ecosystem Syndicates", "Commercial Scaling"] },
];

// ── Audience ──
const audiencePersonas = ["Principals", "School Directors & Leaders", "Teachers & Educators", "Heads of Departments", "Universities & Education Departments", "Boards", "Education Startups & EdTech Companies", "Founders", "Investors"];

const participationStats = [
  { value: 10, suffix: "+", label: "Startups" },
  { value: 10, suffix: "+", label: "Heads of Departments" },
  { value: 250, suffix: "+", label: "School Leaders / Participants" },
];

// ── Speakers & Distinguished Guests ──
const featuredSpeakers = [
  { name: "Mrs. Monika Sharma", role: "Founder, Deep Connection Innovation", featured: true },
  { name: "Mr. Ajay Kumar", role: "VC, Shivalik University Dehradun", featured: false },
  { name: "Mr. Raman Kaushal", role: "To Be Announced", featured: false },
  { name: "Mr. Manish Tyagi", role: "Tulas International School", featured: false },
  { name: "To Be Announced", role: "COE, CBSE", featured: false },
];

// ── Why Attend — regrouped from the conference's existing attendee benefits ──
const whyAttend = [
  { num: "01", verb: "Discover", icon: Compass, items: ["Discover education solutions", "Learn about classroom AI tools", "Understand emerging education technologies", "Learn about holistic child development"] },
  { num: "02", verb: "Connect", icon: Handshake, items: ["Connect with startups", "Meet other education leaders", "Meet school decision-makers", "Increase visibility within the education ecosystem"] },
  { num: "03", verb: "Explore", icon: Rocket, items: ["Explore partnerships", "Explore NEP-related implementation", "Explore new teaching approaches", "Explore institutional pilots"] },
  { num: "04", verb: "Collaborate", icon: Users, items: ["Discuss institutional transformation", "Participate in knowledge-sharing sessions", "Showcase products and solutions", "Participate in round tables", "Build education partnerships"] },
];

// ── FAQs ──
const faqs = [
  { q: "Who should attend?", a: "Principals, school directors and leaders, teachers and educators, heads of departments, university and education-department representatives, board members, EdTech founders, startups and investors." },
  { q: "Is registration free or paid?", a: "To Be Announced." },
  { q: "What is the venue?", a: "Shivalik University, Dehradun, Uttarakhand." },
  { q: "What is the event date?", a: "11th October 2026." },
  { q: "What time does the conference start?", a: "The conference runs from 10:00 AM to 5:00 PM." },
  { q: "Is group registration available?", a: "To Be Announced." },
  { q: "Is parking available?", a: "To Be Announced." },
  { q: "How can schools register?", a: "Click “Register as School / Educator” on this page and complete the registration form. Your email is verified with a one-time code before your registration is confirmed." },
  { q: "How can companies become sponsors?", a: "Click “Become a Sponsor” on this page, or write to us directly to discuss partnership opportunities." },
  { q: "How can I contact EduBeacon?", a: `Email ${siteConfig.email} or call ${siteConfig.phone}.` },
];

// ── Small helpers ──

function useCountdown(target: Date) {
  const [msLeft, setMsLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setMsLeft(target.getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (msLeft === null) return { ready: false, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const clamped = Math.max(msLeft, 0);
  return {
    ready: true,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped / 3_600_000) % 24),
    minutes: Math.floor((clamped / 60_000) % 60),
    seconds: Math.floor((clamped / 1_000) % 60),
  };
}

function useCountUp(end: number, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(end * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, durationMs]);

  return { value, ref };
}

function StatBlock({ value, suffix, label, tone = "dark" }: { value: number; suffix: string; label: string; tone?: "dark" | "light" }) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-2">
      <p className={`font-display font-extrabold text-[34px] sm:text-[42px] leading-none ${tone === "dark" ? "text-white" : "text-[#0E733B]"}`}>
        {animated}{suffix}
      </p>
      <p className={`text-[11.5px] sm:text-[12.5px] font-semibold mt-2 ${tone === "dark" ? "text-slate-300" : "text-slate-600"}`}>
        {label}
      </p>
    </div>
  );
}

/** Fills the vertical timeline rail proportionally to scroll position — a subtle "active" indicator. */
function useScrollFill<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progressPx = window.innerHeight * 0.55 - rect.top;
      const pct = Math.min(Math.max(progressPx / rect.height, 0), 1);
      setFill(pct * 100);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, fill };
}

export default function ConferencePage() {
  const { openModal } = useModal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown(CONFERENCE_DATE);
  const { ref: timelineRef, fill: timelineFill } = useScrollFill<HTMLDivElement>();

  return (
    <div className="bg-warm-ivory text-charcoal min-h-screen overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════════
          1. CINEMATIC HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0A1A10] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-60 scale-105">
            <source src="/videos/conferencepage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A10]/95 via-[#061A10]/75 to-[#061A10]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A10] via-transparent to-[#061A10]/50" />
        </div>

        <div className="relative z-10 flex-1 flex items-center py-20 md:py-28 text-center">
          <Container>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <span className="reveal text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-300/90 mb-6 block">
                {EVENT.presenter}
              </span>

              <h1 className="reveal reveal-delay-1 font-display font-bold text-[40px] sm:text-[60px] md:text-[76px] leading-[1.02] tracking-tight text-white mb-3">
                {EVENT.name}
              </h1>


              <p className="reveal reveal-delay-2 text-slate-200 text-[17px] sm:text-[19px] leading-relaxed mb-10 max-w-[46ch] font-normal">
                {EVENT.tagline}
              </p>

              <div className="reveal reveal-delay-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mb-10 text-[13.5px] text-slate-200 font-medium">
                <span className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Calendar className="w-4 h-4" /> {EVENT.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-300" /> {EVENT.time}
                </span>
                <a href={EVENT.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-300 transition-colors group">
                  <MapPin className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span>{EVENT.venue}</span>
                </a>
              </div>

              <div className="reveal reveal-delay-3 flex flex-wrap justify-center items-center gap-x-5 gap-y-1.5 mb-10 text-[11.5px] text-slate-400">
                <span><span className="font-bold uppercase tracking-wider text-slate-400">Title Sponsor</span> <span className="font-bold text-white ml-1.5">{EVENT.titleSponsor}</span></span>
                <span className="text-slate-600">|</span>
                <span><span className="font-bold uppercase tracking-wider text-slate-400">Gold Partners</span> <span className="text-slate-200 ml-1.5">{EVENT.goldPartners.join(" · ")}</span></span>
              </div>

              <div className="reveal reveal-delay-4 flex flex-wrap justify-center items-center gap-4">
                <button
                  onClick={() => openModal("school-register")}
                  className="px-7 py-4 rounded-full font-bold text-[13.5px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Register as School / Educator →
                </button>
                <button
                  onClick={() => openModal("vendor-register")}
                  className="px-7 py-4 rounded-full font-bold text-[13.5px] uppercase tracking-wider text-charcoal bg-white shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Become a Sponsor →
                </button>

              </div>

              {/* Countdown, integrated into the hero */}
              <div className="reveal reveal-delay-4 flex flex-col items-center gap-4 sm:gap-5 mt-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Counting Down To</span>
                <div className="flex justify-center items-center gap-3 sm:gap-4">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hrs" },
                    { value: countdown.minutes, label: "Min" },
                    { value: countdown.seconds, label: "Sec" },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
                      <div className="text-center">
                        <div className="w-14 sm:w-16 py-2.5 rounded-xl bg-white shadow-sm">
                          <span className="font-display font-extrabold text-[18px] sm:text-[22px] text-[#0E733B] tabular-nums">
                            {countdown.ready ? String(unit.value).padStart(2, "0") : "--"}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1.5 block">{unit.label}</span>
                      </div>
                      {i < 3 && <span className="text-slate-500 font-display text-lg -mt-3">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Stats integrated into the hero, not a separate strip */}
        <div className="relative z-10 border-t border-white/10">
          <Container>
            <div className="grid grid-cols-3 py-8">
              {participationStats.map((stat, i) => (
                <div key={stat.label} className={i < participationStats.length - 1 ? "border-r border-white/10" : ""}>
                  <StatBlock value={stat.value} suffix={stat.suffix} label={stat.label} tone="dark" />
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>



      {/* ════════════════════════════════════════════════════════════════
          2. ABOUT / STORY
      ════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-20 md:py-28 bg-white border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 reveal">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">About the Conference</span>
              <h2 className="font-display font-bold text-[34px] sm:text-[46px] md:text-[54px] text-charcoal leading-[1.05] tracking-tight mt-4 mb-6">
                Education is changing.
              </h2>
              <div className="space-y-5 text-slate-600 text-[16px] leading-relaxed max-w-[58ch]">
                <p>
                  This conference brings together school leaders, principals, educators and teachers with startups, founders, investors, education departments, universities, boards and heads of departments — everyone shaping the next chapter of Indian education.
                </p>
                <p>
                  Together, we connect schools with education-focused startups, create knowledge-sharing opportunities, explore AI and technology in education, and discuss how emerging technologies are reshaping the future of employment.
                </p>
                <p className="font-bold text-charcoal text-[17px]">
                  The goal is not only discussion — it&apos;s creating real opportunities for partnerships, institutional collaboration, product discovery, pilots and actionable outcomes.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 reveal reveal-delay-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/5]">
                <Image src={img.conferenceKeynote} alt="Education leadership conference" fill className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. THREE CONFERENCE CONVERSATIONS
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        {focusPillars.map((pillar, idx) => (
          <div key={pillar.num} className={`border-b border-line ${idx % 2 === 1 ? "bg-[#F8FAF8]" : "bg-white"}`}>
            <Container>
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-16 md:py-24 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="lg:col-span-7 reveal">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-display font-extrabold text-[56px] sm:text-[72px] leading-none text-[#0E733B]/15">
                      {pillar.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                      <pillar.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-[28px] sm:text-[38px] text-charcoal leading-tight mb-4 max-w-[22ch]">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 text-[16px] leading-relaxed max-w-[52ch] mb-6">
                    {pillar.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.points.map((p) => (
                      <span key={p} className="text-[11.5px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5 reveal reveal-delay-2 group">
                  <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[16/11]">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>
        ))}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. CONFERENCE TIMELINE / AGENDA
      ════════════════════════════════════════════════════════════════ */}
      <section id="timeline" className="py-20 md:py-28 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-16 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Conference Agenda</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4">
              A Day, Fully Mapped
            </h2>
            <p className="text-slate-500 text-[15px] mt-3">
              {EVENT.date} · {EVENT.time}. Subject to final speaker and session confirmation.
            </p>
          </div>

          <div ref={timelineRef} className="relative max-w-3xl mx-auto">
            {/* Rail: base + scroll-driven fill (active timeline indicator) */}
            <div className="absolute left-[27px] md:left-[31px] top-2 bottom-2 w-px bg-line" />
            <div
              className="absolute left-[27px] md:left-[31px] top-2 w-px bg-gradient-to-b from-[#0E733B] to-emerald-400 transition-[height] duration-150 ease-out"
              style={{ height: `${timelineFill}%` }}
            />

            <div className="space-y-10 md:space-y-12">
              {agendaItems.map((item, idx) => (
                <div key={idx} className={`relative flex gap-5 md:gap-7 reveal reveal-delay-${(idx % 4) + 1}`}>
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-full bg-white border-2 border-[#0E733B] text-[#0E733B] flex items-center justify-center shadow-xs">
                    <item.icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div className="pt-1.5 pb-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
                      <span className="font-display font-bold text-[14.5px] text-[#0E733B]">{item.time}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-[16px] md:text-[18px] text-charcoal mb-1">{item.title}</h4>
                    {item.detail && (
                      <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-xl">{item.detail}</p>
                    )}
                    {item.cta && (
                      <button
                        onClick={() => openModal("award-nominate")}
                        className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#0E733B] hover:underline"
                      >
                        Submit Nomination →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. FOUR CONFERENCE TRACKS
      ════════════════════════════════════════════════════════════════ */}
      <section id="tracks" className="py-20 md:py-28 bg-[#0A1A10] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-2xl mb-14 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">Four Conference Tracks</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-white leading-[1.05] tracking-tight mt-4">
              One Ecosystem. Four Conversations
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 reveal reveal-delay-2">
            {conferenceTracks.map((track) => (
              <div
                key={track.num}
                className="group relative flex-1 lg:hover:flex-[1.7] transition-[flex-grow] duration-500 ease-out bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/30 rounded-2xl p-7 lg:p-8 min-h-[280px] lg:min-h-[460px] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <span className="text-[12px] font-bold text-emerald-400/60 tracking-widest">TRACK {track.num}</span>
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-emerald-300 flex items-center justify-center my-4 group-hover:bg-[#0E733B] group-hover:text-white group-hover:border-transparent transition-colors">
                    <track.icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display font-bold text-[21px] lg:text-[24px] text-white mb-2.5 leading-tight">
                    {track.title}
                  </h3>
                  <p className="text-[13px] text-slate-300 leading-relaxed max-w-[28ch]">{track.desc}</p>
                </div>

                {/* Mobile / always-visible topics */}
                <div className="lg:hidden mt-6 space-y-2 pt-4 border-t border-white/10">
                  {track.topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[12px] font-medium text-emerald-200">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Desktop hover-reveal topics */}
                <div className="hidden lg:block mt-6 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    {track.topics.map((t) => (
                      <div key={t} className="flex items-center gap-2 text-[12px] font-medium text-emerald-200">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. WHO'S IN THE ROOM
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-10 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Who&apos;s in the Room</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4">
              Built for the Education Ecosystem
            </h2>
          </div>

          <p className="reveal reveal-delay-1 font-display text-[22px] sm:text-[30px] md:text-[34px] leading-[1.4] text-charcoal/80 max-w-4xl mb-16">
            {audiencePersonas.map((p, i) => (
              <span key={p}>
                <span className="font-semibold text-charcoal">{p}</span>
                {i < audiencePersonas.length - 1 && <span className="text-[#0E733B] mx-2.5">·</span>}
              </span>
            ))}
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mb-16 reveal reveal-delay-2">
            {participationStats.map((stat) => (
              <StatBlock key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} tone="light" />
            ))}
          </div>

          {/* Participating Schools — coming soon */}
          <div className="reveal reveal-delay-3 pt-10 border-t border-line">
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-slate-400 mb-4">
              Participating Schools — logos to appear here as confirmed
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-2xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-[#F8FAF8] border border-dashed border-line flex items-center justify-center text-slate-300">
                  <Building2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. SPEAKERS & DISTINGUISHED GUESTS
      ════════════════════════════════════════════════════════════════ */}
      <section id="speakers" className="py-20 md:py-28 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mb-14 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Speakers & Distinguished Guests</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4 mb-3">
              Voices Shaping This Conversation
            </h2>
            <p className="text-slate-500 text-[14.5px]">
              More speakers and marquee guests will be announced as they are confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Featured speaker, large */}
            <div className="lg:col-span-5 reveal">
              {featuredSpeakers.filter((s) => s.featured).map((sp) => (
                <div key={sp.name} className="p-8 sm:p-10 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0E733B] to-emerald-400 text-white font-display font-extrabold text-3xl flex items-center justify-center mb-6">
                    {sp.name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "").charAt(0)}
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E733B] block mb-2">Featured Speaker</span>
                  <h4 className="font-display font-bold text-[26px] text-charcoal mb-1.5">{sp.name}</h4>
                  <p className="text-[14.5px] text-slate-500">{sp.role}</p>
                </div>
              ))}

              <div className="mt-6 p-6 rounded-2xl bg-white/60 border border-dashed border-emerald-300 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 text-[#0E733B] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Chief Guest</span>
                  <h4 className="font-bold text-[15px] text-charcoal">To Be Announced</h4>
                </div>
              </div>
            </div>

            {/* Other confirmed guests — editorial list, not cards */}
            <div className="lg:col-span-7 reveal reveal-delay-2">
              <div className="divide-y divide-line border-t border-b border-line">
                {featuredSpeakers.filter((s) => !s.featured).map((sp) => (
                  <div key={sp.name} className="flex items-center gap-5 py-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-line text-[#0E733B] font-display font-bold text-lg flex items-center justify-center shrink-0">
                      {sp.name === "To Be Announced" ? "?" : sp.name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[16px] text-charcoal truncate">{sp.name}</h4>
                      <p className="text-[13px] text-slate-500 truncate">{sp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          8. WHY ATTEND
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-16 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Why Attend</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4">
              Something for Every Seat at the Table
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
            {whyAttend.map((item, idx) => (
              <div key={item.num} className={`flex gap-6 reveal reveal-delay-${(idx % 4) + 1}`}>
                <span className="font-display font-extrabold text-[48px] leading-none text-[#0E733B]/15 shrink-0">
                  {item.num}
                </span>
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <item.icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.8} />
                    <h3 className="font-display font-bold text-[22px] text-charcoal">{item.verb}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {item.items.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-[14px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0E733B] shrink-0 mt-1" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          9. VENUE
      ════════════════════════════════════════════════════════════════ */}
      <section id="venue" className="py-20 md:py-28 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mb-12 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Venue</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4">
              {EVENT.venue}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal reveal-delay-2">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0E733B] bg-emerald-100/60 px-3 py-1 rounded-md">
                <MapPin className="w-4 h-4" /> Dehradun, Uttarakhand
              </div>
              <div className="space-y-2 pt-1 text-[13px] text-slate-500">
                <p><strong className="text-slate-700">Parking:</strong> To Be Announced</p>
                <p><strong className="text-slate-700">Travel information:</strong> To Be Announced</p>
                <p><strong className="text-slate-700">Accommodation:</strong> To Be Announced</p>
              </div>
              <div className="pt-2">
                <a
                  href={EVENT.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md hover:scale-105 transition-all text-center"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions on Google Maps ↗
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-emerald-200/60 shadow-sm bg-white">
                <iframe
                  title="Shivalik University Dehradun Location Map"
                  src={EVENT.mapQuery}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          10. SCHOOL / SPONSOR CTA
      ════════════════════════════════════════════════════════════════ */}
      <section id="register" className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Schools & Educators */}
          <div className="relative p-10 sm:p-14 lg:p-20 border-b lg:border-b-0 lg:border-r border-line overflow-hidden reveal">
            <div className="absolute inset-0 opacity-[0.06]">
              <Image src={img.leadersMeeting} alt="" fill className="object-cover" />
            </div>
            <div className="relative z-10 max-w-md">
              <GraduationCap className="w-8 h-8 text-[#0E733B] mb-6" strokeWidth={1.6} />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">For Schools & Educators</span>
              <h3 className="font-display font-bold text-[28px] sm:text-[34px] text-charcoal leading-tight mt-3 mb-4">
                Bring Your School Into the Room
              </h3>
              <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
                Register as a principal, school leader, teacher or educator — discover education solutions, explore NEP-related implementation, and meet the people building the future of learning with you.
              </p>
              <button
                onClick={() => openModal("school-register")}
                className="px-8 py-4 rounded-full font-bold text-[13px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md hover:scale-105 transition-all duration-300"
              >
                Register as School / Educator →
              </button>
            </div>
          </div>

          {/* Sponsors */}
          <div className="relative p-10 sm:p-14 lg:p-20 overflow-hidden bg-[#0A1A10] reveal reveal-delay-2">
            <div className="absolute inset-0 opacity-[0.10]">
              <Image src={img.exhibitionFloor} alt="" fill className="object-cover" />
            </div>
            <div className="relative z-10 max-w-md">
              <Handshake className="w-8 h-8 text-emerald-300 mb-6" strokeWidth={1.6} />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">For Sponsors</span>
              <h3 className="font-display font-bold text-[28px] sm:text-[34px] text-white leading-tight mt-3 mb-4">
                Join Our Confirmed Partners
              </h3>
              <div className="mb-6 space-y-1.5 text-[13px] text-slate-300">
                <p><span className="font-bold text-white">Title Sponsor —</span> {EVENT.titleSponsor}</p>
                <p><span className="font-bold text-white">Gold Partners —</span> {EVENT.goldPartners.join(" · ")}</p>
              </div>
              <p className="text-slate-300 text-[15px] leading-relaxed mb-8">
                Meet school decision-makers, showcase your solutions, take part in curated round tables, and build lasting education partnerships.
              </p>
              <button
                onClick={() => openModal("vendor-register")}
                className="px-8 py-4 rounded-full font-bold text-[13px] uppercase tracking-wider text-charcoal bg-white hover:bg-emerald-50 shadow-md hover:scale-105 transition-all duration-300"
              >
                Become a Sponsor →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MOMENTS
      ════════════════════════════════════════════════════════════════ */}
      <GridPanels eyebrow="Past Conference Gallery" title="Our Previous Editions" />

      {/* ════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-14 reveal">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">Frequently Asked Questions</span>
            <h2 className="font-display font-bold text-[34px] sm:text-[48px] text-charcoal leading-[1.05] tracking-tight mt-4">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 reveal reveal-delay-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-line bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-5 py-4 font-bold text-sm text-charcoal flex items-center justify-between gap-4 hover:text-[#0E733B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>





    </div>
  );
}
