import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { sponsorTiers } from "@/lib/data";

const allPartners = sponsorTiers.flatMap((t) => t.names);

export default function PreviousPartners() {
  return (
    <section className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Previous Partners"
          title="Organizations We've Partnered With"
          align="center"
        />
        <Reveal className="flex flex-wrap justify-center overflow-hidden rounded-[0.85rem] border border-line">
          {allPartners.map((name) => (
            <div
              key={name}
              className="flex h-24 w-1/2 items-center justify-center border-b border-r border-line bg-warm-white px-4 grayscale transition-all duration-300 hover:grayscale-0 sm:w-1/3 md:w-1/6"
            >
              <span className="text-center font-display text-[15px] tracking-tight text-charcoal/60">
                {name}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
