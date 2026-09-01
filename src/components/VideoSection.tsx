import Image from "next/image";
import Container from "./ui/Container";
import Eyebrow from "./ui/Eyebrow";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";
import { videoCategories } from "@/lib/data";

export default function VideoSection() {
  return (
    <section id="videos" className="bg-charcoal py-20 text-warm-white md:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow tone="light">On-Demand</Eyebrow>
            <h2 className="font-display text-balance text-[32px] leading-[1.15] text-warm-white md:text-[42px]">
              Catch Up on the Conversation
            </h2>
            <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-warm-white/65">
              A year-round library of keynotes, interviews and panel
              discussions from across our event portfolio.
            </p>
          </Reveal>
          <Button href="/#videos" variant="outline-light" className="shrink-0">
            Watch All Videos →
          </Button>
        </div>

        <Reveal delay={100} className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] border border-warm-white/10">
          <Image
            src={img.videoThumbnail}
            alt="Keynote speaker presenting on stage"
            fill
            sizes="1200px"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
            <button
              aria-label="Play video"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-warm-white/95 transition-transform duration-300 hover:scale-105"
            >
              <span className="ml-1 h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-charcoal" />
            </button>
          </div>
        </Reveal>

        <Reveal delay={160} className="flex flex-wrap gap-3">
          {videoCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-warm-white/20 px-4 py-2 text-[13px] text-warm-white/75"
            >
              {cat}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
