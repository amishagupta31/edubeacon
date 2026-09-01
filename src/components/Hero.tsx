import Image from "next/image";
import Container from "./ui/Container";
import Eyebrow from "./ui/Eyebrow";
import Button from "./ui/Button";
import { img } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="reveal flex flex-col items-start gap-7">
          <Eyebrow>The Technology Community</Eyebrow>
          <h1 className="font-display text-balance text-[42px] leading-[1.08] tracking-tight text-charcoal sm:text-[56px] md:text-[64px]">
            Where Technology Meets Opportunity
          </h1>
          <p className="max-w-[52ch] text-[16.5px] leading-relaxed text-charcoal/65 md:text-[18px]">
            Bringing together technology leaders, innovators, enterprises,
            startups and decision-makers to discover ideas, build
            relationships and shape what comes next.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/#events" variant="primary">
              Explore Events →
            </Button>
            <Button href="/sponsor" variant="secondary">
              Become a Sponsor →
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-6 border-t border-line pt-6 text-[13px] text-charcoal/50">
            <span>10,000+ Professionals</span>
            <span className="h-1 w-1 rounded-full bg-charcoal/20" />
            <span>150+ Companies</span>
            <span className="hidden h-1 w-1 rounded-full bg-charcoal/20 sm:inline-block" />
            <span className="hidden sm:inline-block">Global Events Portfolio</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-10 -top-10 h-[70%] w-[85%] rounded-[2rem] bg-gradient-to-br from-lavender to-powder" />
          <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-sage" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] border border-line shadow-[0_30px_60px_-30px_rgba(32,36,43,0.35)]">
            <Image
              src={img.heroKeynote}
              alt="Speaker addressing a technology conference audience"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 right-4 hidden w-[62%] rounded-[1rem] border border-line bg-warm-white/95 p-4 shadow-[0_20px_45px_-25px_rgba(32,36,43,0.35)] backdrop-blur sm:block">
            <p className="font-display text-[26px] leading-none text-charcoal">4.9/5</p>
            <p className="mt-1.5 text-[12.5px] text-charcoal/55">
              Average attendee rating across our 2025 event portfolio
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
