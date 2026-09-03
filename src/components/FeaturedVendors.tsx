"use client";

import { useState } from "react";
import Container from "./ui/Container";
import { featuredVendors } from "@/lib/data";
import { useModal } from "./modals/ModalProvider";

export default function FeaturedVendors() {
  const { openModal } = useModal();
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? featuredVendors : featuredVendors.slice(0, 6);

  return (
    <section id="vendors" className="py-14 md:py-20 bg-[#FDFBF7]">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 reveal">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>Solution Providers</span>
            </div>
            <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] tracking-tight">
              Meet Our Featured{" "}
              <span className="text-[#0E733B]">Solution Providers</span>
            </h2>
          </div>
            <button
              onClick={() => setShowAll(true)}
              className="shrink-0 border border-[#0E733B] text-[#0E733B] px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#0E733B] hover:text-white transition-colors"
            >
              View All Providers
            </button>
          </div>

          {/* Vendor Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map((vendor, i) => (
              <div
                key={vendor.id}
                className={`bg-white rounded-2xl border border-line p-6 flex flex-col gap-4 card-lift reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                {/* Logo + Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                    <span className="font-display font-bold text-[20px] text-[#0E733B]">
                      {vendor.name[0]}
                    </span>
                  </div>
                  {vendor.featured && (
                    <span className="bg-emerald-50 text-[#0E733B] text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-emerald-200">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[18px] text-charcoal mb-0.5">
                    {vendor.name}
                  </h3>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0E733B] bg-emerald-50 px-2.5 py-0.5 rounded-full mb-3 border border-emerald-100">
                    {vendor.category}
                  </span>
                  <p className="text-[14px] leading-relaxed text-slate-soft">
                    {vendor.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-line">
                  <button className="flex-1 text-[13px] font-semibold text-[#0E733B] border border-[#0E733B]/25 py-2 rounded-lg hover:border-[#0E733B] hover:bg-emerald-50 transition-colors">
                    Learn More
                  </button>
                  <button
                    onClick={() =>
                      openModal("interest", { vendorName: vendor.name })
                    }
                    className="flex-1 text-[13px] font-semibold text-white bg-[#0E733B] py-2 rounded-lg hover:bg-[#0B5C2F] transition-colors"
                  >
                    I&apos;m Interested
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!showAll && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="bg-[#0E733B] text-white px-8 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#0B5C2F] transition-colors shadow-sm"
              >
                View All Solution Providers
              </button>
            </div>
          )}
      </Container>
    </section>
  );
}
