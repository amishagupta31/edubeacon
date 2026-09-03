import Container from "./ui/Container";
import { communityStats } from "@/lib/data";

export default function HeroStats() {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] py-7 sm:py-8 border-y border-stone-200/80 shadow-inner">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {communityStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-2 px-3 ${
                i < communityStats.length - 1
                  ? "md:border-r md:border-stone-200"
                  : ""
              }`}
            >
              <p className="font-bold text-[36px] md:text-[44px] text-transparent bg-clip-text bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] leading-none tracking-tight">
                {stat.value}
              </p>
              <p className="text-[13px] text-stone-600 mt-2 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

