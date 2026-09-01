import Image from "next/image";
import Container from "./ui/Container";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-charcoal overflow-hidden">
      <Container>
        <div className="text-center mb-14 reveal">
          <div className="inline-block bg-white/10 text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-white/15">
            Community Voices
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-white leading-[1.1]">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-white/7 border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="text-teal text-[32px] font-display leading-none mb-4">&ldquo;</div>
              <p className="text-[15.5px] text-white/85 leading-relaxed mb-6 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-10 h-10 bg-teal-muted/20 rounded-full flex items-center justify-center">
                  <span className="font-display font-bold text-[16px] text-teal">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-white">{t.name}</p>
                  <p className="text-[12px] text-white/55">{t.title}, {t.organization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
