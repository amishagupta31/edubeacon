import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { insights } from "@/lib/data";

export default function Insights() {
  return (
    <section id="insights" className="bg-beige/40 py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Insights"
            title="Ideas Beyond the Stage"
            subtitle="Perspectives, interviews and analysis from the people building the future of technology."
          />
          <Button href="/#insights" variant="secondary" className="shrink-0">
            Explore All Insights →
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className="flex h-full flex-col justify-between gap-6 rounded-[1rem] border border-line bg-warm-white p-7">
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lilac-deep">
                    {item.category}
                  </span>
                  <h3 className="font-display text-[19px] leading-snug text-charcoal">
                    {item.title}
                  </h3>
                  <span className="text-[12.5px] text-charcoal/50">
                    {item.date}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-charcoal">
                  Read Article →
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
