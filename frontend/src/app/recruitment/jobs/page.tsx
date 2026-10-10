"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Briefcase, Clock, Building2,
  Loader2, ArrowRight, BookOpen, Users, CalendarDays,
  X, CheckCircle2, Send, AlertTriangle, Phone, Mail,
  Link as LinkIcon, Globe, ShieldCheck, Info, Bookmark,
  SlidersHorizontal, ChevronRight, Sparkles, GraduationCap,
  TrendingUp, Award,
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
  institutionWebsite?: string | null;
  institutionType?: string | null;
  establishedYear?: string | null;
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
const EMPLOYMENT_TYPES = ["All", "Full-time", "Part-time", "Contract", "Temporary"];

// Gradient palettes for school avatars
const GRAD_PALETTES = [
  { from: "#10b981", to: "#059669", text: "white" },
  { from: "#3b82f6", to: "#2563eb", text: "white" },
  { from: "#8b5cf6", to: "#7c3aed", text: "white" },
  { from: "#f59e0b", to: "#d97706", text: "white" },
  { from: "#ef4444", to: "#dc2626", text: "white" },
  { from: "#06b6d4", to: "#0891b2", text: "white" },
  { from: "#ec4899", to: "#db2777", text: "white" },
  { from: "#f97316", to: "#ea580c", text: "white" },
];

