import Container from "./ui/Container";

const pillars = [
  {
    icon: "🔍",
    title: "Discover",
    description:
      "Schools can browse and discover innovative products, technologies and services across 25+ solution categories — all in one place.",
    color: "sky-pastel",
    accent: "text-edu-blue-light",
  },
  {
    icon: "🤝",
    title: "Connect",
    description:
      "Edubeacon intelligently connects schools with the most relevant startups and vendors based on their specific requirements and needs.",
    color: "teal-muted",
    accent: "text-teal",
  },
  {
    icon: "📈",
    title: "Grow",
    description:
      "Startups and education businesses gain visibility, generate qualified leads and build meaningful long-term partnerships with schools.",
    color: "peach-pastel",
    accent: "text-gold",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <div className="inline-block bg-sky-pastel text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/10">
            About Edubeacon
          </div>
          <h2 className="font-display font-bold text-[36px] md:text-[48px] text-charcoal leading-[1.1] text-balance mb-5">
            One Platform.{" "}
            <span className="text-teal">Endless Education</span>{" "}
            Possibilities.
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft max-w-[52ch] mx-auto">
            Edubeacon is the bridge between schools looking for the right
            solutions and the innovators building them. We make the education
            ecosystem work for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`bg-${pillar.color} rounded-2xl p-8 border border-white/60 card-lift reveal reveal-delay-${i + 1}`}
            >
              <div className="text-4xl mb-5">{pillar.icon}</div>
              <h3 className={`font-display font-bold text-[26px] ${pillar.accent} mb-3`}>
                {pillar.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-soft">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Journey flow */}
        <div className="mt-16 bg-white rounded-2xl border border-line p-8 md:p-10 reveal">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-soft mb-6 text-center">
            How It Works
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { emoji: "🏫", label: "School has a\nrequirement" },
              { emoji: "→", label: "", arrow: true },
              { emoji: "🔍", label: "Browses solution\ncategories" },
              { emoji: "→", label: "", arrow: true },
              { emoji: "🤝", label: "Connects with\nrelevant vendors" },
              { emoji: "→", label: "", arrow: true },
              { emoji: "🚀", label: "Partnership\ncreated" },
            ].map((step, i) =>
              step.arrow ? (
                <div
                  key={i}
                  className="text-[20px] text-line mx-3 rotate-90 md:rotate-0"
                >
                  →
                </div>
              ) : (
                <div key={i} className="text-center flex-1 max-w-[140px]">
                  <div className="text-3xl mb-2">{step.emoji}</div>
                  <p className="text-[12px] text-slate-soft leading-tight font-medium whitespace-pre-line">
                    {step.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
