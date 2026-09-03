"use client";

import Image from "next/image";
import { Target, School, BarChart3, Handshake, Mic, Megaphone, Rocket } from "lucide-react";
import { useModal } from "./modals/ModalProvider";
import Container from "./ui/Container";
import { img } from "@/lib/images";

const benefits = [
  { icon: Target, title: "Showcase Your Solution", desc: "Get listed on Edubeacon and reach schools actively looking for your product or service." },
  { icon: School, title: "Reach Decision-Makers", desc: "Connect directly with school owners, principals and education leaders." },
  { icon: BarChart3, title: "Generate Qualified Leads", desc: "Receive interest from schools that have already shown intent in your category." },
  { icon: Handshake, title: "Build Partnerships", desc: "Build long-term relationships with schools across India through the Edubeacon network." },
  { icon: Mic, title: "Speak at Conferences", desc: "Get speaking, panel and exhibition opportunities at Edubeacon events." },
  { icon: Megaphone, title: "Brand Visibility", desc: "Build awareness through Edubeacon's digital presence, magazine and events." },
];

export default function ForVendors() {
  const { openModal } = useModal();

  return (
    <section id="for-vendors" className="py-14 md:py-20 bg-[#FDFBF7]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-line">
              <Image
                src={img.exhibitionFloor}
                alt="Education exhibition floor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0E17]/40 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="bg-white rounded-2xl border border-line shadow-xl p-5 -mt-10 ml-6 relative z-10 max-w-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                  <Rocket className="w-5.5 h-5.5 text-[#0E733B]" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-bold text-[17px] text-charcoal">300+ Vendors</p>
                  <p className="text-[12px] text-slate-soft font-medium">Already Listed on Edubeacon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="reveal reveal-delay-2 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full mb-4 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>For Startups & Vendors</span>
            </div>
            <h2 className="font-bold text-[34px] md:text-[44px] text-charcoal leading-[1.1] mb-4 tracking-tight">
              Connect Your Innovation with{" "}
              <span className="text-[#0E733B]">the Right Schools</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-slate-soft mb-8 font-normal">
              Edubeacon is the most direct route from your product to the schools that need it. Stop cold-calling. Start building meaningful partnerships through India&#39;s education ecosystem platform.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-3 bg-white rounded-2xl border border-line p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="w-9.5 h-9.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <b.icon className="w-[18px] h-[18px] text-[#0E733B]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-charcoal mb-0.5">{b.title}</p>
                    <p className="text-[12.5px] text-slate-soft leading-snug font-normal">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                id="for-vendors-list"
                onClick={() => openModal("vendor-register")}
                className="bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all shadow-md hover:shadow-emerald-950/20"
              >
                List Your Solution →
              </button>
              <button
                onClick={() => {
                  document.getElementById("sponsorship")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-[#0E733B] text-[#0E733B] px-8 py-4 rounded-full font-semibold text-[15px] hover:bg-[#0E733B] hover:text-white transition-all shadow-sm"
              >
                Explore Sponsorship
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