function relativeDate(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function deadlineLabel(iso: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { text: "Expired", urgent: true };
  if (days === 0) return { text: "Closes today", urgent: true };
  if (days <= 7) return { text: `${days}d left`, urgent: true };
  return { text: `Until ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, urgent: false };
}

/** Extract domain from a website URL, returns null if not parseable */
function toDomain(website?: string | null): string | null {
  if (!website) return null;
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    return new URL(url).hostname.replace(/^www\./, "");
  } catch { return null; }
}

/** Gradient initials fallback */
function InitialsAvatar({ name, size }: { name: string; size: "sm" | "md" | "lg" }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
  const idx = name.charCodeAt(0) % GRAD_PALETTES.length;
  const p = GRAD_PALETTES[idx];
  const sz = { sm: "w-10 h-10 text-[13px]", md: "w-12 h-12 text-[14px]", lg: "w-16 h-16 text-[18px]" }[size];
  const radius = size === "lg" ? "rounded-2xl" : "rounded-xl";
  return (
    <div className={`${sz} ${radius} flex items-center justify-center font-bold shrink-0 shadow-sm`}
      style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, color: p.text }}>
      {initials}
    </div>
  );
}

/** Smart school logo — tries Clearbit → Google favicon → initials avatar */
function SchoolAvatar({ name, website, size = "md" }: { name: string; website?: string | null; size?: "sm" | "md" | "lg" }) {
  const domain = toDomain(website);
  const [src, setSrc] = useState<string | null>(
    domain ? `https://logo.clearbit.com/${domain}` : null
  );
  const [failed, setFailed] = useState(false);
  const sz = { sm: "w-10 h-10", md: "w-12 h-12", lg: "w-16 h-16" }[size];
  const radius = size === "lg" ? "rounded-2xl" : "rounded-xl";

  const handleError = () => {
    if (src && src.includes("clearbit") && domain) {
      // Fall back to Google favicon (higher quality than clearbit for many sites)
      setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setFailed(true);
    }
  };

  if (failed || !src) return <InitialsAvatar name={name} size={size} />;

  return (
    <div className={`${sz} ${radius} shrink-0 bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center p-1`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain"
        onError={handleError}
      />
    </div>
  );
}

// ── Decorative hero illustration ─────────────────────────────────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {/* Background glow */}
      <ellipse cx="210" cy="160" rx="180" ry="140" fill="url(#heroGlow)" opacity="0.15" />

      {/* Main building / school */}
      <rect x="120" y="120" width="180" height="140" rx="8" fill="#1a4a33" />
      <rect x="130" y="108" width="160" height="18" rx="4" fill="#0E733B" />
      {/* Windows */}
      <rect x="140" y="140" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.7" />
      <rect x="185" y="140" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.7" />
      <rect x="230" y="140" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.7" />
      <rect x="140" y="180" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.4" />
      <rect x="185" y="180" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.7" />
      <rect x="230" y="180" width="30" height="25" rx="4" fill="#6EDEA8" opacity="0.4" />
      {/* Door */}
      <rect x="185" y="225" width="50" height="35" rx="4" fill="#0E733B" />
      <circle cx="228" cy="245" r="3" fill="#6EDEA8" />
      {/* Flag */}
      <line x1="210" y1="70" x2="210" y2="108" stroke="#6EDEA8" strokeWidth="2" />
      <path d="M210 72 L230 79 L210 86 Z" fill="#6EDEA8" />

      {/* Floating job cards */}
      {/* Card 1 - left */}
      <g transform="translate(12, 80)" opacity="0.9">
        <rect width="100" height="64" rx="10" fill="white" opacity="0.12" />
        <rect width="100" height="64" rx="10" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
        <rect x="10" y="12" width="20" height="20" rx="6" fill="#0E733B" opacity="0.8" />
        <rect x="38" y="14" width="50" height="6" rx="3" fill="white" opacity="0.6" />
        <rect x="38" y="24" width="35" height="4" rx="2" fill="white" opacity="0.3" />
        <rect x="10" y="40" width="25" height="14" rx="7" fill="#0E733B" opacity="0.7" />
        <rect x="40" y="43" width="30" height="8" rx="4" fill="white" opacity="0.2" />
        <rect x="75" y="43" width="16" height="8" rx="4" fill="white" opacity="0.2" />
      </g>

      {/* Card 2 - right */}
      <g transform="translate(308, 60)" opacity="0.9">
        <rect width="100" height="64" rx="10" fill="white" opacity="0.12" />
        <rect width="100" height="64" rx="10" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
        <rect x="10" y="12" width="20" height="20" rx="6" fill="#3b82f6" opacity="0.8" />
        <rect x="38" y="14" width="50" height="6" rx="3" fill="white" opacity="0.6" />
        <rect x="38" y="24" width="35" height="4" rx="2" fill="white" opacity="0.3" />
        <rect x="10" y="40" width="25" height="14" rx="7" fill="#3b82f6" opacity="0.7" />
        <rect x="40" y="43" width="30" height="8" rx="4" fill="white" opacity="0.2" />
        <rect x="75" y="43" width="16" height="8" rx="4" fill="white" opacity="0.2" />
      </g>

      {/* Card 3 - bottom right */}
      <g transform="translate(310, 180)" opacity="0.75">
        <rect width="100" height="64" rx="10" fill="white" opacity="0.1" />
        <rect width="100" height="64" rx="10" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" />
        <rect x="10" y="12" width="20" height="20" rx="6" fill="#8b5cf6" opacity="0.8" />
        <rect x="38" y="14" width="40" height="6" rx="3" fill="white" opacity="0.5" />
        <rect x="38" y="24" width="28" height="4" rx="2" fill="white" opacity="0.25" />
        <rect x="10" y="40" width="25" height="14" rx="7" fill="#8b5cf6" opacity="0.7" />
        <rect x="40" y="43" width="30" height="8" rx="4" fill="white" opacity="0.2" />
      </g>

      {/* Success tick bubble */}
      <g transform="translate(50, 195)">
        <rect width="88" height="36" rx="18" fill="#0E733B" opacity="0.9" />
        <circle cx="22" cy="18" r="8" fill="white" opacity="0.2" />
        {/* checkmark */}
        <path d="M17 18 L20.5 21.5 L27 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="36" y="11" width="42" height="6" rx="3" fill="white" opacity="0.7" />
        <rect x="36" y="20" width="30" height="5" rx="2.5" fill="white" opacity="0.4" />
      </g>

      {/* Dotted grid */}
      {[0,1,2,3,4,5,6].map(col =>
        [0,1,2,3,4,5].map(row => (
          <circle key={`${col}-${row}`} cx={20 + col * 58} cy={20 + row * 52} r="1.5"
            fill="white" opacity={0.05} />
        ))
      )}

      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0E733B" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Skeleton job card ────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 pl-6 flex gap-4 overflow-hidden relative shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 animate-shimmer pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%)",
          animationDelay: `${delay}ms`,
        }}
      />
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 animate-skeleton" style={{ animationDelay: `${delay}ms` }} />

      {/* Content placeholders */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 space-y-2">
            <div className="h-[15px] bg-slate-100 rounded-lg w-3/4 animate-skeleton" style={{ animationDelay: `${delay + 80}ms` }} />
            <div className="h-3 bg-slate-100 rounded-lg w-2/5 animate-skeleton" style={{ animationDelay: `${delay + 120}ms` }} />
            <div className="flex gap-2">
              <div className="h-2.5 bg-slate-100 rounded-lg w-14 animate-skeleton" style={{ animationDelay: `${delay + 160}ms` }} />
              <div className="h-2.5 bg-slate-100 rounded-lg w-20 animate-skeleton" style={{ animationDelay: `${delay + 200}ms` }} />
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0 animate-skeleton" style={{ animationDelay: `${delay}ms` }} />
        </div>

        <div className="flex gap-3 mb-3">
          <div className="h-3 bg-slate-100 rounded-lg w-24 animate-skeleton" style={{ animationDelay: `${delay + 100}ms` }} />
          <div className="h-3 bg-slate-100 rounded-lg w-20 animate-skeleton" style={{ animationDelay: `${delay + 150}ms` }} />
          <div className="h-3 bg-slate-100 rounded-lg w-16 animate-skeleton" style={{ animationDelay: `${delay + 200}ms` }} />
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="h-3 bg-slate-100 rounded-lg w-full animate-skeleton" style={{ animationDelay: `${delay + 120}ms` }} />
          <div className="h-3 bg-slate-100 rounded-lg w-4/5 animate-skeleton" style={{ animationDelay: `${delay + 160}ms` }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-5 bg-slate-100 rounded-full w-16 animate-skeleton" style={{ animationDelay: `${delay + 80}ms` }} />
            <div className="h-5 bg-slate-100 rounded-full w-14 animate-skeleton" style={{ animationDelay: `${delay + 120}ms` }} />
            <div className="h-5 bg-slate-100 rounded-full w-20 animate-skeleton" style={{ animationDelay: `${delay + 160}ms` }} />
          </div>
          <div className="h-7 bg-slate-100 rounded-xl w-14 animate-skeleton" style={{ animationDelay: `${delay + 80}ms` }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 200, 400, 500, 600, 700].map((delay) => (
        <SkeletonCard key={delay} delay={delay} />
      ))}
    </div>
  );
}

