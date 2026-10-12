"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Building2,
  CheckCircle2, BadgeCheck, UserRound, Send,
  BookOpen, Calculator, FlaskConical, Languages, Palette, Trophy, HeartHandshake, Library,
} from "lucide-react";
import { img } from "@/lib/images";
import { useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";
import { Eyebrow, SectionHeading, RecruitmentFooter } from "@/features/recruitment/landing/LandingParts";
import TeacherJobsHero, { TeacherTrustRow } from "@/features/recruitment/landing/TeacherJobsHero";

const STATS = [
  { value: "2,500+", label: "Teachers building careers" },
  { value: "1,200+", label: "Schools hiring" },
  { value: "5,000+", label: "Applications sent" },
];

const STEPS = [
  { icon: UserRound, title: "Build your profile once", desc: "Subjects, classes taught, CTET/STET status, expected salary and preferred cities — set it up in minutes." },
  { icon: Sparkles, title: "Get matched to roles", desc: "We surface openings that fit your subject, board and city, so you stop scrolling through irrelevant posts." },
  { icon: Send, title: "Apply in one click", desc: "Your profile is your application. Track every stage — shortlisted, interview, offer — in one place." },
];

const ROLES = [
  { icon: BookOpen, label: "Primary (PRT)", q: "PRT" },
  { icon: Calculator, label: "Mathematics", q: "Mathematics" },
  { icon: FlaskConical, label: "Sciences", q: "Science" },
  { icon: Languages, label: "Languages", q: "English" },
  { icon: Palette, label: "Art & Music", q: "Music" },
  { icon: Trophy, label: "Sports & PE", q: "Sports" },
  { icon: HeartHandshake, label: "Counsellors", q: "Counsel" },
  { icon: Library, label: "Coordinators", q: "Coordinator" },
];

export default function RecruitmentLandingClient() {
  const router = useRouter();
  const { state } = useRecruitmentProfile();

  useEffect(() => {
    if (state.status === "unregistered") router.replace("/recruitment/register");
  }, [state, router]);

  return (
    <div className="bg-white overflow-x-hidden">
      <TeacherJobsHero />

      {/* ═════════════ HOW IT WORKS ═════════════ */}
      <section className="bg-[#F8FAF8] py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 flex flex-col gap-12">
          <SectionHeading
            center
            eyebrow="How it works"
            title="Hired in three steps. No agents, no commission."
            sub="One simple plan, paid once. Schools come to you with real openings — you decide which conversations to have."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="reveal relative bg-white rounded-3xl border border-line p-7 flex flex-col gap-4 card-lift">
                <span className="absolute top-6 right-7 font-display font-bold text-[44px] leading-none text-emerald-100">
                  0{i + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#0C2A1B] flex items-center justify-center">
                  <Icon className="w-5.5 h-5.5 text-[#8FE3B0]" strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-bold text-[20px] text-charcoal">{title}</h3>
                <p className="text-[14.5px] leading-[1.7] text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ FEATURE ROWS ═════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 flex flex-col gap-24 lg:gap-32">
          <FeatureRow
            eyebrow="Matched, not spammed"
            title="Only the roles that fit you."
            body="Tell us what you teach and where you want to be. We rank openings by subject, class level, board and city — so the first ten jobs you see are the ten worth reading."
            points={["Match score on every opening", "Filter by board, salary and employment type", "Save jobs and come back later"]}
            image={img.speakerM2}
            imageAlt="A teacher reviewing matched roles"
            overlay={
              <div className="w-[250px] bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2.5">
                {[["PGT Biology", "96%"], ["TGT Science", "88%"], ["Lab Coordinator", "81%"]].map(([r, s]) => (
                  <div key={r} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-charcoal truncate">{r}</span>
                    <span className="text-[11.5px] font-bold text-[#0E733B] bg-emerald-50 rounded-full px-2 py-0.5">{s}</span>
                  </div>
                ))}
              </div>
            }
          />
          <FeatureRow
            reverse
            eyebrow="Know before you apply"
            title="Every school, properly introduced."
            body="See the institution's board, campus, student strength and verification status before you send a single application. No more walking into an interview blind."
            points={["Verified institution badge", "Full school profile and open roles", "Clear location and employment terms"]}
            image={img.leadersMeeting}
            imageAlt="School leaders in discussion"
            overlay={
              <div className="w-[260px] bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0C2A1B] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#8FE3B0]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-charcoal flex items-center gap-1">
                      Greenfield Public School <BadgeCheck className="w-4 h-4 text-[#0E733B] shrink-0" />
                    </p>
                    <p className="text-[11.5px] text-slate-500">CBSE · K–12 · Jaipur</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 py-2"><p className="text-[14px] font-bold text-charcoal ewc-counter">2,100</p><p className="text-[10.5px] text-slate-500">Students</p></div>
                  <div className="rounded-xl bg-slate-50 py-2"><p className="text-[14px] font-bold text-charcoal ewc-counter">6</p><p className="text-[10.5px] text-slate-500">Open roles</p></div>
                </div>
              </div>
            }
          />
          <FeatureRow
            eyebrow="Offers in the open"
            title="Talk salary without the awkwardness."
            body="Receive structured offer letters and negotiate right on the platform — CTC, joining date and terms, all written down and easy to compare."
            points={["Digital offer letters", "Counter-offer and negotiate in-app", "Every stage tracked in your dashboard"]}
            image={img.workshop}
            imageAlt="Educators collaborating"
            overlay={
              <div className="w-[250px] bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E733B]">Offer · TGT English</p>
                <div className="flex items-end justify-between">
                  <span className="font-display font-bold text-[24px] text-charcoal leading-none ewc-counter">₹58,000</span>
                  <span className="text-[11.5px] text-slate-500">/ month</span>
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 text-center rounded-lg bg-[#0E733B] text-white text-[12px] font-bold py-1.5">Accept</span>
                  <span className="flex-1 text-center rounded-lg border border-line text-charcoal text-[12px] font-bold py-1.5">Negotiate</span>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* ═════════════ STATS BAND ═════════════ */}
      <section className="bg-[#0C2A1B] text-white">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 py-14 grid sm:grid-cols-3 gap-8 sm:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-1.5 sm:border-r last:border-r-0 border-white/10">
              <span className="font-display font-bold text-[44px] leading-none text-[#8FE3B0] ewc-counter">{s.value}</span>
              <span className="text-[14px] text-white/65">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════ EXPLORE ROLES ═════════════ */}
      <section className="bg-[#F8FAF8] py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading eyebrow="Explore" title="Find roles by what you teach." />
            <Link href="/recruitment/jobs" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0E733B] hover:gap-3 transition-all shrink-0">
              View all jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {ROLES.map(({ icon: Icon, label, q: query }) => (
              <Link
                key={label}
                href={`/recruitment/jobs?q=${encodeURIComponent(query)}`}
                className="group bg-white rounded-2xl border border-line p-5 flex flex-col gap-4 hover:border-[#0E733B]/40 card-lift"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-[#0E733B] flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-[#0E733B] group-hover:text-white transition-colors" strokeWidth={1.8} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14.5px] font-bold text-charcoal">{label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0E733B] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TeacherTrustRow />

      {/* ═════════════ DUAL CTA ═════════════ */}
      <section className="bg-white pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-5">
          <div className="relative overflow-hidden rounded-[28px] bg-[#0C2A1B] p-8 sm:p-10 flex flex-col gap-5 min-h-[260px]">
            <div aria-hidden className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[#0E733B]/40 blur-2xl" />
            <Eyebrow light>For teachers</Eyebrow>
            <h3 className="relative font-display font-bold text-[28px] sm:text-[32px] leading-tight text-white max-w-[18ch]">
              Your profile is your application.
            </h3>
            <Link
              href="/recruitment/register"
              className="relative mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#8FE3B0] hover:bg-white px-6 py-3 text-[14px] font-bold text-[#0C2A1B] transition-colors"
            >
              Create your profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[28px] bg-emerald-50 border border-emerald-100 p-8 sm:p-10 flex flex-col gap-5 min-h-[260px]">
            <Eyebrow>For schools</Eyebrow>
            <h3 className="font-display font-bold text-[28px] sm:text-[32px] leading-tight text-charcoal max-w-[18ch]">
              Hiring this term? Meet ready-to-teach candidates.
            </h3>
            <Link
              href="/recruitment/employers"
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#0E733B] hover:bg-[#0B5C2F] px-6 py-3 text-[14px] font-bold text-white transition-colors"
            >
              Hire with EduBeacon <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <RecruitmentFooter />
    </div>
  );
}

function FeatureRow({
  eyebrow, title, body, points, image, imageAlt, overlay, reverse = false,
}: {
  eyebrow: string; title: string; body: string; points: string[];
  image: string; imageAlt: string; overlay: React.ReactNode; reverse?: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className={`reveal flex flex-col gap-6 min-w-0 ${reverse ? "lg:order-2" : ""}`}>
        <SectionHeading eyebrow={eyebrow} title={title} sub={body} />
        <ul className="flex flex-col gap-3">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[15px] text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-[#0E733B] shrink-0" /> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={`reveal relative w-full max-w-[560px] mx-auto ${reverse ? "lg:order-1" : ""}`}>
        <div aria-hidden className={`absolute -inset-4 sm:-inset-6 rounded-[36px] bg-emerald-50 ${reverse ? "-rotate-2" : "rotate-2"}`} />
        <div className="relative aspect-[5/4] rounded-[28px] overflow-hidden shadow-lg">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 90vw, 560px" className="object-cover" />
        </div>
        <div className={`absolute -bottom-8 ${reverse ? "right-2 sm:-right-6" : "left-2 sm:-left-6"}`}>{overlay}</div>
      </div>
    </div>
  );
}
