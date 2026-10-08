"use client";

import Image from "next/image";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  available: boolean;   // false → placeholder, clearly marked "coming soon"
}

/**
 * Shared chrome for both dashboards: sidebar, header, sign-out.
 * Sections marked `available: false` render as disabled with a "Soon" tag —
 * navigation is visible, but nothing pretends to be implemented.
 */
export default function DashboardShell({
  title, subtitle, nav, active, onNavigate, children, accountName, accountRole,
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
  /** Optional identity line above sign-out in the sidebar. */
  accountName?: string;
  accountRole?: string;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* already signed out */ }
    router.replace("/recruitment/register");
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex">
      {/* Sidebar */}
      <aside className="w-[232px] shrink-0 bg-[#0C2A1B] flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
        <Link href="/solutions/recruitment" className="px-5 py-4 border-b border-white/[0.08] flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
          <Image
            src="/edubeacon-logo.png"
            alt="EduBeacon"
            width={120}
            height={32}
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </Link>
        <div className="px-5 py-2.5 border-b border-white/[0.06]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">
            Recruitment Portal
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <div className="flex flex-col gap-0.5">
            {nav.map(({ id, label, icon: Icon, available }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => available && onNavigate(id)}
                  disabled={!available}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                      : available
                        ? "text-white/60 hover:text-white hover:bg-white/[0.06]"
                        : "text-white/25 cursor-not-allowed"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span className="flex-1 truncate">{label}</span>
                  {!available && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider bg-white/[0.07] px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.08]">
          {accountName && (
            <div className="px-3 mb-3 min-w-0">
              <p className="text-[12.5px] font-semibold text-white truncate" title={accountName}>
                {accountName}
              </p>
              {accountRole && (
                <p className="text-[11px] text-emerald-400/70 mt-0.5 truncate">{accountRole}</p>
              )}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 md:ml-[232px] min-w-0">
        <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile: EduBeacon logo + portal label */}
            <Link href="/solutions/recruitment" className="md:hidden flex items-center gap-2.5">
              <Image
                src="/edubeacon-logo.png"
                alt="EduBeacon"
                width={100}
                height={28}
                className="h-6 w-auto object-contain"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Recruitment</span>
            </Link>

            {/* Desktop: page title */}
            <div className="hidden md:block min-w-0">
              <h1 className="font-display font-bold text-[19px] text-charcoal leading-tight truncate">{title}</h1>
              <p className="text-[12.5px] text-slate-500 mt-0.5 truncate">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>

          {/* Mobile nav tabs */}
          <div className="md:hidden flex gap-1.5 mt-3 overflow-x-auto pb-1">
            {nav.filter((n) => n.available).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap transition-all ${
                  active === id ? "bg-[#0C2A1B] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

/** Honest empty state — used wherever a section has no backend yet. */
export function EmptySection({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl border border-line p-10 text-center">
      <p className="font-display font-bold text-[16px] text-charcoal mb-1.5">{title}</p>
      <p className="text-[13.5px] text-slate-500 max-w-sm mx-auto leading-relaxed">{body}</p>
    </div>
  );
}
