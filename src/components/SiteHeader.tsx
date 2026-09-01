"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "./ui/Container";
import { useModal } from "./modals/ModalProvider";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Solutions", href: "#solutions" },
  { label: "For Schools", href: "#for-schools" },
  { label: "For Vendors", href: "#for-vendors" },
  { label: "Conference", href: "#conference" },
  { label: "Speakers", href: "#speakers" },
  { label: "Sponsorship", href: "#sponsorship" },
  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-white/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-warm-ivory"
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-edu-blue">
            <span className="text-white font-display font-bold text-[15px]">E</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-[18px] text-edu-blue leading-none">
              EduWeCan
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-slate-soft leading-none mt-0.5 hidden sm:block">
              Education Ecosystem
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="px-3 py-2 text-[13px] font-medium text-slate-soft transition-colors hover:text-edu-blue rounded-md hover:bg-sky-pastel"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 xl:flex">
          <button
            onClick={() => openModal("vendor-register")}
            className="text-[13px] font-semibold text-teal hover:text-edu-blue transition-colors"
            id="header-become-partner"
          >
            Become a Partner
          </button>
          <button
            onClick={() => openModal("school-register")}
            className="bg-edu-blue text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-edu-blue-mid transition-colors shadow-sm"
            id="header-register-school"
          >
            Register Your School
          </button>
        </div>

        {/* Hamburger */}
        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[1.5px] w-6 bg-charcoal transition-transform duration-300 ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-charcoal transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-charcoal transition-transform duration-300 ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </Container>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-line bg-white xl:hidden shadow-lg">
          <Container className="flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-slate text-left hover:bg-sky-pastel hover:text-edu-blue transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
              <button
                onClick={() => { setOpen(false); openModal("vendor-register"); }}
                className="w-full border border-teal text-teal py-3 rounded-lg font-semibold text-[14px] hover:bg-teal hover:text-white transition-colors"
              >
                Become a Partner
              </button>
              <button
                onClick={() => { setOpen(false); openModal("school-register"); }}
                className="w-full bg-edu-blue text-white py-3 rounded-lg font-semibold text-[14px] hover:bg-edu-blue-mid transition-colors"
              >
                Register Your School
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
