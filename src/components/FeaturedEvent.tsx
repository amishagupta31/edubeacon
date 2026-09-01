import Image from "next/image";
import Container from "./ui/Container";
import Eyebrow from "./ui/Eyebrow";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { featuredEvent } from "@/lib/data";

export default function FeaturedEvent() {
  return (
    <section id="featured" className="bg-warm-white pb-20 md:pb-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[1.5rem]">
          <div className="relative aspect-[16/11] w-full sm:aspect-[16/8]">
            <Image
              src={featuredEvent.image}
              alt={featuredEvent.name}
              fill
              sizes="1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 md:p-14">
            <Eyebrow tone="light">Flagship Event</Eyebrow>
            <h3 className="font-display text-[30px] leading-tight text-warm-white md:text-[42px]">
              {featuredEvent.name}
            </h3>
            <p className="text-[14px] font-medium text-warm-white/75 md:text-[15px]">
              {featuredEvent.dates} · {featuredEvent.location}
            </p>
            <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-warm-white/70 md:text-[16px]">
              Two days of ideas, innovation, technology and meaningful
              conversations with the people shaping tomorrow.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button href="/#register" variant="light">
                Register Now
              </Button>
              <Button href="/#agenda" variant="outline-light">
                View Agenda
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
