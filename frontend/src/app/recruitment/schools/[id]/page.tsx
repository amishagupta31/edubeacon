"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, MapPin, Globe, Mail, Phone, CheckCircle2, Star,
  ArrowLeft, Loader2, Award, CalendarDays, Briefcase, ChevronRight,
  ExternalLink, Users, BookOpen, Shield,
} from "lucide-react";
import { API, useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";

interface SchoolAchievement {
  title: string;
  year: string;
  description: string;
}

interface SchoolProfile {
  _id: string;
  name: string;
  institutionType: string;
  board: string;
  establishedYear: string;
  officialEmail: string;
  contactPerson: string;
  contactPhone: string;
  website: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  achievements: SchoolAchievement[];
  verificationStatus: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
  verifiedAt: string | null;
  updatedAt: string;
}

interface Job {
  _id: string;
  title: string;
  roleType: string;
  board: string;
  employment: string;
  openings: number;
  city: string;
  deadline: string | null;
  publishedAt: string;
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
        <Icon className="shrink-0 text-[#0E733B]" style={{ width: 18, height: 18 }} />
        <h2 className="font-display font-bold text-[15px] text-charcoal">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function VerifiedBadge({ status }: { status: SchoolProfile["verificationStatus"] }) {
  if (status === "VERIFIED")
    return (
      <span className="flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> Verified school
      </span>
    );
  if (status === "IN_REVIEW")
    return (
      <span className="flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
        <Shield className="w-3.5 h-3.5" /> Verification in review
      </span>
    );
  return null;
}

export default function SchoolPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state } = useRecruitmentProfile();
  const isTeacher = state.status === "ready" && state.profile.accountType === "TEACHER";

  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/recruitment/institutions/${id}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((d) => { if (d) setSchool(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch this school's open jobs once we have the school name
  useEffect(() => {
    if (!school?.name) return;
    const encoded = encodeURIComponent(school.name);
    fetch(`${API}/api/recruitment/jobs?search=${encoded}&limit=10`)
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.jobs ?? []).filter(
          (j: Job & { institutionName?: string }) =>
            j.institutionName === school.name
        );
        setJobs(filtered);
      })
      .catch(() => {});
  }, [school?.name]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-[#0E733B]" />
    </div>
  );

  if (notFound || !school) return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center gap-4 px-4">
      <Building2 className="w-12 h-12 text-slate-300" />
      <p className="text-[16px] font-semibold text-slate-500">School profile not found</p>
      <Link href="/recruitment/jobs" className="text-[13.5px] text-[#0E733B] hover:underline flex items-center gap-1.5">
        <ArrowLeft className="w-3.5 h-3.5" /> Browse open positions
      </Link>
    </div>
  );

  const initials = school.name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="px-4 md:px-8 py-8">

        {/* ── Back link ── */}
        <Link href="/recruitment/jobs" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#0E733B] mb-5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to jobs
        </Link>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-[#0E733B] to-[#1a9b52]" />
          <div className="px-6 pb-6">
            {/* Logo + CTA row */}
            <div className="-mt-12 mb-4 flex items-end justify-between gap-4 flex-wrap">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-[28px] text-[#0E733B]">{initials}</span>
              </div>
              {isTeacher && jobs.length > 0 && (
                <button
                  onClick={() => router.push("/recruitment/jobs")}
                  className="inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] transition-all hover:scale-105 shadow-sm"
                >
                  <Briefcase className="w-4 h-4" /> View open positions
                </button>
              )}
            </div>

            {/* Name + type */}
            <h1 className="font-display font-bold text-[24px] text-charcoal leading-tight mb-1">{school.name}</h1>
            {school.institutionType && (
              <p className="text-[14px] text-slate-500 mb-3">{school.institutionType}</p>
            )}

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <VerifiedBadge status={school.verificationStatus} />
              {school.board && (
                <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {school.board}
                </span>
              )}
              {school.city && (
                <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {school.city}{school.state ? `, ${school.state}` : ""}
                </span>
              )}
              {school.establishedYear && (
                <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> Est. {school.establishedYear}
                </span>
              )}
            </div>

            {/* Quick contact row */}
            <div className="flex flex-wrap gap-4 text-[13px] text-slate-500">
              {school.website && (
                <a href={school.website.startsWith("http") ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#0E733B] transition-colors">
                  <Globe className="w-3.5 h-3.5" /> {school.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {school.officialEmail && (
                <a href={`mailto:${school.officialEmail}`} className="flex items-center gap-1.5 hover:text-[#0E733B] transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {school.officialEmail}
                </a>
              )}
              {school.contactPhone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {school.contactPhone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-5">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* About */}
            {school.description && (
              <SectionCard title="About" icon={Users}>
                <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">{school.description}</p>
              </SectionCard>
            )}

            {/* Open positions */}
            {jobs.length > 0 && (
              <SectionCard title={`Open Positions (${jobs.length})`} icon={Briefcase}>
                <div className="space-y-3">
                  {jobs.map((j) => (
                    <Link
                      key={j._id}
                      href="/recruitment/jobs"
                      className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 hover:border-[#0E733B]/30 hover:bg-emerald-50/40 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-charcoal group-hover:text-[#0E733B] leading-snug">{j.title}</p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {j.roleType && (
                            <span className="text-[11.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{j.roleType}</span>
                          )}
                          {j.employment && (
                            <span className="text-[11.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{j.employment}</span>
                          )}
                          {j.openings > 0 && (
                            <span className="text-[11.5px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{j.openings} opening{j.openings !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                        {j.deadline && (
                          <p className="text-[11.5px] text-slate-400 mt-1.5 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Apply by {new Date(j.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0E733B] shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Link href="/recruitment/jobs" className="text-[13px] font-semibold text-[#0E733B] hover:underline flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Browse all open positions
                  </Link>
                </div>
              </SectionCard>
            )}

            {/* Achievements */}
            {school.achievements?.length > 0 && (
              <SectionCard title="Achievements & Awards" icon={Award}>
                <div className="space-y-4">
                  {school.achievements.map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-charcoal leading-snug">{a.title}</p>
                        {a.year && <p className="text-[12px] text-slate-400 mt-0.5">{a.year}</p>}
                        {a.description && <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{a.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* School overview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider mb-3">School overview</h3>
              <div className="space-y-2.5 text-[13px] text-slate-600">
                {school.institutionType && (
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{school.institutionType}</span>
                  </div>
                )}
                {school.board && (
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Board: {school.board}</span>
                  </div>
                )}
                {school.establishedYear && (
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Est. {school.establishedYear}</span>
                  </div>
                )}
                {(school.city || school.state) && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{[school.addressLine, school.city, school.state, school.pincode].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {school.verificationStatus === "VERIFIED" && (
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-semibold">Verified on EduBeacon</span>
                  </div>
                )}
                {jobs.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{jobs.length} open position{jobs.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA for teachers: apply */}
            {jobs.length > 0 && (
              <div className="bg-[#0E733B] rounded-2xl p-5 text-center">
                <p className="text-white font-bold text-[14px] mb-1">
                  {isTeacher ? "Ready to apply?" : "Explore opportunities"}
                </p>
                <p className="text-white/70 text-[12.5px] mb-4 leading-relaxed">
                  {isTeacher
                    ? `${school.name} has ${jobs.length} open position${jobs.length !== 1 ? "s" : ""} right now.`
                    : "Browse all open teaching positions on EduBeacon."}
                </p>
                <Link
                  href="/recruitment/jobs"
                  className="inline-flex items-center gap-2 bg-white text-[#0E733B] hover:bg-emerald-50 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all hover:scale-105 shadow-sm"
                >
                  View positions <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* CTA for unregistered visitors */}
            {!isTeacher && !jobs.length && (
              <div className="bg-[#0C2A1B] rounded-2xl p-5 text-center">
                <p className="text-white font-bold text-[14px] mb-1">Are you a teacher?</p>
                <p className="text-white/60 text-[12.5px] mb-4 leading-relaxed">
                  Register on EduBeacon to browse and apply for positions at {school.name}.
                </p>
                <Link
                  href="/recruitment/register"
                  className="inline-flex items-center gap-2 bg-[#0E8A45] hover:bg-[#0B6E36] text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all hover:scale-105"
                >
                  Create your profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Contact person */}
            {school.contactPerson && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider mb-3">Contact</h3>
                <div className="space-y-2 text-[13px] text-slate-600">
                  <p className="font-semibold text-charcoal">{school.contactPerson}</p>
                  {school.officialEmail && (
                    <a href={`mailto:${school.officialEmail}`} className="flex items-center gap-2 hover:text-[#0E733B] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {school.officialEmail}
                    </a>
                  )}
                  {school.contactPhone && (
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {school.contactPhone}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
