import Image from "next/image";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";

export default function TwoExperiences() {
  return (
    <section id="experiences" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Two Event Experiences"
          title="Choose Your Experience"
          subtitle="From large-scale flagship gatherings to exclusive, closed-door conversations — find the format that fits how you want to engage."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-beige/40">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={img.conferenceVenue}
                  alt="Large-scale technology conference exhibition floor"
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8 md:p-10">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
                  Flagship Events
                </span>
                <h3 className="font-display text-[26px] leading-tight text-charcoal md:text-[30px]">
                  Conferences &amp; Exhibitions
                </h3>
                <p className="text-[14.5px] leading-relaxed text-charcoal/60">
                  Large-scale technology events featuring keynotes, panel
                  discussions, workshops, exhibitions, networking and product
                  demonstrations.
                </p>
                <div className="mt-2">
                  <Button href="/#events" variant="secondary">
                    Explore Flagship Events →
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-charcoal bg-charcoal text-warm-white">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={img.boardroom}
                  alt="Executive leadership roundtable discussion"
                  fill
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8 md:p-10">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-warm-white/50">
                  Leadership Experiences
                </span>
                <h3 className="font-display text-[26px] leading-tight text-warm-white md:text-[30px]">
                  Summits &amp; Roundtables
                </h3>
                <p className="text-[14.5px] leading-relaxed text-warm-white/65">
                  Exclusive experiences for CXOs, technology leaders,
                  investors, founders and decision-makers.
                </p>
                <div className="mt-2">
                  <Button href="/#events" variant="outline-light">
                    Explore Leadership Events →
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
