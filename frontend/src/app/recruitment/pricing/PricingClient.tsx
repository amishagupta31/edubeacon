"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, GraduationCap, School, ChevronDown, Sparkles } from "lucide-react";
import { RecruitmentFooter } from "@/features/recruitment/landing/LandingParts";

type Audience = "teachers" | "schools";

const PLANS: Record<Audience, { name: string; price: number; years: number | null }[]> = {
  teachers: [
    { name: "1 Year", price: 1100, years: 1 },
    { name: "5 Years", price: 2100, years: 5 },
    { name: "Lifetime", price: 5100, years: null },
  ],
  schools: [
    { name: "1 Year", price: 11000, years: 1 },
    { name: "5 Years", price: 21000, years: 5 },
    { name: "Lifetime", price: 51000, years: null },
  ],
};

const INCLUDED: Record<Audience, string[]> = {
  teachers: [
    "Verified teacher profile schools can discover",
    "Apply to roles at verified schools in one click",
    "Job matches by subject, board and city",
    "Track every application stage in your dashboard",
    "Receive offer letters and negotiate salary in-app",
    "Public profile link to share with any school",
  ],
  schools: [
    "Unlimited job posts for your institution",
    "AI screening and match scores for every applicant",
    "One hiring pipeline — shortlist, demo class, interview",
    "Compare candidates side by side",
    "Offer letter builder and in-app salary negotiation",
    "Public school profile with a verified badge on approval",
  ],
};

const FAQ = [
  { q: "Is this a one-time payment?", a: "Yes. Each plan is paid once for its full term — 1 year, 5 years, or lifetime access. There is no monthly billing." },
  { q: "Do all plans include the same features?", a: "Yes. Plans differ only in how long your access lasts; every feature listed is included in each plan." },
  { q: "What happens when my plan ends?", a: "Your profile and history stay on EduBeacon. You can renew or move to a longer plan at any time." },
  { q: "Can a school group hire for multiple campuses?", a: "A school plan covers one institution account. Contact us for multi-campus groups." },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PricingClient() {
  const params = useSearchParams();
  const [aud, setAud] = useState<Audience>(params.get("for") === "schools" ? "schools" : "teachers");
  const plans = PLANS[aud];
  const yearly = plans[0].price;

  return (
    <div className="bg-[#F5F7F5]">
      {/* Header band */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(180deg, #0C2A1B 0%, #0E3524 70%, #0F3A27 100%)" }}>
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 bottom-[-180px] w-[620px] h-[300px] rounded-full bg-[#10B981]/15 blur-3xl" />
        <div className="relative max-w-[760px] mx-auto px-5 pt-12 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#8FE3B0]">
            <Sparkles className="w-3.5 h-3.5" /> Pay once. No monthly fees.
          </span>
          <h1 className="mt-5 text-[32px] sm:text-[40px] font-bold tracking-tight leading-tight">Simple pricing for teachers and schools</h1>
          <p className="mt-3 text-[16px] text-white/85">Pick how long you want access. Every plan includes every feature.</p>

          <div role="tablist" aria-label="Choose audience" className="mt-8 inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15">
            {(["teachers", "schools"] as const).map((a) => (
              <button
                key={a}
                role="tab"
                aria-selected={aud === a}
                onClick={() => setAud(a)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
                  aud === a ? "bg-white text-[#0C2A1B]" : "text-white/85 hover:text-white"
                }`}
              >
                {a === "teachers" ? <GraduationCap className="w-4 h-4" /> : <School className="w-4 h-4" />}
                For {a === "teachers" ? "Teachers" : "Schools"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 -mt-14">
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p) => {
            const best = p.years === 5;
            const perYear = p.years ? Math.round(p.price / p.years) : null;
            const save = p.years && p.years > 1 ? Math.round((1 - p.price / (yearly * p.years)) * 100) : null;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl bg-white p-7 ${
                  best ? "ring-2 ring-[#0E733B] shadow-[0_18px_40px_-12px_rgba(14,115,59,0.35)]" : "border border-slate-200 shadow-sm"
                }`}
              >
                {best && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0E733B] px-3 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white">
                    Best value
                  </span>
                )}
                <p className="text-[15px] font-semibold text-[#1B2A22]">{p.name}</p>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[40px] font-bold tracking-tight text-[#0C2A1B] tabular-nums">{inr(p.price)}</span>
                  <span className="text-[14px] text-slate-600">{p.years ? "one-time" : "once, forever"}</span>
                </p>
                <p className="mt-1 h-5 text-[13.5px] text-slate-600">
                  {p.years === 1 && `${aud === "teachers" ? "Teacher" : "School"} access for 12 months`}
                  {p.years === 5 && <>Just {inr(perYear!)}/year · <b className="text-[#0E733B]">save {save}%</b></>}
                  {p.years === null && "Never renew again"}
                </p>
                <ul className="mt-6 flex flex-col gap-2.5 text-[14px] text-[#2A3A31]">
                  <li className="flex gap-2.5"><Check className="w-4 h-4 mt-0.5 text-[#0E733B] shrink-0" /> All {aud === "teachers" ? "teacher" : "school"} features included</li>
                  <li className="flex gap-2.5"><Check className="w-4 h-4 mt-0.5 text-[#0E733B] shrink-0" /> {p.years ? `Valid for ${p.years === 1 ? "1 year" : `${p.years} years`}` : "Lifetime access"}</li>
                  <li className="flex gap-2.5"><Check className="w-4 h-4 mt-0.5 text-[#0E733B] shrink-0" /> {aud === "teachers" ? "Unlimited applications" : "Unlimited job posts"}</li>
                </ul>
                <Link
                  href="/recruitment/register"
                  className={`mt-auto pt-7 block`}
                >
                  <span className={`block w-full rounded-xl py-3 text-center text-[14.5px] font-semibold transition-colors ${
                    best ? "bg-[#0E733B] hover:bg-[#0B5C2F] text-white" : "bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#0C2A1B]"
                  }`}>
                    Get {p.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[12.5px] text-slate-600">All prices in Indian Rupees (INR).</p>
      </section>

      {/* Included */}
      <section className="max-w-[1080px] mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-10 grid md:grid-cols-[0.8fr_1.2fr] gap-8">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0E733B]">Every plan includes</p>
            <h2 className="mt-2 text-[26px] font-bold leading-tight text-[#0C2A1B]">
              Everything {aud === "teachers" ? "a teacher needs to land the right role" : "a school needs to hire well"}.
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
            {INCLUDED[aud].map((f) => (
              <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-[#2A3A31]">
                <span className="w-5 h-5 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0 mt-px">
                  <Check className="w-3.5 h-3.5 text-[#0E733B]" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[760px] mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-center text-[24px] font-bold text-[#0C2A1B] mb-6">Pricing questions</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group bg-white rounded-xl border border-slate-200 px-5 py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[15px] font-semibold text-[#1B2A22] [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <p className="mt-3 text-[14px] leading-[1.7] text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RecruitmentFooter />
    </div>
  );
}
