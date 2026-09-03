"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  ChevronDown, 
  Compass, 
  Trophy, 
  HeartHandshake, 
  Users, 
  ArrowRight
} from "lucide-react";
import Container from "./ui/Container";
import { useModal } from "./modals/ModalProvider";

const eventDropdownItems = [
  {
    name: "Roadshows",
    label: "City Roadshows",
    desc: "12+ City Tour bringing live tech demos directly to schools",
    href: "/events/roadshows",
    icon: Compass,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Conference",
    label: "Annual Leadership Conference",
    desc: "Flagship 2-Day Mega-Summit at Bharat Mandapam, New Delhi",
    href: "/events/conference",
    icon: Trophy,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Philanthropy",
    label: "Philanthropy & Social Impact",
    desc: "Adopt-a-School grants, girl-child STEM scholarships & CSR",
    href: "/events/philanthropy",
    icon: HeartHandshake,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Round Table",
    label: "Executive Round Tables",
    desc: "Chatham House Rule strategy salons for school founders",
    href: "/events/roundtable",
    icon: Users,
    accent: "text-[#0E733B] bg-emerald-50",
  },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEventsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    setEventsOpen(false);
    
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const isEventsActive = pathname.startsWith("/events");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 border-none ${
        scrolled
          ? "pt-3 px-3 sm:px-6 md:px-8 pointer-events-none"
          : "bg-[#F8FAF8]"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "max-w-[1440px] rounded-full bg-white/95 shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-2 flex items-center justify-between border-none"
            : "w-full max-w-[1440px] px-6 md:px-10 xl:px-14 flex h-[72px] items-center justify-between border-none"
        }`}
      >
        {/* ──────────────── Brand Logo ──────────────── */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center py-1 group"
            onClick={(e) => {
              setOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/edubeacon-logo.png"
              alt="eduBeacon Logo"
              width={150}
              height={40}
              className={`w-auto object-contain transition-all ${scrolled ? "h-7 sm:h-8" : "h-8 sm:h-9"}`}
              priority
            />
          </Link>
        </div>

        {/* ──────────────── Desktop Navigation Links (Directly Visible) ──────────────── */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 text-[13px]">
          <button
            onClick={() => handleNavClick("/#about")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("/#solutions")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Solutions
          </button>
          <button
            onClick={() => handleNavClick("/#for-schools")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Schools
          </button>
          <button
            onClick={() => handleNavClick("/#for-vendors")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Vendors
          </button>

          {/* Events Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setEventsOpen(!eventsOpen)}
              onMouseEnter={() => setEventsOpen(true)}
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 font-bold transition-all ${
                isEventsActive || eventsOpen
                  ? "bg-emerald-50 text-[#0E733B]"
                  : "text-slate-700 hover:bg-emerald-50 hover:text-[#0E733B]"
              }`}
            >
              <span>Events</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${eventsOpen ? "rotate-180" : ""}`} />
            </button>

            {eventsOpen && (
              <div 
                onMouseLeave={() => setEventsOpen(false)}
                className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-line bg-white p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50"
              >
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    EduBeacon Events
                  </span>
                  <Link
                    href="/events"
                    onClick={() => setEventsOpen(false)}
                    className="text-[11px] font-bold text-[#0E733B] hover:underline"
                  >
                    All Events →
                  </Link>
                </div>

                <div className="space-y-1 mt-1.5">
                  {eventDropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setEventsOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-all hover:bg-emerald-50/60"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.accent}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-charcoal group-hover:text-[#0E733B] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick("/#speakers")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Speakers
          </button>
          <button
            onClick={() => handleNavClick("/events/conference#sponsorship")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Sponsorship
          </button>
          <button
            onClick={() => handleNavClick("/#awards")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Awards
          </button>
          <button
            onClick={() => handleNavClick("/#testimonials")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Testimonials
          </button>
          <button
            onClick={() => handleNavClick("/#contact")}
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:text-[#0E733B] hover:bg-emerald-50 transition-all"
          >
            Contact
          </button>
        </nav>

        {/* ──────────────── Right Action Button (Partner + Register in Both States) ──────────────── */}
        <div className="hidden xl:flex items-center gap-2.5">
          {scrolled ? (
            <>
              <button
                onClick={() => openModal("vendor-register")}
                className="whitespace-nowrap text-[12.5px] font-bold text-[#0E733B] hover:text-[#0B5C2F] transition-colors px-3 py-1.5 rounded-full hover:bg-emerald-50"
              >
                Partner
              </button>
              <button
                onClick={() => openModal("school-register")}
                className="rounded-full bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] px-5 py-2 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                REGISTER NOW
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal("vendor-register")}
                className="whitespace-nowrap text-[13px] font-semibold text-[#0E733B] hover:text-[#0B5C2F] transition-colors px-3 py-2 rounded-full hover:bg-emerald-50"
              >
                Partner
              </button>
              <button
                onClick={() => openModal("school-register")}
                className="whitespace-nowrap rounded-full bg-[#0E733B] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0B5C2F]"
              >
                Register School
              </button>
            </>
          )}
        </div>

        {/* ──────────────── Mobile Hamburger ──────────────── */}
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
      </div>

      {/* ──────────────── Mobile Fullscreen / Drawer Menu ──────────────── */}
      {open && (
        <div className="border-t border-line bg-white xl:hidden shadow-2xl max-h-[calc(100vh-72px)] overflow-y-auto pointer-events-auto">
          <Container className="flex flex-col gap-1 py-4">
            <button
              onClick={() => handleNavClick("/#about")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("/#solutions")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick("/#for-schools")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Schools
            </button>
            <button
              onClick={() => handleNavClick("/#for-vendors")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Vendors
            </button>

            {/* Mobile Events Accordion */}
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-2 my-1">
              <button
                onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[14px] font-bold text-[#0E733B]"
              >
                <span>Events</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileEventsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileEventsOpen && (
                <div className="mt-1 space-y-1 pl-2 pt-1 border-t border-emerald-200">
                  <Link
                    href="/events"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    • All Events Overview
                  </Link>
                  <Link
                    href="/events/roadshows"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Roadshows (12+ Cities)
                  </Link>
                  <Link
                    href="/events/conference"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Annual Leadership Conference
                  </Link>
                  <Link
                    href="/events/philanthropy"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Philanthropy & CSR
                  </Link>
                  <Link
                    href="/events/roundtable"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Executive Round Tables
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick("/#speakers")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Speakers
            </button>
            <button
              onClick={() => handleNavClick("/events/conference#sponsorship")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Sponsorship
            </button>
            <button
              onClick={() => handleNavClick("/#awards")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Awards
            </button>
            <button
              onClick={() => handleNavClick("/#testimonials")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Testimonials
            </button>
            <button
              onClick={() => handleNavClick("/#contact")}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Contact
            </button>

            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
              <button
                onClick={() => { setOpen(false); openModal("school-register"); }}
                className="w-full bg-gradient-to-r from-[#0E733B] via-[#059669] to-[#10B981] text-white py-3 rounded-full font-bold text-[14px] shadow-md"
              >
                REGISTER NOW
              </button>
              <button
                onClick={() => { setOpen(false); openModal("vendor-register"); }}
                className="w-full border border-gray-300 text-charcoal py-3 rounded-full font-semibold text-[14px] hover:bg-gray-50"
              >
                Join as Partner
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
