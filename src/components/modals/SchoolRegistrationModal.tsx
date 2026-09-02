"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";
import ModalShell from "./ModalShell";

const schoolTypes = [
  "CBSE", "ICSE", "IB", "IGCSE", "State Board", "Other",
];

const solutionOptions = [
  "STEM Labs", "AI Labs", "Robotics", "Smart Classrooms", "EdTech Platform",
  "School ERP", "Books & Publishing", "Assessment", "Teacher Training",
  "Healthcare", "Infrastructure", "Other",
];

export default function SchoolRegistrationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    schoolName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    city: "",
    schoolType: "",
    students: "",
    solutions: [] as string[],
    requirements: "",
  });

  const toggle = (sol: string) => {
    setForm((f) => ({
      ...f,
      solutions: f.solutions.includes(sol)
        ? f.solutions.filter((s) => s !== sol)
        : [...f.solutions, sol],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ModalShell title="Registration Received!" onClose={onClose}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-teal-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-teal" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-[22px] font-bold text-edu-blue mb-3">
            Thank you for registering!
          </h3>
          <p className="text-slate-soft text-[15px] leading-relaxed mb-6">
            The Edubeacon team will review your requirements and connect you with the right solution providers. Expect to hear from us within 24–48 hours.
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
    <ModalShell title="Register Your School" onClose={onClose} size="lg">
      <p className="text-slate-soft text-[14px] mb-6">
        Tell us about your school and what you&#39;re looking for. Edubeacon will connect you with the right solution providers.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              School Name *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Delhi Model Senior Secondary School"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
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
              placeholder="e.g. Principal, School Owner"
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
              placeholder="you@school.edu.in"
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
              placeholder="+91 98765 43210"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. New Delhi"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              School Board / Type
            </label>
            <select
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.schoolType}
              onChange={(e) => setForm({ ...form, schoolType: e.target.value })}
            >
              <option value="">Select board</option>
              {schoolTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
              Number of Students
            </label>
            <select
              className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20"
              value={form.students}
              onChange={(e) => setForm({ ...form, students: e.target.value })}
            >
              <option value="">Select range</option>
              <option>Under 500</option>
              <option>500 – 1,000</option>
              <option>1,000 – 2,500</option>
              <option>2,500 – 5,000</option>
              <option>5,000+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slate mb-2 uppercase tracking-wide">
            Solutions Interested In
          </label>
          <div className="flex flex-wrap gap-2">
            {solutionOptions.map((sol) => (
              <button
                key={sol}
                type="button"
                onClick={() => toggle(sol)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                  form.solutions.includes(sol)
                    ? "bg-teal text-white border-teal"
                    : "border-line text-slate-soft hover:border-teal/50"
                }`}
              >
                {sol}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slate mb-1.5 uppercase tracking-wide">
            Current Requirements / Message
          </label>
          <textarea
            rows={3}
            placeholder="Tell us more about what your school is looking for..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-[14px] text-slate focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 resize-none"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-edu-blue text-white py-3.5 rounded-lg font-semibold text-[14px] hover:bg-edu-blue-mid transition-colors mt-2"
        >
          Register My School →
        </button>
        <p className="text-center text-[11px] text-slate-soft">
          Your information is secure and will only be used to connect you with relevant solution providers.
        </p>
      </form>
    </ModalShell>
  );
}
