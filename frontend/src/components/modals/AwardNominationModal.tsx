"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import { Trophy } from "lucide-react";
import ModalShell from "./ModalShell";
import { awardCategories } from "@/lib/data";

export default function AwardNominationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nomineeName: "",
    nomineeOrg: "",
    nomineeDesignation: "",
    awardCategory: "",
    nominatorName: "",
    nominatorEmail: "",
    nominatorPhone: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${API}/api/registrations/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.awardCategory,
          nomineeName: form.nomineeName,
          nomineeOrg: form.nomineeOrg,
          reason: form.reason,
          nominatorName: form.nominatorName,
          nominatorEmail: form.nominatorEmail,
        }),
      });
    } catch (err) {
      console.error("Failed to save award nomination:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <ModalShell title="Nomination Submitted!" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gold" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-[22px] font-bold text-edu-blue mb-3">
            Thank you for your nomination!
          </h3>
          <p className="text-slate-soft text-[15px] leading-relaxed">
            The Edubeacon Awards Committee will review your nomination and you
            will be notified of the shortlist by email.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-gold text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Award Nomination" onClose={onClose} size="lg">
      <p className="text-slate-soft text-[14px] mb-5">
        Nominate an outstanding school, leader or company for an Edubeacon Award.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Award Category *
          </label>
          <select
            required
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
            value={form.awardCategory}
            onChange={(e) => setForm({ ...form, awardCategory: e.target.value })}
          >
            <option value="">Select award category</option>
            {awardCategories.map((a) => (
              <option key={a.title} value={a.title}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Nominee Name / School *
            </label>
            <input
              required
              type="text"
              placeholder="Name or school/organization"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
              value={form.nomineeName}
              onChange={(e) => setForm({ ...form, nomineeName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Nominee Organization
            </label>
            <input
              type="text"
              placeholder="Company or school name"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
              value={form.nomineeOrg}
              onChange={(e) => setForm({ ...form, nomineeOrg: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Why do they deserve this award? *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe their achievement, impact and why they deserve recognition..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <div className="border-t border-line pt-4">
          <p className="text-[12px] font-semibold text-slate-soft uppercase tracking-wide mb-3">
            Your Details (Nominator)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-slate-soft mb-1">Name *</label>
              <input
                required
                type="text"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold"
                value={form.nominatorName}
                onChange={(e) => setForm({ ...form, nominatorName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[12px] text-slate-soft mb-1">Email *</label>
              <input
                required
                type="email"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-gold"
                value={form.nominatorEmail}
                onChange={(e) => setForm({ ...form, nominatorEmail: e.target.value })}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-white py-3.5 rounded-lg font-semibold text-[14px] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Nomination →"}
        </button>
      </form>
    </ModalShell>
  );
}
