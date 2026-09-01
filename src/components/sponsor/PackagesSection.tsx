import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import { sponsorshipPackages } from "@/lib/data";

export default function PackagesSection() {
  return (
    <section id="packages" className="bg-sage/40 py-20 md:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Sponsorship Packages"
          title="Partnership Levels Built Around Your Goals"
          subtitle="Every package is tailored to your objectives. The tiers below outline a starting framework — our team will help shape the right fit."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {sponsorshipPackages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 80}>
              <div
                className={`flex h-full flex-col gap-6 rounded-[1.1rem] border p-7 ${
                  pkg.highlighted
                    ? "border-charcoal bg-charcoal text-warm-white"
                    : "border-line bg-warm-white text-charcoal"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[22px]">{pkg.name}</h3>
                  <p
                    className={`text-[13px] ${
                      pkg.highlighted ? "text-warm-white/60" : "text-charcoal/50"
                    }`}
                  >
                    {pkg.price}
                  </p>
                </div>
                <p
                  className={`text-[13.5px] leading-relaxed ${
                    pkg.highlighted ? "text-warm-white/75" : "text-charcoal/60"
                  }`}
                >
                  {pkg.description}
                </p>
                <ul className="flex flex-1 flex-col gap-2.5 border-t border-current/15 pt-5">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2 text-[13px] leading-snug ${
                        pkg.highlighted ? "text-warm-white/85" : "text-charcoal/70"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                          pkg.highlighted ? "bg-lilac" : "bg-lilac-deep"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href="#enquiry"
                  variant={pkg.highlighted ? "outline-light" : "secondary"}
                  className="w-full"
                >
                  Enquire →
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
