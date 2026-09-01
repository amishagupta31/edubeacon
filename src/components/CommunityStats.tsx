import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { communityStats } from "@/lib/data";

export default function CommunityStats() {
  return (
    <section id="community" className="border-y border-line bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Our Community"
          title="A Community Built Around Innovation"
          align="center"
        />
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-5 md:gap-y-0">
          {communityStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="flex flex-col items-center gap-2 px-4 text-center md:border-l md:border-line md:first:border-l-0">
                <span className="font-display text-[38px] leading-none text-charcoal md:text-[46px]">
                  {stat.value}
                </span>
                <span className="text-[13px] uppercase tracking-[0.12em] text-charcoal/50">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
