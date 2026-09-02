"use client";

import { useState } from "react";
import Container from "./ui/Container";
import { solutionCategories } from "@/lib/data";

const bgMap: Record<string, string> = {
  "sky-pastel": "bg-sky-pastel border-sky-200",
  "lavender-pastel": "bg-lavender-pastel border-purple-100",
  "mint-pastel": "bg-mint-pastel border-teal-100",
  "peach-pastel": "bg-peach-pastel border-amber-100",
  "rose-pastel": "bg-rose-pastel border-rose-100",
  "sage-pastel": "bg-sage-pastel border-green-100",
};

export default function SolutionsGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", ...solutionCategories.map((c) => c.id)];
  const filterLabels: Record<string, string> = { All: "All" };
  solutionCategories.forEach((c) => { filterLabels[c.id] = c.name; });

  const displayFilters = [
    "All", "stem", "ai", "robotics", "smart-classroom", "edtech", "erp",
    "assessment", "training", "books", "healthcare", "other",
  ];

  const visible =
    activeFilter === "All"
      ? solutionCategories
      : solutionCategories.filter((c) => c.id === activeFilter);

  return (
    <section id="solutions" className="py-20 md:py-28 bg-sky-pastel/40">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 reveal">
          <div className="inline-block bg-white text-edu-blue text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-edu-blue/15 shadow-sm">
            Solution Categories
          </div>
          <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4">
            Find the Right Solutions{" "}
            <span className="text-teal">for Your School</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft">
            Explore innovative products, services and solutions designed for the modern education ecosystem.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {displayFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-[12.5px] font-semibold border transition-all ${
                activeFilter === f
                  ? "bg-edu-blue text-white border-edu-blue shadow-sm"
                  : "bg-white text-slate border-line hover:border-edu-blue/40 hover:text-edu-blue"
              }`}
            >
              {filterLabels[f] ?? f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visible.map((cat, i) => (
            <div
              key={cat.id}
              className={`${bgMap[cat.color] ?? "bg-white border-line"} border rounded-xl p-5 flex flex-col gap-3 card-lift cursor-pointer group reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">
                <cat.icon className="w-[22px] h-[22px] text-edu-blue" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[14px] text-charcoal group-hover:text-edu-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[12px] text-slate-soft leading-snug mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
              <button
                className="text-[11.5px] font-semibold text-teal hover:text-edu-blue transition-colors flex items-center gap-1 mt-auto"
                aria-label={`Explore ${cat.name} solutions`}
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
