"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
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
  HeartHandshake,
  Award,
  Landmark,
  Rocket,
  Coffee,
  Compass,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { useModal } from "@/components/modals/ModalProvider";
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

// ── Three Conference Conversations (Focus Pillars, part of "About the Conference") ──
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
    desc: "Supporting the whole child, academically, emotionally and developmentally.",
    points: ["Culture & Wellbeing", "Developmental & Learning Issues", "Child Development Strategies", "Holistic Progress Card", "Active Learning Approaches"],
    image: img.leadersMeeting,
  },
];

// ── Conference Timeline (Agenda — also carries Panel Discussions / Featured Presentations / Round Tables / Awards detail inline) ──
const agendaItems = [
  { time: "10:00 – 10:30 AM", type: "Networking", icon: Users, title: "Registration & Networking", detail: "Attendees arrive, register and meet education leaders, startups, educators and fellow participants." },
  { time: "10:30 – 10:45 AM", type: "Opening", icon: Mic, title: "Welcome Address by EduBeacon & Lighting of Lamp", detail: "Opening and welcome by EduBeacon, followed by the inauguration." },
  { time: "10:45 – 11:00 AM", type: "Address", icon: Landmark, title: "Address by Title Sponsor, Shivalik University" },
  { time: "11:00 – 11:15 AM", type: "Address", icon: Award, title: "Chief Guest Address, To Be Announced" },
  { time: "11:15 AM – 12:15 PM", type: "Panel Discussion 1", icon: Cpu, title: "Future of Education & Employment in the Era of AI", detail: "How should schools prepare children? Moderator & panelists, To Be Announced." },
  { time: "12:15 – 12:45 PM", type: "Presentation", icon: Landmark, title: "Featured Presentation, Shivalik University", detail: "A Center of Excellence for Education." },
  { time: "12:45 – 1:15 PM", type: "Presentation", icon: HeartHandshake, title: "Featured Presentation, Deep Connection / KiddiCove", detail: "Presented by Monika Sharma." },
  { time: "1:15 – 2:00 PM", type: "Networking", icon: Coffee, title: "Lunch & Networking", detail: "A relaxed opportunity to connect with school leaders, educators, startups, founders and institutional representatives." },
  { time: "2:00 – 2:30 PM", type: "Presentation", icon: Trophy, title: "Featured Presentation, India Genius Olympiad", detail: "Presented by Amit Sehgal." },
  { time: "2:30 – 3:30 PM", type: "Panel Discussion 2", icon: HeartHandshake, title: "Holistic Development", detail: "Role of the Holistic Progress Card & ICSE Active Program; developmental & learning issues in children and proactive solutions. Moderator & panelists, To Be Announced." },
  { time: "3:30 – 4:15 PM", type: "Round Table", icon: Handshake, title: "Sponsor Startups × Eligible Schools", detail: "Curated, closed-door sessions connecting startups directly with school decision-makers and educators. Topics, To Be Announced based on confirmed sponsors." },
  { time: "4:15 – 4:45 PM", type: "Awards", icon: Trophy, title: "Excellence in Education Awards Ceremony", detail: "Recognising excellence and innovation in education. Award categories, To Be Announced.", cta: true },
  { time: "4:45 – 5:00 PM", type: "Closing", icon: CheckCircle2, title: "Closing Remarks & Vote of Thanks" },
];

// ── Audience, grouped into levels ──
const audienceLevels = [
  { num: "01", title: "School Leadership", people: ["Principals", "School Directors & Leaders", "Teachers & Educators", "Heads of Departments"] },
  { num: "02", title: "Institutional & Government", people: ["Universities & Education Departments", "Boards"] },
  { num: "03", title: "Industry & Innovation", people: ["Education Startups & EdTech Companies", "Founders", "Investors"] },
];

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

// ── Event Highlights / At a Glance ──
const eventHighlights = [
  { icon: Users, label: "250+ School Leaders / Participants" },
  { icon: Handshake, label: "10+ Startups" },
  { icon: Award, label: "10+ Heads of Departments" },
  { icon: Mic, label: "Panel Discussions" },
  { icon: Landmark, label: "Featured Presentations" },
  { icon: HeartHandshake, label: "Round Tables" },
  { icon: Trophy, label: "Awards Ceremony" },
];

// ── Panel Discussions (dedicated block — same two panels as in the Agenda) ──
const panelDiscussions = [
  {
    num: "01",
    icon: Cpu,
    title: "Future of Education & Employment in the Era of AI",
    subtitle: "How Should Schools Prepare Children",
    detail: "How should schools prepare children? Moderator & panelists, To Be Announced.",
  },
  {
    num: "02",
    icon: HeartHandshake,
    title: "Holistic Development",
    subtitle: "Role of the Holistic Progress Card & ICSE Active Program; Developmental & Learning Issues in Children and Proactive Solutions",
    detail: "Developmental & learning issues in children and proactive solutions. Moderator & panelists, To Be Announced.",
  },
];

