"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import Container from "./ui/Container";
import { siteConfig } from "@/lib/data";

const inquiryTypes = [
  "School Registration",
  "Vendor Registration",
  "Sponsorship",
  "Exhibition",
  "Conference",
  "Partnership",
  "General Inquiry",
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F8FAF8]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left: Info */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-6 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>Get In Touch</span>
            </div>
            <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-5 tracking-tight">
              Let&apos;s Start a{" "}
              <span className="text-[#0E733B]">Conversation</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-slate-soft mb-10 font-normal">
              Whether you&#39;re a school looking to connect with solution providers, a startup wanting to join Edubeacon, or an organization interested in partnership or sponsorship — we&#39;d love to hear from you.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
                { icon: MapPin, label: "Location", value: siteConfig.location, href: "#" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-soft mb-0.5">
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      className="text-[15px] font-semibold text-charcoal hover:text-[#0E733B] transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-10 pt-8 border-t border-line">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-soft mb-4">
                Follow Edubeacon
              </p>
              <div className="flex gap-3">
                {["LinkedIn", "Twitter", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="bg-white border border-line text-[12.5px] font-semibold text-slate-700 px-4 py-2 rounded-xl hover:border-[#0E733B] hover:text-[#0E733B] transition-colors shadow-sm"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl border border-line p-8 md:p-9 shadow-lg reveal reveal-delay-2">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#0E733B]" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-[22px] text-charcoal mb-3">
                  Message Received!
                </h3>
                <p className="text-slate-soft text-[15px] leading-relaxed">
                  Thank you for reaching out. The Edubeacon team will respond within 1–2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[13px] text-[#0E733B] font-bold hover:text-[#0B5C2F] transition-colors"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-[22px] text-charcoal mb-6 tracking-tight">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Full name"
                        className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Organization
                      </label>
                      <input
                        type="text"
                        placeholder="School or company"
                        className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@email.com"
                        className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Inquiry Type *
                    </label>
                    <select
                      required
                      className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full border border-line rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 resize-none transition-all"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    id="contact-submit"
                    className="w-full bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] text-white py-4 rounded-xl font-bold text-[14.5px] hover:opacity-90 transition-all shadow-md mt-2"
                  >
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