// ── Empty state illustration ─────────────────────────────────────────────────
function EmptyIllustration() {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-40" aria-hidden="true">
      <ellipse cx="120" cy="180" rx="80" ry="10" fill="#e2e8f0" />
      <rect x="60" y="60" width="120" height="100" rx="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="60" y="60" width="120" height="28" rx="12" fill="#e2e8f0" />
      <rect x="60" y="75" width="120" height="13" fill="#e2e8f0" />
      <rect x="76" y="105" width="36" height="8" rx="4" fill="#e2e8f0" />
      <rect x="76" y="120" width="88" height="6" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="76" y="132" width="64" height="6" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="120" cy="50" r="22" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M111 50 l6 6 l12-12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="168" cy="40" r="14" stroke="#cbd5e1" strokeWidth="2" fill="white" />
      <line x1="178" y1="50" x2="186" y2="58" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <circle cx="165" cy="37" r="4" fill="#f1f5f9" />
    </svg>
  );
}

// ── School profile modal ─────────────────────────────────────────────────────
function SchoolProfileModal({ institutionId, institutionName, onClose }: {
  institutionId: string; institutionName: string; onClose: () => void;
}) {
  const [data, setData] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/recruitment/institutions/${institutionId}`)
      .then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [institutionId]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[88dvh] flex flex-col overflow-hidden">
        {/* Colored top strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#0E733B] to-[#3DBA77] shrink-0" />
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <SchoolAvatar name={institutionName} website={data?.website} size="sm" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0E733B] mb-0.5">School profile</p>
              <h2 className="font-bold text-[16px] text-slate-900 leading-snug">{institutionName}</h2>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-[#0E733B]" /></div>
          ) : !data ? (
            <p className="text-[13px] text-slate-400 text-center py-12">Profile not available.</p>
          ) : (
            <div className="space-y-5">
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[12.5px] font-semibold border ${
                data.verificationStatus === "VERIFIED"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                <ShieldCheck className={`w-4 h-4 ${data.verificationStatus === "VERIFIED" ? "text-emerald-500" : "text-amber-500"}`} />
                {data.verificationStatus === "VERIFIED" ? "Verified institution" : "Verification pending"}
              </div>
              <div className="flex flex-wrap gap-2">
                {[data.institutionType, data.board, data.establishedYear && `Est. ${data.establishedYear}`].filter(Boolean).map((t) => (
                  <span key={t} className="text-[12px] bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">{t}</span>
                ))}
              </div>
              {data.description && <p className="text-[13.5px] text-slate-600 leading-relaxed">{data.description}</p>}
              {(data.addressLine || data.city) && (
                <div className="flex items-start gap-2.5 text-[13px] text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{[data.addressLine, data.city, data.state, data.pincode].filter(Boolean).join(", ")}</span>
                </div>
              )}
              <div className="space-y-2.5">
                {data.contactPerson && <div className="flex items-center gap-2.5 text-[13px] text-slate-600"><Users className="w-4 h-4 text-slate-400 shrink-0" /><span>Contact: <strong>{data.contactPerson}</strong></span></div>}
                {data.contactPhone && <div className="flex items-center gap-2.5 text-[13px] text-slate-600"><Phone className="w-4 h-4 text-slate-400 shrink-0" /><a href={`tel:${data.contactPhone}`} className="hover:underline">{data.contactPhone}</a></div>}
                {data.officialEmail && <div className="flex items-center gap-2.5 text-[13px] text-slate-600"><Mail className="w-4 h-4 text-slate-400 shrink-0" /><a href={`mailto:${data.officialEmail}`} className="hover:underline truncate">{data.officialEmail}</a></div>}
                {data.website && <div className="flex items-center gap-2.5 text-[13px] text-slate-600"><Globe className="w-4 h-4 text-slate-400 shrink-0" /><a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0E733B] truncate">{data.website.replace(/^https?:\/\//, "")}</a></div>}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-6 py-4 shrink-0">
          <button onClick={onClose} className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[13.5px] font-semibold text-slate-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Job detail modal ─────────────────────────────────────────────────────────
function JobDetailModal({ job, isApplied, isSaved, onToggleSave, onApply, onViewSchool, onClose, isTeacher, isSchool }: {
  job: Job; isApplied: boolean; isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onApply: () => void; onViewSchool: () => void; onClose: () => void;
  isTeacher: boolean; isSchool: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const dl = deadlineLabel(job.deadline);
  const gradIdx = job.institutionName.charCodeAt(0) % GRAD_PALETTES.length;
  const grad = GRAD_PALETTES[gradIdx];
  const stats = [
    { icon: Briefcase, label: job.roleType },
    { icon: BookOpen, label: job.board },
    { icon: Users, label: `${job.openings} opening${job.openings !== 1 ? "s" : ""}` },
    { icon: Clock, label: job.employment },
    ...(job.classes ? [{ icon: CalendarDays, label: `Classes ${job.classes}` }] : []),
  ].filter((s) => s.label);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Gradient header band */}
        <div className="h-32 shrink-0 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${grad.from}22, ${grad.to}44)` }}>
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${grad.from}60 0%, transparent 60%), radial-gradient(circle at 80% 50%, ${grad.to}40 0%, transparent 60%)` }} />
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${grad.to}, transparent)`, transform: "translate(30%, -30%)" }} />
          {/* Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {dl && (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                dl.urgent ? "bg-red-500/90 text-white" : "bg-white/80 text-slate-700"
              }`}>{dl.text}</span>
            )}
            <button onClick={onToggleSave}
              className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-sm ${
                isSaved ? "bg-[#0E733B] text-white" : "bg-white/80 text-slate-500 hover:text-slate-800"
              }`}>
              <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Avatar positioned over band */}
          <div className="absolute -bottom-6 left-6">
            <div className="p-1 bg-white rounded-2xl shadow-md">
              <SchoolAvatar name={job.institutionName} website={job.institutionWebsite} size="lg" />
            </div>
          </div>
        </div>

        {/* Title area */}
        <div className="px-6 pt-10 pb-4 border-b border-slate-100 shrink-0">
          <h2 className="font-bold text-[20px] text-slate-900 leading-snug mb-1">{job.title}</h2>
          {job.institutionId ? (
            <button onClick={onViewSchool} className="text-[13.5px] font-semibold text-[#0E733B] hover:underline underline-offset-2 text-left">
              {job.institutionName}
            </button>
          ) : (
            <p className="text-[13.5px] font-semibold text-slate-500">{job.institutionName}</p>
          )}

          {/* Institution meta chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2 mb-1">
            <span className="flex items-center gap-1 text-[12px] text-slate-400">
              <MapPin className="w-3 h-3" />{job.city}{job.state ? `, ${job.state}` : ""}
            </span>
            {job.institutionType && (
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">{job.institutionType}</span>
            )}
            {job.establishedYear && (
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">Est. {job.establishedYear}</span>
            )}
            {job.institutionWebsite && (
              <a
                href={job.institutionWebsite.startsWith("http") ? job.institutionWebsite : `https://${job.institutionWebsite}`}
                target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-[#0E733B] hover:underline flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                {toDomain(job.institutionWebsite)}
              </a>
            )}
            <span className="text-[11px] text-slate-400 ml-auto">{relativeDate(job.publishedAt)}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {stats.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-medium px-3 py-1.5 rounded-full">
                <Icon className="w-3.5 h-3.5 text-[#0E733B]" /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">About the role</p>
          <p className="text-[14px] text-slate-600 leading-[1.75] whitespace-pre-line">
            {job.description || "No description provided."}
          </p>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 shrink-0 flex items-center gap-3">
          {isSchool ? (
            <p className="text-[13px] text-slate-400">Sign in as a teacher to apply.</p>
          ) : isApplied ? (
            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl">
              <CheckCircle2 className="w-4 h-4" /> Application submitted!
            </div>
          ) : (
            <button onClick={onApply}
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-2xl font-bold text-[14px] transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}>
              {isTeacher ? "Apply Now" : "Sign in to Apply"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Apply modal ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess, authHeader, goToProfile }: {
  job: Job; onClose: () => void; onSuccess: (jobId: string) => void;
  authHeader: () => Promise<Record<string, string>>; goToProfile: () => void;
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
        setPhone(data.phone || ""); setResumeUrl(data.resumeUrl || ""); setEmail(data.email || "");
        const missing: string[] = [];
        if (!String(data.fullName || "").trim()) missing.push("Full name");
        if (!String(data.phone || "").trim()) missing.push("Phone number");
        if (!String(data.bio || "").trim() && !(Array.isArray(data.qualifications) && data.qualifications.length)) missing.push("Bio or qualification");
        setProfileGap(missing.length ? missing : null);
      } catch { setProfileGap(["Could not load profile"]); }
      finally { setCheckingProfile(false); setTimeout(() => textRef.current?.focus(), 50); }
    })();
  }, [authHeader]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileGap) { setErr("Complete your profile first."); return; }
    setBusy(true); setErr("");
    try {
      const headers = await authHeader();
      if (phone.trim() || resumeUrl.trim()) await fetch(`${API}/api/recruitment/profile/teacher`, { method: "PUT", headers, body: JSON.stringify({ phone: phone.trim(), resumeUrl: resumeUrl.trim() }) });
      const res = await fetch(`${API}/api/recruitment/jobs/${job._id}/apply`, { method: "POST", headers, body: JSON.stringify({ coverNote: coverNote.trim() }) });
      const body = await res.json();
      if (!res.ok) {
        if (body.code === "PROFILE_INCOMPLETE") { setProfileGap(body.missingFields ?? ["incomplete profile"]); return; }
        setErr(body.error || "Could not submit application."); return;
      }
      setDone(true); onSuccess(job._id);
    } catch { setErr("Network error. Please try again."); }
    finally { setBusy(false); }
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0E733B] to-[#3DBA77] shrink-0" />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0E733B] mb-0.5">Applying for</p>
            <h2 className="font-bold text-[17px] text-slate-900 leading-snug truncate">{job.title}</h2>
            <p className="text-[12.5px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 shrink-0" /> {job.institutionName}
              {job.city && <><span className="text-slate-300">·</span><MapPin className="w-3 h-3 shrink-0" />{job.city}</>}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {checkingProfile ? (
            <div className="flex items-center justify-center py-14"><Loader2 className="w-5 h-5 animate-spin text-[#0E733B]" /><span className="ml-2.5 text-[13.5px] text-slate-500">Loading profile…</span></div>
          ) : done ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0E733B] to-[#3DBA77] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[20px] text-slate-900 mb-2">Application submitted!</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">Your application for <strong>{job.title}</strong> at {job.institutionName} has been sent.<br />Track it in <strong>My Applications</strong>.</p>
              <button onClick={onClose} className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-[#0E733B] to-[#3DBA77] text-white font-bold text-[14px] hover:opacity-90 transition-all shadow-md">Done</button>
            </div>
          ) : profileGap ? (
            <div className="px-6 py-8">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="font-bold text-[14px] text-amber-900 mb-1">Complete your profile first</p>
                    <p className="text-[13px] text-amber-800/80 leading-relaxed">Schools need your details. Please add:</p>
                    <ul className="mt-2 space-y-1">
                      {profileGap.map((f) => <li key={f} className="text-[12.5px] font-semibold text-amber-900 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              <button onClick={() => { onClose(); goToProfile(); }} className="w-full flex items-center justify-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-2xl font-bold text-[14px] transition-all">Go to My Profile <ArrowRight className="w-4 h-4" /></button>
              <button onClick={onClose} className="mt-2.5 w-full py-2.5 rounded-2xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3"><Info className="w-3.5 h-3.5 text-slate-400 shrink-0" /><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Your contact details</p></div>
                <div className="flex flex-col gap-3">
                  {email && <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Email <span className="font-normal text-slate-400">(from account)</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input value={email} readOnly className={`${inp} pl-9 bg-slate-100 text-slate-500 cursor-not-allowed`} /></div></div>}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" className={`${inp} pl-9`} /></div></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Resume link</label><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" /><input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="PDF or Drive URL" className={`${inp} pl-9`} /></div></div>
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-2">These save to your profile when you submit.</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Cover note <span className="font-normal normal-case">(optional · max 1000 chars)</span></label>
                <textarea ref={textRef} value={coverNote} onChange={(e) => setCoverNote(e.target.value.slice(0, 1000))} rows={5}
                  placeholder="Tell the school why you're a great fit…"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[13.5px] text-slate-800 resize-none focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all" />
                <p className="text-right text-[11px] text-slate-400 mt-1">{coverNote.length} / 1000</p>
              </div>
              {err && <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{err}</p>}
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0E733B] to-[#0B8F44] hover:opacity-90 text-white py-3 rounded-2xl font-bold text-[14px] transition-all disabled:opacity-50 shadow-md hover:shadow-lg">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {busy ? "Submitting…" : "Submit Application"}
                </button>
                <button type="button" onClick={onClose} className="px-5 py-3 rounded-2xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar filter ───────────────────────────────────────────────────────────
function FilterGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">{label}</p>
      <div className="flex flex-col gap-0.5">
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`text-left px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
              value === opt ? "bg-[#0E733B]/10 text-[#0E733B] font-semibold" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Job card ─────────────────────────────────────────────────────────────────
function JobCard({ job, isApplied, isSaved, onToggleSave, onViewJob, onApply, isTeacher, isSchool }: {
  job: Job; isApplied: boolean; isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onViewJob: () => void; onApply: () => void;
  isTeacher: boolean; isSchool: boolean;
}) {
  const dl = deadlineLabel(job.deadline);
  const tags = [job.roleType, job.board, job.employment, job.classes ? `Classes ${job.classes}` : ""].filter(Boolean);
  const gradIdx = job.institutionName.charCodeAt(0) % GRAD_PALETTES.length;
  const grad = GRAD_PALETTES[gradIdx];

  return (
    <article
      onClick={onViewJob}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Accent line on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-2xl"
        style={{ background: `linear-gradient(to bottom, ${grad.from}, ${grad.to})` }} />

      <div className="flex gap-4 p-5 pl-6">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          <SchoolAvatar name={job.institutionName} website={job.institutionWebsite} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-bold text-[14.5px] text-slate-900 leading-snug group-hover:text-[#0E733B] transition-colors">{job.title}</h3>
              <p className="text-[12.5px] text-slate-600 font-semibold mt-0.5 truncate">{job.institutionName}</p>
              {/* Institution quick meta */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {job.institutionType && (
                  <span className="text-[10.5px] text-slate-400 font-medium">{job.institutionType}</span>
                )}
                {job.establishedYear && (
                  <><span className="text-slate-300 text-[10px]">·</span><span className="text-[10.5px] text-slate-400">Est. {job.establishedYear}</span></>
                )}
                {job.institutionWebsite && (
                  <><span className="text-slate-300 text-[10px]">·</span>
                  <a href={job.institutionWebsite.startsWith("http") ? job.institutionWebsite : `https://${job.institutionWebsite}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10.5px] text-[#0E733B] hover:underline flex items-center gap-0.5">
                    <Globe className="w-2.5 h-2.5" />{toDomain(job.institutionWebsite)}
                  </a></>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isApplied && (
                <span className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Applied
                </span>
              )}
              <button onClick={(e) => { e.stopPropagation(); onToggleSave(e); }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isSaved ? "text-[#0E733B] bg-emerald-50" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                }`}>
                <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12px] text-slate-400 mb-3">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.city}{job.state ? `, ${job.state}` : ""}</span>
            {job.openings > 0 && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.openings} opening{job.openings !== 1 ? "s" : ""}</span>}
            {job.employment && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.employment}</span>}
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{job.description}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <span key={tag}
                  className="text-[11px] border text-slate-600 px-2.5 py-0.5 rounded-full font-medium"
                  style={{ borderColor: `${grad.from}30`, background: `${grad.from}08` }}>
                  {tag}
                </span>
              ))}
              {dl && (
                <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${dl.urgent ? "bg-red-50 text-red-500 border border-red-100" : "bg-slate-100 text-slate-500"}`}>
                  {dl.text}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-slate-400">{relativeDate(job.publishedAt)}</span>
              {!isSchool && !isApplied && (
                <button
                  onClick={(e) => { e.stopPropagation(); onApply(); }}
                  className="text-[12px] font-bold text-white px-3.5 py-1.5 rounded-xl transition-all hidden sm:block hover:opacity-90 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                >
                  {isTeacher ? "Apply" : "Sign in"}
                </button>
              )}
              <span className="text-[12px] font-semibold text-[#0E733B] flex items-center gap-0.5 group-hover:gap-1.5 transition-all whitespace-nowrap">
                View <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Promo card ───────────────────────────────────────────────────────────────
function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl text-white"
      style={{ background: "linear-gradient(135deg, #0A2D1F 0%, #0E5C30 50%, #0E733B 100%)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute top-0 right-16 w-px h-full bg-white/5" />

      <div className="relative flex items-center justify-between gap-6 p-6 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-[#6EDEA8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6EDEA8]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#6EDEA8]">For schools</p>
            </div>
            <p className="font-bold text-[16px] mb-1 leading-snug">Ready to hire great teachers?</p>
            <p className="text-[12.5px] text-white/60 leading-relaxed">Post a job and reach thousands of qualified educators across India — for free.</p>
          </div>
        </div>
        <a href="/recruitment/register"
          className="inline-flex items-center gap-2 bg-white text-[#0E733B] text-[13px] font-bold px-5 py-2.5 rounded-2xl hover:bg-emerald-50 transition-colors shadow-md shrink-0">
          Post a job <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">
      <Icon className="w-4 h-4 text-[#6EDEA8] shrink-0" />
      <span className="text-[13px] font-medium text-white/80">{label}</span>
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
  const [heroSearch, setHeroSearch] = useState("");
  const [roleType, setRoleType] = useState("All");
  const [board, setBoard] = useState("All");
  const [employment, setEmployment] = useState("All");
  const [city, setCity] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { const raw = localStorage.getItem("recruitment_saved_jobs"); return raw ? new Set(JSON.parse(raw) as string[]) : new Set(); }
    catch { return new Set(); }
  });

  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [applyTarget, setApplyTarget] = useState<Job | null>(null);
  const [schoolProfileTarget, setSchoolProfileTarget] = useState<{ id: string; name: string } | null>(null);

  const toggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId); else next.add(jobId);
      try { localStorage.setItem("recruitment_saved_jobs", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

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
    } catch { /* silent */ } finally { setLoading(false); }
  }, [search, roleType, board, city]);

  useEffect(() => { fetchJobs(1); }, [roleType, board, employment]);
  useEffect(() => { const t = setTimeout(() => fetchJobs(1), 350); return () => clearTimeout(t); }, [search, city]);

  const isTeacher = state.status === "ready" && state.profile.accountType === "TEACHER";
  const isSchool  = state.status === "ready" && state.profile.accountType === "SCHOOL_ADMIN";
  const activeFilters = [roleType !== "All", board !== "All", employment !== "All", !!city].filter(Boolean).length;
  const clearAll = () => { setRoleType("All"); setBoard("All"); setEmployment("All"); setCity(""); setSearch(""); setHeroSearch(""); };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Modals */}
      {viewJob && (
        <JobDetailModal
          job={viewJob} isApplied={applied.has(viewJob._id)} isSaved={saved.has(viewJob._id)}
          onToggleSave={(e) => toggleSave(viewJob._id, e)}
          onApply={() => { if (isTeacher) { setApplyTarget(viewJob); setViewJob(null); } else router.push("/recruitment/register"); }}
          onViewSchool={() => { if (viewJob.institutionId) setSchoolProfileTarget({ id: viewJob.institutionId, name: viewJob.institutionName }); }}
          onClose={() => setViewJob(null)} isTeacher={isTeacher} isSchool={isSchool}
        />
      )}
      {applyTarget && (
        <ApplyModal job={applyTarget} onClose={() => setApplyTarget(null)} onSuccess={(id) => setApplied((p) => new Set([...p, id]))}
          authHeader={authHeader} goToProfile={() => router.push(DASHBOARD_PATH.TEACHER + "?tab=profile")} />
      )}
      {schoolProfileTarget && (
        <SchoolProfileModal institutionId={schoolProfileTarget.id} institutionName={schoolProfileTarget.name} onClose={() => setSchoolProfileTarget(null)} />
      )}

      {/* Mobile filter sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative bg-white w-64 h-full shadow-2xl p-5 overflow-y-auto ml-auto rounded-l-3xl">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[15px] text-slate-900">Filters {activeFilters > 0 && <span className="text-[#0E733B]">({activeFilters})</span>}</p>
              <button onClick={() => setMobileSidebarOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <FilterGroup label="Role type" options={ROLE_TYPES} value={roleType} onChange={setRoleType} />
            <FilterGroup label="Board" options={BOARDS} value={board} onChange={setBoard} />
            <FilterGroup label="Employment" options={EMPLOYMENT_TYPES} value={employment} onChange={setEmployment} />
            {activeFilters > 0 && <button onClick={clearAll} className="w-full mt-2 py-2 rounded-xl border border-slate-200 text-[12.5px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors">Clear all</button>}
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #071a10 0%, #0A2D1F 40%, #0d3d28 100%)" }}>
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #6EDEA8 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0E733B, transparent)", transform: "translate(-50%, -50%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3DBA77, transparent)", transform: "translate(50%, 50%)" }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8 py-12 lg:py-16">
            {/* Left: text content */}
            <div className="flex-1 text-white max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <GraduationCap className="w-3.5 h-3.5 text-[#6EDEA8]" />
                <span className="text-[11.5px] font-semibold text-white/80">India&rsquo;s Teacher Recruitment Portal</span>
              </div>

              <h1 className="text-[36px] sm:text-[48px] font-bold leading-[1.12] tracking-tight mb-4">
                Find your next<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #6EDEA8, #3DBA77)" }}>
                  teaching role
                </span>
              </h1>
              <p className="text-[14.5px] text-white/50 mb-8 leading-relaxed max-w-sm">
                Browse openings at top schools across India. Apply directly and track everything in one place.
              </p>

              {/* Hero search bar */}
              <form onSubmit={(e) => { e.preventDefault(); setSearch(heroSearch); }} className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input value={heroSearch} onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Role, subject, school or keyword…"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-[14px] text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E733B]/30 shadow-xl" />
                </div>
                <button type="submit"
                  className="px-5 py-3.5 font-bold text-[14px] rounded-2xl transition-all shadow-lg shrink-0 active:scale-[0.97] text-white"
                  style={{ background: "linear-gradient(135deg, #0E733B, #0B8F44)" }}>
                  Search
                </button>
              </form>

              {/* City + stats row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Filter by city…"
                    className="pl-9 pr-4 py-2 rounded-xl text-[12.5px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all w-40" />
                </div>
                {total > 0 && (
                  <StatPill icon={TrendingUp} label={`${total.toLocaleString()} active jobs`} />
                )}
              </div>
            </div>

            {/* Right: illustration */}
            <div className="hidden lg:block w-[420px] shrink-0 opacity-90">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>

      {/* ── Results bar ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[64px] z-20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <p className="text-[12.5px] text-slate-500">
            {loading
              ? <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin text-[#0E733B]" />Searching…</span>
              : <><strong className="text-slate-800">{total.toLocaleString()}</strong> job{total !== 1 ? "s" : ""} found{search && <> · <span className="italic">&ldquo;{search}&rdquo;</span></>}</>
            }
          </p>
          <div className="flex items-center gap-2">
            {search && (
              <button onClick={() => { setSearch(""); setHeroSearch(""); }}
                className="flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
            <button onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                activeFilters > 0 ? "bg-[#0E733B]/10 text-[#0E733B]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden lg:block w-48 xl:w-52 shrink-0">
          <div className="sticky top-[116px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Filters</p>
              {activeFilters > 0 && (
                <button onClick={clearAll} className="text-[10.5px] font-semibold text-[#0E733B] hover:underline">{activeFilters} active · Clear</button>
              )}
            </div>
            <div className="p-4">
              <FilterGroup label="Role type" options={ROLE_TYPES} value={roleType} onChange={setRoleType} />
              <FilterGroup label="Board" options={BOARDS} value={board} onChange={setBoard} />
              <FilterGroup label="Employment" options={EMPLOYMENT_TYPES} value={employment} onChange={setEmployment} />
            </div>

            {/* Sidebar promo */}
            <div className="mx-4 mb-4 p-3.5 rounded-xl text-white text-center"
              style={{ background: "linear-gradient(135deg, #0A2D1F, #0E733B)" }}>
              <Award className="w-5 h-5 text-[#6EDEA8] mx-auto mb-1.5" />
              <p className="text-[11px] font-bold mb-0.5">Hiring teachers?</p>
              <p className="text-[10px] text-white/60 mb-2">Post a free job today</p>
              <a href="/recruitment/register" className="block text-[10.5px] font-bold bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-1">Get started →</a>
            </div>
          </div>
        </aside>

        {/* Card list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <SkeletonList />
          ) : jobs.length === 0 ? (
            <div className="flex flex-col gap-6">
              {/* Empty state card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-8 py-12 flex flex-col items-center text-center">
                  <EmptyIllustration />
                  <h3 className="text-[18px] font-bold text-slate-800 mt-5 mb-2">
                    {search ? `No results for "${search}"` : "No jobs match your filters"}
                  </h3>
                  <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-xs mb-6">
                    {search
                      ? "Try different keywords — a subject, grade level, or school name."
                      : "Adjust your filters or check back soon — new roles are posted daily."}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {(activeFilters > 0 || search) && (
                      <button onClick={clearAll}
                        className="px-5 py-2.5 rounded-2xl text-white font-bold text-[13.5px] hover:opacity-90 transition-all shadow-md"
                        style={{ background: "linear-gradient(135deg, #0E733B, #3DBA77)" }}>
                        Clear all filters
                      </button>
                    )}
                    <button onClick={() => fetchJobs(1)}
                      className="px-5 py-2.5 rounded-2xl border border-slate-200 font-semibold text-[13.5px] text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>
                </div>

                {/* Browse suggestion chips */}
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-3">Browse by role type</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_TYPES.filter((r) => r !== "All").map((r) => (
                      <button key={r} onClick={() => { setRoleType(r); setSearch(""); setHeroSearch(""); }}
                        className="text-[12.5px] font-medium px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#0E733B]/30 hover:text-[#0E733B] hover:bg-emerald-50 transition-all">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA for schools */}
              <PromoCard />
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {jobs.map((job, idx) => (
                <div key={job._id}>
                  {idx === 5 && <div className="mb-1"><PromoCard /></div>}
                  <JobCard
                    job={job} isApplied={applied.has(job._id)} isSaved={saved.has(job._id)}
                    onToggleSave={(e) => toggleSave(job._id, e)}
                    onViewJob={() => setViewJob(job)}
                    onApply={() => { if (isTeacher) setApplyTarget(job); else router.push("/recruitment/register"); }}
                    isTeacher={isTeacher} isSchool={isSchool}
                  />
                </div>
              ))}

              {pages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-slate-200/60">
                  <button onClick={() => fetchJobs(page - 1)} disabled={page <= 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold disabled:opacity-40 hover:border-slate-300 hover:shadow-sm transition-all">
                    ← Previous
                  </button>
                  <span className="text-[13px] text-slate-400 font-medium">Page {page} of {pages}</span>
                  <button onClick={() => fetchJobs(page + 1)} disabled={page >= pages}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold disabled:opacity-40 hover:border-slate-300 hover:shadow-sm transition-all">
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
