import Container from "./ui/Container";
import { communityStats } from "@/lib/data";

export default function HeroStats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-sky-pastel via-lavender-pastel to-mint-pastel py-14 border-y border-line-soft">
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-blob-slow absolute -top-16 left-10 w-64 h-64 rounded-full bg-white/40 blur-3xl" />
        <div className="bg-blob absolute -bottom-20 right-16 w-72 h-72 rounded-full bg-teal-muted/30 blur-3xl" />
      </div>
      <Container className="relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {communityStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < communityStats.length - 1
                  ? "md:border-r md:border-edu-blue/10"
                  : ""
              }`}
            >
              <p className="font-display font-bold text-[36px] md:text-[42px] text-edu-blue leading-none">
                {stat.value}
              </p>
              <p className="text-[13px] text-slate-soft mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
