"use client";

import { useState } from "react";
import { ChevronLeft, FileText } from "lucide-react";

// ── Demo data ──────────────────────────────────────────────────────────────

const OFFER = {
  school: "Greenfield Public School",
  role: "PGT Physics · XI–XII",
  ctc: "₹82,000",
  ctcLabel: "/ month CTC",
  joining: "1 Apr 2027",
  expiresBadge: "Expires in 4 days",
  breakup: [
    { label: "Basic", amount: "₹41,000" },
    { label: "HRA", amount: "₹16,400" },
    { label: "Special allowance", amount: "₹17,708" },
    { label: "Employer PF", amount: "₹4,920" },
    { label: "Gratuity", amount: "₹1,972" },
  ],
  keyTerms: [
    { label: "Probation", value: "6 months" },
    { label: "Notice period", value: "60 days" },
  ],
};

// ── Component ──────────────────────────────────────────────────────────────

export default function CandidateOfferView({ onBack }: { onBack?: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    /* Outer shell — mimics a narrow mobile/candidate-app viewport centred in the
       school dashboard so the design reads correctly */
    <div className="max-w-full">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
        Candidate app — offer view
      </p>

      <div className="flex justify-start">
        <div className="w-full max-w-[380px] min-h-[680px] bg-[#F6F8F7] rounded-3xl border border-line shadow-xl overflow-hidden flex flex-col">

          {/* ── App header ── */}
          <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
            )}
            <p className="font-display font-bold text-[16px] text-charcoal">Your offer</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* ── Offer hero card ── */}
            <div className="bg-[#0C2A1B] mx-4 mt-4 rounded-2xl p-5 text-white">
              <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide mb-1">
                {OFFER.school}
              </p>
              <p className="font-display font-bold text-[18px] leading-tight mb-3">
                {OFFER.role}
              </p>

              <div className="mb-4">
                <span className="font-display font-bold text-[34px] leading-none tabular-nums">
                  {OFFER.ctc}
                </span>
                <span className="text-[13px] text-emerald-300 ml-1.5">{OFFER.ctcLabel}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11.5px] font-semibold bg-white/10 px-2.5 py-1 rounded-full">
                  Joining {OFFER.joining}
                </span>
                <span className="text-[11.5px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
                  {OFFER.expiresBadge}
                </span>
              </div>
            </div>

            {/* ── Salary breakup ── */}
            <div className="bg-white mx-4 mt-3 rounded-2xl border border-line p-5">
              <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-3.5">
                Salary breakup
              </p>
              <div className="space-y-2.5">
                {OFFER.breakup.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-slate-600">{row.label}</span>
                    <span className="text-[13px] font-semibold text-charcoal tabular-nums">
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Key terms ── */}
            <div className="bg-white mx-4 mt-3 rounded-2xl border border-line p-5">
              <p className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-3.5">
                Key terms
              </p>
              <div className="space-y-2.5">
                {OFFER.keyTerms.map((t) => (
                  <div key={t.label} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-slate-600">{t.label}</span>
                    <span className="text-[13px] font-semibold text-charcoal">{t.value}</span>
                  </div>
                ))}
              </div>

              <button className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0E733B] hover:underline underline-offset-2">
                <FileText className="w-3.5 h-3.5" /> Read full offer letter (PDF)
              </button>
            </div>

            <div className="h-4" />
          </div>

          {/* ── Action buttons ── */}
          <div className="bg-white border-t border-slate-100 px-4 pt-4 pb-5 space-y-2.5">
            {accepted ? (
              <div className="py-3 text-center">
                <p className="text-[14px] font-bold text-emerald-700">✓ Offer accepted & e-signed</p>
                <p className="text-[12px] text-slate-500 mt-1">The school has been notified.</p>
              </div>
            ) : declined ? (
              <div className="py-3 text-center">
                <p className="text-[14px] font-bold text-red-600">Offer declined</p>
                <p className="text-[12px] text-slate-500 mt-1">Thank you for letting us know.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAccepted(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#0E733B] text-white font-bold text-[14px] hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
                >
                  Accept &amp; e-sign
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 transition-all">
                    Request revision
                  </button>
                  <button
                    onClick={() => setDeclined(true)}
                    className="py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
