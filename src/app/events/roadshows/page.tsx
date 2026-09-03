"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send
} from "lucide-react";
import Container from "@/components/ui/Container";
import { img } from "@/lib/images";

const cities = [
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    date: "10 October 2026",
    time: "09:30 AM – 04:30 PM",
    venue: "Grand Hyatt, Santacruz East",
    focus: "AI Labs, STEM Infrastructure & Future Learning Spaces",
    expectedSchools: "140+ Schools",
    status: "Registration Open",
    speakersCount: 8,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    date: "28 October 2026",
    time: "09:30 AM – 04:30 PM",
    venue: "The Leela Palace, Old Airport Road",
    focus: "Robotics, Coding Ecosystems & EdTech Integration",
    expectedSchools: "160+ Schools",
    status: "Filling Fast",
    speakersCount: 10,
  },
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    state: "National Capital Region",
    date: "14 November 2026",
    time: "09:30 AM – 04:30 PM",
    venue: "Taj Palace, Chanakyapuri",
    focus: "NEP 2020 Implementation & Digital School ERPs",
    expectedSchools: "180+ Schools",
    status: "Registration Open",
    speakersCount: 12,
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    date: "05 December 2026",
    time: "09:30 AM – 04:30 PM",
    venue: "HICC Novotel, HITEC City",
    focus: "Smart Classroom Tech & Assessment Platforms",
    expectedSchools: "130+ Schools",
    status: "Registration Open",
    speakersCount: 7,
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    date: "18 January 2027",
    time: "09:30 AM – 04:30 PM",
    venue: "JW Marriott, Senapati Bapat Road",
    focus: "Teacher Training & Experiential Learning Modules",
    expectedSchools: "110+ Schools",
    status: "Upcoming",
    speakersCount: 6,
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    date: "06 February 2027",
    time: "09:30 AM – 04:30 PM",
    venue: "Courtyard by Marriott, Satellite",
    focus: "School Sports, Activity Infrastructure & Safety",
    expectedSchools: "100+ Schools",
    status: "Upcoming",
    speakersCount: 6,
  },
];

const roadshowSchedule = [
  { time: "09:30 AM", title: "Registration & Welcome Networking Breakfast", desc: "Collect badges, review the digital catalog, and meet fellow educators." },
  { time: "10:15 AM", title: "Regional Keynote: Education Transformation 2027", desc: "Insights from leading state educationists and visionary principals." },
  { time: "11:00 AM", title: "Live Product Experience & Hands-On Demo Pods", desc: "Interactive walkthrough of AI labs, STEM kits, interactive screens, and ERP software." },
  { time: "01:00 PM", title: "Curated Principals' Leadership Lunch", desc: "High-table networking lunch bringing school trustees and directors together." },
  { time: "02:15 PM", title: "1-on-1 Speed Networking: School Buyers & Vendors", desc: "Pre-matched 15-minute consultations to review proposals and pricing." },
  { time: "03:45 PM", title: "Case Study Panels & Innovation Awards", desc: "Honoring top innovative regional schools and closing takeaways." },
];

