import Image from "next/image";
import Container from "./ui/Container";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 md:py-28 bg-rose-pastel overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-blob-slow absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-white/50 blur-3xl" />
        <div className="bg-blob absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-lavender-pastel/60 blur-3xl" />
      </div>
      <Container className="relative">
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/15 shadow-sm">
            Community Voices
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1]">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white border border-line rounded-2xl p-7 shadow-sm hover:shadow-md transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="text-teal text-[32px] font-display leading-none mb-4">&ldquo;</div>
              <p className="text-[15.5px] text-slate leading-relaxed mb-6 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 border-t border-line pt-4">
                <div className="w-10 h-10 bg-teal-muted rounded-full flex items-center justify-center">
                  <span className="font-display font-bold text-[16px] text-teal">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-charcoal">{t.name}</p>
                  <p className="text-[12px] text-slate-soft">{t.title}, {t.organization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
