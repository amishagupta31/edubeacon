import Image from "next/image";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import Button from "../ui/Button";
import { img } from "@/lib/images";

export default function SponsorHero() {
  return (
    <section className="relative overflow-hidden bg-warm-white pt-14 pb-20 md:pt-20 md:pb-24">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="reveal flex flex-col items-start gap-7">
          <Eyebrow>Partner With Convene</Eyebrow>
          <h1 className="font-display text-balance text-[38px] leading-[1.1] tracking-tight text-charcoal sm:text-[48px] md:text-[56px]">
            Reach the People Making Tomorrow&apos;s Technology Decisions
          </h1>
          <p className="max-w-[54ch] text-[16px] leading-relaxed text-charcoal/65 md:text-[17.5px]">
            Sponsorship with Convene puts your brand in front of a highly
            relevant, senior audience of technology leaders, investors and
            decision-makers — across a full portfolio of flagship events and
            leadership experiences.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="#enquiry" variant="primary">
              Start a Sponsorship Enquiry →
            </Button>
            <Button href="#packages" variant="secondary">
              View Sponsorship Packages
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 h-[70%] w-[85%] rounded-[2rem] bg-gradient-to-br from-powder to-sage" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] border border-line shadow-[0_30px_60px_-30px_rgba(32,36,43,0.35)]">
            <Image
              src={img.boardroom}
              alt="Corporate partners in conversation at a technology summit"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
