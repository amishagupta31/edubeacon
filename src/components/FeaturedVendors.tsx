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
    <section id="vendors" className="py-20 md:py-28 bg-warm-ivory">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
          <div>
            <div className="inline-block bg-teal-muted text-teal text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 border border-teal/15">
              Solution Providers
            </div>
            <h2 className="font-display font-bold text-[34px] md:text-[46px] text-charcoal leading-[1.1]">
              Meet Our Featured{" "}
              <span className="text-teal">Solution Providers</span>
            </h2>
          </div>
          <button
            onClick={() => setShowAll(true)}
            className="shrink-0 border border-edu-blue text-edu-blue px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-edu-blue hover:text-white transition-colors"
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
                <div className="w-14 h-14 bg-sky-pastel rounded-xl flex items-center justify-center border border-edu-blue/10">
                  <span className="font-display font-bold text-[20px] text-edu-blue">
                    {vendor.name[0]}
                  </span>
                </div>
                {vendor.featured && (
                  <span className="bg-gold/10 text-gold text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-gold/20">
                    Featured
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-display font-bold text-[18px] text-charcoal mb-0.5">
                  {vendor.name}
                </h3>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-teal bg-teal-muted px-2.5 py-0.5 rounded-full mb-3">
                  {vendor.category}
                </span>
                <p className="text-[14px] leading-relaxed text-slate-soft">
                  {vendor.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-line">
                <button className="flex-1 text-[13px] font-semibold text-edu-blue border border-edu-blue/25 py-2 rounded-lg hover:border-edu-blue hover:bg-sky-pastel/50 transition-colors">
                  Learn More
                </button>
                <button
                  onClick={() =>
                    openModal("interest", { vendorName: vendor.name })
                  }
                  className="flex-1 text-[13px] font-semibold text-white bg-teal py-2 rounded-lg hover:bg-teal-light transition-colors"
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
              className="bg-edu-blue text-white px-8 py-3.5 rounded-xl font-semibold text-[14px] hover:bg-edu-blue-mid transition-colors shadow-sm"
            >
              View All Solution Providers
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
