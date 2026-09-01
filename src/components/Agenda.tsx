"use client";

import { useState } from "react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { agenda, SessionCategory } from "@/lib/data";

const categoryStyles: Record<SessionCategory, string> = {
  KEYNOTE: "bg-lilac/30 text-charcoal",
  PANEL: "bg-powder text-charcoal",
  WORKSHOP: "bg-sage text-charcoal",
  NETWORKING: "bg-beige text-charcoal",
  DEMO: "bg-lavender text-charcoal",
};

export default function Agenda() {
  const [active, setActive] = useState(agenda[0].id);
  const activeDay = agenda.find((d) => d.id === active) ?? agenda[0];

  return (
    <section id="agenda" className="bg-powder/35 py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Agenda"
          title="Three Days of Ideas & Conversation"
          subtitle="A carefully curated program of keynotes, panels, workshops, demos and networking."
        />

        <Reveal className="flex flex-wrap gap-3">
          {agenda.map((day) => (
            <button
              key={day.id}
              onClick={() => setActive(day.id)}
              className={`flex flex-col items-start rounded-[0.85rem] border px-5 py-3 text-left transition-colors ${
                active === day.id
                  ? "border-charcoal bg-charcoal text-warm-white"
                  : "border-line bg-warm-white text-charcoal/70 hover:border-charcoal/40"
              }`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
                {day.label}
              </span>
              <span className="font-display text-[18px] leading-none">
                {day.date}
              </span>
            </button>
          ))}
        </Reveal>

        <div className="flex flex-col divide-y divide-line rounded-[1rem] border border-line bg-warm-white">
          {activeDay.sessions.map((session, i) => (
            <Reveal key={`${activeDay.id}-${i}`} delay={i * 60}>
              <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:gap-6 md:p-7">
                <span className="w-16 shrink-0 font-display text-[18px] text-charcoal/70">
                  {session.time}
                </span>
                <span
                  className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1 text-[10.5px] font-semibold tracking-[0.1em] ${categoryStyles[session.category]}`}
                >
                  {session.category}
                </span>
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-charcoal">
                    {session.title}
                  </h3>
                  <p className="text-[14px] text-charcoal/60">
                    {session.description}
                  </p>
                </div>
                {session.speaker && (
                  <span className="shrink-0 text-[13px] font-medium text-charcoal/50">
                    {session.speaker}
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
