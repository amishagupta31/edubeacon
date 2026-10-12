"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap, MapPin, Loader2, Search, CheckCircle2, ArrowRight, User,
} from "lucide-react";
import { API, useRecruitmentProfile } from "@/features/recruitment/useRecruitmentProfile";

interface Teacher {
  _id: string;
  fullName: string;
  bio?: string;
  subjectSpecialisations?: string[];
  ctetStatus?: string;
  preferredCities?: string[];
  currentCTC?: number;
  expectedCTC?: number;
  availableFrom?: string;
}

function ctetLabel(status?: string) {
  if (status === "cleared") return "CTET Cleared";
  if (status === "not_cleared") return "CTET Not Cleared";
  if (status === "not_applicable") return "CTET N/A";
  return null;
}

function availableLabel(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "Available now";
  if (days < 30) return `Available in ${days}d`;
  return `Available from ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}

export default function PublicTeacherDirectoryPage() {
  const { state } = useRecruitmentProfile();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filtered, setFiltered] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    fetch(`${API}/api/recruitment/teachers`)
      .then(r => r.json())
      .then(data => {
        setTeachers(data ?? []);
        setFiltered(data ?? []);
        setSearch(p.get("q") ?? "");
        setCity(p.get("city") ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const c = city.toLowerCase();
    if (!q && !c) { setFiltered(teachers); return; }
    setFiltered(teachers.filter(t =>
      (!q ||
        t.fullName?.toLowerCase().includes(q) ||
        t.subjectSpecialisations?.some(s => s.toLowerCase().includes(q)) ||
        t.preferredCities?.some(pc => pc.toLowerCase().includes(q)) ||
        t.bio?.toLowerCase().includes(q)) &&
      (!c || t.preferredCities?.some(pc => pc.toLowerCase().includes(c)))
    ));
  }, [search, city, teachers]);

  const isSchool = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* ── Header strip ── */}
      <div className="bg-white border-b border-slate-100 py-8 px-4 md:px-8">
        <div>
          <h1 className="font-display font-bold text-[28px] text-charcoal mb-1">Browse Teachers</h1>
          <p className="text-[14px] text-slate-500 mb-5">
            Explore verified teacher profiles across India. Sign in as a school to view full details and reach out.
          </p>
          <div className="relative max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, subject, or city…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-[13.5px] focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10"
            />
          </div>
          {city && (
            <button
              onClick={() => setCity("")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[12.5px] font-semibold text-[#0E733B] hover:bg-emerald-100"
            >
              City: {city} <span aria-hidden>×</span><span className="sr-only">remove city filter</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-[#0E733B]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-[15px]">{search ? "No teachers match your search" : "No teacher profiles yet"}</p>
          </div>
        ) : (
          <>
            <p className="text-[12.5px] text-slate-500 mb-5">{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(teacher => (
                <Link
                  key={teacher._id}
                  href={`/recruitment/teachers/${teacher._id}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-[#0E733B]/30 transition-all flex flex-col group"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#0E733B]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[15px] text-charcoal truncate group-hover:text-[#0E733B] transition-colors">{teacher.fullName}</h3>
                      {ctetLabel(teacher.ctetStatus) && (
                        <span className="flex items-center gap-1 text-[11px] text-[#0E733B] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> {ctetLabel(teacher.ctetStatus)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  {teacher.subjectSpecialisations && teacher.subjectSpecialisations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {teacher.subjectSpecialisations.slice(0, 4).map(s => (
                        <span key={s} className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                      {teacher.subjectSpecialisations.length > 4 && (
                        <span className="text-[11px] text-slate-400">+{teacher.subjectSpecialisations.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Bio */}
                  {teacher.bio && (
                    <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                      {teacher.bio}
                    </p>
                  )}

                  {/* Cities & availability */}
                  <div className="flex flex-col gap-1 mb-4">
                    {teacher.preferredCities && teacher.preferredCities.length > 0 && (
                      <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {teacher.preferredCities.join(", ")}
                      </p>
                    )}
                    {availableLabel(teacher.availableFrom) && (
                      <p className="text-[12px] text-[#0E733B] font-semibold">
                        {availableLabel(teacher.availableFrom)}
                      </p>
                    )}
                    {teacher.expectedCTC && (
                      <p className="text-[12px] text-slate-500">
                        Expected ₹{teacher.expectedCTC.toLocaleString("en-IN")}/mo
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto w-full flex items-center justify-center gap-2 border border-[#0E733B] text-[#0E733B] group-hover:bg-emerald-50 py-2 rounded-lg text-[13px] font-semibold transition-all">
                    {isSchool ? "View Full Profile" : "View Profile"} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom CTA for unauthenticated schools ── */}
      {state.status === "signed-out" && (
        <div className="bg-[#0C2A1B] py-12 px-4 text-center">
          <h2 className="font-display font-bold text-[24px] text-white mb-2">
            Ready to hire verified teachers?
          </h2>
          <p className="text-white/70 text-[14px] mb-6">
            Register your institution to view full profiles and reach out directly.
          </p>
          <a
            href="/recruitment/register"
            className="inline-flex items-center gap-2 bg-[#0E8A45] hover:bg-[#0B6E36] text-white px-8 py-3 rounded-full font-bold text-[14px] transition-all hover:scale-105"
          >
            Register Your School <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
