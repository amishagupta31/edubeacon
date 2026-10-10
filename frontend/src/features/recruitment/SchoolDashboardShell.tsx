"use client";

import Image from "next/image";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export type SchoolNavId =
  | "overview"
  | "profile"
  | "jobs"
  | "candidates"
  | "offers"
  | "negotiations"
  | "interviews"
  | "onboarding"
  | "analytics"
  | "settings";

interface NavDef {
  id: SchoolNavId;
  label: string;
  available: boolean;
}

const NAV_ITEMS: NavDef[] = [
  { id: "overview",      label: "DASHBOARD",    available: true  },
  { id: "jobs",          label: "JOBS",         available: true  },
  { id: "candidates",    label: "CANDIDATES",   available: true  },
  { id: "offers",        label: "OFFERS",       available: true  },
  { id: "negotiations",  label: "NEGOTIATIONS", available: true  },
  { id: "profile",       label: "INSTITUTION",  available: true  },
  { id: "analytics",     label: "ANALYTICS",    available: false },
  { id: "settings",      label: "SETTINGS",     available: false },
];

export default function SchoolDashboardShell({
  active,
  onNavigate,
  children,
  badges,
  accountName,
}: {
  active: SchoolNavId;
  onNavigate: (id: SchoolNavId) => void;
  children: React.ReactNode;
  badges?: Partial<Record<SchoolNavId, number>>;
  accountName?: string;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* ignore */ }
    router.replace("/recruitment/register");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">

      {/* ── Dark top nav ──────────────────────────────────────────────────── */}
      <header className="bg-[#0C2A1B] sticky top-0 z-40 shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
        <div className="max-w-[1400px] mx-auto px-5 flex items-center h-14 gap-4">

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

          {/* Role chip */}
          <span className="shrink-0 text-[10px] font-bold tracking-widest text-white/40 uppercase border border-white/10 px-2 py-0.5 rounded">
            RECRUITER
          </span>

          {/* Nav items */}
          <nav className="flex-1 flex items-center gap-0 overflow-x-auto scrollbar-none ml-2">
            {NAV_ITEMS.map(({ id, label, available }) => {
              const isActive = active === id;
              const count = badges?.[id];
              return (
                <button
                  key={id}
                  onClick={() => available && onNavigate(id)}
                  className={`relative flex items-center gap-1.5 px-3 h-14 text-[11.5px] font-bold tracking-[0.1em] whitespace-nowrap transition-colors ${
                    !available
                      ? "text-white/25 cursor-not-allowed"
                      : isActive
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
                  {!available && (
                    <span className="text-[9px] text-white/25 font-normal tracking-normal">soon</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0E733B] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account + sign out */}
          <div className="shrink-0 flex items-center gap-3">
            {accountName && (
              <span className="hidden lg:block text-[12px] font-semibold text-white/60 max-w-[140px] truncate">
                {accountName}
              </span>
            )}
            <span className="hidden lg:block h-4 w-px bg-white/15" />
            <button
              onClick={handleSignOut}
              className="text-[11.5px] font-bold tracking-[0.1em] text-white/50 hover:text-white/80 transition-colors"
            >
              SIGN OUT
            </button>
          </div>
        </div>

        {/* Mobile compact strip */}
        <div className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.filter((n) => n.available).map(({ id, label }) => (
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

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
