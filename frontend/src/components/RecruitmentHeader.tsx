"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, User, LayoutGrid, LogOut, Briefcase, Users, FileText, UserCircle } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRecruitmentProfile, DASHBOARD_PATH } from "@/features/recruitment/useRecruitmentProfile";

export default function RecruitmentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const clerk = useClerk();
  const { state } = useRecruitmentProfile();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const handleSignOut = async () => {
    await clerk.signOut();
    router.push("/solutions/recruitment");
  };

  const isLoggedIn = state.status === "ready";
  const isTeacher = isLoggedIn && state.profile.accountType === "TEACHER";
  const isSchool = isLoggedIn && state.profile.accountType === "SCHOOL_ADMIN";
  const dashboardPath = isLoggedIn ? DASHBOARD_PATH[state.profile.accountType] : null;

  // Nav items differ by role
  const desktopNav = isTeacher
    ? [
        { label: "Browse Jobs", href: "/recruitment/jobs", icon: Briefcase },
        { label: "About Us", href: "/about/our-story", icon: null },
      ]
    : isSchool
    ? [
        { label: "Browse Candidates", href: "/recruitment/teachers", icon: Users },
        { label: "About Us", href: "/about/our-story", icon: null },
      ]
    : [
        { label: "Find Jobs", href: "/recruitment/jobs", icon: null },
        { label: "For Schools", href: "/recruitment/employers", icon: null },
        { label: "How It Works", href: "/solutions/recruitment", icon: null },
        { label: "Pricing", href: "/recruitment/pricing", icon: null },
      ];

  const navLinkCls = (href: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all text-[13px] ${
      pathname === href
        ? "bg-emerald-50 text-[#0E733B]"
        : "text-slate-600 hover:text-[#0E733B] hover:bg-emerald-50"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-slate-100 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_20px_rgba(12,42,27,0.08)]" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-14 flex h-[64px] items-center justify-between">
        {/* ── Brand ── */}
        <Link href="/solutions/recruitment" className="flex items-center gap-2.5 shrink-0 py-1">
          <Image
            src="/edubeacon-logo.png"
            alt="EduBeacon"
            width={130}
            height={36}
            className="w-auto object-contain h-8"
            priority
          />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full hidden sm:inline bg-emerald-50 text-emerald-700">
            Recruitment
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center whitespace-nowrap gap-0.5">
          {desktopNav.map(({ label, href }) => (
            <Link key={label} href={href} className={navLinkCls(href)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right CTAs ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {isLoggedIn ? (
            /* Profile dropdown */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#0E733B] hover:bg-emerald-50 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#0E733B]" />
                </div>
                <span className="text-[13px] font-semibold text-charcoal max-w-[120px] truncate">
                  {isTeacher
                    ? (state.profile.fullName?.split(" ")[0] ?? "Teacher")
                    : (state.profile.institutionName?.split(" ").slice(0, 2).join(" ") ?? "School")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Account info */}
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      {isTeacher ? "Teacher Account" : "School Account"}
                    </p>
                    <p className="text-[13.5px] font-bold text-charcoal truncate">
                      {isTeacher
                        ? (state.profile.fullName ?? "My Account")
                        : (state.profile.institutionName ?? "My School")}
                    </p>
                    <p className="text-[11.5px] text-slate-400 truncate mt-0.5">{state.profile.email}</p>
                  </div>

                  {/* Nav links */}
                  {isTeacher ? (
                    <>
                      <Link href="/recruitment/jobs" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-[#0E733B] transition-colors">
                        <Briefcase className="w-4 h-4 shrink-0" /> Browse Jobs
                      </Link>
                      <Link href={`${dashboardPath}?tab=applications`} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-[#0E733B] transition-colors">
                        <FileText className="w-4 h-4 shrink-0" /> My Applications
                      </Link>
                      <Link href={`${dashboardPath}?tab=profile`} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-[#0E733B] transition-colors">
                        <UserCircle className="w-4 h-4 shrink-0" /> My Profile
                      </Link>
                    </>
                  ) : (
                    <Link href="/recruitment/teachers" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-[#0E733B] transition-colors">
                      <Users className="w-4 h-4 shrink-0" /> Browse Candidates
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link href={dashboardPath!} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-[#0E733B] transition-colors">
                      <LayoutGrid className="w-4 h-4 shrink-0" /> My Dashboard
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/recruitment/register"
                className="text-[13px] font-semibold px-3 py-1.5 rounded-full text-[#0E733B] hover:bg-emerald-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/recruitment/register"
                className="inline-flex items-center gap-2 pl-5 pr-4 py-2 rounded-full text-[13px] font-bold text-white bg-[#0E8A45] hover:bg-[#0B6E36] shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg text-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl pointer-events-auto">
          <div className="px-5 py-4 flex flex-col gap-1">
            {desktopNav.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-3 rounded-xl text-[14px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0E733B] transition-all"
              >
                {label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardPath!}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-3 rounded-full border border-slate-200 text-[13.5px] font-semibold text-slate-700 justify-center hover:bg-slate-50"
                  >
                    <LayoutGrid className="w-4 h-4" /> My Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="py-3 rounded-full text-[13.5px] font-bold text-red-600 border border-red-100 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
