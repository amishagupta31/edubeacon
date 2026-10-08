import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ShieldCheck, Landmark, Lock, Users, Building2,
  FileText, UserRound, Briefcase, Link2,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Teacher Recruitment, EduBeacon",
  description:
    "Connect with trusted institutions and build your teaching career. Verified profiles, trusted schools and secure credentials.",
};

const STATS = [
  { icon: Users, value: "2,500+", label: "Teachers" },
  { icon: Building2, value: "1,200+", label: "Schools" },
  { icon: FileText, value: "5,000+", label: "Applications" },
];

const WHY = [
  { icon: ShieldCheck, title: "Verified Profiles", desc: "Real teachers. Genuine credentials." },
  { icon: Landmark, title: "Trusted Institutions", desc: "Work with verified schools and colleges." },
  { icon: Lock, title: "Secure Credentials", desc: "Every account is email-verified before access." },
];

const STEPS = [
  { num: "01", icon: UserRound, title: "Create Profile" },
  { num: "02", icon: Briefcase, title: "Apply / Post" },
  { num: "03", icon: Link2, title: "Connect" },
];

/** Small centred section label with the short rule beneath it. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-11">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#0E733B]">
        {children}
      </p>
      <span className="block h-[2px] w-9 bg-[#0E733B]/50 mx-auto mt-3" />
    </div>
  );
}

function TrustBadge({
  icon: Icon, line1, line2, className,
}: {
  icon: React.ElementType; line1: string; line2: string; className: string;
}) {
  return (
    <div className={`absolute ${className} bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] pl-3 pr-4 py-2.5 flex items-center gap-2.5`}>
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#0E733B]" strokeWidth={2.2} />
      </div>
      <span className="text-[11.5px] font-semibold text-charcoal leading-[1.3] whitespace-nowrap">
        {line1}<br />{line2}
      </span>
    </div>
  );
}

export default function RecruitmentSolutionPage() {
  return (
    <div className="bg-white">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative bg-[#0C2A1B] overflow-hidden">
        {/* Right image panel — the photo has its own dark-left edge + arcs baked in. */}
        <div className="absolute right-0 top-0 bottom-8 w-[52%] hidden lg:block overflow-hidden rounded-bl-2xl bg-[#0C2A1B]">
          {/* object-top keeps face/shoulders in view when the panel is shorter than the image */}
          <Image
            src={img.recruitmentHero}
            alt="A teacher exploring opportunities on EduBeacon"
            fill
            priority
            sizes="(max-width: 1024px) 0px, 52vw"
            className="object-cover object-top"
          />
          {/* Very subtle left-edge fade so the photo blends into the dark bg seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C2A1B]/60 via-transparent to-transparent z-10 w-[30%]" />

          <TrustBadge icon={ShieldCheck} line1="Verified" line2="Teachers"     className="left-[6%]  top-[22%] z-20" />
          <TrustBadge icon={Landmark}    line1="Trusted"  line2="Institutions" className="right-[5%] top-[10%] z-20" />
          <TrustBadge icon={Lock}        line1="Secure"   line2="Credentials"  className="right-[2%] top-[58%] z-20" />
        </div>

        <Container>
          <div className="relative z-20 py-14 lg:py-[88px] lg:max-w-[44%]">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11.5px] font-bold uppercase tracking-[0.22em] text-white/85">
                Teacher Recruitment
              </span>
              <span className="h-px w-9 bg-white/35" />
            </div>

            <h1 className="font-display font-bold text-[42px] sm:text-[52px] leading-[1.06] tracking-tight text-white mb-5">
              Find the right<br />
              <span className="text-[#8FE3B0]">opportunities.</span>
            </h1>

            <p className="text-slate-200/90 text-[15.5px] leading-[1.65] max-w-[33ch] mb-8">
              Connect with trusted institutions and build your teaching career.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/recruitment/register"
                className="inline-flex items-center gap-2.5 pl-7 pr-6 py-3.5 rounded-full font-semibold text-[13.5px] text-white bg-[#0E8A45] hover:bg-[#0B6E36] shadow-lg shadow-emerald-950/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/recruitment/register"
                className="inline-flex items-center px-8 py-3.5 rounded-full font-semibold text-[13.5px] text-white border border-white/35 hover:bg-white/10 hover:border-white/55 transition-all duration-300"
              >
                For Schools
              </Link>
            </div>
          </div>
        </Container>

        {/* Mobile / tablet visual */}
        <div className="relative lg:hidden h-[280px]">
          <Image
            src={img.recruitmentHero}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2A1B] via-transparent to-[#0C2A1B]/40" />
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="bg-[#FAFCFA] py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70 max-w-5xl mx-auto">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center justify-center gap-5 py-6 sm:py-1">
                <div className="w-[60px] h-[60px] rounded-full bg-emerald-100/60 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-[#0E733B]" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="font-display font-bold text-[32px] text-charcoal leading-none tracking-tight">
                    {value}
                  </p>
                  <p className="text-[14.5px] text-slate-500 mt-1.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════ WHY ═══════════════════ */}
      <section className="py-16 md:py-[72px] bg-[#FDFEFD]">
        <Container>
          <SectionLabel>Why EduBeacon</SectionLabel>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200/70 rounded-xl px-7 py-9 hover:shadow-lg hover:border-[#0E733B]/25 transition-all duration-300"
              >
                <div className="w-[62px] h-[62px] rounded-full bg-emerald-50 flex items-center justify-center mb-8">
                  <Icon className="w-7 h-7 text-[#0E733B]" strokeWidth={1.6} />
                </div>
                <h3 className="font-display font-bold text-[20px] text-charcoal mb-2.5">{title}</h3>
                <p className="text-[14px] text-slate-500 leading-[1.6] max-w-[26ch]">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="pb-16 md:pb-[72px] bg-[#FDFEFD]">
        <Container>
          <SectionLabel>How It Works</SectionLabel>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-2 max-w-3xl mx-auto">
            {STEPS.map(({ num, icon: Icon, title }, i) => (
              <div key={num} className="contents">
                <div className="flex flex-col items-center text-center sm:flex-1">
                  <div className="w-[66px] h-[66px] rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#0E733B]" strokeWidth={1.5} />
                  </div>
                  <p className="font-display font-bold text-[21px] text-[#2E9E63] mb-2">{num}</p>
                  <p className="font-display font-bold text-[17px] text-charcoal">{title}</p>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="shrink-0 sm:mb-[52px] rotate-90 sm:rotate-0" aria-hidden="true">
                    <svg width="44" height="12" viewBox="0 0 44 12" fill="none">
                      <path d="M0 6h40M35 1.5L40.5 6 35 10.5" stroke="#2E9E63" strokeOpacity="0.75"
                        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="pb-16 md:pb-20 bg-[#FDFEFD]">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-[#0C2A1B] px-8 sm:px-12 py-12">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none"
              viewBox="0 0 900 200" fill="none" aria-hidden="true">
              <path d="M-50 190 Q 340 120 920 185" stroke="white" strokeOpacity="0.1" strokeWidth="1.2" />
              <path d="M240 210 Q 620 130 960 165" stroke="white" strokeOpacity="0.07" strokeWidth="1.2" />
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
              <h2 className="font-display font-bold text-[27px] sm:text-[31px] leading-[1.28] text-white max-w-[19ch]">
                Build your next opportunity with EduBeacon.
              </h2>
              <Link
                href="/recruitment/register"
                className="inline-flex items-center gap-2.5 pl-7 pr-6 py-3.5 rounded-full font-semibold text-[13.5px] text-white bg-[#0E8A45] hover:bg-[#0B6E36] shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
