"use client";

import { useState } from "react";
import { 
  Building2, 
  CheckCircle2, 
  Ruler, 
  Handshake, 
  Mic, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  Globe,
  Award
} from "lucide-react";
import ModalShell from "./ModalShell";

interface SponsorRegistrationModalProps {
  onClose: () => void;
  defaultPackageId?: string;
}

const packageOptions = [
  {
    id: "bronze",
    name: "Bronze Partner",
    badge: "Entry Tier",
    space: "6×6 ft Stall",
    meetings: "5 Curated Meetings",
    perk: "Logo on all banners & 2 passes",
    color: "border-slate-300 bg-slate-50 text-slate-700",
  },
  {
    id: "silver",
    name: "Silver Partner",
    badge: "Growing Brands",
    space: "8×8 ft Stall",
    meetings: "10 Curated Meetings",
    perk: "10-min stage slot & 5 passes",
    color: "border-emerald-300 bg-emerald-50/60 text-[#0E733B]",
  },
  {
    id: "gold",
    name: "Gold Partner",
    badge: "Most Popular",
    space: "10×10 ft Stall",
    meetings: "15 Curated Meetings",
    perk: "20-min presentation & 10 passes",
    color: "border-[#0E733B] bg-emerald-50 text-[#0E733B]",
  },
  {
    id: "diamond",
    name: "Diamond Partner",
    badge: "Elite Partner",
    space: "Custom Island Stall",
    meetings: "20+ Curated Meetings",
    perk: "Plenary Keynote & Front Page Story",
    color: "border-emerald-600 bg-emerald-100/50 text-[#064E3B]",
  },
  {
    id: "custom",
    name: "Custom / Booth Only",
    badge: "Flexible",
    space: "Standard Booth",
    meetings: "General Networking",
    perk: "Tailored brand package",
    color: "border-teal-300 bg-teal-50/50 text-teal-800",
  },
];

const categoryOptions = [
  "AI & Machine Learning",
  "STEM & Robotics Labs",
  "Smart Classroom & AV Tech",
  "EdTech & LMS Platforms",
  "School ERP & Management",
  "Books & Curriculum Publishing",
  "Assessment & Testing",
  "Teacher Professional Development",
  "School Infrastructure & Furniture",
  "Olympiad & Competitive Prep",
  "Sports, Arts & Activities",
  "FinTech & Fee Management",
  "Other",
];

export default function SponsorRegistrationModal({
  onClose,
  defaultPackageId = "gold",
}: SponsorRegistrationModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<string>(
    packageOptions.some((p) => p.id === defaultPackageId) ? defaultPackageId : "gold"
  );
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    category: "AI & Machine Learning",
    objective: "B2B Lead Generation & School Partnerships",
    estimatedAttendees: "2-4 Team Members",
    specialRequests: "",
  });

  const activePackageData = packageOptions.find((p) => p.id === selectedPkg) || packageOptions[2];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instantaneous smooth submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <ModalShell title="Sponsorship Registration Confirmed" onClose={onClose} size="lg">
        <div className="py-6 px-2 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-[#0E733B] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] bg-emerald-50 text-[#0E733B] border border-emerald-200 px-3.5 py-1 rounded-full mb-3">
            Registration Received
          </span>

          <h3 className="font-display text-[24px] md:text-[28px] font-bold text-charcoal mb-2 tracking-tight">
            Welcome, {form.companyName || "Partner"}!
          </h3>

          <p className="text-slate-600 text-[14.5px] leading-relaxed max-w-lg mx-auto mb-6">
            Your registration for the <strong className="text-[#0E733B]">{activePackageData.name}</strong> package at the <strong>EduBeacon Education Leadership Conference 2027</strong> has been successfully registered.
          </p>

          {/* Registration Details Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 max-w-md mx-auto text-left mb-6 space-y-3 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-200/60 font-semibold">
              <span className="text-slate-500">Reserved Tier:</span>
              <span className="bg-[#0E733B] text-white px-2.5 py-0.5 rounded-full text-[11px]">
                {activePackageData.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Exhibition Space:</span>
              <span className="font-bold text-slate-800">{activePackageData.space}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">School Meetings:</span>
              <span className="font-bold text-emerald-800">{activePackageData.meetings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Key Deliverable:</span>
              <span className="font-semibold text-slate-800">{activePackageData.perk}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-200/60">
              <span className="text-slate-500">Primary Contact:</span>
              <span className="font-medium text-slate-800">{form.contactPerson} ({form.email})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Done & Return to Conference
            </button>
            <a
              href="#sponsorship"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Prospectus Kit
            </a>
          </div>

          <p className="text-[11.5px] text-slate-400 mt-4">
            Our Sponsorship Director will reach out within 4–6 business hours to finalize booth allocation and meeting matchmaking.
          </p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Sponsor & Partner Registration" onClose={onClose} size="lg">
      <div className="mb-5">
        <p className="text-slate-500 text-[13.5px] leading-relaxed">
          Lock in your brand presence, exhibition stall, and guaranteed 1-on-1 school decision-maker meetings at India&#39;s premier education conference.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Tier Selector */}
        <div>
          <label className="block text-[11.5px] font-bold text-[#0E733B] mb-2 uppercase tracking-wider">
            1. Select Sponsorship Tier *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {packageOptions.map((pkg) => {
              const isSelected = selectedPkg === pkg.id;
              return (
                <button
                  type="button"
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#0E733B] bg-emerald-50 shadow-sm ring-1 ring-[#0E733B]/30"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded w-fit mb-1">
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {pkg.name}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {pkg.space}
                  </span>
                </button>
              );
            })}
          </div>


        </div>

        {/* Company & Contact Details */}
        <div>
          <label className="block text-[11.5px] font-bold text-[#0E733B] mb-2 uppercase tracking-wider">
            2. Company & Contact Details *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Company / Brand Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  required
                  type="text"
                  placeholder="e.g. NextGen EdTech Solutions"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Contact Person Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Vikram Sharma"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Designation / Role *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Co-Founder / VP Sales"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Official Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phone / WhatsApp Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Company Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://company.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category & Objectives */}
        <div>
          <label className="block text-[11.5px] font-bold text-[#0E733B] mb-2 uppercase tracking-wider">
            3. Product Category & Goals
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Product / Solution Category
              </label>
              <select
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 bg-white focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Primary Sponsorship Objective
              </label>
              <select
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-800 bg-white focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors"
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
              >
                <option value="B2B Lead Generation & School Partnerships">B2B Lead Generation & School Partnerships</option>
                <option value="Brand Visibility & Leadership Positioning">Brand Visibility & Leadership Positioning</option>
                <option value="Product Launch & Live Demos">Product Launch & Live Demos</option>
                <option value="Keynote Speaking & Thought Leadership">Keynote Speaking & Thought Leadership</option>
                <option value="Investor & Channel Partner Networking">Investor & Channel Partner Networking</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Custom Requirements / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Need corner booth space, require power for robotics demo, interested in awards co-branding..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 transition-colors resize-none"
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11.5px]">
            <ShieldCheck className="w-4 h-4 text-[#0E733B]" />
            <span>Guaranteed booth allocation & priority matchmaking.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto bg-[#0E733B] hover:bg-[#0B5C2F] disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  Confirm Registration
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