// ── Featured Presentations (dedicated block — same three presentations as in the Agenda) ──
const featuredPresentationsList = [
  { icon: Landmark, org: "Shivalik University", detail: "A Center of Excellence for Education." },
  { icon: HeartHandshake, org: "Deep Connection / KiddiCove", detail: "Presented by Monika Sharma." },
  { icon: Trophy, org: "India Genius Olympiad", detail: "Presented by Amit Sehgal." },
];

// ── Round Tables (Sponsor–School Matchmaking) ──
const roundTables = [
  { num: "01", title: "Sponsor Startup × Eligible Schools", topic: "Topic, To Be Announced" },
  { num: "02", title: "Sponsor Startup × Eligible Schools", topic: "Topic, To Be Announced" },
];

// ── Excellence in Education Awards — proposed categories (placeholders, to be finalized) ──
const awardCategories = [
  "Best Innovation in Teaching",
  "Outstanding Principal",
  "Best NEP-Aligned School",
  "Excellence in Child Development Practices",
];

// ── FAQs ──
const faqs = [
  { q: "Who should attend?", a: "Principals, school directors and leaders, teachers and educators, heads of departments, university and education-department representatives, board members, EdTech founders, startups and investors" },
  { q: "Is registration free or paid?", a: "To Be Announced" },
  { q: "What is the venue?", a: "Shivalik University, Dehradun, Uttarakhand" },
  { q: "What is the event date?", a: "11th October 2026" },
  { q: "What time does the conference start?", a: "The conference runs from 10:00 AM to 5:00 PM" },
  { q: "Is group registration available?", a: "To Be Announced" },
  { q: "Is parking available?", a: "To Be Announced" },
  { q: "How can schools register?", a: "Click “Register as School / Educator” on this page and complete the registration form. Your email is verified with a one-time code before your registration is confirmed" },
  { q: "How can companies become sponsors?", a: "Click “Become a Sponsor” on this page, or write to us directly to discuss partnership opportunities" },
  { q: "How can I contact EduBeacon?", a: `Email ${siteConfig.email} or call ${siteConfig.phone}` },
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
      <p className={`font-display font-extrabold text-[30px] sm:text-[38px] leading-none ${tone === "dark" ? "text-white" : "text-[#0E733B]"}`}>
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
          1. HERO BANNER
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0A1A10] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-60 scale-105">
            <source src="/videos/conferencepage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A10]/95 via-[#061A10]/75 to-[#061A10]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A10] via-transparent to-[#061A10]/50" />
        </div>

        <div className="relative z-10 flex-1 flex items-center py-16 md:py-20 text-center">
          <Container>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <h1 className="reveal reveal-delay-1 font-display font-bold text-[36px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-tight text-white mb-3">
                {EVENT.name}
              </h1>

              <p className="reveal reveal-delay-2 text-slate-200 text-[15px] sm:text-[17px] lg:text-[18px] leading-relaxed mb-8 max-w-[46ch] lg:max-w-none lg:whitespace-nowrap font-normal">
                {EVENT.tagline}
              </p>

              <div className="reveal reveal-delay-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mb-8 text-[13.5px] text-slate-200 font-medium">
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

              <div className="reveal reveal-delay-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-8 text-[11.5px] text-slate-400">
                <span><span className="font-bold uppercase tracking-wider text-slate-400">Title Sponsor</span> <span className="font-bold text-white ml-1.5">{EVENT.titleSponsor}</span></span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold uppercase tracking-wider text-slate-400">Gold Partners</span>
                  <div className="flex items-center gap-2.5">
                    <Image src="/images/sponsors/deep-connection.png" alt="Deep Connection" width={334} height={158} className="h-7 w-auto rounded-md" />
                    <span className="text-slate-500">/</span>
                    <Image src="/images/sponsors/kiddicove.png" alt="KiddiCove Therapy Center by Deep Connection" width={239} height={77} className="h-6 w-auto rounded-md bg-white px-1 py-0.5" />
                    <Image src="/images/sponsors/india-genius-foundation.png" alt="India Genius Foundation" width={233} height={225} className="h-8 w-auto rounded-full" />
                  </div>
                </div>
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
              <div className="reveal reveal-delay-4 flex flex-col items-center gap-4 sm:gap-5 mt-8">
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
            <div className="grid grid-cols-3 py-6">
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
          2. ABOUT THE CONFERENCE
      ════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 reveal">
              <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight mb-5">
                Education is changing
              </h2>
              <div className="space-y-4 text-slate-600 text-[15.5px] leading-relaxed max-w-[58ch]">
                <p>
                  This conference brings together school leaders, principals, educators and teachers with startups, founders, investors, education departments, universities, boards and heads of departments, everyone shaping the next chapter of Indian education.
                </p>
                <p>
                  Together, we connect schools with education-focused startups, create knowledge-sharing opportunities, explore AI and technology in education, and discuss how emerging technologies are reshaping the future of employment.
                </p>
                <p className="font-bold text-charcoal text-[16.5px]">
                  The goal is not only discussion, it&apos;s creating real opportunities for partnerships, institutional collaboration, product discovery, pilots and actionable outcomes.
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
          2b. THREE CONFERENCE CONVERSATIONS (Focus Pillars, part of About)
      ════════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        {focusPillars.map((pillar, idx) => (
          <div key={pillar.num} className={`border-b border-line ${idx % 2 === 1 ? "bg-[#F8FAF8]" : "bg-white"}`}>
            <Container>
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-14 md:py-20 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="lg:col-span-7 reveal">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display font-extrabold text-[48px] sm:text-[60px] leading-none text-[#0E733B]/15">
                      {pillar.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                      <pillar.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-[24px] sm:text-[32px] text-charcoal leading-tight mb-3 max-w-[22ch]">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed max-w-[52ch] mb-5">
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
          3. WHY ATTEND
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-12 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
              Something for Every Seat at the Table
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {whyAttend.map((item, idx) => (
              <div key={item.num} className={`flex gap-6 reveal reveal-delay-${(idx % 4) + 1}`}>
                <span className="font-display font-extrabold text-[42px] leading-none text-[#0E733B]/15 shrink-0">
                  {item.num}
                </span>
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <item.icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.8} />
                    <h3 className="font-display font-bold text-[20px] text-charcoal">{item.verb}</h3>
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
          4. EVENT HIGHLIGHTS / AT A GLANCE
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-12 md:py-14 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 reveal">
            {eventHighlights.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 text-[#0E733B] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="text-[13.5px] font-bold text-charcoal whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. AGENDA / SCHEDULE
          (also carries Panel Discussions / Featured Presentations /
          Round Tables / Awards detail inline, per item below)
      ════════════════════════════════════════════════════════════════ */}
      <section id="timeline" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-12 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
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

            <div className="space-y-8 md:space-y-10">
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
          6. SPEAKERS & DISTINGUISHED GUESTS
      ════════════════════════════════════════════════════════════════ */}
      <section id="speakers" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mb-10 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight mb-3">
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
                  <h4 className="font-display font-bold text-[24px] text-charcoal mb-1.5">{sp.name}</h4>
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
          7. PANEL DISCUSSIONS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-12 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
              Conversations That Matter
            </h2>
          </div>

          <div className="space-y-12">
            {panelDiscussions.map((panel, idx) => (
              <div
                key={panel.num}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-14 reveal reveal-delay-${idx + 1} ${idx < panelDiscussions.length - 1 ? "pb-12 border-b border-line" : ""}`}
              >
                <div className="lg:w-[45%] shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display font-extrabold text-[38px] leading-none text-[#0E733B]/15">{panel.num}</span>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                      <panel.icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-[21px] sm:text-[24px] text-charcoal leading-tight mb-2">{panel.title}</h3>
                  <p className="text-[14px] font-semibold text-emerald-800 mb-3">{panel.subtitle}</p>
                  <p className="text-slate-600 text-[14.5px] leading-relaxed">{panel.detail}</p>
                </div>

                <div className="lg:flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Moderator & Panelists, To Be Announced</p>
                  <div className="grid grid-cols-4 gap-3 max-w-md">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-[#F8FAF8] border border-dashed border-line flex items-center justify-center text-slate-300 font-display font-bold text-lg">
                        ?
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
          8. FEATURED PRESENTATIONS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mb-10 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
              From Our Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal reveal-delay-2">
            {featuredPresentationsList.map((fp) => (
              <div key={fp.org} className="p-7 rounded-2xl bg-white border border-line">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-5">
                  <fp.icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h4 className="font-display font-bold text-[18px] text-charcoal mb-2">{fp.org}</h4>
                <p className="text-[14px] text-slate-500 leading-relaxed">{fp.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          9. ROUND TABLES (SPONSOR–SCHOOL MATCHMAKING)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="mb-4 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight mb-4 lg:whitespace-nowrap">
              Sponsor–School Matchmaking
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed max-w-2xl">
              Curated, closed-door sessions connecting startups directly with school decision-makers and educators. Topics, To Be Announced based on confirmed sponsors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 reveal reveal-delay-2 max-w-3xl">
            {roundTables.map((rt) => (
              <div key={rt.num} className="p-7 rounded-2xl border border-line bg-[#F8FAF8]">
                <span className="font-display font-extrabold text-[32px] leading-none text-[#0E733B]/15">{rt.num}</span>
                <h4 className="font-bold text-[17px] text-charcoal mt-3 mb-1.5">Round Table {Number(rt.num)}</h4>
                <p className="text-[14px] text-slate-600 mb-1">{rt.title}</p>
                <p className="text-[12.5px] text-slate-400 font-semibold">{rt.topic}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          10. EXCELLENCE IN EDUCATION AWARDS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#0A1A10] text-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-8 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-white leading-[1.1] tracking-tight mb-4">
              Recognising Excellence & Innovation
            </h2>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              Recognising excellence and innovation in education. Final award categories are To Be Announced, proposed categories below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-8 reveal reveal-delay-2">
            {awardCategories.map((cat) => (
              <span key={cat} className="text-[12.5px] font-semibold text-emerald-200 bg-white/[0.06] border border-white/10 px-4 py-2 rounded-full">
                {cat}
              </span>
            ))}
          </div>

          <button
            onClick={() => openModal("award-nominate")}
            className="reveal reveal-delay-3 inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[13px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md hover:scale-105 transition-all duration-300"
          >
            Submit Nomination →
          </button>
        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          11. PARTICIPATING SCHOOLS ("Who's in the Room")
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mb-8 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
              Built for the Education Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mb-12">
            {audienceLevels.map((level, idx) => (
              <div key={level.num} className={`reveal reveal-delay-${idx + 1}`}>
                <span className="font-display font-extrabold text-[36px] leading-none text-[#0E733B]/15 block mb-2">
                  {level.num}
                </span>
                <h3 className="font-display font-bold text-[18px] text-charcoal mb-2">{level.title}</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  {level.people.join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12 reveal reveal-delay-2">
            {participationStats.map((stat) => (
              <StatBlock key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} tone="light" />
            ))}
          </div>

          {/* Participating Schools — coming soon */}
          <div className="reveal reveal-delay-3 pt-8 border-t border-line">
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-slate-400 mb-4">
              Participating Schools, logos to appear here as confirmed
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
          13. VENUE & TRAVEL INFO
      ════════════════════════════════════════════════════════════════ */}
      <section id="venue" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mb-10 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
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
          12 + 14. OUR PARTNERS & SPONSORS + REGISTRATION
      ════════════════════════════════════════════════════════════════ */}
      <section id="register" className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Schools & Educators */}
          <div className="relative p-10 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-line overflow-hidden reveal">
            <div className="absolute inset-0 opacity-[0.06]">
              <Image src={img.leadersMeeting} alt="" fill className="object-cover" />
            </div>
            <div className="relative z-10 max-w-md">
              <GraduationCap className="w-8 h-8 text-[#0E733B] mb-5" strokeWidth={1.6} />
              <h3 className="font-display font-bold text-[24px] sm:text-[28px] text-charcoal leading-tight mb-3">
                Bring Your School Into the Room
              </h3>
              <p className="text-slate-600 text-[15px] leading-relaxed mb-7">
                Register as a principal, school leader, teacher or educator, discover education solutions, explore NEP-related implementation, and meet the people building the future of learning with you.
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
          <div className="relative p-10 sm:p-12 lg:p-16 overflow-hidden bg-[#0A1A10] reveal reveal-delay-2">
            <div className="absolute inset-0 opacity-[0.10]">
              <Image src={img.exhibitionFloor} alt="" fill className="object-cover" />
            </div>
            <div className="relative z-10 max-w-md">
              <Handshake className="w-8 h-8 text-emerald-300 mb-5" strokeWidth={1.6} />
              <h3 className="font-display font-bold text-[24px] sm:text-[28px] text-white leading-tight mb-3">
                Join Our Confirmed Partners
              </h3>
              <div className="mb-5 space-y-1.5 text-[13px] text-slate-300">
                <p><span className="font-bold text-white">Title Sponsor,</span> {EVENT.titleSponsor}</p>
                <p><span className="font-bold text-white">Gold Partners,</span> {EVENT.goldPartners.join(" · ")}</p>
              </div>
              <p className="text-slate-300 text-[15px] leading-relaxed mb-7">
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
          15. FAQ
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-10 reveal">
            <h2 className="font-display font-bold text-[30px] sm:text-[40px] text-charcoal leading-[1.1] tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 reveal reveal-delay-2 items-start">
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
