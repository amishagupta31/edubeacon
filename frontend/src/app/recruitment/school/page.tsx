"use client";

import { useState } from "react";
import DashboardGuard from "@/features/recruitment/DashboardGuard";
import SchoolDashboardShell, { SchoolNavId } from "@/features/recruitment/SchoolDashboardShell";

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


// Sub-view union — tracks exactly where in the drill-down tree we are
type SubView =
  | { kind: "none" }
  | { kind: "pipeline"; jobId: string }
  | { kind: "candidate"; applicationId: string; jobId: string }
  | { kind: "offer-builder"; candidateId?: string }
  | { kind: "candidate-offer-view" };

function EmptySection({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <p className="font-display font-bold text-[16px] text-[#1a2332] mb-2">{title}</p>
      <p className="text-[13.5px] text-slate-500 max-w-md mx-auto leading-relaxed">{body}</p>
    </div>
  );
}

export default function SchoolDashboardPage() {
  const [active, setActive] = useState<SchoolNavId>("overview");
  const [postingJob, setPostingJob] = useState(false);
  const { authHeader } = useRecruitmentProfile();
  const [sub, setSub] = useState<SubView>({ kind: "none" });

  // Which sidebar item is highlighted when drilling down
  const shellActive: SchoolNavId =
    sub.kind === "pipeline"             ? "jobs" :
    sub.kind === "candidate"            ? "candidates" :
    sub.kind === "offer-builder"        ? "offers" :
    sub.kind === "candidate-offer-view" ? "offers" :
    active;

  // Navigate top-level — always resets sub-views
  const navigate = (id: SchoolNavId) => {
    setSub({ kind: "none" });
    setPostingJob(false);
    setActive(id);
  };

  return (
    <DashboardGuard allow="SCHOOL_ADMIN">
      {(profile) => (
        <SchoolDashboardShell
          active={shellActive}
          onNavigate={navigate}
          accountName={profile.institutionName || profile.email}
        >
          {/* ═══════════════════════════════════
              SUB-VIEW DRILL-DOWNS (highest priority)
          ═══════════════════════════════════ */}

          {sub.kind === "candidate" ? (
            <CandidateProfile
              applicationId={sub.applicationId}
              jobId={sub.jobId}
              authHeader={authHeader}
              onBack={() => setSub({ kind: "pipeline", jobId: sub.jobId })}
            />

          ) : sub.kind === "pipeline" ? (
            <JobPipeline
              jobId={sub.jobId}
              authHeader={authHeader}
              onBack={() => { setSub({ kind: "none" }); setActive("jobs"); }}
              onViewCandidate={(appId) => setSub({ kind: "candidate", applicationId: appId, jobId: sub.jobId })}
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

          ) : active === "jobs" && postingJob ? (
            <PostJobForm
              institutionName={profile.institutionName || "Your institution"}
              authHeader={authHeader}
              onCancel={() => setPostingJob(false)}
              onSaved={() => { setPostingJob(false); }}
              onGoToProfile={() => navigate("profile")}
            />

          ) : active === "jobs" ? (
            <SchoolJobList
              authHeader={authHeader}
              onPostJob={() => setPostingJob(true)}
              onViewPipeline={(jobId) => setSub({ kind: "pipeline", jobId })}
              onGoToProfile={() => navigate("profile")}
            />

          ) : active === "candidates" ? (
            <EmptySection
              title="Select a candidate from a job pipeline"
              body="Open a job from Jobs & pipeline, then click 'View profile' on any applicant card to see their full details here."
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
              <InstitutionOverview
                name={profile.contactPerson || profile.institutionName || "there"}
                authHeader={authHeader}
                onPostJob={() => { setActive("jobs"); setPostingJob(true); }}
                onViewPipeline={(jobId) => setSub({ kind: "pipeline", jobId })}
              />
            </>
          ) : (
            <EmptySection
              title="This section is coming soon"
              body="This part of the portal has no backend yet. It will appear here as soon as it is built."
            />
          )}
        </SchoolDashboardShell>
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
