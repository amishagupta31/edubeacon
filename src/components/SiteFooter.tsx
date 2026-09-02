"use client";

import Image from "next/image";
import Container from "./ui/Container";
import { siteConfig } from "@/lib/data";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "About Edubeacon", href: "#about" },
      { label: "Find Solutions", href: "#solutions" },
      { label: "For Schools", href: "#for-schools" },
      { label: "For Vendors", href: "#for-vendors" },
    ],
  },
  {
    title: "Conference",
    links: [
      { label: "Overview", href: "#conference" },
      { label: "Speakers", href: "#speakers" },
      { label: "Agenda", href: "#conference" },
      { label: "Exhibition", href: "#conference" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Register Your School", href: "#for-schools" },
      { label: "List Your Solution", href: "#for-vendors" },
      { label: "Sponsorship", href: "#sponsorship" },
      { label: "Awards", href: "#awards" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Magazine", href: "#magazine" },
      { label: "Partners", href: "#partners" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

const socials = [
  { name: "LinkedIn", href: "#" },
  { name: "Twitter / X", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
  { name: "Facebook", href: "#" },
];

function scrollTo(id: string) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0E17] text-white">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-6 md:gap-8 md:py-20">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md inline-block">
              <Image
                src="/edubeacon-logo.png"
                alt="eduBeacon Logo"
                width={150}
                height={40}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>
          <p className="max-w-[28ch] text-[14px] leading-relaxed text-slate-400">
            Connecting Schools, Innovation and Opportunity across India.
          </p>
          <div className="mt-6 flex flex-col gap-1.5 text-[13.5px] text-slate-300/80">
            <span>{siteConfig.email}</span>
            <span>{siteConfig.phone}</span>
            <span>{siteConfig.location}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="text-[12.5px] font-medium tracking-wide text-slate-400 hover:text-emerald-300 transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400/90 mb-4">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[13.5px] text-slate-300/80 hover:text-emerald-300 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-[12.5px] text-slate-400 md:flex-row">
          <span>© 2027 Edubeacon. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-emerald-300 transition-colors">Cookie Policy</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}

