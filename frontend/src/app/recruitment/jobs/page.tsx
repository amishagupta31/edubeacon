"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Briefcase, Clock, Building2,
  Loader2, ArrowRight, BookOpen, Users, CalendarDays,
  X, CheckCircle2, Send, AlertTriangle, Phone, Mail,
  Link as LinkIcon, Globe, ShieldCheck, Info,
} from "lucide-react";
import { API, useRecruitmentProfile, DASHBOARD_PATH } from "@/features/recruitment/useRecruitmentProfile";

interface Job {
  _id: string;
  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;
  institutionId?: string;
  institutionName: string;
  city: string;
  state: string;
  deadline: string | null;
  publishedAt: string;
}

interface SchoolProfile {
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
  verificationStatus: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";
}

const ROLE_TYPES = ["All", "Teaching", "Non-teaching", "Administrative", "Leadership"];
const BOARDS = ["All", "CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS"];

function relativeDate(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function deadlineLabel(iso: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Expired";
  if (days === 0) return "Closes today";
  if (days <= 7) return `${days}d left`;
  return `Until ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
}

// ── School profile modal ─────────────────────────────────────────────────────
function SchoolProfileModal({
  institutionId,
  institutionName,
  onClose,
}: {
  institutionId: string;
  institutionName: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/recruitment/institutions/${institutionId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [institutionId]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const verified = data?.verificationStatus === "VERIFIED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0E733B] mb-0.5">School Profile</p>
            <h2 className="font-display font-bold text-[18px] text-charcoal leading-snug">{institutionName}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#0E733B]" />
            </div>
          ) : !data ? (
            <p className="text-[13px] text-slate-500 text-center py-10">Profile not available.</p>
          ) : (
            <div className="space-y-5">
              {/* Verification badge */}
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12.5px] font-semibold ${
                verified ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}>
                <ShieldCheck className={`w-4 h-4 ${verified ? "text-emerald-600" : "text-amber-600"}`} />
                {verified ? "Verified institution" : "Verification pending"}
              </div>

              {/* Type / Board / Year */}
              <div className="flex flex-wrap gap-2">
                {data.institutionType && (
                  <span className="text-[12px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">{data.institutionType}</span>
                )}
                {data.board && (
                  <span className="text-[12px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">{data.board}</span>
                )}
                {data.establishedYear && (
                  <span className="text-[12px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Est. {data.establishedYear}</span>
                )}
              </div>

              {/* Description */}
              {data.description && (
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{data.description}</p>
              )}

              {/* Address */}
              {(data.addressLine || data.city) && (
                <div className="flex items-start gap-2 text-[13px] text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{[data.addressLine, data.city, data.state, data.pincode].filter(Boolean).join(", ")}</span>
                </div>
              )}

              {/* Contact */}
              <div className="space-y-2">
                {data.contactPerson && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Contact: <strong>{data.contactPerson}</strong></span>
                  </div>
                )}
                {data.contactPhone && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${data.contactPhone}`} className="hover:underline">{data.contactPhone}</a>
                  </div>
                )}
                {data.officialEmail && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${data.officialEmail}`} className="hover:underline">{data.officialEmail}</a>
                  </div>
                )}
                {data.website && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0E733B]">{data.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4 shrink-0 flex items-center gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[13.5px] font-semibold text-slate-700 transition-all">
            Close
          </button>
          <a
            href={`/recruitment/schools/${institutionId}`}
            className="px-5 py-2.5 rounded-xl bg-[#0E733B] hover:bg-[#0B5C2F] text-white text-[13.5px] font-semibold transition-all"
          >
            View full profile →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Apply modal ──────────────────────────────────────────────────────────────
function ApplyModal({
  job,
  onClose,
  onSuccess,
  authHeader,
  goToProfile,
}: {
  job: Job;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
  authHeader: () => Promise<Record<string, string>>;
  goToProfile: () => void;
}) {
  const [coverNote, setCoverNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileGap, setProfileGap] = useState<string[] | null>(null);

  const [phone, setPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [email, setEmail] = useState("");

  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const headers = await authHeader();
        const res = await fetch(`${API}/api/recruitment/me`, { headers });
        if (!res.ok) { setProfileGap(["profile"]); return; }
        const data = await res.json();
        setPhone(data.phone || "");
        setResumeUrl(data.resumeUrl || "");
        setEmail(data.email || "");

        const missing: string[] = [];
        if (!String(data.fullName || "").trim()) missing.push("Full name");
        if (!String(data.phone || "").trim()) missing.push("Phone number");
        const hasBio = String(data.bio || "").trim().length > 0;
        const hasQual = Array.isArray(data.qualifications) && data.qualifications.length > 0;
        if (!hasBio && !hasQual) missing.push("Bio or at least one qualification");
        setProfileGap(missing.length > 0 ? missing : null);
      } catch {
        setProfileGap(["Could not load profile"]);
      } finally {
        setCheckingProfile(false);
        setTimeout(() => textRef.current?.focus(), 50);
      }
    })();
  }, [authHeader]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileGap) { setErr("Complete your profile first."); return; }
    setBusy(true); setErr("");
    try {
      const headers = await authHeader();

      if (phone.trim() || resumeUrl.trim()) {
        await fetch(`${API}/api/recruitment/profile/teacher`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ phone: phone.trim(), resumeUrl: resumeUrl.trim() }),
        });
      }

      const res = await fetch(`${API}/api/recruitment/jobs/${job._id}/apply`, {
        method: "POST",
        headers,
        body: JSON.stringify({ coverNote: coverNote.trim() }),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body.code === "PROFILE_INCOMPLETE") {
          setProfileGap(body.missingFields ?? ["incomplete profile"]);
          return;
        }
        setErr(body.error || "Could not submit application.");
        return;
      }
      setDone(true);
      onSuccess(job._id);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0E733B] mb-0.5">Applying for</p>
            <h2 className="font-display font-bold text-[18px] text-charcoal leading-snug truncate">{job.title}</h2>
            <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 shrink-0" /> {job.institutionName}
              {job.city && <> · <MapPin className="w-3 h-3 shrink-0" />{job.city}</>}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {checkingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#0E733B]" />
              <span className="ml-2.5 text-[13.5px] text-slate-500">Loading your profile…</span>
            </div>
          ) : done ? (
            <div className="px-6 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#0E733B]" strokeWidth={1.8} />
              </div>
              <h3 className="font-display font-bold text-[20px] text-charcoal mb-1.5">Application submitted!</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">
                Your application for <strong>{job.title}</strong> at {job.institutionName} has been sent.<br />
                Track it in <strong>My Applications</strong>.
              </p>
              <button onClick={onClose} className="px-7 py-2.5 rounded-full bg-[#0E733B] text-white font-bold text-[13.5px] hover:bg-[#0B5C2F] transition-all">
                Done
              </button>
            </div>
          ) : profileGap ? (
            <div className="px-6 py-8">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="font-bold text-[14px] text-amber-900 mb-1">Complete your profile first</p>
                    <p className="text-[13px] text-amber-800/80 leading-relaxed">
                      Schools need your details to review your application. Please add:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {profileGap.map((f) => (
                        <li key={f} className="text-[12.5px] font-semibold text-amber-900 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { onClose(); goToProfile(); }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-xl font-bold text-[14px] transition-all"
              >
                Go to My Profile <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="mt-2.5 w-full py-2.5 rounded-xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
              {/* Editable contact details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <p className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500">Your contact details</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {email && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Email <span className="font-normal text-slate-400">(from your account)</span></label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          value={email}
                          readOnly
                          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] bg-slate-100 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit mobile"
                          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#0E733B] bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Resume / Portfolio</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          placeholder="Drive / Notion link"
                          className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#0E733B] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Phone and resume changes save to your profile when you submit.</p>
              </div>

              {/* Cover note */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Cover note <span className="text-slate-400 font-normal normal-case">(optional, max 1000 chars)</span>
                </label>
                <textarea
                  ref={textRef}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value.slice(0, 1000))}
                  rows={5}
                  placeholder="Tell the school why you're a great fit for this role…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13.5px] text-charcoal resize-none focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all"
                />
                <p className="text-right text-[11px] text-slate-400 mt-1">{coverNote.length} / 1000</p>
              </div>

              {err && (
                <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">{err}</p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-xl font-bold text-[14px] transition-all disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {busy ? "Submitting…" : "Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function PublicJobsPage() {
  const router = useRouter();
  const { state, authHeader } = useRecruitmentProfile();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleType, setRoleType] = useState("All");
  const [board, setBoard] = useState("All");
  const [city, setCity] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);

  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [applyTarget, setApplyTarget] = useState<Job | null>(null);
  const [schoolProfileTarget, setSchoolProfileTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: "20" });
      if (search) params.set("search", search);
      if (roleType !== "All") params.set("roleType", roleType);
      if (board !== "All") params.set("board", board);
      if (city) params.set("city", city);
      const res = await fetch(`${API}/api/recruitment/jobs?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
      setPage(pg);
      if (data.jobs?.length > 0) setSelected((prev) => prev ?? data.jobs[0]);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [search, roleType, board, city]);

  useEffect(() => { fetchJobs(1); }, [roleType, board]);
  useEffect(() => { const t = setTimeout(() => fetchJobs(1), 350); return () => clearTimeout(t); }, [search, city]);

  const isTeacher = state.status === "ready" && state.profile.accountType === "TEACHER";
  const isSchool  = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";

  const handleApplyClick = () => {
    if (!selected) return;
    if (isTeacher) setApplyTarget(selected);
    else router.push("/recruitment/register");
  };

  const handleApplySuccess = (jobId: string) => {
    setApplied((prev) => new Set([...prev, jobId]));
  };

  const goToProfile = () => {
    router.push(DASHBOARD_PATH.TEACHER + "?tab=profile");
  };

  const selectedApplied = selected ? applied.has(selected._id) : false;

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col">

      {applyTarget && (
        <ApplyModal
          job={applyTarget}
          onClose={() => setApplyTarget(null)}
          onSuccess={handleApplySuccess}
          authHeader={authHeader}
          goToProfile={goToProfile}
        />
      )}

      {schoolProfileTarget && (
        <SchoolProfileModal
          institutionId={schoolProfileTarget.id}
          institutionName={schoolProfileTarget.name}
          onClose={() => setSchoolProfileTarget(null)}
        />
      )}

      {/* Search bar — sticky below the 64px recruitment header */}
      <div className="bg-white border-b border-slate-100 py-4 px-4 md:px-8 sticky top-[64px] z-30 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, school, or keyword…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-[13.5px] focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#0E733B] w-32"
              />
            </div>
            <select value={roleType} onChange={(e) => setRoleType(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#0E733B] bg-white">
              {ROLE_TYPES.map(r => <option key={r}>{r}</option>)}
            </select>
            <select value={board} onChange={(e) => setBoard(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#0E733B] bg-white hidden md:block">
              {BOARDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 w-full px-4 md:px-8 py-6 flex gap-5">

        {/* Left: job list */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col gap-3">
          <p className="text-[12.5px] text-slate-500 mb-1">
            {loading ? "Loading…" : `${total.toLocaleString()} job${total !== 1 ? "s" : ""} found`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#0E733B]" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-[14px]">No jobs match your filters</p>
            </div>
          ) : (
            <>
              {jobs.map(job => {
                const isSelected = selected?._id === job._id;
                const isApplied = applied.has(job._id);
                return (
                  <div key={job._id}>
                    <button
                      onClick={() => setSelected(job)}
                      className={`text-left w-full bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
                        isSelected
                          ? "border-[#0E733B] ring-1 ring-[#0E733B]/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[14px] text-charcoal leading-snug">{job.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isApplied && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Applied</span>
                          )}
                          <span className="text-[11px] text-slate-400">{relativeDate(job.publishedAt)}</span>
                        </div>
                      </div>
                      <p className="text-[12.5px] text-slate-600 mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {job.institutionName}
                      </p>
                      <p className="text-[12px] text-slate-500 flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {job.city}{job.state ? `, ${job.state}` : ""}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.roleType}</span>
                        {job.board && <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.board}</span>}
                        {job.employment && <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.employment}</span>}
                        {deadlineLabel(job.deadline) && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            deadlineLabel(job.deadline) === "Expired" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                          }`}>
                            {deadlineLabel(job.deadline)}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Mobile inline detail panel — visible only on small screens */}
                    {isSelected && (
                      <div className="md:hidden bg-white rounded-xl border border-[#0E733B]/30 mt-1 mb-1 p-5 shadow-sm">
                        <div className="mb-4">
                          {job.institutionId ? (
                            <button
                              onClick={() => setSchoolProfileTarget({ id: job.institutionId!, name: job.institutionName })}
                              className="font-semibold text-[14px] text-[#0E733B] hover:underline underline-offset-2 flex items-center gap-1.5 mb-1"
                            >
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              {job.institutionName}
                              <span className="text-[11px] font-normal text-slate-400">(view profile)</span>
                            </button>
                          ) : (
                            <p className="font-semibold text-[14px] text-slate-700 flex items-center gap-1.5 mb-1">
                              <Building2 className="w-3.5 h-3.5 shrink-0 text-[#0E733B]" /> {job.institutionName}
                            </p>
                          )}
                          <p className="text-[12.5px] text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> {job.city}{job.state ? `, ${job.state}` : ""}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {[
                            { icon: Briefcase,    label: job.roleType },
                            { icon: BookOpen,     label: job.board },
                            { icon: Users,        label: `${job.openings} opening${job.openings !== 1 ? "s" : ""}` },
                            { icon: Clock,        label: job.employment },
                            ...(job.classes ? [{ icon: CalendarDays, label: `Classes ${job.classes}` }] : []),
                          ].map(({ icon: Icon, label }) => label ? (
                            <span key={label} className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11.5px] font-semibold px-2.5 py-1 rounded-full">
                              <Icon className="w-3 h-3" /> {label}
                            </span>
                          ) : null)}
                        </div>

                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line mb-4 border-t border-slate-100 pt-4">
                          {job.description || "No description provided."}
                        </p>

                        <div className="border-t border-slate-100 pt-4">
                          {isSchool ? (
                            <p className="text-[12.5px] text-slate-500">Sign in as a teacher to apply.</p>
                          ) : isApplied ? (
                            <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" /> Application submitted!
                            </div>
                          ) : (
                            <button
                              onClick={handleApplyClick}
                              className="w-full inline-flex items-center justify-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] transition-all"
                            >
                              {isTeacher ? "Apply Now" : "Sign in to Apply"} <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button onClick={() => fetchJobs(page - 1)} disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] disabled:opacity-40 hover:bg-slate-50">← Prev</button>
                  <span className="text-[12px] text-slate-500">{page} / {pages}</span>
                  <button onClick={() => fetchJobs(page + 1)} disabled={page >= pages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] disabled:opacity-40 hover:bg-slate-50">Next →</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: job detail */}
        {selected && (
          <div className="hidden md:flex flex-1 flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-[130px] self-start max-h-[calc(100vh-150px)]">
            <div className="overflow-y-auto flex-1 p-7">
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-display font-bold text-[22px] text-charcoal leading-snug">{selected.title}</h2>
                  {deadlineLabel(selected.deadline) && (
                    <span className={`text-[11.5px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                      deadlineLabel(selected.deadline) === "Expired" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                    }`}>
                      {deadlineLabel(selected.deadline)}
                    </span>
                  )}
                </div>

                {/* Institution name — clickable if institutionId present */}
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#0E733B] shrink-0" />
                  {selected.institutionId ? (
                    <button
                      onClick={() => setSchoolProfileTarget({ id: selected.institutionId!, name: selected.institutionName })}
                      className="font-semibold text-[15px] text-[#0E733B] hover:underline underline-offset-2 transition-colors text-left"
                    >
                      {selected.institutionName}
                      <span className="ml-1.5 text-[11px] font-normal text-slate-400">(view profile)</span>
                    </button>
                  ) : (
                    <p className="font-semibold text-[15px] text-slate-700">{selected.institutionName}</p>
                  )}
                </div>
                <p className="text-[13.5px] text-slate-500 flex items-center gap-2 ml-6">
                  <MapPin className="w-3.5 h-3.5" /> {selected.city}{selected.state ? `, ${selected.state}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Briefcase,    label: selected.roleType },
                  { icon: BookOpen,     label: selected.board },
                  { icon: Users,        label: `${selected.openings} opening${selected.openings !== 1 ? "s" : ""}` },
                  { icon: Clock,        label: selected.employment },
                  ...(selected.classes ? [{ icon: CalendarDays, label: `Classes ${selected.classes}` }] : []),
                ].map(({ icon: Icon, label }) => label ? (
                  <span key={label} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[12px] font-semibold px-3 py-1.5 rounded-full">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </span>
                ) : null)}
              </div>

              <div className="prose prose-sm max-w-none text-slate-600 text-[13.5px] leading-relaxed whitespace-pre-line border-t border-slate-100 pt-5">
                {selected.description || "No description provided."}
              </div>
            </div>

            {/* CTA footer */}
            <div className="border-t border-slate-100 px-7 py-4 bg-white flex items-center gap-3">
              {isSchool ? (
                <p className="text-[13px] text-slate-500">Sign in as a teacher to apply for this role.</p>
              ) : selectedApplied ? (
                <div className="flex items-center gap-2 text-[13.5px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" /> Application submitted successfully!
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApplyClick}
                    className="inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-6 py-2.5 rounded-full font-bold text-[13.5px] transition-all hover:scale-105 active:scale-95"
                  >
                    {isTeacher ? "Apply Now" : "Sign in to Apply"} <ArrowRight className="w-4 h-4" />
                  </button>
                  {!isTeacher && (
                    <p className="text-[12px] text-slate-400">Free to register · Takes 2 minutes</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
