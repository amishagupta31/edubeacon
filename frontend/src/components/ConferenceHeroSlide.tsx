"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useModal } from "@/components/modals/ModalProvider";

const EVENT = {
  name: "AI, NEP & the Future of Learning",
  tagline: "Connecting Schools with the Startups Shaping the Future of Education",
  date: "25th October 2026",
  time: "10:00 AM – 5:00 PM",
  venue: "Shivalik University, Dehradun",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Shivalik+University+Dehradun",
};

export default function ConferenceHeroSlide() {
  const { openModal } = useModal();

  return (
    <section className="relative w-full h-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-[#0A1A10] text-white py-12">
      {/* Background Video */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-60 scale-105"
        >
          <source src="/videos/conferencepage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#061A10]/95 via-[#061A10]/75 to-[#061A10]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061A10] via-transparent to-[#061A10]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-900/50 border border-emerald-500/30 rounded-full px-4 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
            EduBeacon Conference 2026
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-bold text-[30px] sm:text-[44px] md:text-[56px] leading-[1.06] tracking-tight text-white">
          {EVENT.name}
        </h2>

        {/* Tagline */}
        <p className="text-slate-200 text-[14px] sm:text-[16px] leading-relaxed max-w-[52ch] font-normal">
          {EVENT.tagline}
        </p>

        {/* Event Details */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[13px] text-slate-200 font-medium">
          <span className="flex items-center gap-2 text-emerald-300 font-bold">
            <Calendar className="w-4 h-4" /> {EVENT.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-300" /> {EVENT.time}
          </span>
          <a
            href={EVENT.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-300" /> {EVENT.venue}
          </a>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openModal("school-register")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-[12.5px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Register as School / Educator →
          </button>
          <button
            onClick={() => openModal("vendor-register")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-[12.5px] uppercase tracking-wider text-charcoal bg-white shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Become a Sponsor →
          </button>
        </div>

        {/* Link to full conference page */}
        <Link
          href="/events/conference"
          className="text-[11.5px] font-bold uppercase tracking-widest text-emerald-400/80 hover:text-emerald-300 transition-colors"
        >
          View Full Conference Details →
        </Link>
      </div>
    </section>
  );
}
