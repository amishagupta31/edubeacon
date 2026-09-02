"use client";

import { useState } from "react";
import { Ruler, Handshake, Mic } from "lucide-react";
import Container from "./ui/Container";
import { sponsorshipPackages } from "@/lib/data";
import { useModal } from "./modals/ModalProvider";

const tierColors = {
  bronze:  { ring: "border-amber-600/30", badge: "bg-amber-600/10 text-amber-700", dot: "bg-amber-600" },
  silver:  { ring: "border-slate-400/30", badge: "bg-slate-100 text-slate-600",    dot: "bg-slate-400" },
  gold:    { ring: "border-gold/40",      badge: "bg-gold/10 text-gold",            dot: "bg-gold" },
  diamond: { ring: "border-diamond/40",   badge: "bg-diamond/10 text-diamond",      dot: "bg-diamond" },
};

export default function SponsorshipPackages() {
  const { openModal } = useModal();
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <section id="sponsorship" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 reveal">
          <div className="inline-block bg-gold-light text-gold text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-gold/20">
            Partnership Packages
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4">
            Partner With Edubeacon
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft">
            Gain visibility, connect with education leaders and position your organization at the center of India&#39;s education ecosystem.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {sponsorshipPackages.map((pkg, i) => {
            const colors = tierColors[pkg.tier];
            const isGold = pkg.tier === "gold";

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all card-lift reveal reveal-delay-${Math.min(i + 1, 4)} ${
                  isGold
                    ? "border-gold bg-gradient-to-b from-gold-light/80 to-white shadow-xl scale-[1.02]"
                    : `${colors.ring} bg-white`
                }`}
              >
                {/* Tier badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`${colors.badge} text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border`}
                      style={{ borderColor: "currentColor" }}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Tier label */}
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-soft">
                    {pkg.name}
                  </span>
                </div>

                <p className="text-[13.5px] text-slate-soft leading-relaxed mb-5 flex-1">
                  {pkg.description}
                </p>

                {/* Key highlights */}
                {pkg.exhibitionSpace && (
                  <div className="flex items-center gap-2 text-[13px] text-slate mb-2">
                    <Ruler className="w-4 h-4 text-slate-soft shrink-0" strokeWidth={1.75} />
                    <span>Exhibition: <strong>{pkg.exhibitionSpace}</strong></span>
                  </div>
                )}
                {pkg.guaranteedMeetings && (
                  <div className="flex items-center gap-2 text-[13px] text-slate mb-2">
                    <Handshake className="w-4 h-4 text-slate-soft shrink-0" strokeWidth={1.75} />
                    <span><strong>{pkg.guaranteedMeetings}</strong> curated school meetings</span>
                  </div>
                )}
                {pkg.speakingSlot && (
                  <div className="flex items-center gap-2 text-[13px] text-slate mb-4">
                    <Mic className="w-4 h-4 text-slate-soft shrink-0" strokeWidth={1.75} />
                    <span>{pkg.speakingSlot}</span>
                  </div>
                )}

                <ul className="flex flex-col gap-2 mb-6 mt-4 border-t border-line pt-4">
                  {pkg.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-slate">
                      <svg className="mt-0.5 shrink-0" width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4 8L11 1" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className="text-[12px] text-slate-soft ml-5">
                      +{pkg.features.length - 5} more benefits
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => openModal("vendor-register")}
                  className={`w-full py-3 rounded-xl font-semibold text-[13.5px] transition-all ${
                    isGold
                      ? "bg-gold text-white hover:opacity-90 shadow-md"
                      : "bg-edu-blue text-white hover:bg-edu-blue-mid"
                  }`}
                >
                  Become a {pkg.name} →
                </button>
              </div>
            );
          })}
        </div>

        {/* Compare toggle */}
        <div className="text-center">
          <button
            onClick={() => setCompareOpen((v) => !v)}
            className="text-[13.5px] font-semibold text-edu-blue hover:text-teal transition-colors underline decoration-edu-blue/30 underline-offset-3"
          >
            {compareOpen ? "Hide" : "Compare"} Partnership Benefits ↓
          </button>
        </div>

        {compareOpen && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-[13px] min-w-[600px]">
              <thead>
                <tr className="bg-charcoal text-white">
                  <th className="text-left px-5 py-3.5 font-semibold">Benefit</th>
                  {sponsorshipPackages.map((pkg) => (
                    <th key={pkg.id} className="px-5 py-3.5 font-semibold text-center capitalize">
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
                  <tr key={benefit} className={ri % 2 === 0 ? "bg-white" : "bg-sky-pastel/30"}>
                    <td className="px-5 py-3 font-medium text-slate">{benefit}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} className="px-5 py-3 text-center text-slate-soft">
                        {v === "—" ? (
                          <span className="text-line">—</span>
                        ) : (
                          <span className="text-charcoal font-medium">{v}</span>
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
