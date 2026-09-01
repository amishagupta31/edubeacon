"use client";

import { useState } from "react";
import Container from "./ui/Container";
import { conferenceAgenda } from "@/lib/data";
import type { SessionType } from "@/lib/data";

const typeStyles: Record<SessionType, { bg: string; text: string; dot: string }> = {
  KEYNOTE:    { bg: "bg-edu-blue/10",    text: "text-edu-blue",    dot: "bg-edu-blue" },
  PANEL:      { bg: "bg-teal-muted",     text: "text-teal",        dot: "bg-teal" },
  WORKSHOP:   { bg: "bg-lavender-pastel",text: "text-purple-700",  dot: "bg-purple-500" },
  NETWORKING: { bg: "bg-sage-pastel",    text: "text-green-700",   dot: "bg-green-500" },
  DEMO:       { bg: "bg-peach-pastel",   text: "text-amber-700",   dot: "bg-gold" },
  AWARDS:     { bg: "bg-gold-light",     text: "text-gold",        dot: "bg-gold" },
};

export default function AgendaSection() {
  const [activeDay, setActiveDay] = useState("day-1");
  const currentDay = conferenceAgenda.find((d) => d.id === activeDay)!;

  return (
    <section id="agenda" className="py-20 md:py-28 bg-sky-pastel/30">
      <Container>
        <div className="text-center mb-12 reveal">
          <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/15 shadow-sm">
            Conference Agenda
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4">
            Two Days of Ideas,{" "}
            <span className="text-teal">Innovation & Connection</span>
          </h2>
        </div>

        {/* Day tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {conferenceAgenda.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-[13.5px] transition-all border ${
                activeDay === day.id
                  ? "bg-edu-blue text-white border-edu-blue shadow-md"
                  : "bg-white text-slate border-line hover:border-edu-blue/40 hover:text-edu-blue"
              }`}
            >
              {day.label} — {day.date}
            </button>
          ))}
        </div>

        {/* Sessions */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {currentDay.sessions.map((session, i) => {
            const style = typeStyles[session.type];
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-line p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 card-lift"
              >
                {/* Time */}
                <div className="shrink-0 text-center md:text-right md:w-16">
                  <span className="font-display font-bold text-[18px] text-edu-blue">
                    {session.time}
                  </span>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-line shrink-0" />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`${style.bg} ${style.text} text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full flex items-center gap-1.5`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {session.type}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-[16px] text-charcoal">
                    {session.title}
                  </h4>
                  <p className="text-[13.5px] text-slate-soft mt-0.5">
                    {session.description}
                  </p>
                  {session.speaker && (
                    <p className="text-[12.5px] text-teal font-medium mt-1.5">
                      🎤 {session.speaker}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