export default function RoadshowsPage() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    email: "",
    phone: "",
    city: cities[0].name,
    role: "Principal / Director",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2618] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        
        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-6 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                <span>Pan-India Tour 2026–2027</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6 font-display">
                EduBeacon City <br />
                <span className="text-emerald-400">Roadshow Series</span>
              </h1>
              
              <p className="text-base md:text-lg text-emerald-100/80 leading-relaxed font-normal mb-8">
                Bringing premier education solutions, live hands-on tech demos, and high-impact school leader networking directly to 12+ cities across India.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Building className="h-4 w-4 text-emerald-400" />
                  <span>1,500+ Schools Participating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>12+ Metro & Tier-2 Hubs</span>
                </div>
              </div>
            </div>

            {/* Quick Hero City Highlight Card */}
            <div className="w-full lg:w-[420px] rounded-3xl bg-white p-6 md:p-8 text-charcoal shadow-2xl border border-line">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E733B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Next Destination
                </span>
                <span className="text-xs font-semibold text-slate-500">10 Oct 2026</span>
              </div>

              <h3 className="text-2xl font-bold font-display text-charcoal mb-1">
                Mumbai City Edition
              </h3>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                Grand Hyatt, Santacruz East
              </p>

              <div className="rounded-xl bg-gray-50 p-3.5 mb-5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Target Focus:</span>
                  <span className="font-semibold text-charcoal">AI & STEM Labs</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Confirmed Principals:</span>
                  <span className="font-semibold text-emerald-700">140+ Registered</span>
                </div>
              </div>

              <a
                href="#city-selector"
                className="w-full block text-center rounded-xl bg-[#0E733B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0B5C2F] transition-colors"
              >
                Select Your City & RSVP
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive City Selector */}
      <section id="city-selector" className="py-16 md:py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Select Your City
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal mt-3 mb-3">
              Tour Dates & City Venues
            </h2>
            <p className="text-slate-600 text-sm">
              Click on any city below to inspect the venue details, thematic focus, and reserve your delegate pass.
            </p>
          </div>

          {/* City Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city);
                  setFormData((prev) => ({ ...prev, city: city.name }));
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedCity.id === city.id
                    ? "bg-[#0E733B] text-white shadow-md scale-105"
                    : "bg-white text-slate-600 border border-line hover:border-[#0E733B]/40 hover:text-[#0E733B]"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          {/* Detailed Selected City Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border border-line rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    {selectedCity.state}
                  </span>
                  <h3 className="text-3xl font-bold font-display text-charcoal mt-0.5">
                    {selectedCity.name} Edition
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-1.5 text-xs font-bold">
                  {selectedCity.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <Calendar className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Date</span>
                    <span className="text-sm font-bold text-charcoal">{selectedCity.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Time</span>
                    <span className="text-sm font-bold text-charcoal">{selectedCity.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Venue</span>
                    <span className="text-sm font-bold text-charcoal">{selectedCity.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
                  <Users className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Attendance</span>
                    <span className="text-sm font-bold text-charcoal">{selectedCity.expectedSchools}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  Special Thematic Focus for {selectedCity.name}
                </h4>
                <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                  {selectedCity.focus}
                </p>
              </div>

              {/* Day Agenda Timeline */}
              <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4">
                Typical Roadshow Agenda
              </h4>
              <div className="space-y-4">
                {roadshowSchedule.map((slot, idx) => (
                  <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
                      {slot.time}
                    </span>
                    <div>
                      <h5 className="text-xs md:text-sm font-bold text-charcoal">{slot.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{slot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Registration Form for the City */}
            <div className="lg:col-span-5 bg-white border border-line rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold font-display text-charcoal mb-2">
                RSVP for {selectedCity.name}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Complimentary access for School Principals, Trustees, Administrators & Academic Coordinators.
              </p>

              {formSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#0E733B]" />
                  </div>
                  <h4 className="text-lg font-bold text-charcoal mb-2">Pass Request Received!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Thank you, <strong className="text-charcoal">{formData.name || "Educator"}</strong>. Our regional event coordinator will send your official entry QR code for the {formData.city} edition shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-[#0E733B] underline"
                  >
                    Register Another Delegate
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none focus:ring-1 focus:ring-[#0E733B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      School / Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi Public School"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none focus:ring-1 focus:ring-[#0E733B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="principal@school.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none focus:ring-1 focus:ring-[#0E733B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none focus:ring-1 focus:ring-[#0E733B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Your Designation
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    >
                      <option>Principal / Head of School</option>
                      <option>Managing Trustee / Director</option>
                      <option>Academic Coordinator</option>
                      <option>IT & Innovation Head</option>
                      <option>EdTech Solution Provider / Vendor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Selected City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none bg-gray-50"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0E733B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0B5C2F] transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Confirm Free Registration</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Verified educator credentials only. No spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Visual Experience Gallery */}
      <section className="py-16 bg-white border-t border-line">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E733B]">
                On-Ground Energy
              </span>
              <h2 className="text-3xl font-bold font-display text-charcoal mt-1">
                What Happens at an EduBeacon Roadshow
              </h2>
            </div>
            <Link
              href="/#solutions"
              className="text-xs font-bold text-[#0E733B] hover:underline mt-2 md:mt-0 flex items-center gap-1"
            >
              Explore Solutions Directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-line bg-[#FAFCFA] p-6 flex flex-col">
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                <Image src={img.stemLab} alt="Hands-on Demo" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-base text-charcoal mb-2">1. Hands-on Demo Pods</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test STEM kits, touch digital flat panels, and test-drive school management dashboards live before making procurement decisions.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-[#FAFCFA] p-6 flex flex-col">
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                <Image src={img.networking} alt="1-on-1 Speed Networking" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-base text-charcoal mb-2">2. 1-on-1 Speed Dating</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-scheduled 15-minute consultations matching school requirements with verified providers for transparent discussions and quotes.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-[#FAFCFA] p-6 flex flex-col">
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                <Image src={img.panelDiscussion} alt="Regional Leaders Exchange" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-base text-charcoal mb-2">3. Principal Masterclasses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candid peer discussions on NEP compliance, board assessments, mental wellness, and staff retention in modern schools.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
