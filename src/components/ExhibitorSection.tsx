import Image from "next/image";
import Container from "./ui/Container";
import Eyebrow from "./ui/Eyebrow";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";

const stats = [
  { value: "100+", label: "Exhibitors" },
  { value: "20+", label: "Technology Categories" },
  { value: "5,000+", label: "Visitors" },
];

export default function ExhibitorSection() {
  return (
    <section id="exhibit" className="bg-warm-white py-20 md:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border border-line">
            <Image
              src={img.exhibitorBooth}
              alt="Exhibitor booth at a technology exhibition"
              fill
              sizes="(min-width: 1024px) 540px, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 flex flex-col items-start gap-6 lg:order-2" delay={80}>
          <Eyebrow>Exhibit</Eyebrow>
          <h2 className="font-display text-balance text-[32px] leading-[1.15] text-charcoal md:text-[42px]">
            Showcase What You&apos;re Building
          </h2>
          <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-charcoal/60">
            Turn your technology into conversations, connections and
            opportunities.
          </p>

          <div className="flex flex-wrap gap-8 border-y border-line py-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-[28px] leading-none text-charcoal">
                  {stat.value}
                </span>
                <span className="text-[12.5px] uppercase tracking-[0.1em] text-charcoal/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/sponsor#opportunities" variant="primary">
              Become an Exhibitor →
            </Button>
            <Button href="/#events" variant="secondary">
              Explore Exhibitors →
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
