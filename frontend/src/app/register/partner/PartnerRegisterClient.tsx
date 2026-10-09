"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { Store, Mail, Phone, MapPin, CheckCircle2, Rocket } from "lucide-react";
import { siteConfig } from "@/lib/data";

const CATEGORIES: Record<string, string> = {
  stem: "STEM Labs",
  ai: "AI & Machine Learning",
  robotics: "Robotics",
  "smart-classroom": "Smart Classroom",
  erp: "School ERP",
  assessment: "Assessment Tools",
  other: "Other",
};

interface FormState {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  description: string;
}

export default function PartnerRegisterClient() {
  const [form, setForm] = useState<FormState>({
    companyName: "", contactPerson: "", email: "", phone: "",
    website: "", category: "", description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF8] to-white pt-24 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-[#0E733B]" strokeWidth={1.6} />
              </div>

              <h2 className="text-3xl font-bold text-charcoal mb-3">
                Thanks for partnering with us, {form.companyName}!
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We&apos;ve received your solution listing under{" "}
                <strong className="text-charcoal">{CATEGORIES[form.category] ?? form.category}</strong>.{" "}
                <strong className="text-charcoal">{form.contactPerson}</strong> will hear back at{" "}
                <strong className="text-charcoal">{form.email}</strong> within 2–3 business days once our
                team has reviewed your submission.
              </p>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 text-left space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Solution listing received for {form.companyName}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Category: {CATEGORIES[form.category] ?? form.category}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Review response sent to {form.email} in 2–3 business days
                </div>
              </div>

              <p className="text-[13px] text-slate-500 mb-6">
                While you wait, explore how EduBeacon connects solution providers with schools across India.
              </p>

              <a
                href="/"
                className="inline-block bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-3 rounded-xl font-bold text-[14px] transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF8] to-white pt-24 pb-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <Store className="w-8 h-8 text-[#0E733B]" />
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4">List Your Solution</h1>
            <p className="text-lg text-slate-600">
              Reach schools looking for innovative solutions on EduBeacon
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Company Name *</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Contact Person Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="your@company.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Website</label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Solution Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                >
                  <option value="">Select a category</option>
                  {Object.entries(CATEGORIES).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Solution Description *</label>
                <textarea
                  placeholder="Tell us about your solution and how it helps schools"
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-4 rounded-lg font-bold text-base transition-colors shadow-md"
              >
                Submit Your Solution
              </button>
            </form>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-8">
            <h3 className="font-bold text-lg text-charcoal mb-6">Have questions?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-[#0E733B] hover:underline">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Phone</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-sm text-[#0E733B] hover:underline">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Location</p>
                  <p className="text-sm text-slate-600">{siteConfig.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
