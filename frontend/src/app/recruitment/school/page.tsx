"use client";

import { useState } from "react";
import {
  LayoutGrid, Building2, Briefcase, Users, Settings, ShieldCheck,
  FileText, Handshake, CalendarCheck, UserCheck, BarChart3,
} from "lucide-react";
import DashboardGuard from "@/features/recruitment/DashboardGuard";
import DashboardShell, { EmptySection, NavItem } from "@/features/recruitment/DashboardShell";
import InstitutionProfileForm from "@/features/recruitment/InstitutionProfileForm";
import InstitutionOverview from "@/features/recruitment/InstitutionOverview";
import PostJobForm from "@/features/recruitment/PostJobForm";
import SchoolJobList from "@/features/recruitment/SchoolJobList";
import JobPipeline from "@/features/recruitment/JobPipeline";
import CandidateProfile from "@/features/recruitment/CandidateProfile";
import OfferLetterBuilder from "@/features/recruitment/OfferLetterBuilder";
import SalaryNegotiation from "@/features/recruitment/SalaryNegotiation";
import CandidateOfferView from "@/features/recruitment/CandidateOfferView";
import { useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";

const NAV: NavItem[] = [
  { id: "overview",     label: "Dashboard",           icon: LayoutGrid,    available: true },
  { id: "profile",      label: "Institution",         icon: Building2,     available: true },
  { id: "jobs",         label: "Jobs & pipeline",     icon: Briefcase,     available: true },
  { id: "candidates",   label: "Candidates",          icon: Users,         available: true },
  { id: "offers",       label: "Offers",              icon: FileText,      available: true },
  { id: "negotiations", label: "Negotiations",        icon: Handshake,     available: true },
  { id: "interviews",   label: "Interviews & demos",  icon: CalendarCheck, available: false },
  { id: "onboarding",   label: "Onboarding",          icon: UserCheck,     available: false },
  { id: "analytics",    label: "Analytics",           icon: BarChart3,     available: false },
  { id: "settings",     label: "Settings",            icon: Settings,      available: false },
];

// Sub-view union — tracks exactly where in the drill-down tree we are
type SubView =
  | { kind: "none" }
  | { kind: "pipeline"; jobId: string }
  | { kind: "candidate"; candidateId: string }
  | { kind: "offer-builder"; candidateId?: string }
  | { kind: "candidate-offer-view" };

export default function SchoolDashboardPage() {
  const [active, setActive] = useState("overview");
  const { authHeader } = useRecruitmentProfile();
  const [sub, setSub] = useState<SubView>({ kind: "none" });

  // Which sidebar item is highlighted when drilling down
  const shellActive =
    sub.kind === "pipeline"            ? "jobs" :
    sub.kind === "candidate"           ? "candidates" :
    sub.kind === "offer-builder"       ? "offers" :
    sub.kind === "candidate-offer-view"? "offers" :
    active;

  // Navigate top-level — always resets sub-views
  const navigate = (id: string) => {
    setSub({ kind: "none" });
    setActive(id);
  };

  return (
    <DashboardGuard allow="SCHOOL_ADMIN">
      {(profile) => (
        <DashboardShell
          title={profile.institutionName || "School Dashboard"}
          subtitle={profile.email}
          nav={NAV}
          active={shellActive}
          onNavigate={navigate}
          accountName={profile.institutionName || profile.email}
          accountRole="HR · Admin"
        >
          {/* ═══════════════════════════════════
              SUB-VIEW DRILL-DOWNS (highest priority)
          ═══════════════════════════════════ */}

          {sub.kind === "candidate" ? (
            <CandidateProfile
              onBack={() => setSub({ kind: "pipeline", jobId: "demo" })}
            />

          ) : sub.kind === "pipeline" ? (
            <JobPipeline
              jobId={sub.jobId}
              authHeader={authHeader}
              onBack={() => { setSub({ kind: "none" }); setActive("jobs"); }}
              onViewCandidate={(cId) => setSub({ kind: "candidate", candidateId: cId })}
            />

          ) : sub.kind === "offer-builder" ? (
            <OfferLetterBuilder
              onBack={() => { setSub({ kind: "none" }); setActive("offers"); }}
            />

          ) : sub.kind === "candidate-offer-view" ? (
            <CandidateOfferView
              onBack={() => { setSub({ kind: "none" }); setActive("offers"); }}
            />

          /* ═══════════════════════════════════
             TOP-LEVEL SECTIONS
          ═══════════════════════════════════ */

          ) : active === "profile" ? (
            <InstitutionProfileForm authHeader={authHeader} />

          ) : active === "post-job" ? (
            <PostJobForm
              institutionName={profile.institutionName || "Your institution"}
              authHeader={authHeader}
              onCancel={() => setActive("jobs")}
              onSaved={() => setActive("jobs")}
              onGoToProfile={() => navigate("profile")}
            />

          ) : active === "jobs" ? (
            <SchoolJobList
              authHeader={authHeader}
              onPostJob={() => setActive("post-job")}
              onViewPipeline={(jobId) => setSub({ kind: "pipeline", jobId })}
              onGoToProfile={() => navigate("profile")}
            />

          ) : active === "candidates" ? (
            <CandidateProfile
              onBack={() => navigate("jobs")}
            />

          ) : active === "offers" ? (
            <OffersSection
              onNewOffer={() => setSub({ kind: "offer-builder" })}
              onViewCandidateOffer={() => setSub({ kind: "candidate-offer-view" })}
            />

          ) : active === "negotiations" ? (
            <SalaryNegotiation
              authHeader={authHeader}
              onBack={() => navigate("offers")}
            />

          ) : active === "overview" ? (
            <>
              {/* Verification is a separate review workflow — registering does not grant it. */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="min-w-0">
                  <p className="font-bold text-[13.5px] text-amber-900">Institution not yet verified</p>
                  <p className="text-[12.5px] text-amber-800/80 mt-0.5 leading-relaxed">
                    Complete your{" "}
                    <button onClick={() => navigate("profile")} className="font-bold underline underline-offset-2">
                      institution profile
                    </button>{" "}
                    to be considered for verification.
                  </p>
                </div>
              </div>

              <InstitutionOverview
                demo
                name={profile.contactPerson || profile.institutionName || "there"}
                onPostJob={() => setActive("post-job")}
                onViewCandidates={() => navigate("candidates")}
              />
            </>
          ) : (
            <EmptySection
              title={`${NAV.find((n) => n.id === active)?.label ?? "This section"} is coming soon`}
              body="This part of the portal has no backend yet. It will appear here as soon as it is built."
            />
          )}
        </DashboardShell>
      )}
    </DashboardGuard>
  );
}

// ── Offers list (landing page for the Offers nav item) ─────────────────────

function OffersSection({
  onNewOffer,
  onViewCandidateOffer,
}: {
  onNewOffer: () => void;
  onViewCandidateOffer: () => void;
}) {
  const DEMO_OFFERS = [
    {
      id: "o1",
      name: "Ananya Iyer",
      role: "PGT Physics",
      ctc: "₹78,000 / month",
      status: "Awaiting approval",
      statusStyle: "bg-amber-50 text-amber-700",
    },
    {
      id: "o2",
      name: "Meera Joshi",
      role: "PGT Physics",
      ctc: "₹82,000 / month",
      status: "In negotiation",
      statusStyle: "bg-blue-50 text-blue-700",
    },
    {
      id: "o3",
      name: "Rohan Gupta",
      role: "TGT Mathematics",
      ctc: "₹64,000 / month",
      status: "Accepted",
      statusStyle: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">
            Offers
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Offer letters sent, pending and accepted.
          </p>
        </div>
        <button
          onClick={onNewOffer}
          className="px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all"
        >
          New offer
        </button>
      </div>

      <div className="grid gap-3">
        {DEMO_OFFERS.map((offer) => (
          <button
            key={offer.id}
            onClick={offer.id === "o1" ? onNewOffer : onViewCandidateOffer}
            className="w-full text-left bg-white rounded-2xl border border-line shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-[16px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                  {offer.name}
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">{offer.role} · {offer.ctc}</p>
              </div>
              <span className={`shrink-0 text-[12px] font-bold px-2.5 py-1 rounded-full ${offer.statusStyle}`}>
                {offer.status}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Candidate app preview link */}
      <div className="mt-6 bg-slate-50 border border-line rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-charcoal mb-1">Candidate offer view</p>
        <p className="text-[12.5px] text-slate-500 mb-3 leading-relaxed">
          Preview how the offer looks to the candidate in their app before sending.
        </p>
        <button
          onClick={onViewCandidateOffer}
          className="px-4 py-2 rounded-xl border border-line bg-white text-[13px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
        >
          Preview candidate view
        </button>
      </div>
    </div>
  );
}
