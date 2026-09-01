import Container from "./ui/Container";
import { communityStats } from "@/lib/data";

export default function HeroStats() {
  return (
    <section className="bg-edu-blue py-14 border-y border-edu-blue-mid">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {communityStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < communityStats.length - 1
                  ? "md:border-r md:border-white/15"
                  : ""
              }`}
            >
              <p className="font-display font-bold text-[36px] md:text-[42px] text-white leading-none">
                {stat.value}
              </p>
              <p className="text-[13px] text-white/65 mt-2 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
