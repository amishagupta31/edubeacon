"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { useRecruitmentProfile, DASHBOARD_PATH, AccountType, RecruitmentProfile } from "./useRecruitmentProfile";
export default function DashboardGuard({
  allow,
  children,
}: {
  allow: AccountType;
  children: (profile: RecruitmentProfile) => React.ReactNode;
}) {
  const router = useRouter();
  const { state } = useRecruitmentProfile();

  // Wrong role → send the user to their own dashboard rather than a dead end.
  useEffect(() => {
    if (state.status === "ready" && state.profile.accountType !== allow) {
      router.replace(DASHBOARD_PATH[state.profile.accountType]);
    }
  }, [state, allow, router]);

  if (state.status === "loading") {
    return (
      <Centered>
        <Loader2 className="w-6 h-6 animate-spin text-[#0E733B]" />
      </Centered>
    );
  }

  if (state.status === "signed-out") {
    return (
      <Centered>
        <Panel
          icon={<Lock className="w-6 h-6 text-[#0E733B]" />}
          title="Sign in to continue"
          body="You need to be signed in to view this dashboard."
          action={{ href: "/recruitment/register", label: "Sign in or register" }}
        />
      </Centered>
    );
  }

  if (state.status === "unregistered") {
    return (
      <Centered>
        <Panel
          icon={<Lock className="w-6 h-6 text-[#0E733B]" />}
          title="Finish setting up your account"
          body="Your email is verified, but you haven't chosen an account type yet."
          action={{ href: "/recruitment/register", label: "Complete registration" }}
        />
      </Centered>
    );
  }

  if (state.status === "error") {
    return (
      <Centered>
        <Panel
          icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
          title="Something went wrong"
          body={state.message}
          action={{ href: "/recruitment/register", label: "Back to sign in" }}
        />
      </Centered>
    );
  }

  // Wrong role — the effect above is redirecting; avoid flashing the wrong UI.
  if (state.profile.accountType !== allow) {
    return (
      <Centered>
        <Loader2 className="w-6 h-6 animate-spin text-[#0E733B]" />
      </Centered>
    );
  }

  return <>{children(state.profile)}</>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[70vh] flex items-center justify-center px-4">{children}</div>;
}

function Panel({
  icon, title, body, action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="max-w-sm w-full bg-white rounded-2xl border border-line shadow-sm p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
        {icon}
      </div>
      <h2 className="font-display font-bold text-[19px] text-charcoal mb-2">{title}</h2>
      <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">{body}</p>
      <Link
        href={action.href}
        className="inline-block bg-[#0E733B] text-white px-6 py-2.5 rounded-xl font-semibold text-[13.5px] hover:bg-[#0B5C2F] transition-colors"
      >
        {action.label}
      </Link>
    </div>
  );
}
