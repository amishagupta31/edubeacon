import Image from "next/image";
import Container from "./ui/Container";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";

export default function CorporateCta() {
  return (
    <section className="bg-powder/45 py-20 md:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="flex flex-col items-start gap-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
            For Companies
          </span>
          <h2 className="font-display text-balance text-[32px] leading-[1.15] text-charcoal md:text-[42px]">
            Bring Your Team Into the Conversation
          </h2>
          <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-charcoal/60">
            Give your employees access to industry leaders, emerging
            technologies, new ideas and valuable professional connections.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/#register" variant="primary">
              Register Your Team
            </Button>
            <Button href="/sponsor#enquiry" variant="secondary">
              Talk to Our Team
            </Button>
          </div>
        </Reveal>
        <Reveal delay={100} className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] border border-line">
          <Image
            src={img.teamMeeting}
            alt="Corporate team at a technology conference"
            fill
            sizes="(min-width: 1024px) 480px, 90vw"
            className="object-cover"
          />
        </Reveal>
      </Container>
    </section>
  );
}
