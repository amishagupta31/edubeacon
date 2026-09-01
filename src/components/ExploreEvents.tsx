"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { events, EventCategory } from "@/lib/data";

const filters: ("All" | EventCategory)[] = [
  "All",
  "Technology",
  "AI",
  "Innovation",
  "Leadership",
  "EdTech",
  "Startups",
];

export default function ExploreEvents() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const filtered =
    active === "All" ? events : events.filter((e) => e.category === active);

  return (
    <section id="events" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Event Portfolio"
            title="Explore Our Events"
            subtitle="Discover conferences, summits and experiences taking place throughout the year."
          />
        </div>

        <Reveal className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                active === f
                  ? "border-charcoal bg-charcoal text-warm-white"
                  : "border-line text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
              }`}
            >
              {f}
            </button>
          ))}
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <Reveal key={event.slug} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1rem] border border-line bg-warm-white transition-shadow duration-300 hover:shadow-[0_25px_50px_-30px_rgba(32,36,43,0.35)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(min-width: 1024px) 380px, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-warm-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal/70 backdrop-blur">
                    {event.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-display text-[21px] leading-snug text-charcoal">
                    {event.name}
                  </h3>
                  <p className="text-[13px] font-medium text-charcoal/55">
                    {event.dates} · {event.location}
                  </p>
                  <p className="text-[14px] leading-relaxed text-charcoal/60">
                    {event.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-[12.5px] text-charcoal/50">
                    <span>{event.attendees}</span>
                    <span>{event.speakers}</span>
                    {event.exhibitors && <span>{event.exhibitors}</span>}
                  </div>
                  <Link
                    href={`/#featured`}
                    className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-charcoal transition-colors group-hover:text-lilac-deep"
                  >
                    Visit Event
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
