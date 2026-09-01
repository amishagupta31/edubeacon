import Image from "next/image";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";

const blocks = [
  {
    title: "Learn",
    description: "Keynotes, panels and workshops.",
    image: img.speakingEngagement,
  },
  {
    title: "Connect",
    description: "Meet industry leaders and peers.",
    image: img.networkingEvent,
  },
  {
    title: "Discover",
    description: "Explore emerging technologies.",
    image: img.demo,
  },
  {
    title: "Build",
    description: "Create partnerships and opportunities.",
    image: img.handshake,
  },
];

export default function EventExperience() {
  return (
    <section id="experience" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="The Experience"
          title="More Than a Conference"
          align="center"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={i * 90}>
              <article className="group relative aspect-[3/4] w-full overflow-hidden rounded-[1.1rem]">
                <Image
                  src={block.image}
                  alt={block.description}
                  fill
                  sizes="(min-width: 1024px) 280px, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
                  <h3 className="font-display text-[24px] text-warm-white">
                    {block.title}
                  </h3>
                  <p className="text-[13.5px] text-warm-white/75">
                    {block.description}
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
