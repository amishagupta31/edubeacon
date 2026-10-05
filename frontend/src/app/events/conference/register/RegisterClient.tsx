"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useModal } from "@/components/modals/ModalProvider";

const EVENT = {
  name: "Principal Conclave on",
  nameAccent: "AI in School Education",
  organisers: "Edubeacon & India Genius Foundation",
  date: "25th October 2026",
  time: "9:00 AM onwards",
  venue: "Shivalik University, Dehradun",
  addressLines: [
    "Shivalik University, Dehradun Shiniwala,",
    "P.O. Sherpur, Shimla Road, Dehradun – 248197, Uttarakhand",
  ],
  landmark: "500 metres from Chakrata Road, Dhoolkot",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Shivalik University, Shimla Road, Sherpur, Dehradun, Uttarakhand 248197"),
};

const BENEFITS = [
  "Panel discussions on AI, NEP 2020 and holistic child development",
  "Meet 250+ school leaders, principals and educators",
  "Discover solutions from 10+ education startups",
  "Excellence in Education Awards ceremony",
  "Curated round tables with solution providers",
  "Lunch and networking included",
];

export default function RegisterClient() {
  const { openModal } = useModal();

  // Someone arriving from a shared link wants to register — open the form straight away.
  useEffect(() => {
    const t = setTimeout(() => openModal("school-register"), 400);
    return () => clearTimeout(t);
  }, [openModal]);

  return (
    <div className="min-h-screen bg-[#0A1A10] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
            <source src="/videos/conferencepage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#061A10]/90 via-[#061A10]/85 to-[#0A1A10]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-14 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-900/50 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              Registrations Open
            </span>
          </div>

          <h1 className="font-display font-bold text-[30px] sm:text-[42px] md:text-[50px] leading-[1.08] tracking-tight mb-3">
            {EVENT.name}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              {EVENT.nameAccent}
            </span>
          </h1>

          <p className="text-slate-300 text-[14px] sm:text-[15px] mb-8">
            Organised by {EVENT.organisers}
          </p>

          {/* Key facts */}
          <div className="flex flex-wrap justify-center items-center gap-x-7 gap-y-3 mb-9 text-[13.5px] font-medium">
            <span className="flex items-center gap-2 text-emerald-300 font-bold">
              <Calendar className="w-4 h-4" /> {EVENT.date}
            </span>
            <span className="flex items-center gap-2 text-slate-200">
              <Clock className="w-4 h-4 text-emerald-300" /> {EVENT.time}
            </span>
            <a
              href={EVENT.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-300" /> {EVENT.venue}
            </a>
          </div>

          <button
            onClick={() => openModal("school-register")}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-[14px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Register as School / Educator
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[12px] text-slate-400 mt-4">
            Free to attend · Email verification required
          </p>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-display font-bold text-[20px] sm:text-[24px] mb-6 text-center">
          What your registration includes
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5 mb-12">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-[14px] text-slate-300 leading-relaxed">{b}</span>
            </div>
          ))}
        </div>

        {/* Venue */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 mb-10">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-emerald-400 mb-3">
            Venue
          </p>
          {EVENT.addressLines.map((l) => (
            <p key={l} className="text-[14.5px] text-white leading-relaxed">{l}</p>
          ))}
          <p className="text-[13px] text-slate-400 mt-1.5">({EVENT.landmark})</p>
          <a
            href={EVENT.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[12.5px] font-bold transition-all"
          >
            <MapPin className="w-3.5 h-3.5" /> Get Directions
          </a>
        </div>

        {/* Title sponsor */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Title Sponsor
          </p>
          <Image
            src="/images/sponsors/shivalik-university.png"
            alt="Shivalik University"
            width={2000}
            height={1000}
            className="h-11 w-auto rounded-md bg-white px-3 py-1.5"
          />
        </div>

        {/* Closing CTA */}
        <div className="text-center border-t border-white/10 pt-10">
          <button
            onClick={() => openModal("school-register")}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-[14px] uppercase tracking-wider text-charcoal bg-white hover:bg-emerald-50 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Register Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="mt-6 text-[13px] text-slate-400">
            Want the full agenda and speaker list?{" "}
            <Link href="/events/conference" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">
              View the conference page
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
