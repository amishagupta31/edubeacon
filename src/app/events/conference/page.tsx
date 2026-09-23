"use client";

import { useState } from "react";
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
  BookOpen,
  Briefcase,
  TrendingUp,
  HeartHandshake,
  Award,
  Landmark,
  Rocket,
  Download,
  Coffee,
  ImageIcon,
  Newspaper,
  Sparkle,
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

// ── 3 Focus Pillars ──
const focusPillars = [
  {
    icon: Cpu,
    title: "AI in Education & Future of Employment",
    desc: "How artificial intelligence is reshaping classrooms, assessment and the future of work.",
    points: ["AI in Education", "Future of Employment", "Digital Transformation", "Smart Classrooms", "Responsible AI", "Automated Assessment", "Emerging Technologies"],
  },
  {
    icon: GraduationCap,
    title: "NEP 2020 Implementation in Schools",
    desc: "Bringing NEP 2020 to life inside real classrooms and institutions.",
    points: ["Institutional Transformation", "Curriculum Evolution", "Institutional Governance", "School-Level Implementation", "New Teaching & Learning Approaches"],
  },
  {
    icon: HeartHandshake,
    title: "Holistic Child Development",
    desc: "Supporting the whole child — academically, emotionally and developmentally.",
    points: ["Culture & Wellbeing", "Developmental & Learning Issues", "Child Development Strategies", "Holistic Progress Card", "Active Learning Approaches"],
  },
];

// ── What's Happening — Conference Journey (no fixed times; see Agenda for the schedule) ──
const journeyMoments = [
  { icon: Users, title: "Registration & Networking", desc: "Attendees arrive, register and meet education leaders, startups, educators and fellow participants." },
  { icon: Mic, title: "Welcome Address", desc: "Opening and welcome by EduBeacon, followed by the inauguration." },
  { icon: Landmark, title: "Leadership & Education Discussions", desc: "Education leaders discuss institutional transformation, curriculum, governance and the future of education." },
  { icon: Cpu, title: "Panel Discussion 1", desc: "Future of Education & Employment in the Era of AI — how should schools prepare children." },
  { icon: Building2, title: "Featured Presentations", desc: "Shivalik University, Deep Connection / KiddiCove and India Genius Olympiad share their work." },
  { icon: Coffee, title: "Lunch & Networking", desc: "A relaxed opportunity to connect with school leaders, educators, startups, founders and institutional representatives." },
  { icon: HeartHandshake, title: "Panel Discussion 2", desc: "Holistic Development — the Holistic Progress Card, the ICSE Active Program, and proactive solutions for developmental and learning issues." },
  { icon: Handshake, title: "Round Tables", desc: "Closed-door sponsor–school matchmaking, connecting startups directly with eligible schools and decision-making educators." },
  { icon: Trophy, title: "Excellence in Education Awards", desc: "Recognising excellence and innovation across the education ecosystem." },
  { icon: CheckCircle2, title: "Closing & Vote of Thanks", desc: "Final remarks and acknowledgements to close the conference." },
];

// ── 4 Conference Tracks ──
const conferenceTracks = [
  { num: "01", title: "Education Leadership", icon: GraduationCap, desc: "Leadership, institutional transformation and the future of education.", topics: ["Institutional Governance", "Curriculum Evolution", "Culture & Wellbeing"] },
  { num: "02", title: "AI & Emerging Tech", icon: Cpu, desc: "AI, digital transformation, smart classrooms and emerging technologies.", topics: ["Responsible AI", "Automated Assessment", "Smart Campus Infrastructure"] },
  { num: "03", title: "EdTech & Innovation", icon: Sparkles, desc: "Startups, solution providers, product showcases and school–startup collaboration.", topics: ["Institutional Pilots", "Product Validation", "Scalable Classroom Technology"] },
  { num: "04", title: "Investment & Partnership", icon: TrendingUp, desc: "VC conversations, university partnerships, founders and institutional opportunities.", topics: ["VC × Higher Education", "Ecosystem Syndicates", "Commercial Scaling"] },
];

