"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Eye, MessageCircle, XCircle, Building2, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { API } from "./useRecruitmentProfile";

// ── Types ──────────────────────────────────────────────────────────────────────
type ActivityKind = "viewed" | "contacted" | "not_shortlisted";

interface ActivityItem {
  _id: string;
  kind: ActivityKind;
  institutionName: string;
  institutionCity?: string;
  institutionState?: string;
  roleTitle?: string;
  message?: string;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const KIND_META: Record<ActivityKind, { label: string; icon: React.ElementType; color: string; bg: string; badge: string }> = {
  viewed: {
    label: "Viewed",
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  contacted: {
    label: "Contacted",
    icon: MessageCircle,
    color: "text-[#0E733B]",
    bg: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  not_shortlisted: {
    label: "Not Shortlisted",
    icon: XCircle,
    color: "text-slate-500",
    bg: "bg-slate-100",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)} week${Math.floor(d / 7) !== 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── School initials avatar ─────────────────────────────────────────────────────
function SchoolAvatar({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  const COLORS = [
    "from-blue-500 to-blue-700", "from-violet-500 to-purple-700",
    "from-emerald-500 to-teal-700", "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-700", "from-cyan-500 to-sky-700",
    "from-indigo-500 to-indigo-700", "from-[#0E733B] to-[#065F28]",
  ];
  const grad = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="text-white font-bold text-[14px] tracking-tight select-none">{initials}</span>
    </div>
  );
}

// ── Stat filter sidebar item ───────────────────────────────────────────────────
function FilterItem({
  kind, label, count, active, onClick,
}: {
  kind: ActivityKind;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 w-full text-left py-2 group"
    >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
        active ? "border-[#0E733B] bg-[#0E733B]" : "border-slate-300 group-hover:border-slate-400"
      }`}>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className={`text-[13.5px] transition-colors ${active ? "font-bold text-charcoal" : "text-slate-600 group-hover:text-charcoal"}`}>
        {label} <span className="text-slate-400 font-normal">({count})</span>
      </span>
    </button>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyActivity({ filter }: { filter: ActivityKind | "all" }) {
  const msgs: Record<string, { title: string; body: string }> = {
    all:            { title: "No activity from schools yet!", body: "When a school views or contacts you, it will appear here." },
    viewed:         { title: "No schools have viewed your profile yet", body: "Complete your profile and apply to jobs to get noticed by schools." },
    contacted:      { title: "No schools have contacted you yet", body: "Schools will reach out here when they're interested in your profile." },
    not_shortlisted:{ title: "No rejections here", body: "Schools that pass on your application will show up here." },
  };
  const { title, body } = msgs[filter] ?? msgs.all;
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-8 text-center">
      {/* Briefcase SVG illustration */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5 opacity-80">
        <ellipse cx="40" cy="72" rx="26" ry="4" fill="#E2E8F0" />
        <rect x="16" y="26" width="48" height="36" rx="5" fill="#CBD5E1" />
        <rect x="18" y="28" width="44" height="32" rx="4" fill="#E2E8F0" />
        <path d="M30 26V22a2 2 0 012-2h16a2 2 0 012 2v4" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="34" y="38" width="12" height="8" rx="2" fill="#94A3B8" />
        {/* Green checkmark badge */}
        <circle cx="58" cy="56" r="12" fill="#0E733B" />
        <path d="M53 56l3.5 3.5L63 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="font-display font-bold text-[17px] text-charcoal mb-2">{title}</h3>
      <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-xs">{body}</p>
      {filter === "all" && (
        <Link
          href="/recruitment/jobs"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm transition-all"
        >
          Browse jobs <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ── Activity card ──────────────────────────────────────────────────────────────
function ActivityCard({ item }: { item: ActivityItem }) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  return (
    <div className="bg-white border border-line rounded-2xl p-5 hover:shadow-md hover:border-slate-200 transition-all">
      <div className="flex items-start gap-4">
        <SchoolAvatar name={item.institutionName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="font-display font-bold text-[15px] text-charcoal leading-tight">{item.institutionName}</p>
              {(item.institutionCity || item.institutionState) && (
                <p className="flex items-center gap-1 text-[12.5px] text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {[item.institutionCity, item.institutionState].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <span className={`shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full border ${meta.badge}`}>
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {meta.label}
            </span>
          </div>

          {item.roleTitle && (
            <p className="text-[13px] text-slate-600 mt-2">
              <span className="text-slate-400">For:</span> {item.roleTitle}
            </p>
          )}

          {item.message && item.kind === "contacted" && (
            <div className="mt-2.5 px-3.5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-[13px] text-emerald-900 leading-relaxed">&ldquo;{item.message}&rdquo;</p>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-2.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-[12px] text-slate-400">{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Promo sidebar card ─────────────────────────────────────────────────────────
function PromoCard() {
  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-line">
        <p className="font-display font-bold text-[14.5px] text-charcoal">Got placed?</p>
      </div>
      <div className="px-5 py-5 text-center">
        {/* school + star SVG */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
          <rect x="10" y="28" width="44" height="28" rx="3" fill="#CBD5E1" />
          <rect x="12" y="30" width="40" height="24" rx="2" fill="#E2E8F0" />
          <rect x="26" y="40" width="12" height="14" rx="1.5" fill="#94A3B8" />
          <polygon points="32,8 36,20 48,20 38,28 42,40 32,32 22,40 26,28 16,20 28,20" fill="#F59E0B" opacity="0.9" />
        </svg>
        <p className="text-[12.5px] text-slate-600 leading-relaxed mb-4">
          Let us know if a school hired you through EduBeacon — we&apos;d love to celebrate your new role!
        </p>
        <Link
          href="/recruitment/jobs"
          className="block w-full py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] transition-colors text-center"
        >
          Explore more jobs »
        </Link>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function TeacherActivity({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityKind | "all">("all");

  const load = useCallback(async () => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/activity/mine`, { headers });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items ?? []);
      }
    } catch { /* silent — endpoint may not exist yet */ }
    finally { setLoading(false); }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const counts: Record<ActivityKind, number> = {
    viewed:          items.filter((i) => i.kind === "viewed").length,
    contacted:       items.filter((i) => i.kind === "contacted").length,
    not_shortlisted: items.filter((i) => i.kind === "not_shortlisted").length,
  };

  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">Activity</h1>
        <p className="text-[13.5px] text-slate-500 mt-1">See how schools are engaging with your profile.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
          <span className="ml-3 text-[14px] text-slate-500">Loading activity…</span>
        </div>
      ) : (
        <div className="flex gap-5 items-start flex-col lg:flex-row">

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="lg:w-60 shrink-0 space-y-4">

            {/* Filter by status */}
            <div className="bg-white border border-line rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-line">
                <p className="font-display font-bold text-[14.5px] text-charcoal">Filter by status</p>
              </div>
              <div className="px-5 py-4 space-y-0.5">
                <FilterItem
                  kind="viewed"
                  label="Viewed"
                  count={counts.viewed}
                  active={filter === "viewed"}
                  onClick={() => setFilter(filter === "viewed" ? "all" : "viewed")}
                />
                <FilterItem
                  kind="contacted"
                  label="Contacted"
                  count={counts.contacted}
                  active={filter === "contacted"}
                  onClick={() => setFilter(filter === "contacted" ? "all" : "contacted")}
                />
                <FilterItem
                  kind="not_shortlisted"
                  label="Not Shortlisted"
                  count={counts.not_shortlisted}
                  active={filter === "not_shortlisted"}
                  onClick={() => setFilter(filter === "not_shortlisted" ? "all" : "not_shortlisted")}
                />
              </div>
            </div>

            <PromoCard />
          </aside>

          {/* ── Main feed ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {visible.length === 0 ? (
              <div className="bg-white border border-line rounded-2xl min-h-[400px] flex flex-col">
                <EmptyActivity filter={filter} />
              </div>
            ) : (
              <>
                {/* Summary bar */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <p className="text-[13px] text-slate-500">
                    <span className="font-bold text-charcoal">{visible.length}</span>{" "}
                    {filter === "all" ? "total" : KIND_META[filter].label.toLowerCase()} activit{visible.length !== 1 ? "ies" : "y"}
                  </p>
                  {filter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="text-[12.5px] text-[#0E733B] hover:underline underline-offset-2 font-semibold"
                    >
                      Show all
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {visible.map((item) => (
                    <ActivityCard key={item._id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
