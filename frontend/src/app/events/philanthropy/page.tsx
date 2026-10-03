"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  HeartHandshake, 
  Sparkles, 
  GraduationCap, 
  Laptop, 
  Sun, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building,
  Users2,
  TrendingUp,
  Heart,
  Send
} from "lucide-react";
import Container from "@/components/ui/Container";
import { img } from "@/lib/images";

const impactStats = [
  { value: "120+", label: "Schools Adopted", desc: "Equipped with modern smart learning labs" },
  { value: "45,000+", label: "Students Reached", desc: "Across 8 rural & underserved districts" },
  { value: "₹12 Cr+", label: "CSR Grants Facilitated", desc: "100% transparent ESG deployment" },
  { value: "8,500+", label: "STEM Kits Delivered", desc: "Hands-on robotics & science materials" },
];

const philanthropicPillars = [
  {
    title: "1. Adopt-A-School Smart Lab Program",
    desc: "Transforming government and low-income community schools into modern innovation centers equipped with interactive panels, coding kits, and solar power backup.",
    icon: Laptop,
    beneficiaries: "120+ Village & Municipal Schools",
    badge: "Infrastructure",
  },
  {
    title: "2. Girl Child STEM & AI Scholarships",
    desc: "Providing full tuition assistance, coding bootcamps, and 1-on-1 industry mentorship to promising female students from disadvantaged backgrounds.",
    icon: GraduationCap,
    beneficiaries: "1,500+ Female Scholars",
    badge: "Scholarships",
  },
  {
    title: "3. Grassroots Teacher Digital Fellowship",
    desc: "Empowering rural teachers with tablets, digital lesson plans, pedagogical training, and ongoing capacity-building workshops.",
    icon: Users2,
    beneficiaries: "2,400+ Certified Educators",
    badge: "Capacity Building",
  },
  {
    title: "4. Green Campus & Clean Water Initiative",
    desc: "Installing rainwater harvesting, clean UV water filtration, sanitation facilities, and rooftop solar power across underserved school campuses.",
    icon: Sun,
    beneficiaries: "80+ Campus Installations",
    badge: "Sustainability",
  },
];

const impactStories = [
  {
    title: "From Blackboard to Robotics: ZP High School, Wardha",
    quote: "Our students had never seen a computer before. Today, three 9th-grade girls from our village won the regional robotics challenge.",
    author: "Shri. Ramesh Gaikwad",
    role: "Headmaster, ZP High School",
    image: img.stemLab,
  },
  {
    title: "Empowering 500 First-Generation Learners in Almora",
    quote: "With solar smart panels and interactive bilingual lessons, student attendance increased from 62% to 94% in just two terms.",
    author: "Kavita Bisht",
    role: "Lead Teacher & Digital Fellow",
    image: img.smartClassroom,
  },
];

export default function PhilanthropyPage() {
  const [pledgeSubmitted, setPledgeSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    email: "",
    phone: "",
    type: "Corporate CSR Fund",
    amount: "₹10,00,000 (Adopt 2 Smart Labs)",
  });

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    setPledgeSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#062013] via-[#0A331E] to-[#061A10] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-6 backdrop-blur-sm">
              <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
              <span>EduBeacon Social Impact Foundation</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.1] mb-6">
              Philanthropy & <br />
              <span className="text-emerald-400">Grassroots Education</span>
            </h1>

            <p className="text-base md:text-lg text-emerald-100/80 font-normal leading-relaxed mb-8">
              Connecting corporate CSR leaders, philanthropic trusts, and progressive donors with verified underserved schools to deliver real, measurable educational transformation.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100% 80G & CSR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Audited Milestone Tracking</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-b border-line shadow-sm">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <span className="block text-3xl md:text-4xl font-bold font-display text-charcoal mb-1 text-[#0E733B]">
                  {stat.value}
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">{stat.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 Core Pillars */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Action Pillars
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal mt-3 mb-3">
              Where Your Impact Goes
            </h2>
            <p className="text-slate-600 text-sm">
              Targeted philanthropic interventions designed for tangible, measurable student outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philanthropicPillars.map((pillar, i) => (
              <div
                key={i}
                className="rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0E733B]">
                      <pillar.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-slate-600">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-charcoal mb-2">{pillar.title}</h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Impact Reach:</span>
                  <span className="font-bold text-[#0E733B]">{pillar.beneficiaries}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-white border-y border-line">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0E733B]">
              Real Impact Stories
            </span>
            <h2 className="text-3xl font-bold font-display text-charcoal mt-1">
              Voices from the Ground
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactStories.map((story, i) => (
              <div key={i} className="rounded-3xl border border-line bg-[#F8FAF8] overflow-hidden shadow-sm flex flex-col">
                <div className="relative h-56 w-full">
                  <Image src={story.image} alt={story.title} fill className="object-cover" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h3 className="font-bold text-base text-charcoal mb-3">{story.title}</h3>
                  <blockquote className="text-xs md:text-sm text-slate-600 italic leading-relaxed mb-6">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                  <div className="mt-auto pt-4 border-t border-gray-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-[#0E733B] font-bold text-xs">
                      {story.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal">{story.author}</h4>
                      <p className="text-[11px] text-slate-500">{story.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pledge Support / CSR Form */}
      <section className="py-16 md:py-24 bg-[#F8FAF8]">
        <Container>
          <div className="max-w-3xl mx-auto rounded-3xl border border-line bg-white p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
                Partner with Us
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-charcoal mt-3 mb-2">
                Pledge CSR Support or Adopt a School
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Our social impact team will assist with project selection, transparent costing, and 80G tax compliance.
              </p>
            </div>

            {pledgeSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-emerald-600 fill-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">Thank You for Your Generosity!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                  We have received your interest, <strong className="text-charcoal">{formData.name}</strong>. Our CSR director will contact you within 24 hours with school profiles and implementation roadmaps.
                </p>
                <button
                  onClick={() => setPledgeSubmitted(false)}
                  className="text-xs font-bold text-[#0E733B] underline"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handlePledge} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Anita Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Organization / Foundation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TechCorp CSR Foundation"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="anita@foundation.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
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
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Partnership Category
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    >
                      <option>Corporate CSR Fund</option>
                      <option>Philanthropic Trust / NGO</option>
                      <option>Individual Philanthropist</option>
                      <option>School Looking to be Adopted</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Proposed Grant / Scope
                    </label>
                    <select
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-charcoal focus:border-[#0E733B] focus:outline-none"
                    >
                      <option>₹5,00,000 (Adopt 1 Smart Lab)</option>
                      <option>₹10,00,000 (Adopt 2 Smart Labs)</option>
                      <option>₹25,00,000 (Adopt 5 Schools + Fellowships)</option>
                      <option>Custom CSR Program</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0E733B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0B5C2F] transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Submit Philanthropic Inquiry</span>
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
