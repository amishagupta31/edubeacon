import Container from "./ui/Container";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";

export default function FinalCta() {
  return (
    <section
      id="register"
      className="bg-gradient-to-br from-lavender via-lavender/70 to-powder py-24 md:py-32"
    >
      <Container>
        <Reveal className="mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
          <h2 className="font-display text-balance text-[36px] leading-[1.1] text-charcoal md:text-[52px]">
            Be Part of What&apos;s Next.
          </h2>
          <p className="max-w-[46ch] text-[16px] leading-relaxed text-charcoal/65 md:text-[18px]">
            Meet the people building the future of technology.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="#" variant="primary">
              Register Now
            </Button>
            <Button href="/sponsor" variant="secondary">
              Become a Sponsor
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
