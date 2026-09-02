import Container from "./ui/Container";
import { communityStats } from "@/lib/data";

export default function HeroStats() {
  return (
    <section className="relative overflow-hidden bg-[#0A0E17] py-12 border-y border-white/10">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-600/10 blur-3xl" />
      </div>
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {communityStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-2 px-3 ${
                i < communityStats.length - 1
                  ? "md:border-r md:border-white/10"
                  : ""
              }`}
            >
              <p className="font-bold text-[36px] md:text-[44px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 leading-none tracking-tight">
                {stat.value}
              </p>
              <p className="text-[13px] text-slate-300/80 mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

