import Image from "next/image";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { speakers } from "@/lib/data";

export default function Speakers() {
  return (
    <section id="speakers" className="bg-beige/40 py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Speakers"
            title="Meet the People Shaping What's Next"
            subtitle="An assembly of technology leaders, founders and investors sharing the ideas defining the next decade."
          />
          <Button href="/#speakers" variant="secondary" className="shrink-0">
            View All Speakers →
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {speakers.map((speaker, i) => (
            <Reveal key={speaker.name} delay={(i % 6) * 70}>
              <article className="group relative flex flex-col overflow-hidden rounded-[0.9rem] border border-line bg-warm-white">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    sizes="(min-width: 1024px) 190px, 45vw"
                    className="object-cover grayscale-[10%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-[12px] leading-snug text-warm-white/85">
                      {speaker.topic}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-warm-white">
                      Profile
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 p-3.5">
                  <h3 className="text-[14px] font-semibold text-charcoal">
                    {speaker.name}
                  </h3>
                  <p className="text-[12px] leading-snug text-charcoal/55">
                    {speaker.title}
                  </p>
                  <p className="text-[12px] font-medium text-charcoal/45">
                    {speaker.company}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
