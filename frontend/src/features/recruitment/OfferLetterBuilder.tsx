"use client";

import { useState } from "react";
import { ChevronLeft, FileText, Zap, Check } from "lucide-react";

// ── Demo data ──────────────────────────────────────────────────────────────

const TEMPLATES = ["Teaching — permanent", "Teaching — contract", "Non-teaching", "Leadership"] as const;
const LANGUAGES = ["English", "Hindi", "Bilingual (English + Hindi)"] as const;

const CLAUSES = [
  { id: "probation", label: "Probation & confirmation", defaultOn: true },
  { id: "child-protection", label: "Child-protection policy", defaultOn: true },
  { id: "leave", label: "Leave policy", defaultOn: true },
  { id: "bond", label: "Service bond", defaultOn: false },
];

const SALARY_ROWS = [
  { label: "Basic", amount: "₹39,000" },
  { label: "House rent allowance", amount: "₹15,600" },
  { label: "Special allowance", amount: "₹16,844" },
  { label: "Employer PF (12% of basic)", amount: "₹4,680" },
  { label: "Gratuity (4.81% of basic)", amount: "₹1,876" },
];

const APPROVAL_CHAIN = [
  { step: 1, role: "HR", status: "Drafting", color: "bg-[#0E733B] text-white" },
  { step: 2, role: "Principal", status: "Waiting", color: "bg-slate-200 text-slate-600" },
  { step: 3, role: "Management", status: "Only if above target band", color: "bg-slate-200 text-slate-600" },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function OfferLetterBuilder({
  onBack,
}: {
  onBack: () => void;
}) {
  const [template, setTemplate] = useState(TEMPLATES[0] as string);
  const [joiningDate, setJoiningDate] = useState("2027-04-01");
  const [ctc, setCtc] = useState("78000");
  const [probation, setProbation] = useState("6 months");
  const [noticePeriod, setNoticePeriod] = useState("60 days");
  const [offerExpires, setOfferExpires] = useState("7 days after sending");
  const [language, setLanguage] = useState(LANGUAGES[0] as string);
  const [enabledClauses, setEnabledClauses] = useState<Set<string>>(
    new Set(CLAUSES.filter((c) => c.defaultOn).map((c) => c.id))
  );
  const [sendVia, setSendVia] = useState({ email: true, whatsapp: true, inApp: true });
  const [statusTab, setStatusTab] = useState<"Draft" | "Approved" | "Sent">("Draft");

  const toggleClause = (id: string) => {
    setEnabledClauses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const label = "block text-[11.5px] font-semibold text-slate-500 mb-1";
  const field =
    "w-full border border-line rounded-lg px-3 py-2 text-[13px] text-charcoal bg-white " +
    "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";

  return (
    <div className="max-w-full">
      {/* ── Breadcrumb ── */}
      <p className="text-[13px] text-slate-500 mb-1">
        <button
          onClick={onBack}
          className="text-[#0E733B] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Ananya Iyer
        </button>
        <span className="mx-1.5">/</span>
        <span>Offer letter</span>
      </p>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mt-2 mb-5">
        <h1 className="font-display font-bold text-[26px] sm:text-[30px] text-charcoal leading-tight tracking-tight">
          New offer — PGT Physics
        </h1>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[12.5px] text-slate-500 font-semibold px-3 py-2">Draft · v1</span>
          <button className="px-4 py-2.5 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
            Preview PDF
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all">
            Submit for approval
          </button>
        </div>
      </div>

      {/* ── Three-column layout ── */}
      <div className="grid lg:grid-cols-[250px_1fr_270px] gap-4 items-start">

        {/* ══════════ Left: Details form ══════════ */}
        <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
          <div className="flex items-center justify-between gap-2 mb-5">
            <h2 className="font-display font-bold text-[15px] text-charcoal">Details</h2>
            <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0E733B] bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-all">
              <Zap className="w-3 h-3" /> Auto-fill from pipeline
            </button>
          </div>

          <div className="space-y-4">
            {/* Template */}
            <div>
              <label className={label}>Template</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className={`${field} cursor-pointer`}>
                {TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Joining date + CTC */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Joining date</label>
                <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className={`${field} cursor-pointer text-[12px]`} />
              </div>
              <div>
                <label className={label}>CTC / month</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">₹</span>
                  <input
                    type="text" value={Number(ctc).toLocaleString("en-IN")}
                    onChange={(e) => setCtc(e.target.value.replace(/\D/g, ""))}
                    className={`${field} pl-6`}
                  />
                </div>
              </div>
            </div>

            {/* Probation + Notice */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Probation</label>
                <input type="text" value={probation} onChange={(e) => setProbation(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Notice period</label>
                <input type="text" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className={field} />
              </div>
            </div>

            {/* Offer expires */}
            <div>
              <label className={label}>Offer expires</label>
              <input type="text" value={offerExpires} onChange={(e) => setOfferExpires(e.target.value)} className={field} />
            </div>

            {/* Clauses */}
            <div>
              <label className={label}>Clauses</label>
              <div className="space-y-2.5 mt-1">
                {CLAUSES.map((c) => (
                  <label key={c.id} className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={enabledClauses.has(c.id)}
                      onChange={() => toggleClause(c.id)}
                      className="w-4 h-4 rounded accent-[#0E733B] cursor-pointer"
                    />
                    <span className="text-[12.5px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className={label}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${field} cursor-pointer`}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ══════════ Center: Letter preview ══════════ */}
        <div className="bg-white rounded-2xl border border-line shadow-lg min-h-[700px]">
          {/* Letter paper */}
          <div className="p-8 sm:p-10">
            {/* School header */}
            <div className="flex items-start justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-charcoal">Greenfield Public School</p>
                  <p className="text-[11px] text-slate-400">[CAMPUS ADDRESS]</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 shrink-0">Ref [OFFER-ID]</p>
            </div>

            {/* Letter body */}
            <div className="text-[13px] text-slate-700 leading-[1.85] space-y-4">
              <p>Dear Ananya Iyer,</p>

              <p>
                We are pleased to offer you the position of{" "}
                <strong className="text-charcoal">Post Graduate Teacher (Physics)</strong> for Classes XI–XII,
                effective <strong className="text-charcoal">1 April 2027</strong>, at a monthly cost to company of{" "}
                <strong className="text-charcoal">₹78,000</strong>, as detailed in Annexure A.
              </p>

              <p>
                You will be on probation for six months, after which your appointment will be confirmed subject to
                satisfactory performance. Either party may end the engagement with 60 days&apos; written notice.
              </p>

              <p>
                This offer is subject to verification of your documents, police verification, and your acceptance of
                the school&apos;s child-protection policy.
              </p>

              {/* Annexure */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-[12.5px] font-bold text-charcoal mb-3">
                  Annexure A — Salary breakup (monthly)
                </p>
                <div className="space-y-1.5">
                  {SALARY_ROWS.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <span className="text-[12.5px] text-slate-600">{row.label}</span>
                      <span className="text-[12.5px] text-slate-600 tabular-nums flex items-center gap-2">
                        <span className="flex-1 border-b border-dotted border-slate-200 min-w-[40px]" />
                        {row.amount}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-slate-300">
                    <span className="text-[12.5px] font-bold text-charcoal">Cost to company</span>
                    <span className="text-[12.5px] font-bold text-charcoal tabular-nums">₹78,000</span>
                  </div>
                </div>
              </div>

              {/* Signature block */}
              <div className="flex items-end justify-between gap-8 mt-10 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-300 mb-1" />
                  <p className="text-[11px] text-slate-500">[SIGNATORY], Principal</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-300 mb-1" />
                  <p className="text-[11px] text-slate-500">Candidate e-signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ Right: Approval + Send + Status ══════════ */}
        <div className="flex flex-col gap-4">
          {/* Approval chain */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[14px] text-charcoal mb-4">Approval chain</h3>
            <div className="space-y-3.5">
              {APPROVAL_CHAIN.map((a) => (
                <div key={a.step} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${a.color}`}>
                    {a.step}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-charcoal">{a.role}</p>
                    <p className="text-[11px] text-slate-500">{a.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Send via */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[14px] text-charcoal mb-4">Send via</h3>
            <div className="space-y-2.5">
              {([
                ["email", "Email"],
                ["whatsapp", "WhatsApp"],
                ["inApp", "In-app"],
              ] as const).map(([key, text]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={sendVia[key]}
                    onChange={(e) => setSendVia((s) => ({ ...s, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#0E733B] cursor-pointer"
                  />
                  <span className="text-[13px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                    {text}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Sends automatically once the last approver signs off. Reminders go out 2 days before expiry.
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[14px] text-charcoal mb-4">Status</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(["Draft", "Approved", "Sent"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    statusTab === tab
                      ? "bg-[#0C2A1B] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-3 text-[12px] text-slate-400 font-semibold mb-3">
              <span>Viewed</span>
              <span>Accepted</span>
            </div>
            <button className="text-[12.5px] font-semibold text-[#0E733B] hover:underline underline-offset-2">
              Version history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
