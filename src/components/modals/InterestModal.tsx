"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import ModalShell from "./ModalShell";

export default function InterestModal({
  onClose,
  vendorName,
}: {
  onClose: () => void;
  vendorName?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    school: "",
    designation: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ModalShell title="Request Received!" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-teal-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Handshake className="w-8 h-8 text-teal" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-[22px] font-bold text-edu-blue mb-3">
            Thank you for your interest!
          </h3>
          <p className="text-slate-soft text-[15px] leading-relaxed">
            The Edubeacon team will help connect you with{" "}
            <strong>{vendorName ?? "the right solution provider"}</strong>. You
            can expect to hear from us within 24–48 hours.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-edu-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-edu-blue-mid transition-colors"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Express Your Interest" onClose={onClose}>
      {vendorName && (
        <div className="mb-5 px-4 py-3 bg-sky-pastel rounded-lg">
          <p className="text-[13px] text-edu-blue">
            Expressing interest in:{" "}
            <strong className="font-semibold">{vendorName}</strong>
          </p>
        </div>
      )}
      <p className="text-slate-soft text-[14px] mb-5">
        Share your details and Edubeacon will connect you with the solution provider.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            School / Organization *
          </label>
          <input
            required
            type="text"
            placeholder="School or organization name"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Designation
            </label>
            <input
              type="text"
              placeholder="e.g. Principal"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Phone *
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
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Email Address *
          </label>
          <input
            required
            type="email"
            placeholder="you@school.edu.in"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Your Requirement
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe what you're looking for..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 resize-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-edu-blue text-white py-3.5 rounded-lg font-semibold text-[14px] hover:bg-edu-blue-mid transition-colors"
        >
          Send My Interest →
        </button>
      </form>
    </ModalShell>
  );
}
