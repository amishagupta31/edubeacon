"use client";

import { useRef, useState } from "react";
import {
  gsap,
  ensureGsapRegistered,
  useIsomorphicLayoutEffect,
  prefersReducedMotion,
  EASE,
} from "./gsapSetup";
import { horizontalCards } from "./data";

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useIsomorphicLayoutEffect(() => {
    ensureGsapRegistered();
    // Scroll-hijacking a pinned section is poor touch UX on small screens,
    // so mobile gets the plain swipeable rail — same fallback used for
    // prefers-reduced-motion.
    const isReduced = prefersReducedMotion() || window.matchMedia("(max-width: 767px)").matches;
    setReduced(isReduced);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Reduced motion (or mobile): skip the pin/scrub entirely — the
    // section instead renders as a normal horizontally-scrollable rail
    // (see className below), which stays fully usable without animation.
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(track.scrollWidth - section.clientWidth, 0);
      // Pace the pin to roughly 1.5–2.5 viewport-widths of scroll (per spec),
      // independent of how wide the track itself happens to be — otherwise a
      // short track blows through the pin almost instantly.
      const getPinDistance = () => getDistance() + window.innerWidth * 1.3;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getPinDistance(),
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const viewportCenter = window.innerWidth / 2;
            cardRefs.current.forEach((card) => {
              if (!card) return;
              const rect = card.getBoundingClientRect();
              const cardCenter = rect.left + rect.width / 2;
              const dist = Math.abs(viewportCenter - cardCenter);
              const proximity = gsap.utils.clamp(0, 1, 1 - dist / (window.innerWidth * 0.6));
              const scale = gsap.utils.interpolate(0.96, 1, proximity);
              gsap.set(card, { scale });
            });
          },
        },
      });

      gsap.fromTo(
        section.querySelector("[data-heading]"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.entrance,
          scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none", once: true },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`relative overflow-hidden py-24 ${reduced ? "" : "md:py-0 md:h-screen md:flex md:items-center"}`}
      style={{ background: "var(--color-ewc-ivory)" }}
    >
      <div className="w-full">
        <div data-heading className="mx-auto mb-10 max-w-[1320px] px-6 md:px-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-ewc-muted)" }}>
            The Journey
          </span>
          <h2 className="mt-3 font-display text-[32px] leading-[1.15] font-medium md:text-[42px]" style={{ color: "var(--color-ewc-ink)" }}>
            From First Question to Success Story
          </h2>
        </div>

        <div
          ref={trackRef}
          className={`scroll-rail flex gap-6 px-6 md:px-10 ${reduced ? "overflow-x-auto" : "overflow-x-auto md:overflow-visible"}`}
        >
          {horizontalCards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex h-[360px] w-[280px] shrink-0 flex-col justify-between rounded-[1.75rem] p-8 md:h-[420px] md:w-[340px]"
              style={{ background: card.bg }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/50">
                <card.icon className="h-6 w-6" style={{ color: "var(--color-ewc-ink)" }} strokeWidth={1.75} />
              </div>
              <div>
                <span className="text-[13px] font-semibold" style={{ color: "var(--color-ewc-muted)" }}>
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-[26px] leading-tight md:text-[30px]" style={{ color: "var(--color-ewc-ink)" }}>
                  {card.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--color-ewc-ink)", opacity: 0.7 }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
