"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Landmark, Mic, Handshake, Calendar, MapPin } from "lucide-react";
import Container from "./ui/Container";
import { img } from "@/lib/images";
import { siteConfig } from "@/lib/data";
import { useModal } from "./modals/ModalProvider";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const experiences = [
  { icon: Landmark, title: "Exhibition", desc: "Discover innovative education products and solutions from 100+ vendors." },
  { icon: Mic, title: "Conference", desc: "Hear from education leaders, policymakers and industry experts." },
  { icon: Handshake, title: "Networking", desc: "Build meaningful relationships with education decision-makers." },
  { icon: Calendar, title: "Curated Meetings", desc: "Pre-arranged 1:1 meetings connecting schools with relevant vendors." },
];

export default function ConferenceSection() {
  const { openModal } = useModal();
  const timeLeft = useCountdown(siteConfig.conferenceDate);

  return (
    <section id="conference" className="relative py-20 md:py-28 overflow-hidden bg-[#0A0E17]">
      {/* Full-width background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img.panelDiscussion}
          alt="Edubeacon Education Leadership Conference"
          fill
          className="object-cover opacity-25 filter brightness-90 contrast-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17]/95 via-[#0A0E17]/80 to-[#0A0E17]/90" />
      </div>

      <Container className="relative z-10">
        {/* Event label */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4.5 py-1.5 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            Upcoming Conference • 15–16 March 2027
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="reveal">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400 block mb-2">
              Upcoming Flagship Summit
            </span>
            <h2 className="font-bold text-[38px] md:text-[52px] text-white leading-[1.08] mb-4 tracking-tight">
              {siteConfig.conferenceEventName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 text-[13px] font-semibold px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                {siteConfig.conferenceEventDate}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 text-[13px] font-semibold px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                {siteConfig.conferenceVenue}
              </span>
            </div>
            <p className="text-[16px] text-slate-300/90 leading-relaxed mb-8 max-w-[46ch] font-normal">
              India&#39;s premier education leadership conference bringing together school owners, principals, education leaders, EdTech startups, solution providers, universities and industry experts.
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/90 mb-3.5 font-bold">
                CONFERENCE BEGINS IN
              </p>
              <div className="flex gap-4">
                {[
                  { val: timeLeft.days, label: "Days" },
                  { val: timeLeft.hours, label: "Hours" },
                  { val: timeLeft.minutes, label: "Mins" },
                  { val: timeLeft.seconds, label: "Secs" },
                ].map(({ val, label }) => (
                  <div
                    key={label}
                    className="text-center bg-slate-900/80 border border-emerald-500/30 rounded-2xl px-5 py-4 min-w-[72px] backdrop-blur-md shadow-lg"
                  >
                    <span className="font-bold text-[32px] text-emerald-300 leading-none countdown-digit">
                      {String(val).padStart(2, "0")}
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 mt-1 font-semibold">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/events/conference"
                className="bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] text-white px-8 py-4 rounded-full font-bold text-[14px] hover:opacity-90 transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>View Full Conference Page</span>
                <span>→</span>
              </Link>
              <button
                id="conference-attend"
                onClick={() => openModal("school-register")}
                className="border border-emerald-400/40 text-emerald-300 px-8 py-4 rounded-full font-semibold text-[14px] hover:bg-emerald-500/10 transition-colors backdrop-blur-md"
              >
                Register for Passes
              </button>
            </div>
          </div>

          {/* Right: Experience Cards */}
          <div className="grid grid-cols-2 gap-4 reveal reveal-delay-2">
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="bg-slate-900/60 border border-white/15 rounded-2xl p-6 hover:border-emerald-400/40 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <exp.icon className="w-5.5 h-5.5 text-emerald-300" strokeWidth={1.75} />
                </div>
                <h4 className="font-bold text-[17px] text-white mb-2">
                  {exp.title}
                </h4>
                <p className="text-[13px] text-slate-300/80 leading-relaxed font-normal">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

