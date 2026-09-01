import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import {
  audienceDemographics,
  audienceIndustries,
  communityStats,
} from "@/lib/data";

export default function AudienceOverview() {
  return (
    <section id="audience" className="border-y border-line bg-beige/40 py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Audience"
          title="A Highly Relevant, Senior Audience"
          subtitle="Our audience spans the full technology decision chain — from founders and investors to the operators building and buying enterprise technology."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {communityStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="flex flex-col items-start gap-1 border-l border-line pl-4">
                <span className="font-display text-[34px] leading-none text-charcoal">
                  {stat.value}
                </span>
                <span className="text-[12.5px] uppercase tracking-[0.1em] text-charcoal/50">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-5 rounded-[1rem] border border-line bg-warm-white p-8">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
              Seniority Breakdown
            </h3>
            <div className="flex flex-col gap-4">
              {audienceDemographics.map((d) => (
                <div key={d.label} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[13.5px]">
                    <span className="font-medium text-charcoal">{d.label}</span>
                    <span className="text-charcoal/50">{d.value}%</span>
                  </div>
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-lilac-deep"
                      style={{ width: `${d.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90} className="flex flex-col gap-5 rounded-[1rem] border border-line bg-warm-white p-8">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
              Industries Represented
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {audienceIndustries.map((industry) => (
                <span
                  key={industry}
                  className="rounded-full border border-line bg-powder/40 px-4 py-2 text-[13px] text-charcoal/75"
                >
                  {industry}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
