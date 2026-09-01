import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-lavender/40 py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Community Says"
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col justify-between gap-8 rounded-[1.1rem] border border-line/70 bg-warm-white p-8 md:p-10">
                <span className="font-display text-[48px] leading-none text-lilac-deep">
                  &ldquo;
                </span>
                <blockquote className="-mt-6 flex-1 font-display text-[19px] leading-relaxed text-charcoal md:text-[21px]">
                  {t.quote}
                </blockquote>
                <figcaption className="flex flex-col border-t border-line pt-4">
                  <span className="text-[14.5px] font-semibold text-charcoal">
                    {t.name}
                  </span>
                  <span className="text-[13px] text-charcoal/55">
                    {t.title}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
