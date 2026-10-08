"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Building2, Info, ArrowRight, Menu, X } from "lucide-react";

const NAV = [
  { label: "Find Jobs",   href: "/recruitment/register", icon: Briefcase },
  { label: "For Schools", href: "/recruitment/register", icon: Building2 },
  { label: "How it Works", href: "/solutions/recruitment", icon: Info },
];

export default function RecruitmentHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Always dark green — consistent across all recruitment pages
  const isDark = !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "pt-3 px-3 sm:px-6 pointer-events-none"
          : isDark
            ? "bg-[#0C2A1B]"
            : "bg-white border-b border-slate-100"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "max-w-[1440px] rounded-full bg-white/95 shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-2 flex items-center justify-between"
            : "w-full max-w-[1440px] px-5 md:px-10 xl:px-14 flex h-[68px] items-center justify-between"
        }`}
      >
        {/* ── Brand ── */}
        <Link href="/solutions/recruitment" className="flex items-center gap-2.5 shrink-0 py-1">
          <Image
            src="/edubeacon-logo.png"
            alt="EduBeacon"
            width={130}
            height={36}
            className={`h-8 w-auto object-contain transition-all ${isDark ? "brightness-0 invert" : ""} ${scrolled ? "h-7" : ""}`}
            priority
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full transition-all ${
              isDark
                ? "bg-emerald-500/25 text-white"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            Recruitment
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 text-[13px]">
          {NAV.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-[#0E733B] hover:bg-emerald-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right CTAs ── */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/recruitment/register"
            className={`text-[13px] font-semibold px-3 py-1.5 rounded-full transition-all ${
              isDark
                ? "text-white/75 hover:text-white hover:bg-white/10"
                : "text-[#0E733B] hover:bg-emerald-50"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/recruitment/register"
            className="inline-flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full text-[13px] font-bold text-white bg-[#0E8A45] hover:bg-[#0B6E36] shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg"
        >
          {mobileOpen
            ? <X className={`w-5 h-5 ${isDark ? "text-white" : "text-charcoal"}`} />
            : <Menu className={`w-5 h-5 ${isDark ? "text-white" : "text-charcoal"}`} />
          }
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl pointer-events-auto">
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0E733B] transition-all"
              >
                <Icon className="w-4 h-4 text-[#0E733B]" />
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/recruitment/register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-full border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/recruitment/register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-full text-[13.5px] font-bold text-white bg-[#0E8A45] hover:bg-[#0B6E36]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
