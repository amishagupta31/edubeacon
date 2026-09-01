import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const faqs = [
  {
    q: "Who attends Convene events?",
    a: "Technology leaders, founders, investors, enterprise buyers and educators — spanning C-suite executives to senior individual contributors across the technology sector.",
  },
  {
    q: "What is the difference between a flagship event and a leadership experience?",
    a: "Flagship events are large-scale conferences and exhibitions open to the broader professional community. Leadership experiences are smaller, invitation-only summits and roundtables for CXOs, founders and investors.",
  },
  {
    q: "How do I become a speaker?",
    a: "Submit a speaker application through our Get Involved section. Our content team reviews submissions on a rolling basis ahead of each event.",
  },
  {
    q: "What sponsorship packages are available?",
    a: "We offer Title, Platinum, Gold and Technology Partner tiers, each shaped around brand visibility, speaking opportunities, exhibition space and networking access. Visit our sponsorship page for full details.",
  },
  {
    q: "Can I bring my whole team?",
    a: "Yes — we offer group and corporate registration rates. Contact our team to arrange access for your organization.",
  },
];

export default function Faqs() {
  return (
    <section id="faqs" className="bg-beige/30 py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionHeading eyebrow="FAQs" title="Common Questions" />
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15.5px] font-medium text-charcoal">
                  {item.q}
                  <span className="shrink-0 text-[18px] font-light text-charcoal/40 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[65ch] text-[14.5px] leading-relaxed text-charcoal/60">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
