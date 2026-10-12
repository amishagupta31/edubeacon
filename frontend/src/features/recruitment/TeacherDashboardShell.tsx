"use client";

import Image from "next/image";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export type TeacherNavId =
  | "opportunities"
  | "activity"
  | "applications"
  | "profile"
  | "settings";

interface NavDef {
  id: TeacherNavId;
  label: string;
  badge?: number;
}

const NAV_ITEMS: NavDef[] = [
  { id: "activity",      label: "ACTIVITY" },
  { id: "opportunities", label: "OPPORTUNITIES" },
  { id: "applications",  label: "APPLICATIONS" },
  { id: "profile",       label: "PROFILE" },
  { id: "settings",      label: "SETTINGS" },
];

export default function TeacherDashboardShell({
  active,
  onNavigate,
  children,
  badges,
  fullBleed = false,
}: {
  active: TeacherNavId;
  onNavigate: (id: TeacherNavId) => void;
  children: React.ReactNode;
  badges?: Partial<Record<TeacherNavId, number>>;
  fullBleed?: boolean;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* already signed out */ }
    router.replace("/recruitment/register");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">

      {/* ── Dark top nav ──────────────────────────────────────────────────── */}
      <header className="bg-[#142035] sticky top-0 z-40 shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center h-14 gap-6">

          {/* Logo */}
          <Link href="/solutions/recruitment" className="shrink-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image
              src="/edubeacon-logo.png"
              alt="EduBeacon"
              width={110}
              height={28}
              className="h-6 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.12] shrink-0" />

          {/* Nav items */}
          <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = active === id;
              const count = badges?.[id];
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`relative flex items-center gap-1.5 px-3 h-14 text-[12px] font-bold tracking-[0.12em] whitespace-nowrap transition-colors group ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {label}
                  {count != null && count > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#0E733B] text-white text-[10px] font-bold leading-none">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0E733B] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="shrink-0 text-[12px] font-bold tracking-[0.12em] text-white/50 hover:text-white/80 transition-colors px-2"
          >
            SIGN OUT
          </button>
        </div>

        {/* Mobile nav — scrollable horizontal strip below main bar */}
        <div className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-colors ${
                active === id
                  ? "bg-[#0E733B] text-white"
                  : "bg-white/[0.08] text-white/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <main className="flex-1">
        {fullBleed ? children : (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
