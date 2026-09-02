"use client";

import Container from "./ui/Container";
import { whyAttendSchools, whyAttendVendors } from "@/lib/data";
import { useModal } from "./modals/ModalProvider";

export default function WhyAttend() {
  const { openModal } = useModal();

  const cards = [
    {
      eyebrow: "For Schools & Education Leaders",
      title: "Why Schools\nAttend",
      items: whyAttendSchools,
      checkColor: "#1E3A5F",
      cta: "Register Your School",
      onCta: () => openModal("school-register"),
      accent: "#1E3A5F",
    },
    {
      eyebrow: "For Startups & Solution Providers",
      title: "Why Vendors\nAttend",
      items: whyAttendVendors,
      checkColor: "#0D9488",
      cta: "List Your Solution",
      onCta: () => openModal("vendor-register"),
      accent: "#0D9488",
    },
  ];

  return (
    <section id="why-attend" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-gold-light text-gold text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-gold/20">
            Why Attend
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1]">
            Something Valuable for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <div
              key={card.eyebrow}
              className={`flex flex-col p-8 md:p-10 reveal reveal-delay-${i + 1}`}
              style={{
                background: "#E2E6EA",
                borderRadius: "12px 52px 12px 52px",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 16px 40px -10px rgba(30,58,95,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
            >
              {/* Eyebrow */}
              <p
                className="text-[11.5px] font-bold uppercase tracking-[0.15em] mb-4"
                style={{ color: card.accent }}
              >
                {card.eyebrow}
              </p>

              {/* Title */}
              <h3
                className="font-display font-bold text-[28px] text-charcoal mb-6 leading-tight whitespace-pre-line"
              >
                {card.title}
              </h3>

              {/* Benefit list */}
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {card.items.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: card.accent + "22" }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke={card.checkColor}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[14.5px] text-slate">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div>
                <button
                  onClick={card.onCta}
                  className="inline-flex items-center gap-2 text-white font-semibold text-[13.5px] px-6 py-3 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
                  style={{ background: card.accent }}
                >
                  {card.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
