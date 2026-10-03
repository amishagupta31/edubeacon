"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Explore", href: "#explore" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "Guidance", href: "#guidance" },
  { label: "Community", href: "#community" },
  { label: "Stories", href: "#stories" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (href: string) => {
    setOpen(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[var(--color-ewc-ivory)]/85 backdrop-blur-md shadow-[0_1px_0_var(--color-ewc-line)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center"
        >
          <Image
            src="/edubeacon-logo.png"
            alt="eduBeacon Logo"
            width={160}
            height={44}
            className="h-8.5 w-auto object-contain"
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => goTo(item.href)}
              className="whitespace-nowrap text-[14px] font-medium transition-colors duration-200"
              style={{ color: "var(--color-ewc-muted)" }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => goTo("#join")}
          className="hidden whitespace-nowrap rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 md:block"
          style={{ background: "var(--color-ewc-ink)", color: "var(--color-ewc-ivory)" }}
        >
          Get Started
        </button>

        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-[1.5px] w-6 transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} style={{ background: "var(--color-ewc-ink)" }} />
          <span className={`h-[1.5px] w-6 transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} style={{ background: "var(--color-ewc-ink)" }} />
          <span className={`h-[1.5px] w-6 transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} style={{ background: "var(--color-ewc-ink)" }} />
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden" style={{ borderColor: "var(--color-ewc-line)", background: "var(--color-ewc-ivory)" }}>
          <div className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item.href)}
                className="rounded-lg px-2 py-3 text-left text-[15px] font-medium"
                style={{ color: "var(--color-ewc-ink)" }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => goTo("#join")}
              className="mt-2 rounded-full py-3 text-[14px] font-semibold"
              style={{ background: "var(--color-ewc-ink)", color: "var(--color-ewc-ivory)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
