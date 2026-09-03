"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Send,
  Building2,
  Crown
} from "lucide-react";
import Container from "@/components/ui/Container";
import { img } from "@/lib/images";

const upcomingRoundtables = [
  {
    topic: "AI Governance, Ethics & Academic Integrity in K–12",
    date: "22 October 2026",
    city: "Mumbai",
    venue: "Private Executive Suite, Bandra Kurla Complex",
    chairs: "Chaired by CBSE Advisory Board Member & Top EdTech Founder",
    capacity: "Limited to 18 Institutional Heads",
    badge: "Upcoming",
  },
  {
    topic: "Sustainable Institutional Finance & Fee Regulation",
    date: "19 November 2026",
    city: "New Delhi",
    venue: "The Oberoi, New Delhi",
    chairs: "Chaired by Former Secretary of School Education & Legal Counsel",
    capacity: "Limited to 20 Managing Trustees",
    badge: "Curating Invites",
  },
  {
    topic: "Overcoming NEP 2020 Cross-Board Transition Bottlenecks",
    date: "14 January 2027",
    city: "Bengaluru",
    venue: "The Ritz-Carlton, Residency Road",
    chairs: "Chaired by Deans of Leading International & CBSE School Groups",
    capacity: "Limited to 18 Education Directors",
    badge: "Nominations Open",
  },
  {
    topic: "Educator Retention, Compensation & Campus Mental Health",
    date: "11 February 2027",
    city: "Hyderabad",
    venue: "Taj Falaknuma Palace",
    chairs: "Chaired by Clinical Psychologists & Senior School Group CEOs",
    capacity: "Limited to 16 Leaders",
    badge: "Nominations Open",
  },
];

const roundtableRules = [
  {
    title: "Strict Chatham House Rule",
    desc: "Participants are free to use the information received, but neither the identity nor the affiliation of the speaker may be revealed.",
    icon: Lock,
  },
  {
    title: "Zero Slides / Pure Dialogue",
    desc: "No corporate pitch decks or PowerPoint monologues. Pure structured peer-to-peer inquiry and debate.",
    icon: Users,
  },
  {
    title: "Actionable Policy Whitepapers",
    desc: "Discussions are synthesized into an anonymized executive brief distributed exclusively to attendees and policy committees.",
    icon: FileText,
  },
  {
    title: "Strict Capacity Cap",
    desc: "Every roundtable is strictly limited to 16–20 verified school founders, trustees, and tech pioneers.",
    icon: Crown,
  },
];

export default function RoundtablePage() {
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    institution: "",
    email: "",
    phone: "",
    selectedTopic: upcomingRoundtables[0].topic,
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#062013] via-[#0A331E] to-[#061A10] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-6 backdrop-blur-sm">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Strictly By Invitation / Nomination</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6">
              EduBeacon Executive <br />
              <span className="text-emerald-400">Leadership Roundtables</span>
            </h1>

            <p className="text-base md:text-lg text-emerald-100/80 font-normal leading-relaxed mb-8">
              Intimate, closed-door strategy salons under Chatham House Rule bringing together 20 handpicked school founders, trustees, and policymakers to debate high-stakes education priorities.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <Crown className="h-4 w-4 text-emerald-400" />
                <span>Max 20 Leaders per Session</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Chatham House Rule Protocol</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Protocol & Philosophy */}
      <section className="py-16 bg-white border-b border-line">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              The Format
            </span>
            <h2 className="text-3xl font-bold font-display text-charcoal mt-3 mb-2">
              The Roundtable Protocol
            </h2>
            <p className="text-slate-600 text-sm">
              Why 20 leaders around a single table achieve more than 2,000 in an auditorium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roundtableRules.map((rule, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-line bg-[#F8FAF8] p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0E733B] mb-4">
                    <rule.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-charcoal mb-2">{rule.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Upcoming Salons */}
      <section className="py-16 md:py-24 bg-[#F8FAF8]">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              2026–2027 Calendar
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal mt-3 mb-2">
              Upcoming Strategic Salons
            </h2>
            <p className="text-slate-600 text-sm">
              Curated regional gatherings addressing core structural challenges in education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {upcomingRoundtables.map((rt, i) => (
              <div
                key={i}
                className="rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-emerald-50 text-[#0E733B] border border-emerald-200 px-3 py-1 text-[11px] font-bold">
                      {rt.city} Edition
                    </span>
                    <span className="text-xs font-bold text-slate-400">{rt.badge}</span>
                  </div>

                  <h3 className="font-bold text-lg text-charcoal mb-3">{rt.topic}</h3>

                  <div className="space-y-2 text-xs text-slate-600 mb-6 bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0E733B] shrink-0" />
                      <span>{rt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0E733B] shrink-0" />
                      <span>{rt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0E733B] shrink-0" />
                      <span className="font-medium text-charcoal">{rt.capacity}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic mb-6">
                    {rt.chairs}
                  </p>
                </div>

                <a
                  href="#nominate-form"
                  onClick={() => setFormData((prev) => ({ ...prev, selectedTopic: rt.topic }))}
                  className="w-full text-center rounded-xl bg-[#0E733B] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#0B5C2F] transition-colors"
                >
                  Request Seat for this Roundtable →
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Nomination Form */}
      <section id="nominate-form" className="py-16 md:py-24 bg-white border-t border-line">
        <Container>
          <div className="max-w-3xl mx-auto rounded-3xl border border-line bg-[#F8FAF8] p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
                Participation Request
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-charcoal mt-3 mb-2">
                Request an Invitation / Nominate a Leader
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Applications are reviewed by the EduBeacon Advisory Committee to maintain balanced, senior cohort representation.
              </p>
            </div>

            {requestSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#0E733B]" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Application Under Review</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <strong className="text-charcoal">{formData.name}</strong>. The selection committee will review your profile for the <em>{formData.selectedTopic}</em> session and send formal invitation details upon confirmation.
                </p>
                <button
                  onClick={() => setRequestSubmitted(false)}
                  className="text-xs font-bold text-[#0E733B] underline"
                >
                  Submit Another Nomination
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Leader Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sunita Rao"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Managing Trustee / Founder"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Institution / School Group *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Heritage School Group"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="trustee@heritageschools.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select Roundtable Topic *
                  </label>
                  <select
                    value={formData.selectedTopic}
                    onChange={(e) => setFormData({ ...formData, selectedTopic: e.target.value })}
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none bg-white"
                  >
                    {upcomingRoundtables.map((rt, idx) => (
                      <option key={idx} value={rt.topic}>
                        {rt.topic} ({rt.city} • {rt.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Brief Background & Perspective (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key institutional perspective or insights you wish to contribute to the discussion..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0E733B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0B5C2F] transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Submit Nomination for Review</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