// ── Audience ──
const audiencePersonas = [
  { icon: GraduationCap, label: "Principals" },
  { icon: Building2, label: "School Directors & Leaders" },
  { icon: BookOpen, label: "Teachers & Educators" },
  { icon: Briefcase, label: "Heads of Departments" },
  { icon: Landmark, label: "Universities & Education Departments" },
  { icon: Users, label: "Boards" },
  { icon: Rocket, label: "Education Startups & EdTech Companies" },
  { icon: Sparkle, label: "Founders" },
  { icon: TrendingUp, label: "Investors" },
];

const participationStats = [
  { value: "10+", label: "Startups" },
  { value: "10+", label: "Heads of Departments" },
  { value: "250+", label: "School Leaders / Participants" },
];

// ── Speakers & Distinguished Guests ──
const featuredSpeakers = [
  { name: "Mrs. Monika Sharma", role: "Founder, Deep Connection Innovation", featured: true },
  { name: "Mr. Ajay Kumar", role: "VC, Shivalik University Dehradun", featured: false },
  { name: "Mr. Raman Kaushal", role: "To Be Announced", featured: false },
  { name: "Mr. Manish Tyagi", role: "Tulas International School", featured: false },
  { name: "To Be Announced", role: "COE, CBSE", featured: false },
];

// ── Conference Agenda (single day) ──
const agendaItems = [
  { time: "10:00 – 10:30 AM", type: "NETWORKING", title: "Registration & Networking" },
  { time: "10:30 – 10:45 AM", type: "OPENING", title: "Welcome Address by EduBeacon & Lighting of Lamp" },
  { time: "10:45 – 11:00 AM", type: "ADDRESS", title: "Address by Title Sponsor — Shivalik University" },
  { time: "11:00 – 11:15 AM", type: "ADDRESS", title: "Chief Guest Address — To Be Announced" },
  { time: "11:15 AM – 12:15 PM", type: "PANEL", title: "Panel Discussion 1 — Future of Education & Employment in the Era of AI" },
  { time: "12:15 – 12:45 PM", type: "PRESENTATION", title: "Featured Presentation — Shivalik University: A Center of Excellence" },
  { time: "12:45 – 1:15 PM", type: "PRESENTATION", title: "Featured Presentation — Deep Connection / KiddiCove — Monika Sharma" },
  { time: "1:15 – 2:00 PM", type: "NETWORKING", title: "Lunch & Networking" },
  { time: "2:00 – 2:30 PM", type: "PRESENTATION", title: "Featured Presentation — India Genius Olympiad — Amit Sehgal" },
  { time: "2:30 – 3:30 PM", type: "PANEL", title: "Panel Discussion 2 — Holistic Development, Progress Cards & Learning Issues" },
  { time: "3:30 – 4:15 PM", type: "ROUND TABLE", title: "Round Tables — Sponsor Startups × Eligible Schools" },
  { time: "4:15 – 4:45 PM", type: "AWARDS", title: "Excellence in Education Awards Ceremony" },
  { time: "4:45 – 5:00 PM", type: "CLOSING", title: "Closing Remarks & Vote of Thanks" },
];

// ── Why Attend ──
const whyPrincipals = ["Discover education solutions", "Connect with startups", "Explore partnerships", "Discuss institutional transformation", "Explore NEP-related implementation", "Meet other education leaders"];
const whyTeachers = ["Learn about classroom AI tools", "Explore new teaching approaches", "Understand emerging education technologies", "Learn about holistic child development", "Participate in knowledge-sharing sessions"];
const whyStartups = ["Meet school decision-makers", "Showcase products and solutions", "Explore institutional pilots", "Participate in round tables", "Build education partnerships", "Increase visibility within the education ecosystem"];

// ── Panel Discussions ──
const panels = [
  {
    num: "01",
    title: "Future of Education & Employment in the Era of AI",
    subtitle: "How Should Schools Prepare Children",
    moderator: "To Be Announced",
    panelists: "To Be Announced",
  },
  {
    num: "02",
    title: "Holistic Development",
    subtitle: "Role of the Holistic Progress Card & ICSE Active Program; Developmental & Learning Issues in Children and Proactive Solutions",
    moderator: "To Be Announced",
    panelists: "To Be Announced",
  },
];

