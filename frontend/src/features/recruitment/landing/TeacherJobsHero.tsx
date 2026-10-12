"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Sparkles, IndianRupee, CalendarClock, CheckCircle2, ShieldCheck, Handshake } from "lucide-react";
import { img } from "@/lib/images";

const POPULAR = ["PGT Physics", "TGT Mathematics", "PRT English", "Vice Principal"];
const BOARDS = ["CBSE", "ICSE", "IB", "Cambridge IGCSE", "State Boards", "NIOS", "Pre-primary"];

export default function TeacherJobsHero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const goSearch = (query = q, where = city) => {
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (where.trim()) p.set("city", where.trim());
    const qs = p.toString();
    router.push(`/recruitment/jobs${qs ? `?${qs}` : ""}`);
  };

  return (
    <>
      <section className="relative bg-[#0C2A1B] text-white overflow-hidden">
        <div aria-hidden className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#0E733B]/35 blur-3xl bg-blob" />
        <div aria-hidden className="absolute -bottom-48 right-[-120px] w-[560px] h-[560px] rounded-full bg-[#10B981]/15 blur-3xl bg-blob-reverse" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-14 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center">
          <div className="flex flex-col gap-7 min-w-0">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-[#8FE3B0]">
              <Sparkles className="w-3.5 h-3.5" /> India&apos;s recruitment platform for educators
            </span>
            <h1 className="font-display font-bold text-[40px] sm:text-[54px] lg:text-[60px] leading-[1.04] tracking-tight text-balance">
              Your next classroom is <span className="italic text-[#8FE3B0]">looking for you.</span>
            </h1>
            <p className="text-[16px] sm:text-[17px] leading-[1.7] text-white/80 max-w-[46ch]">
              Build one profile. Get matched with verified schools that need your subject, your board and your city —
              and hear back faster.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); goSearch(); }}
              className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 flex flex-col sm:flex-row gap-2 w-full max-w-[600px]"
            >
              <label className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 sm:bg-transparent min-w-0">
                <Search className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Subject or role, e.g. PGT Chemistry"
                  className="w-full bg-transparent text-[14.5px] text-charcoal placeholder:text-slate-500 focus:outline-none min-w-0"
                />
              </label>
              <span className="hidden sm:block w-px bg-slate-200 my-2" />
              <label className="flex items-center gap-2.5 sm:w-[170px] px-3.5 py-2.5 rounded-xl bg-slate-50 sm:bg-transparent min-w-0">
                <MapPin className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full bg-transparent text-[14.5px] text-charcoal placeholder:text-slate-500 focus:outline-none min-w-0"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E733B] hover:bg-[#0B5C2F] px-6 py-3 text-[14px] font-bold text-white transition-colors"
              >
                Search jobs
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12.5px] text-white/70 mr-1">Popular:</span>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => goSearch(p, "")}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[12.5px] font-medium text-white/90 hover:bg-white/15 hover:text-white transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5] rounded-[28px] overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <Image src={img.teacherClassroom} alt="A teacher leading a class" fill priority sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2A1B]/70 via-transparent to-transparent" />
            </div>

            <div className="absolute left-[-8px] sm:-left-8 top-[12%] w-[230px] sm:w-[250px] bg-white rounded-2xl shadow-xl p-4 text-charcoal ewc-float">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E733B]">New match</span>
                <span className="text-[11px] font-bold text-white bg-[#0E733B] rounded-full px-2 py-0.5">94%</span>
              </div>
              <p className="font-bold text-[14px] leading-tight">PGT Chemistry</p>
              <p className="text-[12px] text-slate-600 mt-0.5">CBSE · Senior Secondary · Pune</p>
              <div className="flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-slate-700">
                <IndianRupee className="w-3.5 h-3.5 text-[#0E733B]" /> 55k – 70k / month
              </div>
            </div>

            <div className="absolute right-[-8px] sm:-right-6 top-[46%] w-[210px] bg-white rounded-2xl shadow-xl p-4 text-charcoal ewc-drift">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-4.5 h-4.5 text-[#0E733B]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold leading-tight">Demo class scheduled</p>
                  <p className="text-[11.5px] text-slate-600">Thu · 11:00 AM</p>
                </div>
              </div>
            </div>

            <div className="absolute left-4 sm:left-8 bottom-6 right-4 sm:right-auto sm:w-[290px] bg-white/95 backdrop-blur rounded-2xl shadow-xl p-4 text-charcoal">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E733B] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight">Offer received</p>
                  <p className="text-[12px] text-slate-600 truncate">TGT Mathematics · ₹62,000 / month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg aria-hidden className="block w-full h-10 sm:h-16 text-white" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 64h1440V18C1180 54 900 64 720 44S240 0 0 30z" />
        </svg>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 py-10 flex flex-col items-center gap-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">
            Openings across every board and level
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {BOARDS.map((b) => (
              <span key={b} className="font-display font-bold text-[18px] sm:text-[20px] text-slate-400 hover:text-[#0E733B] transition-colors">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function TeacherTrustRow() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 grid md:grid-cols-3 gap-5">
        {[
          { icon: ShieldCheck, t: "Verified schools", d: "Institutions go through review before they get the verified badge." },
          { icon: Handshake, t: "Direct conversations", d: "You talk to the school, not a placement agent taking a cut." },
          { icon: IndianRupee, t: "Pay once, no commission", d: "Plans from ₹1,100 — no placement agent takes a cut of your salary." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex gap-4 items-start p-2">
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-[16px] text-charcoal">{t}</h3>
              <p className="text-[14px] leading-relaxed text-slate-600">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
