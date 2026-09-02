"use client";

import { useState } from "react";
import Container from "./ui/Container";
import { solutionCategories } from "@/lib/data";

export default function SolutionsGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

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
    <section id="solutions" className="py-20 md:py-28 bg-[#F8FAF8]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 reveal">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-5 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
            <span>Solution Categories</span>
          </div>
          <h2 className="font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1] mb-4 tracking-tight">
            Find the Right Solutions{" "}
            <span className="text-[#0E733B]">for Your School</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-slate-soft font-normal">
            Explore innovative products, services and solutions designed for the modern education ecosystem.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {displayFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4.5 py-2.5 rounded-full text-[13px] font-semibold border transition-all ${
                activeFilter === f
                  ? "bg-[#0E733B] text-white border-[#0E733B] shadow-md"
                  : "bg-white text-slate-600 border-line hover:border-[#0E733B]/40 hover:text-[#0E733B]"
              }`}
            >
              {filterLabels[f] ?? f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {visible.map((cat, i) => (
            <div
              key={cat.id}
              className={`bg-white border border-line rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:border-[#0E733B]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-[#0E733B] transition-colors duration-300">
                <cat.icon className="w-5 h-5 text-[#0E733B] group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold text-[14.5px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[12px] text-slate-soft leading-snug mt-1.5 line-clamp-2">
                  {cat.description}
                </p>
              </div>
              <button
                className="text-[12px] font-bold text-[#0E733B] hover:text-[#0B5C2F] transition-colors flex items-center gap-1 mt-auto pt-1"
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

