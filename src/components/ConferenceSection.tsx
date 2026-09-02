"use client";

import Image from "next/image";
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
    <section id="conference" className="relative py-20 md:py-28 overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img.panelDiscussion}
          alt="Edubeacon Education Leadership Conference"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-edu-blue/85" />
      </div>

      <Container className="relative z-10">
        {/* Event label */}
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Flagship Conference & Exhibition
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="reveal">
            <h2 className="font-display font-bold text-[38px] md:text-[52px] text-white leading-[1.08] mb-4">
              {siteConfig.conferenceEventName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full border border-white/20">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                {siteConfig.conferenceEventDate}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full border border-white/20">
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                {siteConfig.conferenceVenue}
              </span>
            </div>
            <p className="text-[15.5px] text-white/75 leading-relaxed mb-8 max-w-[44ch]">
              India&#39;s premier education leadership conference bringing together school owners, principals, education leaders, EdTech startups, solution providers, universities and industry experts.
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3 font-semibold">
                Conference Begins In
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
                    className="text-center bg-white/10 border border-white/20 rounded-xl px-5 py-4 min-w-[70px]"
                  >
                    <span className="font-display font-bold text-[32px] text-white leading-none countdown-digit">
                      {String(val).padStart(2, "0")}
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/55 mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                id="conference-attend"
                onClick={() => openModal("school-register")}
                className="bg-white text-edu-blue px-7 py-3.5 rounded-xl font-bold text-[14px] hover:bg-white/90 transition-colors shadow-lg"
              >
                Register to Attend
              </button>
              <button
                id="conference-exhibit"
                onClick={() => openModal("vendor-register")}
                className="border-2 border-white/50 text-white px-7 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-white/15 transition-colors"
              >
                Become an Exhibitor
              </button>
            </div>
          </div>

          {/* Right: Experience Cards */}
          <div className="grid grid-cols-2 gap-4 reveal reveal-delay-2">
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="bg-white/10 border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <exp.icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <h4 className="font-display font-bold text-[16px] text-white mb-1.5">
                  {exp.title}
                </h4>
                <p className="text-[13px] text-white/65 leading-snug">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
