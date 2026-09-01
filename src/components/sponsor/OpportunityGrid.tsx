import Image from "next/image";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { img } from "@/lib/images";

const opportunities = [
  {
    title: "Brand Visibility",
    description:
      "Prominent placement across stage branding, digital touchpoints, delegate materials and the event venue itself.",
    features: ["Main stage branding", "Digital & print placements", "Venue signage"],
    image: img.conferenceVenue,
  },
  {
    title: "Speaking Opportunities",
    description:
      "Keynote, panel and workshop slots that position your team as thought leaders in front of a senior audience.",
    features: ["Keynote & panel slots", "Workshop hosting", "Content collaboration"],
    image: img.keynoteWide,
  },
  {
    title: "Exhibition Opportunities",
    description:
      "Premium exhibition space designed to turn foot traffic into meaningful, qualified conversations.",
    features: ["Premium floor placement", "Live product demos", "Branded booth design support"],
    image: img.exhibitorBooth,
  },
  {
    title: "Networking Opportunities",
    description:
      "Curated access to receptions, roundtables and closed-door sessions with decision-makers.",
    features: ["VIP receptions", "Leadership roundtable seats", "1:1 introductions"],
    image: img.networkingEvent,
  },
];

export default function OpportunityGrid() {
  return (
    <section id="opportunities" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Sponsorship Opportunities"
          title="Ways to Put Your Brand in the Room"
          subtitle="Every partnership is built around a mix of visibility, thought leadership, exhibition presence and access to the right conversations."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {opportunities.map((opp, i) => (
            <Reveal key={opp.title} delay={i * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-line">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={opp.image}
                    alt={opp.title}
                    fill
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 bg-warm-white p-7 md:p-8">
                  <h3 className="font-display text-[22px] text-charcoal">
                    {opp.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-charcoal/60">
                    {opp.description}
                  </p>
                  <ul className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
                    {opp.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-[13px] text-charcoal/65"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-lilac-deep" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
