"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, MapPin, Briefcase, CheckCircle2, Star,
  ArrowLeft, Loader2, BookOpen, Award, CalendarDays,
  ChevronRight, ExternalLink, Users, Building2,
} from "lucide-react";
import { API, useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";

interface Qualification { degree: string; institution: string; year: string; }
interface Experience { school: string; role: string; from: string; to: string; }
interface Achievement { title: string; issuer: string; year: string; description: string; }

interface TeacherProfile {
  _id: string;
  fullName: string;
  bio: string;
  subjectSpecialisations: string[];
  ctetStatus: "cleared" | "not_cleared" | "not_applicable" | "";
  stetStatus: string;
  preferredCities: string[];
  availableFrom: string | null;
  currentCTC: number | null;
  expectedCTC: number | null;
  qualifications: Qualification[];
  experience: Experience[];
  achievements: Achievement[];
  updatedAt: string;
}

function ctetBadge(status: TeacherProfile["ctetStatus"]) {
  if (status === "cleared") return { label: "CTET Cleared", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (status === "not_cleared") return { label: "CTET Not Cleared", cls: "bg-slate-100 text-slate-600 border-slate-200" };
  if (status === "not_applicable") return { label: "CTET N/A", cls: "bg-slate-100 text-slate-500 border-slate-200" };
  return null;
}

function availableLabel(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return { label: "Available now", cls: "text-emerald-700 bg-emerald-50" };
  if (days < 30) return { label: `Available in ${days}d`, cls: "text-amber-700 bg-amber-50" };
  return {
    label: `Available from ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
    cls: "text-slate-600 bg-slate-100",
  };
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
        <Icon className="w-4.5 h-4.5 text-[#0E733B] shrink-0" style={{ width: 18, height: 18 }} />
        <h2 className="font-display font-bold text-[15px] text-charcoal">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default function TeacherPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { state } = useRecruitmentProfile();
  const isSchool = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";

  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/recruitment/teachers/${id}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((d) => { if (d) setProfile(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-[#0E733B]" />
    </div>
  );

  if (notFound || !profile) return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center gap-4 px-4">
      <GraduationCap className="w-12 h-12 text-slate-300" />
      <p className="text-[16px] font-semibold text-slate-500">Teacher profile not found</p>
      <Link href="/recruitment/teachers" className="text-[13.5px] text-[#0E733B] hover:underline flex items-center gap-1.5">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
      </Link>
    </div>
  );

  const badge = ctetBadge(profile.ctetStatus);
  const avail = availableLabel(profile.availableFrom);
  const initials = profile.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="px-4 md:px-8 py-8">

        {/* ── Back link ── */}
        <Link href="/recruitment/teachers" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#0E733B] mb-5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
        </Link>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          {/* Top green banner */}
          <div className="h-24 bg-gradient-to-r from-[#0E733B] to-[#1a9b52]" />
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 mb-4 flex items-end justify-between gap-4 flex-wrap">
              <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-[28px] text-[#0E733B]">{initials}</span>
              </div>
              {isSchool && (
                <button
                  onClick={() => router.push("/recruitment/school?tab=candidates")}
                  className="inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] transition-all hover:scale-105 shadow-sm"
                >
                  <Briefcase className="w-4 h-4" /> View in Dashboard
                </button>
              )}
            </div>

            {/* Name + headline */}
            <h1 className="font-display font-bold text-[24px] text-charcoal leading-tight mb-1">{profile.fullName}</h1>
            {profile.subjectSpecialisations.length > 0 && (
              <p className="text-[14px] text-slate-600 mb-3">
                {profile.subjectSpecialisations.slice(0, 3).join(" · ")}
              </p>
            )}

            {/* Location + availability */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {profile.preferredCities.length > 0 && (
                <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.preferredCities.join(", ")}
                </span>
              )}
              {avail && (
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${avail.cls}`}>
                  {avail.label}
                </span>
              )}
              {badge && (
                <span className={`flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {badge.label}
                </span>
              )}
              {profile.stetStatus && (
                <span className="text-[12px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{profile.stetStatus}</span>
              )}
            </div>

            {/* CTC */}
            {(profile.expectedCTC || profile.currentCTC) && (
              <div className="flex flex-wrap gap-4 text-[13px] text-slate-600">
                {profile.currentCTC ? (
                  <span>Current: <strong className="text-charcoal">₹{profile.currentCTC.toLocaleString("en-IN")}/mo</strong></span>
                ) : null}
                {profile.expectedCTC ? (
                  <span>Expected: <strong className="text-charcoal">₹{profile.expectedCTC.toLocaleString("en-IN")}/mo</strong></span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-5">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* About */}
            {profile.bio && (
              <SectionCard title="About" icon={Users}>
                <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </SectionCard>
            )}

            {/* Experience */}
            {profile.experience.length > 0 && (
              <SectionCard title="Work Experience" icon={Briefcase}>
                <div className="space-y-5">
                  {profile.experience.map((e, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-charcoal leading-snug">{e.role}</p>
                        <p className="text-[13px] text-slate-600 mt-0.5">{e.school}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> {e.from}{e.to ? ` – ${e.to}` : ""}
                        </p>
                      </div>
                      {i < profile.experience.length - 1 && (
                        <div className="absolute left-[28px] top-[52px] w-px h-[calc(100%-8px)] bg-slate-200" />
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Qualifications */}
            {profile.qualifications.length > 0 && (
              <SectionCard title="Education & Qualifications" icon={GraduationCap}>
                <div className="space-y-4">
                  {profile.qualifications.map((q, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-5 h-5 text-[#0E733B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-charcoal leading-snug">{q.degree}</p>
                        <p className="text-[13px] text-slate-600 mt-0.5">{q.institution}</p>
                        {q.year && <p className="text-[12px] text-slate-400 mt-0.5">{q.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Achievements */}
            {profile.achievements.length > 0 && (
              <SectionCard title="Achievements & Honours" icon={Award}>
                <div className="space-y-4">
                  {profile.achievements.map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] text-charcoal leading-snug">{a.title}</p>
                        {a.issuer && <p className="text-[13px] text-slate-600 mt-0.5">{a.issuer}</p>}
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

            {/* Subjects */}
            {profile.subjectSpecialisations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider mb-3">Subject expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.subjectSpecialisations.map((s) => (
                    <span key={s} className="text-[12.5px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-[13px] text-slate-500 uppercase tracking-wider mb-3">Quick facts</h3>
              <div className="space-y-2.5 text-[13px] text-slate-600">
                {badge && (
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                )}
                {profile.stetStatus && (
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile.stetStatus}</span>
                  </div>
                )}
                {profile.experience.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile.experience.length} role{profile.experience.length !== 1 ? "s" : ""} listed</span>
                  </div>
                )}
                {profile.qualifications.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile.qualifications.length} qualification{profile.qualifications.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {profile.preferredCities.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{profile.preferredCities.join(", ")}</span>
                  </div>
                )}
                {avail && (
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className={profile.availableFrom && new Date(profile.availableFrom) <= new Date() ? "font-semibold text-emerald-700" : ""}>
                      {avail.label}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA for schools */}
            {!isSchool && (
              <div className="bg-[#0C2A1B] rounded-2xl p-5 text-center">
                <p className="text-white font-bold text-[14px] mb-1">Interested in this teacher?</p>
                <p className="text-white/60 text-[12.5px] mb-4 leading-relaxed">
                  Register your school to view contact details and reach out directly.
                </p>
                <Link
                  href="/recruitment/register"
                  className="inline-flex items-center gap-2 bg-[#0E8A45] hover:bg-[#0B6E36] text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-all hover:scale-105"
                >
                  Register your school <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Browse jobs CTA for teachers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
              <Link
                href="/recruitment/jobs"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0E733B] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Browse open positions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
