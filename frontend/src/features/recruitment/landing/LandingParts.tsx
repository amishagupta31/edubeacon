import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.2em] ${
        light ? "text-[#8FE3B0]" : "text-[#0E733B]"
      }`}
    >
      <span className={`h-px w-6 ${light ? "bg-[#8FE3B0]/60" : "bg-[#0E733B]/50"}`} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow, title, sub, center = false, light = false,
}: { eyebrow: string; title: ReactNode; sub?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 ${center ? "items-center text-center mx-auto" : ""} max-w-2xl`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`font-display font-bold text-[30px] sm:text-[38px] leading-[1.12] tracking-tight text-balance ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`text-[15.5px] leading-[1.7] max-w-[56ch] ${light ? "text-white/70" : "text-slate-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

const FOOTER_COLS = [
  {
    title: "Teachers",
    links: [
      { label: "Browse jobs", href: "/recruitment/jobs" },
      { label: "Create profile", href: "/recruitment/register" },
      { label: "Sign in", href: "/recruitment/register" },
    ],
  },
  {
    title: "Schools",
    links: [
      { label: "Hire with EduBeacon", href: "/recruitment/employers" },
      { label: "Browse candidates", href: "/recruitment/teachers" },
      { label: "Post a job", href: "/recruitment/register" },
      { label: "Pricing", href: "/recruitment/pricing" },
    ],
  },
  {
    title: "EduBeacon",
    links: [
      { label: "How it works", href: "/recruitment/how-it-works" },
      { label: "About us", href: "/about/our-story" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function RecruitmentFooter() {
  return (
    <footer className="bg-[#06170E] text-white/70">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="bg-white rounded-lg px-2.5 py-1.5">
                <Image src="/edubeacon-logo.png" alt="EduBeacon" width={110} height={30} className="h-6 w-auto object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8FE3B0]">Recruitment</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-white/55">
              Where India&apos;s schools and teachers find each other — verified profiles, transparent offers,
              no middlemen.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{col.title}</p>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="text-[14px] text-white/75 hover:text-[#8FE3B0] transition-colors w-fit">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 justify-between text-[12.5px] text-white/40">
          <p>© {new Date().getFullYear()} EduBeacon. All rights reserved.</p>
          <p>Made for educators across CBSE, ICSE, IB, Cambridge &amp; State boards.</p>
        </div>
      </div>
    </footer>
  );
}
