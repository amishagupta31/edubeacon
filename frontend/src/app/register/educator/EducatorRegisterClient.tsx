"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { School, Mail, Phone, MapPin, CheckCircle2, PartyPopper } from "lucide-react";
import { siteConfig } from "@/lib/data";

interface FormState {
  schoolName: string;
  principalName: string;
  email: string;
  phone: string;
  city: string;
  requirements: string;
}

export default function EducatorRegisterClient() {
  const [form, setForm] = useState<FormState>({
    schoolName: "", principalName: "", email: "", phone: "", city: "", requirements: "",
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
                <PartyPopper className="w-10 h-10 text-[#0E733B]" strokeWidth={1.6} />
              </div>

              <h2 className="text-3xl font-bold text-charcoal mb-3">
                Welcome to EduBeacon, {form.schoolName}!
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Thank you for registering <strong className="text-charcoal">{form.schoolName}</strong>.
                Our team will reach out to <strong className="text-charcoal">{form.principalName}</strong> at{" "}
                <strong className="text-charcoal">{form.email}</strong> shortly.
                We&apos;re excited to help your school discover world-class education solutions!
              </p>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 text-left space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Registration received for {form.schoolName}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Confirmation will be sent to {form.email}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0E733B] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Our team will connect with you within 2 business days
                </div>
              </div>

              <p className="text-[13px] text-slate-500 mb-6">
                In the meantime, feel free to explore our solutions and upcoming events.
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
              <School className="w-8 h-8 text-[#0E733B]" />
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4">Register Your School</h1>
            <p className="text-lg text-slate-600">
              Join EduBeacon and discover the best solutions for your school
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">School Name *</label>
                  <input
                    type="text"
                    placeholder="Enter school name"
                    required
                    value={form.schoolName}
                    onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Principal/Head Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={form.principalName}
                    onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
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
                <label className="block text-sm font-semibold text-charcoal mb-2">City *</label>
                <input
                  type="text"
                  placeholder="School location"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  What solutions are you looking for? *
                </label>
                <textarea
                  placeholder="Tell us about your school's requirements"
                  rows={4}
                  required
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-4 rounded-lg font-bold text-base transition-colors shadow-md"
              >
                Register Your School
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
