import Image from "next/image";
import Container from "./ui/Container";
import { magazineArticles } from "@/lib/data";
import { img } from "@/lib/images";

export default function MagazineSection() {
  return (
    <section id="magazine" className="py-20 md:py-28 bg-peach-pastel/40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left: Magazine cover + info */}
          <div className="reveal">
            <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6 border border-edu-blue/15 shadow-sm">
              Edubeacon Magazine
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-5">
              Ideas, Insights &{" "}
              <span className="text-edu-blue">Education Trends</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-soft mb-8">
              Edubeacon Magazine is India&#39;s education leadership publication — featuring school stories, startup spotlights, policy analysis and EdTech trends. Partners and sponsors receive premium editorial and advertising opportunities.
            </p>

            {/* Magazine cover mockup */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-[260px] shadow-2xl border border-line">
              <Image
                src={img.magazine}
                alt="Edubeacon Magazine Cover"
                fill
                className="object-cover"
                sizes="260px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-edu-blue/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
                  Edubeacon
                </p>
                <p className="font-display font-bold text-[18px] text-white leading-tight">
                  Education Leadership Magazine
                </p>
                <p className="text-[12px] text-white/70 mt-1">Vol. 1 — 2027</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <button className="bg-edu-blue text-white px-6 py-3 rounded-xl font-semibold text-[13.5px] hover:bg-edu-blue-mid transition-colors shadow-sm">
                Read Latest Issue →
              </button>
              <button className="border border-edu-blue/25 text-edu-blue px-6 py-3 rounded-xl font-semibold text-[13.5px] hover:border-edu-blue hover:bg-sky-pastel/50 transition-colors">
                Advertise in the Magazine
              </button>
            </div>
          </div>

          {/* Right: Articles */}
          <div className="reveal reveal-delay-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-soft mb-6">
              Latest Articles
            </p>
            <div className="flex flex-col gap-4">
              {magazineArticles.map((article, i) => (
                <div
                  key={article.title}
                  className={`bg-white rounded-2xl border border-line p-5 card-lift ${
                    article.featured ? "border-edu-blue/30" : ""
                  }`}
                >
                  {article.featured && (
                    <span className="text-[10px] font-bold text-edu-blue uppercase tracking-[0.15em] mb-2 block">
                      ⭐ Featured
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-sky-pastel text-edu-blue px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-soft">{article.date}</span>
                  </div>
                  <h4 className="font-display font-semibold text-[16px] text-charcoal leading-tight mb-3">
                    {article.title}
                  </h4>
                  <button className="text-[12.5px] font-semibold text-teal hover:text-edu-blue transition-colors">
                    Read Article →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
