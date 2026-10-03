"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import { CheckCircle2 } from "lucide-react";
import ModalShell from "./ModalShell";

const categoryOptions = [
  "STEM Labs", "AI Labs", "Robotics", "Smart Classrooms", "EdTech Platform",
  "School ERP", "Books & Publishing", "Assessment", "Teacher Training",
  "Olympiad", "Adventure & Entertainment", "Recognition, Awards & Prizes",
  "Healthcare", "Infrastructure", "Sports & Activity", "Other",
];

export default function VendorRegistrationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    category: "",
    companyDescription: "",
    productDescription: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${API}/api/registrations/vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error("Failed to save vendor registration:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <ModalShell title="Application Received!" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-teal-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-teal" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-[22px] font-bold text-edu-blue mb-3">
            Welcome to Edubeacon!
          </h3>
          <p className="text-slate-soft text-[15px] leading-relaxed mb-6">
            Thank you for applying to list your solution on Edubeacon. Our team will review your application and get in touch within 2–3 business days.
          </p>
          <button
            onClick={onClose}
            className="bg-edu-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-edu-blue-mid transition-colors"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="List Your Solution" onClose={onClose} size="lg">
      <p className="text-slate-soft text-[14px] mb-6">
        Register your company on Edubeacon and start connecting with schools across India.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Company Name *
            </label>
            <input
              required
              type="text"
              placeholder="Your company name"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Contact Person *
            </label>
            <input
              required
              type="text"
              placeholder="Full name"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.contactPerson}
              onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Designation *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Founder, Business Development Head"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Email Address *
            </label>
            <input
              required
              type="email"
              placeholder="you@company.com"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Phone Number *
            </label>
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Website
            </label>
            <input
              type="url"
              placeholder="https://yourcompany.com"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Solution Category *
          </label>
          <select
            required
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select your primary category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Company Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief description of your company..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 resize-none"
            value={form.companyDescription}
            onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Product / Service Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe the product or service you want to list..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 resize-none"
            value={form.productDescription}
            onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal text-white py-3.5 rounded-lg font-semibold text-[14px] hover:bg-teal-light transition-colors mt-2 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Application →"}
        </button>
        <p className="text-center text-[11px] text-slate-soft">
          Our team will review your application and contact you within 2–3 business days.
        </p>
      </form>
    </ModalShell>
  );
}
