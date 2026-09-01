import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Link from "next/link";
import { getInvolvedPaths } from "@/lib/data";

export default function GetInvolved() {
  return (
    <section id="get-involved" className="bg-warm-white py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading eyebrow="Get Involved" title="Get Involved" align="center" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {getInvolvedPaths.map((path, i) => (
            <Reveal key={path.title} delay={i * 80}>
              <Link
                href={path.href}
                className="group flex h-full flex-col justify-between gap-8 rounded-[1rem] border border-line bg-warm-white p-7 transition-colors hover:border-charcoal/30"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-display text-[24px] text-charcoal">
                    {path.title}
                  </span>
                  <p className="text-[14px] leading-relaxed text-charcoal/60">
                    {path.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-charcoal transition-colors group-hover:text-lilac-deep">
                  {path.cta}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
