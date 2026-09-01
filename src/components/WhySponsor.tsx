import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { whySponsor } from "@/lib/data";

export default function WhySponsor() {
  return (
    <section className="bg-sage/45 py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Why Sponsor"
            title="Put Your Brand at the Center of Innovation"
            subtitle="Connect your organization with technology leaders, decision-makers and professionals actively shaping the future."
          />
        </div>

        <div className="flex flex-wrap overflow-hidden rounded-[1rem] border border-charcoal/10">
          {whySponsor.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 70}
              className="w-full border-b border-r border-charcoal/10 sm:w-1/2 lg:w-1/5"
            >
              <div className="flex h-full flex-col gap-3 bg-warm-white p-7">
                <span className="font-display text-[26px] leading-none text-lilac-deep">
                  0{i + 1}
                </span>
                <h3 className="text-[16px] font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-charcoal/60">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-col gap-3 sm:flex-row">
          <Button href="/sponsor" variant="primary">
            Become a Sponsor →
          </Button>
          <Button href="/sponsor#packages" variant="secondary">
            Download Sponsorship Brochure
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
