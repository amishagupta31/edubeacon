import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "charcoal",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "charcoal" | "light";
}) {
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={`font-display text-balance text-[32px] leading-[1.15] md:text-[44px] ${
          tone === "light" ? "text-warm-white" : "text-charcoal"
        } ${align === "center" ? "max-w-[24ch]" : "max-w-[18ch]"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-[56ch] text-[15.5px] leading-relaxed ${
            tone === "light" ? "text-warm-white/70" : "text-charcoal/60"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
