import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { sponsorTiers } from "@/lib/data";

export default function SponsorLogos() {
  return (
    <section id="sponsors" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Industry Support"
          title="Supported by Industry Leaders"
          subtitle="Trusted by organizations driving innovation across technology and business."
          align="center"
        />

        <div className="flex flex-col gap-10">
          {sponsorTiers.map((tier, tierIndex) => (
            <Reveal key={tier.tier} delay={tierIndex * 80}>
              <div className="flex flex-col gap-5">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal/40">
                  {tier.tier}
                </p>
                <div className="flex flex-wrap justify-center overflow-hidden rounded-[0.85rem] border border-line">
                  {tier.names.map((name) => (
                    <div
                      key={name}
                      className="flex h-24 w-1/2 items-center justify-center border-b border-r border-line bg-warm-white px-6 grayscale transition-all duration-300 hover:grayscale-0 sm:w-1/3 md:w-1/4"
                    >
                      <span className="font-display text-[17px] tracking-tight text-charcoal/60">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
