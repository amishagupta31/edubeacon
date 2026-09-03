"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  Trophy, 
  HeartHandshake, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import Container from "@/components/ui/Container";
import { img } from "@/lib/images";

const eventPillars = [
  {
    id: "roadshows",
    title: "City Roadshows",
    subtitle: "Pan-India Innovation Tour",
    badge: "12+ Major Cities",
    desc: "Bringing education technology, lab innovations, and school management breakthroughs directly to school leaders across Tier 1, 2, and 3 regional hubs.",
    href: "/events/roadshows",
    icon: Compass,
    accent: "bg-[#0E733B] text-white",
    lightBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    image: img.workshop,
    highlights: [
      "120+ Regional Principals per city",
      "Hands-on Product Testing Demos",
      "Curated 1-on-1 Vendor-School Speed Dating",
      "Interactive NEP 2020 Action Workshops",
    ],
    nextDate: "Starting Oct 2026",
    nextCity: "Mumbai • Delhi • Bengaluru • Hyderabad",
  },
  {
    id: "conference",
    title: "Annual Leadership Conference",
    subtitle: "Flagship Mega-Summit 2027",
    badge: "2-Day National Summit",
    desc: "India's premier confluence of 1,200+ education leaders, policymakers, EdTech unicorns, and institutional trustees at Bharat Mandapam, New Delhi.",
    href: "/events/conference",
    icon: Trophy,
    accent: "bg-[#059669] text-white",
    lightBg: "bg-emerald-50 text-emerald-900 border-emerald-200",
    image: img.conferenceKeynote,
    highlights: [
      "50+ Visionary Keynote Speakers",
      "4 Specialized Thematic Stages",
      "300+ Exhibition & Demo Booths",
      "National Education Excellence Awards",
    ],
    nextDate: "15–16 March 2027",
    nextCity: "Bharat Mandapam, New Delhi",
  },
  {
    id: "philanthropy",
    title: "Philanthropy & Social Impact",
    subtitle: "CSR & Grassroots Empowerment",
    badge: "Empowering 50,000+ Students",
    desc: "Uniting corporate CSR foundations, NGOs, and progressive schools to bridge the educational divide with smart lab grants, teacher digital fellowships, and scholarships.",
    href: "/events/philanthropy",
    icon: HeartHandshake,
    accent: "bg-[#10B981] text-white",
    lightBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    image: img.smartClassroom,
    highlights: [
      "120+ Adopted Underserved Schools",
      "₹12 Cr+ in Facilitated CSR Grants",
      "Girl Child STEM & Robotics Scholarships",
      "Direct ESG & 80G Tax-Compliant Projects",
    ],
    nextDate: "Year-Round Program",
    nextCity: "Nationwide Outreach",
  },
  {
    id: "roundtable",
    title: "Executive Round Tables",
    subtitle: "Closed-Door Leadership Salons",
    badge: "Strictly Invitation Only",
    desc: "High-stakes, confidential discussions under Chatham House Rule bringing together 20 handpicked school founders, trustees, and tech pioneers to solve pressing institutional challenges.",
    href: "/events/roundtable",
    icon: Users,
    accent: "bg-[#064E3B] text-white",
    lightBg: "bg-emerald-50 text-emerald-950 border-emerald-200",
    image: img.roundtable,
    highlights: [
      "Strict Chatham House Rule protocol",
      "Max 20 leaders per exclusive session",
      "Actionable Policy & Governance Whitepapers",
      "Unfiltered peer benchmarking",
    ],
    nextDate: "Bi-Monthly Series",
    nextCity: "Exclusive Private Venues",
  },
];

export default function EventsHubPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFA]">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-[#062013] to-[#0A331E] py-20 md:py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>EduBeacon Event Ecosystem</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6 font-display">
              Events, Roadshows & <br />
              <span className="text-emerald-400">Leadership Gatherings</span>
            </h1>
            
            <p className="text-lg md:text-xl text-emerald-100/80 leading-relaxed font-normal mb-8">
              From multi-city regional roadshows and our flagship national conference to closed-door executive roundtables and grassroots CSR philanthropy initiatives.
            </p>

            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-emerald-200/70">
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-sm">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Pan-India Tour</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>Year-Round Calendar</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Curated & Verified Delegates</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Grid of 4 Pillars */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {eventPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="group relative flex flex-col rounded-3xl border border-line bg-white shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Visual Image Header */}
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-charcoal shadow-sm backdrop-blur-sm">
                      <pillar.icon className="h-3.5 w-3.5 text-emerald-600" />
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                      {pillar.subtitle}
                    </p>
                    <h2 className="text-2xl font-bold font-display text-white mt-0.5">
                      {pillar.title}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-6">
                    {pillar.desc}
                  </p>

                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Key Program Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal">
                      {pillar.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                        Schedule & Venue
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {pillar.nextDate} • {pillar.nextCity}
                      </span>
                    </div>

                    <Link
                      href={pillar.href}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E733B] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B5C2F] transition-colors"
                    >
                      <span>Explore {pillar.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Box */}
      <section className="py-12 bg-white border-t border-line">
        <Container>
          <div className="rounded-3xl bg-gradient-to-r from-[#062013] to-[#0E733B] p-8 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Partner & Collaborate
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-white mt-1 mb-3">
                Want to Host or Sponsor an EduBeacon Event?
              </h2>
              <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed">
                Whether you want to sponsor a city roadshow, co-host an executive roundtable, or contribute to our philanthropy fund, our team is ready to collaborate.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3.5 shrink-0">
              <Link
                href="/#contact"
                className="rounded-xl bg-white px-6 py-3 text-xs md:text-sm font-bold text-[#0E733B] hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Inquire for Partnerships
              </Link>
              <Link
                href="/events/roadshows"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 text-xs md:text-sm font-bold text-white hover:bg-white/20 transition-colors"
              >
                View Roadshow Dates
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
