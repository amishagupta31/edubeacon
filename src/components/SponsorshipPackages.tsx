"use client";

import { useState } from "react";
import { Ruler, Handshake, Mic } from "lucide-react";
import Container from "./ui/Container";
import { sponsorshipPackages } from "@/lib/data";
import { useModal } from "./modals/ModalProvider";

const tierColors = {
  bronze:  { ring: "border-slate-300", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-500" },
  silver:  { ring: "border-emerald-300", badge: "bg-emerald-50 text-[#0E733B]", dot: "bg-emerald-600" },
  gold:    { ring: "border-[#0E733B]", badge: "bg-emerald-100 text-[#0E733B]", dot: "bg-[#0E733B]" },
  diamond: { ring: "border-emerald-600", badge: "bg-emerald-200 text-[#0E733B]", dot: "bg-[#0E733B]" },
};

export default function SponsorshipPackages() {
  const { openModal } = useModal();
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <section id="sponsorship" className="py-20 md:py-28 bg-[#FDFBF7]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-5 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>Partnership Packages</span>
          </div>
          <h2 className="font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4 tracking-tight">
            Partner With Edubeacon
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[50ch] mx-auto font-normal">
            Gain visibility, connect with education leaders and position your organization at the center of India&#39;s education ecosystem.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {sponsorshipPackages.map((pkg, i) => {
            const colors = tierColors[pkg.tier];
            const isGold = pkg.tier === "gold";

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 reveal reveal-delay-${Math.min(i + 1, 4)} ${
                  isGold
                    ? "border-[#0E733B] bg-emerald-50/40 shadow-lg"
                    : `${colors.ring} bg-white`
                }`}
              >
                {/* Tier badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className="bg-[#0E733B] text-white text-[10.5px] font-bold uppercase tracking-[0.18em] px-3.5 py-1 rounded-full shadow-sm"
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Tier label */}
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0E733B]">
                    {pkg.name}
                  </span>
                </div>

                <p className="text-[13.5px] text-slate-soft leading-relaxed mb-5 flex-1 font-normal">
                  {pkg.description}
                </p>

                {/* Key highlights */}
                {pkg.exhibitionSpace && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-700 mb-2 font-medium">
                    <Ruler className="w-4 h-4 text-[#0E733B] shrink-0" strokeWidth={1.75} />
                    <span>Exhibition: <strong>{pkg.exhibitionSpace}</strong></span>
                  </div>
                )}
                {pkg.guaranteedMeetings && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-700 mb-2 font-medium">
                    <Handshake className="w-4 h-4 text-[#0E733B] shrink-0" strokeWidth={1.75} />
                    <span><strong>{pkg.guaranteedMeetings}</strong> curated school meetings</span>
                  </div>
                )}
                {pkg.speakingSlot && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-700 mb-4 font-medium">
                    <Mic className="w-4 h-4 text-[#0E733B] shrink-0" strokeWidth={1.75} />
                    <span>{pkg.speakingSlot}</span>
                  </div>
                )}

                <ul className="flex flex-col gap-2.5 mb-6 mt-4 border-t border-line pt-4">
                  {pkg.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-slate-700 font-medium">
                      <svg className="mt-0.5 shrink-0" width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4 8L11 1" stroke="#0E733B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className="text-[12px] text-slate-500 ml-5 font-medium">
                      +{pkg.features.length - 5} more benefits
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => openModal("sponsor-register", { packageId: pkg.id, packageName: pkg.name })}
                  className="w-full py-3.5 rounded-xl font-bold text-[14px] bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] text-white hover:opacity-90 transition-all shadow-sm"
                >
                  Register as {pkg.name} →
                </button>
              </div>
            );
          })}
        </div>

        {/* Compare toggle */}
        <div className="text-center">
          <button
            onClick={() => setCompareOpen((v) => !v)}
            className="text-[14px] font-bold text-[#0E733B] hover:text-[#0B5C2F] transition-colors underline decoration-[#0E733B]/30 underline-offset-4"
          >
            {compareOpen ? "Hide" : "Compare"} Partnership Benefits ↓
          </button>
        </div>

        {compareOpen && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line shadow-sm">
            <table className="w-full text-[13px] min-w-[600px]">
              <thead>
                <tr className="bg-[#0A0E17] text-white">
                  <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-emerald-300">Benefit</th>
                  {sponsorshipPackages.map((pkg) => (
                    <th key={pkg.id} className="px-5 py-4 font-bold text-center capitalize text-emerald-300 text-[12px]">
                      {pkg.name.replace(" Partner", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Exhibition Space", "6×6 ft", "8×8 ft", "10×10 ft", "Custom Premium"],
                  ["Curated School Meetings", "5", "10", "15", "20+"],
                  ["Speaking Slot", "—", "10 min", "20 min", "Keynote Available"],
                  ["Magazine Feature", "✓", "Half Page", "Full Page", "Full Page (Front)"],
                  ["Social Media Promotion", "—", "✓", "Priority", "Year-Round"],
                  ["Delegate Passes", "2", "5", "10", "Unlimited"],
                  ["Delegate Contact List", "✓", "✓", "✓", "✓"],
                  ["Panel Participation", "—", "—", "✓ (Founder)", "✓"],
                ].map(([benefit, ...vals], ri) => (
                  <tr key={benefit} className={ri % 2 === 0 ? "bg-white" : "bg-emerald-50/30"}>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{benefit}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} className="px-5 py-3.5 text-center text-slate-600">
                        {v === "—" ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <span className="text-charcoal font-bold">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}