// ── Featured Presentations ──
const featuredPresentations = [
  { icon: Landmark, title: "Shivalik University", subtitle: "A Center of Excellence for Education" },
  { icon: HeartHandshake, title: "Deep Connection / KiddiCove", subtitle: "Presented by Monika Sharma" },
  { icon: Trophy, title: "India Genius Olympiad", subtitle: "Presented by Amit Sehgal" },
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

export default function ConferencePage() {
  const { openModal } = useModal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#F8FAF8] text-charcoal min-h-screen">

      {/* ════════════════════════════════════════════════════════════════
          UPCOMING CONFERENCE
      ════════════════════════════════════════════════════════════════ */}

      {/* ──────────────── 1. HERO ──────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-[#0A1A10] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-70 scale-105 filter brightness-105 contrast-105">
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A10]/92 via-[#061A10]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A10] via-transparent to-[#061A10]/40" />
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 my-auto py-16 md:py-24">
          <Container>
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300 mb-3 block">
                {EVENT.presenter}
              </span>

              <h1 className="font-extrabold font-display text-[32px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-tight text-white mb-2">
                {EVENT.name}
              </h1>
              <p className="text-emerald-300 font-bold text-[15px] sm:text-[17px] mb-5">
                — {EVENT.suffix}
              </p>

              <p className="text-slate-200 text-[16px] sm:text-[18px] leading-relaxed mb-8 max-w-[52ch] font-normal drop-shadow-sm">
                {EVENT.tagline}
              </p>

              {/* Date, Time, Venue */}
              <div className="inline-flex flex-wrap items-center gap-4 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3.5 mb-5 text-xs text-slate-200 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Calendar className="w-4 h-4" /> {EVENT.date}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1.5 text-slate-100">
                  <Clock className="w-4 h-4 text-emerald-300" /> {EVENT.time}
                </span>
                <span className="text-slate-400">•</span>
                <a href={EVENT.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-100 hover:text-emerald-300 transition-colors group">
                  <MapPin className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span>{EVENT.venue}</span>
                </a>
              </div>

              {/* Title Sponsor & Gold Partners strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-[11px] text-slate-300">
                <span className="font-bold uppercase tracking-wider text-slate-400">Title Sponsor:</span>
                <span className="font-bold text-white">{EVENT.titleSponsor}</span>
                <span className="text-slate-500">|</span>
                <span className="font-bold uppercase tracking-wider text-slate-400">Gold Partners:</span>
                <span className="text-slate-200">{EVENT.goldPartners.join(" · ")}</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
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
                <button
                  onClick={() => openModal("interest", { vendorName: "Conference Brochure" })}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[13.5px] uppercase tracking-wider text-slate-100 bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Brochure
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Participation Stats Strip */}
        <div className="relative z-10 w-full border-t border-white/10 bg-[#061A10]/90 backdrop-blur-xl py-6">
          <Container>
            <div className="grid grid-cols-3 gap-6">
              {participationStats.map((stat, i) => (
                <div key={stat.label} className={`text-center px-4 ${i < participationStats.length - 1 ? "md:border-r md:border-white/10" : ""}`}>
                  <p className="font-extrabold text-[28px] sm:text-[36px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] text-slate-300 font-semibold mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* Ribbon */}
      <div className="bg-gradient-to-r from-[#061A10] via-[#0E733B] to-[#061A10] text-white py-3.5 text-center text-[11px] sm:text-sm font-bold uppercase tracking-widest shadow-inner border-y border-emerald-500/30 px-4">
        EduBeacon Education Leadership Conference • {EVENT.date} • {EVENT.venue}
      </div>

      {/* ──────────────── 2. ABOUT THE CONFERENCE ──────────────── */}
      <section id="about" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
                <span>ABOUT THE CONFERENCE</span>
              </div>
              <h2 className="font-bold font-display text-[30px] md:text-[40px] text-charcoal leading-[1.15] tracking-tight mb-5">
                Bringing the Education Ecosystem Into One Room
              </h2>
              <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                <p>
                  This conference brings together school leaders, principals, educators and teachers with startups, founders, investors, education departments, universities, boards and heads of departments — everyone shaping the next chapter of Indian education.
                </p>
                <p>
                  Together, we connect schools with education-focused startups, create knowledge-sharing opportunities, explore AI and technology in education, and discuss how emerging technologies are reshaping the future of employment.
                </p>
                <p className="font-bold text-charcoal">
                  The goal is not only discussion — it&apos;s creating real opportunities for partnerships, institutional collaboration, product discovery, pilots and actionable outcomes.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-line shadow-sm aspect-[4/3]">
                <Image src={img.conferenceKeynote} alt="Education leadership conference" fill className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 3. THREE FOCUS PILLARS ──────────────── */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FOCUS AREAS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Three Conversations at the Heart of This Conference
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {focusPillars.map((pillar) => (
              <div key={pillar.title} className="group p-7 rounded-3xl bg-white border border-line hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center group-hover:bg-[#0E733B] group-hover:text-white transition-colors mb-4">
                    <pillar.icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold font-display text-[19px] text-charcoal mb-2 group-hover:text-[#0E733B] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-5">
                    {pillar.desc}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-1.5">
                  {pillar.points.map((p) => (
                    <span key={p} className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 4. WHAT'S HAPPENING AT THE CONFERENCE ──────────────── */}
      <section id="journey" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              THE CONFERENCE JOURNEY
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              What&apos;s Happening at the Conference
            </h2>
            <p className="text-slate-500 text-[14.5px]">
              From welcome to closing — see the full timed schedule in the Agenda section below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {journeyMoments.map((moment, idx) => (
              <div key={moment.title} className="p-5 rounded-2xl bg-[#F8FAF8] border border-line hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                    <moment.icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-black text-slate-300">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="font-bold text-[13.5px] text-charcoal mb-1">{moment.title}</h4>
                <p className="text-[11.5px] text-slate-500 leading-snug">{moment.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 5. FOUR CONFERENCE TRACKS ──────────────── */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FOUR CONFERENCE TRACKS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              One Ecosystem. Four Conversations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conferenceTracks.map((track) => (
              <div key={track.num} className="group p-7 rounded-3xl bg-white border border-line hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center group-hover:bg-[#0E733B] group-hover:text-white transition-colors">
                      <track.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-emerald-600 transition-colors">TRACK {track.num}</span>
                  </div>
                  <h3 className="font-bold text-[17px] text-charcoal mb-2 group-hover:text-[#0E733B] transition-colors">{track.title}</h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed mb-5">{track.desc}</p>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  {track.topics.map((t) => (
                    <div key={t} className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 6. CONFERENCE AUDIENCE ──────────────── */}
      <section id="audience" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              WHO&apos;S IN THE ROOM
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Built for the Education Ecosystem
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {audiencePersonas.map((p) => (
              <div key={p.label} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8FAF8] border border-line text-[13px] font-semibold text-slate-700 hover:border-emerald-300 transition-colors">
                <p.icon className="w-4 h-4 text-[#0E733B]" strokeWidth={1.8} />
                <span>{p.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {participationStats.map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <p className="font-extrabold text-[26px] sm:text-[32px] text-[#0E733B] leading-none">{stat.value}</p>
                <p className="text-[11px] sm:text-[12px] text-slate-600 font-semibold mt-1.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 7. WHY ATTEND ──────────────── */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              WHY ATTEND
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Something for Every Seat at the Table
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "For Principals & School Leaders", icon: GraduationCap, items: whyPrincipals, cta: "Register as School / Educator", modal: "school-register" as const },
              { title: "For Teachers & Educators", icon: BookOpen, items: whyTeachers, cta: "Register as School / Educator", modal: "school-register" as const },
              { title: "For Startups & Sponsors", icon: Rocket, items: whyStartups, cta: "Become a Sponsor", modal: "vendor-register" as const },
            ].map((card) => (
              <div key={card.title} className="p-7 rounded-3xl bg-white border border-line shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-4">
                    <card.icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold text-[16.5px] text-charcoal mb-3">{card.title}</h3>
                  <ul className="space-y-2 mb-6 text-[13px] text-slate-600">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0E733B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => openModal(card.modal)}
                  className="w-full text-center py-3 rounded-full font-bold text-[12px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-sm transition-colors"
                >
                  {card.cta} →
                </button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 8. SPEAKERS & DISTINGUISHED GUESTS ──────────────── */}
      <section id="speakers" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              SPEAKERS & DISTINGUISHED GUESTS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Voices Shaping This Conversation
            </h2>
            <p className="text-slate-500 text-[14px]">
              More speakers and marquee guests will be announced as they are confirmed.
            </p>
          </div>

          {/* Chief Guest */}
          <div className="mb-8 p-6 rounded-2xl bg-emerald-50/50 border border-dashed border-emerald-300 flex items-center gap-4 max-w-xl">
            <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 text-[#0E733B] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Chief Guest</span>
              <h4 className="font-bold text-[16px] text-charcoal">To Be Announced</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpeakers.map((sp) => (
              <div
                key={sp.name}
                className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                  sp.featured
                    ? "bg-emerald-50/60 border-emerald-200 shadow-sm"
                    : "bg-[#F8FAF8] border-line hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0E733B] to-emerald-400 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                  {sp.name === "To Be Announced" ? "?" : sp.name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "").charAt(0)}
                </div>
                <div className="min-w-0">
                  {sp.featured && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#0E733B] block mb-0.5">Featured Speaker</span>
                  )}
                  <h4 className="font-bold text-[15px] text-charcoal truncate">{sp.name}</h4>
                  <p className="text-[12px] text-slate-500 truncate">{sp.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 9. PANEL DISCUSSIONS ──────────────── */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              PANEL DISCUSSIONS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Conversations That Matter
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {panels.map((panel) => (
              <div key={panel.num} className="p-7 rounded-3xl bg-white border border-line shadow-xs hover:shadow-lg hover:border-emerald-200 transition-all">
                <span className="text-[28px] font-black font-display text-[#0E733B]/30 block mb-2">PANEL {panel.num}</span>
                <h3 className="font-bold font-display text-[19px] text-charcoal mb-1.5">{panel.title}</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed mb-5">{panel.subtitle}</p>
                <div className="border-t border-gray-100 pt-4 space-y-1.5 text-[12.5px] text-slate-500">
                  <p><strong className="text-charcoal">Moderator:</strong> {panel.moderator}</p>
                  <p><strong className="text-charcoal">Panelists:</strong> {panel.panelists}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 10. FEATURED PRESENTATIONS ──────────────── */}
      <section className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FEATURED PRESENTATIONS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Ideas Worth Your Full Attention
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPresentations.map((pres) => (
              <div key={pres.title} className="p-7 rounded-3xl bg-[#F8FAF8] border border-line hover:border-emerald-300 hover:shadow-lg hover:bg-white transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-4">
                  <pres.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[17px] text-charcoal mb-1">{pres.title}</h3>
                <p className="text-[13px] text-slate-500">{pres.subtitle}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 11. ROUND TABLES ──────────────── */}
      <section className="py-16 md:py-20 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-100 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">ROUND TABLES</span>
            <h2 className="font-bold font-display text-[26px] sm:text-[32px] text-charcoal mt-2 mb-3">
              Sponsor Startups × Eligible Schools
            </h2>
            <p className="text-slate-600 text-[14.5px] leading-relaxed max-w-2xl mb-5">
              Curated, closed-door sessions connecting startups directly with school decision-makers and educators — designed for real conversations, not pitches to a crowd.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-[12px] font-semibold text-emerald-800">
              Round-table topics — To Be Announced based on confirmed sponsors
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 12. CONFERENCE AGENDA ──────────────── */}
      <section id="agenda" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              INTERACTIVE SCHEDULE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal mt-3 mb-2">
              Conference Agenda
            </h2>
            <p className="text-slate-600 text-sm">
              {EVENT.date} · {EVENT.time}. Subject to final speaker and session confirmation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {agendaItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-line p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-emerald-200 transition-all shadow-xs">
                <div className="w-full sm:w-36 shrink-0 font-display font-extrabold text-[#0E733B] text-sm">
                  {item.time}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 inline-block mb-1">
                    {item.type}
                  </span>
                  <h4 className="font-bold text-sm text-charcoal">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 13. EXCELLENCE IN EDUCATION AWARDS ──────────────── */}
      <section className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              RECOGNITION
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Excellence in Education Awards
            </h2>
            <p className="text-slate-600 text-[14.5px] leading-relaxed max-w-xl mx-auto">
              A dedicated segment recognising excellence and innovation in education — celebrating institutions, educators and innovators driving meaningful change.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm text-center">
            <Trophy className="w-8 h-8 text-[#0E733B] mx-auto mb-3" />
            <h3 className="font-bold text-[16px] text-charcoal mb-1">Award Categories — To Be Announced</h3>
            <p className="text-[13px] text-slate-500 mb-6">Categories will be published here once confirmed.</p>
            <button
              onClick={() => openModal("award-nominate")}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-sm transition-all"
            >
              Submit Nomination →
            </button>
          </div>
        </Container>
      </section>

      {/* ──────────────── 14. PARTICIPATING SCHOOLS ──────────────── */}
      <section className="py-16 md:py-20 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">SCHOOLS ATTENDING</span>
            <h2 className="font-bold font-display text-[26px] md:text-[36px] text-charcoal mt-2 tracking-tight">
              Participating Schools
            </h2>
            <p className="text-slate-500 text-[13.5px] mt-2">
              School logos will appear here as participation is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-[#F8FAF8] border border-dashed border-line flex flex-col items-center justify-center gap-1.5 text-slate-300">
                <Building2 className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[9px] font-semibold uppercase tracking-wide">Coming Soon</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 15. PARTNERS & SPONSORS ──────────────── */}
      <section id="sponsors" className="py-16 md:py-24 bg-[#0A1A10] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full inline-block mb-3">
              PARTNERS & SPONSORS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-white leading-tight mb-3 tracking-tight">
              Powered by the Education Ecosystem
            </h2>
          </div>

          {/* Title Sponsor */}
          <div className="p-8 rounded-3xl bg-white/[0.07] border border-emerald-400/30 backdrop-blur-md mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">Title Sponsor</span>
            <h3 className="font-bold font-display text-[26px] text-white mt-3">{EVENT.titleSponsor}</h3>
          </div>

          {/* Gold Partners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {EVENT.goldPartners.map((partner) => (
              <div key={partner} className="p-7 rounded-3xl bg-white/[0.05] border border-white/15 backdrop-blur-md hover:bg-white/[0.09] transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">Gold Partner</span>
                <h4 className="font-bold text-[18px] text-white mt-3">{partner}</h4>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal("vendor-register")}
            className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg shadow-emerald-900/40 hover:scale-105 transition-all"
          >
            Become a Sponsor / Partner With Us →
          </button>
        </Container>
      </section>

      {/* ──────────────── 16. VENUE ──────────────── */}
      <section id="venue" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              VENUE
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              {EVENT.venue}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto bg-[#F8FAF8] border border-emerald-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0E733B] bg-emerald-100/60 px-3 py-1 rounded-md">
                  <MapPin className="w-4 h-4" /> Dehradun, Uttarakhand
                </div>
                <h3 className="text-xl font-bold font-display text-charcoal">Shivalik University</h3>
                <div className="space-y-2 pt-1 text-[12.5px] text-slate-500">
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
                <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] rounded-2xl overflow-hidden border border-emerald-200/80 shadow-md bg-white">
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
          </div>
        </Container>
      </section>

      {/* ──────────────── 17. REGISTRATION ──────────────── */}
      <section id="register" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              REGISTRATION
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Join Us on {EVENT.date}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-7 rounded-3xl bg-white border border-[#0E733B] shadow-xl ring-2 ring-emerald-400/20 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[16px] text-charcoal mb-2">School / Educator Registration</h3>
                <p className="text-[13px] text-slate-500 mb-4">
                  For principals, school leaders, teachers and educators. Collects your name, role, school, city and contact details, verified by email.
                </p>
              </div>
              <button onClick={() => openModal("school-register")} className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#0E733B] hover:bg-[#0B5C2F] text-white shadow-md transition-colors">
                Register Now →
              </button>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-line shadow-xs hover:border-emerald-200 flex flex-col justify-between transition-all">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-4">
                  <Handshake className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[16px] text-charcoal mb-2">Sponsor / Exhibitor Registration</h3>
                <p className="text-[13px] text-slate-500 mb-4">
                  For startups, EdTech companies and solution providers exploring sponsorship or round-table participation.
                </p>
              </div>
              <button onClick={() => openModal("vendor-register")} className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-emerald-50 text-[#0E733B] hover:bg-[#0E733B] hover:text-white transition-colors">
                Register Now →
              </button>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-line shadow-xs hover:border-emerald-200 flex flex-col justify-between transition-all">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center mb-4">
                  <Newspaper className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[16px] text-charcoal mb-2">Media / Press</h3>
                <p className="text-[13px] text-slate-500 mb-4">
                  Coordinating coverage of the conference? Let us know and our team will follow up.
                </p>
              </div>
              <button onClick={() => openModal("interest", { vendorName: "Media & Press Coverage" })} className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-emerald-50 text-[#0E733B] hover:bg-[#0E733B] hover:text-white transition-colors">
                Get in Touch →
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 18. FAQ ──────────────── */}
      <section id="faqs" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-2xl border border-line bg-white overflow-hidden shadow-xs">
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

      {/* ════════════════════════════════════════════════════════════════
          PREVIOUS CONFERENCE — visually distinct, placeholder until real data is available
      ════════════════════════════════════════════════════════════════ */}
      <section id="previous-conference" className="py-16 md:py-24 bg-[#FDFBF7] border-b border-line relative">
        <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(45deg,transparent_49%,rgba(14,115,59,0.04)_49%,rgba(14,115,59,0.04)_51%,transparent_51%)] bg-[length:24px_24px] pointer-events-none" />
        <Container className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 bg-white px-4 py-1.5 rounded-full border border-dashed border-slate-300">
              <Clock className="w-3.5 h-3.5" />
              PREVIOUS CONFERENCE — COMING SOON
            </span>
            <h2 className="font-bold font-display text-[28px] md:text-[38px] text-slate-500 mt-3 mb-2 tracking-tight">
              Previous Conference
            </h2>
            <p className="text-slate-400 text-[13.5px] leading-relaxed">
              The October 2026 conference is EduBeacon&apos;s upcoming flagship event. Details from a previous edition will be published here once available.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Landmark, label: "Overview" },
              { icon: Sparkles, label: "Highlights" },
              { icon: Users, label: "Speakers & Guests" },
              { icon: ImageIcon, label: "Gallery" },
              { icon: TrendingUp, label: "Participation" },
              { icon: Handshake, label: "Outcomes" },
              { icon: Mic, label: "Testimonials" },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-2xl bg-white border border-dashed border-slate-200 text-center flex flex-col items-center gap-2">
                <item.icon className="w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <span className="text-[12px] font-bold text-slate-400">{item.label}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-300">Coming Soon</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── FINAL CTA ──────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#061A10] via-[#0A2618] to-[#061A10] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-300 mb-3 block">
              {EVENT.date} • {EVENT.venue}
            </span>
            <h2 className="font-extrabold font-display text-[30px] sm:text-[42px] text-white leading-tight mb-4">
              Be Part of the Conversation
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-[46ch] mx-auto">
              {EVENT.tagline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button onClick={() => openModal("school-register")} className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg hover:scale-105 transition-all">
                Register as School / Educator →
              </button>
              <button onClick={() => openModal("vendor-register")} className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-charcoal bg-white shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all">
                Become a Sponsor →
              </button>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
