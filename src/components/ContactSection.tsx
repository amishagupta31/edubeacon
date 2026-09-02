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
    <section id="contact" className="py-20 md:py-28 bg-sky-pastel/40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left: Info */}
          <div className="reveal">
            <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6 border border-edu-blue/15 shadow-sm">
              Get In Touch
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-5">
              Let&apos;s Start a{" "}
              <span className="text-teal">Conversation</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-soft mb-10">
              Whether you&#39;re a school looking to connect with solution providers, a startup wanting to join Edubeacon, or an organization interested in partnership or sponsorship — we&#39;d love to hear from you.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
                { icon: MapPin, label: "Location", value: siteConfig.location, href: "#" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white rounded-xl border border-line flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="w-5 h-5 text-edu-blue" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-soft mb-0.5">
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      className="text-[14.5px] font-medium text-charcoal hover:text-teal transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-8 pt-8 border-t border-line">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-soft mb-4">
                Follow Edubeacon
              </p>
              <div className="flex gap-3">
                {["LinkedIn", "Twitter", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="bg-white border border-line text-[12px] font-semibold text-slate px-3 py-1.5 rounded-lg hover:border-edu-blue hover:text-edu-blue transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl border border-line p-7 shadow-sm reveal reveal-delay-2">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-teal-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-bold text-[22px] text-edu-blue mb-3">
                  Message Received!
                </h3>
                <p className="text-slate-soft text-[15px] leading-relaxed">
                  Thank you for reaching out. The Edubeacon team will respond within 1–2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-[13px] text-teal font-semibold hover:text-edu-blue transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-[20px] text-charcoal mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Full name"
                        className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                        Organization
                      </label>
                      <input
                        type="text"
                        placeholder="School or company"
                        className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@email.com"
                        className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                      Inquiry Type *
                    </label>
                    <select
                      required
                      className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
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
                    <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    id="contact-submit"
                    className="w-full bg-edu-blue text-white py-3.5 rounded-xl font-bold text-[14px] hover:bg-edu-blue-mid transition-colors shadow-md mt-2"
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
