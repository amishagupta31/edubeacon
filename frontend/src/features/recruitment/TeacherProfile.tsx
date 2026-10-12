"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Trash2, Loader2, CheckCircle2, AlertTriangle,
  Link as LinkIcon, Pencil, X, Check,
  GraduationCap, Briefcase, Award, BookOpen, FileText, User,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";

interface Qualification { degree: string; institution: string; year: string; }
interface Experience { school: string; role: string; from: string; to: string; }
interface Achievement { title: string; issuer: string; year: string; description: string; }

interface ProfileData {
  fullName: string;
  phone: string;
  bio: string;
  resumeUrl: string;
  ctetStatus: string;
  stetStatus: string;
  currentCTC: number | null;
  expectedCTC: null | number;
  availableFrom: string;
  subjectSpecialisations: string[];
  preferredCities: string[];
  qualifications: Qualification[];
  experience: Experience[];
  achievements: Achievement[];
}

const EMPTY: ProfileData = {
  fullName: "", phone: "", bio: "", resumeUrl: "",
  ctetStatus: "", stetStatus: "",
  currentCTC: null, expectedCTC: null, availableFrom: "",
  subjectSpecialisations: [], preferredCities: [],
  qualifications: [], experience: [], achievements: [],
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const inp =
  "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-charcoal bg-white " +
  "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all placeholder:text-slate-400";
const lbl = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

// ── Helpers ────────────────────────────────────────────────────────────────────
function completeness(f: ProfileData): number {
  const checks = [
    !!f.fullName.trim(),
    !!f.phone.trim(),
    !!f.bio.trim(),
    f.subjectSpecialisations.length > 0,
    f.preferredCities.length > 0,
    !!f.ctetStatus,
    f.qualifications.length > 0,
    f.experience.length > 0,
    !!f.resumeUrl.trim(),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function InitialsAvatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0E733B] to-[#10B981] flex items-center justify-center shrink-0 shadow-md">
      <span className="text-white font-bold text-[22px] tracking-tight select-none">
        {initials.toUpperCase() || "?"}
      </span>
    </div>
  );
}

// ── Tag chip input ─────────────────────────────────────────────────────────────
function TagInput({
  tags, onAdd, onRemove, placeholder, colorClass,
}: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
  colorClass?: string;
}) {
  const [val, setVal] = useState("");
  const add = () => { if (val.trim()) { onAdd(val.trim()); setVal(""); } };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2.5">
        {tags.map((t, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1 rounded-full border ${colorClass ?? "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
            {t}
            <button type="button" onClick={() => onRemove(i)} className="hover:opacity-60 transition-opacity leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inp} flex-1`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-[#0E733B] text-white hover:bg-[#0B5C2F] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({
  title, onEdit, children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h3 className="font-display font-bold text-[15.5px] text-charcoal">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0E733B] hover:text-[#0B5C2F] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ── Edit footer ────────────────────────────────────────────────────────────────
function EditFooter({
  onSave, onCancel, saving,
}: {
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-line mt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm transition-all disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        {saving ? "Saving…" : "Save"}
      </button>
      <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-line text-[13.5px] font-bold text-charcoal hover:bg-slate-50 transition-colors">
        Cancel
      </button>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function Empty({ label, onAdd }: { label: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <p className="text-[13px] text-slate-400 italic">{label}</p>
      {onAdd && (
        <button type="button" onClick={onAdd} className="text-[12.5px] font-bold text-[#0E733B] hover:underline underline-offset-2 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      )}
    </div>
  );
}

// ── Sidebar checklist item ─────────────────────────────────────────────────────
const TODAY = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function SidebarItem({
  icon: Icon, label, done, onEdit,
}: {
  icon: React.ElementType;
  label: string;
  done: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2 group cursor-default" onClick={onEdit}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-[#0E733B]" : "border-2 border-slate-300"}`}>
        {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <div className="min-w-0 flex-1">
        <span className={`text-[13px] font-semibold block leading-snug ${done ? "text-charcoal group-hover:text-[#0E733B]" : "text-slate-500"} transition-colors`}>{label}</span>
        <span className="text-[11px] text-slate-400">{done ? `Last updated: ${TODAY}` : "Not added"}</span>
      </div>
    </div>
  );
}

// ── CTC formatter ──────────────────────────────────────────────────────────────
function ctcLabel(n: number | null) {
  if (!n) return null;
  return `₹${n.toLocaleString("en-IN")} / month`;
}

// ── Main component ─────────────────────────────────────────────────────────────
type Section = "basic" | "skills" | "preferences" | "qualifications" | "experience" | "resume" | "achievements";

export default function TeacherProfile({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  const [form, setForm] = useState<ProfileData>(EMPTY);
  const [draft, setDraft] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/me`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        const p: ProfileData = {
          fullName: data.fullName || "",
          phone: data.phone || "",
          bio: data.bio || "",
          resumeUrl: data.resumeUrl || "",
          ctetStatus: data.ctetStatus || "",
          stetStatus: data.stetStatus || "",
          currentCTC: data.currentCTC ?? null,
          expectedCTC: data.expectedCTC ?? null,
          availableFrom: data.availableFrom ? data.availableFrom.split("T")[0] : "",
          subjectSpecialisations: data.subjectSpecialisations || [],
          preferredCities: data.preferredCities || [],
          qualifications: data.qualifications || [],
          experience: data.experience || [],
          achievements: data.achievements || [],
        };
        setForm(p);
        setDraft(p);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (s: Section) => {
    setDraft({ ...form });
    setEditing(s);
    setError(null);
  };

  const cancelEdit = () => { setEditing(null); setError(null); };

  const saveSection = async () => {
    setSaving(true); setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/profile/teacher`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Could not save"); }
      setForm({ ...draft });
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const setD = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) =>
    setDraft((prev) => ({ ...prev, [k]: v }));

  const addQual = () => setDraft((p) => ({ ...p, qualifications: [...p.qualifications, { degree: "", institution: "", year: "" }] }));
  const removeQual = (i: number) => setDraft((p) => ({ ...p, qualifications: p.qualifications.filter((_, idx) => idx !== i) }));
  const updateQual = (i: number, field: keyof Qualification, val: string) =>
    setDraft((p) => ({ ...p, qualifications: p.qualifications.map((q, idx) => idx === i ? { ...q, [field]: val } : q) }));

  const addExp = () => setDraft((p) => ({ ...p, experience: [...p.experience, { school: "", role: "", from: "", to: "" }] }));
  const removeExp = (i: number) => setDraft((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i: number, field: keyof Experience, val: string) =>
    setDraft((p) => ({ ...p, experience: p.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  const addAchv = () => setDraft((p) => ({ ...p, achievements: [...p.achievements, { title: "", issuer: "", year: "", description: "" }] }));
  const removeAchv = (i: number) => setDraft((p) => ({ ...p, achievements: p.achievements.filter((_, idx) => idx !== i) }));
  const updateAchv = (i: number, key: keyof Achievement, val: string) =>
    setDraft((p) => ({ ...p, achievements: p.achievements.map((a, idx) => idx === i ? { ...a, [key]: val } : a) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        <span className="ml-3 text-[14px] text-slate-500">Loading profile…</span>
      </div>
    );
  }

  const pct = completeness(form);
  const isEditing = (s: Section) => editing === s;

  const CTET_MAP: Record<string, string> = {
    cleared: "Cleared", not_cleared: "Not cleared", not_applicable: "Not applicable",
  };

  return (
    <div className="w-full">
      {/* Top banner */}
      {pct < 100 && (
        <div className="mb-4 bg-[#142035] rounded-2xl px-5 py-3 flex items-center justify-between gap-3">
          <p className="text-[13px] text-white/80 font-medium">Keep your profile updated for best results!</p>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#0E733B] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[12px] font-bold text-white">{pct}%</span>
          </div>
        </div>
      )}

      <div className="flex gap-5 items-start flex-col lg:flex-row">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="lg:w-[260px] shrink-0 space-y-3">

          {/* Avatar + name + bar */}
          <div className="bg-white border border-line rounded-2xl p-5">
            <div className="flex justify-center mb-3">
              <InitialsAvatar name={form.fullName || "You"} />
            </div>
            <p className="font-display font-bold text-[17px] text-charcoal text-center">
              {form.fullName || "Your name"}
            </p>
            {form.phone && <p className="text-[12.5px] text-slate-500 mt-0.5 text-center">{form.phone}</p>}

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-semibold text-slate-500">Profile strength</span>
                <span className="text-[13px] font-bold" style={{ color: pct >= 80 ? "#0E733B" : "#F59E0B" }}>{pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 80 ? "#0E733B" : pct >= 50 ? "#10B981" : "#F59E0B",
                  }}
                />
              </div>
            </div>

            {pct < 80 && (
              <p className="text-[12px] text-[#0E733B] font-semibold mt-3 text-center cursor-pointer hover:underline underline-offset-2"
                onClick={() => startEdit("basic")}>
                Update your profile type
              </p>
            )}
          </div>

          {/* Checklist */}
          <div className="bg-white border border-line rounded-2xl p-4 divide-y divide-slate-100">
            <SidebarItem icon={User}          label="Job Preferences"  done={!!form.ctetStatus || !!form.expectedCTC} onEdit={() => startEdit("preferences")} />
            <SidebarItem icon={BookOpen}      label="Skills"           done={form.subjectSpecialisations.length > 0}   onEdit={() => startEdit("skills")} />
            <SidebarItem icon={Briefcase}     label="Experience"       done={form.experience.length > 0}                onEdit={() => startEdit("experience")} />
            <SidebarItem icon={GraduationCap} label="Education"        done={form.qualifications.length > 0}            onEdit={() => startEdit("qualifications")} />
            <SidebarItem icon={Award}         label="Achievements"     done={form.achievements.length > 0}              onEdit={() => startEdit("achievements")} />
            <SidebarItem icon={FileText}      label="Resume"           done={!!form.resumeUrl}                          onEdit={() => startEdit("resume")} />
            <SidebarItem icon={User}          label="Basic info"       done={!!form.fullName && !!form.phone}           onEdit={() => startEdit("basic")} />
          </div>

          {/* Discover matching opportunities promo card */}
          <div className="bg-white border border-line rounded-2xl p-4 overflow-hidden">
            <p className="font-display font-bold text-[14px] text-charcoal mb-2">Discover matching opportunities</p>
            {/* Building illustration */}
            <div className="flex justify-center my-3">
              <svg viewBox="0 0 120 80" className="w-28 h-auto" fill="none">
                {/* Ground */}
                <ellipse cx="60" cy="72" rx="48" ry="5" fill="#E9F5EE" />
                {/* Building */}
                <rect x="30" y="28" width="50" height="44" rx="3" fill="#0E733B" opacity="0.15" />
                <rect x="33" y="31" width="44" height="41" rx="2" fill="#0E733B" opacity="0.25" />
                {/* Windows */}
                {[0,1,2].map(col => [0,1,2].map(row => (
                  <rect key={`${col}-${row}`} x={38 + col*13} y={36 + row*11} width="8" height="7" rx="1"
                    fill={row === 0 && col === 1 ? "#0E733B" : "#fff"} opacity={row === 0 && col === 1 ? 0.9 : 0.6} />
                )))}
                {/* Door */}
                <rect x="52" y="55" width="12" height="14" rx="2" fill="#0E733B" opacity="0.4" />
                {/* Briefcase */}
                <rect x="72" y="48" width="24" height="18" rx="3" fill="#F59E0B" />
                <path d="M77 48v-4a4 4 0 018 0v4" stroke="#d97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <line x1="72" y1="57" x2="96" y2="57" stroke="#d97706" strokeWidth="1.5" />
                {/* Location pin */}
                <circle cx="84" cy="38" r="6" fill="#EF4444" opacity="0.8" />
                <circle cx="84" cy="38" r="2.5" fill="white" />
                <path d="M84 44 L84 47" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              </svg>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-3 text-center">
              Just select companies you&apos;re interested in to share your profile with them!
            </p>
            <Link
              href="/recruitment/jobs"
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] transition-colors shadow-sm"
            >
              View jobs now »
            </Link>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-800">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── Basic info ── */}
          <Section title="Basic information" onEdit={editing ? undefined : () => startEdit("basic")}>
            {!isEditing("basic") ? (
              <div className="space-y-2.5">
                {form.fullName ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-24 shrink-0">Full name</span>
                    <span className="text-[13.5px] font-semibold text-charcoal">{form.fullName}</span>
                  </div>
                ) : null}
                {form.phone ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-24 shrink-0">Phone</span>
                    <span className="text-[13.5px] text-charcoal">{form.phone}</span>
                  </div>
                ) : null}
                {form.bio ? (
                  <div className="flex gap-3 mt-1">
                    <span className="text-[12px] text-slate-400 w-24 shrink-0 mt-0.5">Bio</span>
                    <p className="text-[13.5px] text-charcoal leading-relaxed">{form.bio}</p>
                  </div>
                ) : null}
                {!form.fullName && !form.phone && !form.bio && (
                  <Empty label="No basic info yet." />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={lbl}>Full name</label>
                  <input className={inp} value={draft.fullName} onChange={(e) => setD("fullName", e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input className={inp} type="tel" inputMode="numeric" maxLength={10}
                    value={draft.phone}
                    onChange={(e) => setD("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile" />
                </div>
                <div>
                  <label className={lbl}>Professional summary</label>
                  <textarea rows={3} className={`${inp} resize-none`} value={draft.bio}
                    onChange={(e) => setD("bio", e.target.value)}
                    placeholder="Brief summary of your teaching philosophy, strengths and goals…" />
                </div>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Subjects & Skills ── */}
          <Section title="Subjects & Skills" onEdit={editing ? undefined : () => startEdit("skills")}>
            {!isEditing("skills") ? (
              <div className="space-y-3">
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-400 mb-2">Subject specialisations</p>
                  {form.subjectSpecialisations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {form.subjectSpecialisations.map((s, i) => (
                        <span key={i} className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12.5px] font-semibold px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  ) : <p className="text-[13px] text-slate-400 italic">None added</p>}
                </div>
                {form.preferredCities.length > 0 && (
                  <div>
                    <p className="text-[11.5px] font-semibold text-slate-400 mb-2">Preferred cities</p>
                    <div className="flex flex-wrap gap-2">
                      {form.preferredCities.map((c, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-[12.5px] font-semibold px-3 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {form.subjectSpecialisations.length === 0 && form.preferredCities.length === 0 && (
                  <Empty label="No subjects or cities added yet." />
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className={lbl}>Subject specialisations</label>
                  <TagInput
                    tags={draft.subjectSpecialisations}
                    onAdd={(t) => setDraft((p) => ({ ...p, subjectSpecialisations: [...p.subjectSpecialisations, t] }))}
                    onRemove={(i) => setDraft((p) => ({ ...p, subjectSpecialisations: p.subjectSpecialisations.filter((_, idx) => idx !== i) }))}
                    placeholder="e.g. Physics, Mathematics…"
                  />
                </div>
                <div>
                  <label className={lbl}>Preferred cities</label>
                  <TagInput
                    tags={draft.preferredCities}
                    onAdd={(t) => setDraft((p) => ({ ...p, preferredCities: [...p.preferredCities, t] }))}
                    onRemove={(i) => setDraft((p) => ({ ...p, preferredCities: p.preferredCities.filter((_, idx) => idx !== i) }))}
                    placeholder="e.g. Delhi, Mumbai…"
                    colorClass="bg-slate-100 border-slate-200 text-slate-700"
                  />
                </div>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Job Preferences ── */}
          <Section title="Job Preferences" onEdit={editing ? undefined : () => startEdit("preferences")}>
            {!isEditing("preferences") ? (
              <div className="space-y-2.5">
                {form.ctetStatus && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-32 shrink-0">CTET status</span>
                    <span className="text-[13.5px] text-charcoal font-semibold">{CTET_MAP[form.ctetStatus] ?? form.ctetStatus}</span>
                  </div>
                )}
                {form.stetStatus && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-32 shrink-0">State TET</span>
                    <span className="text-[13.5px] text-charcoal">{form.stetStatus}</span>
                  </div>
                )}
                {form.availableFrom && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-32 shrink-0">Available from</span>
                    <span className="text-[13.5px] text-charcoal">
                      {new Date(form.availableFrom).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                )}
                {form.currentCTC != null && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-32 shrink-0">Current CTC</span>
                    <span className="text-[13.5px] text-charcoal">{ctcLabel(form.currentCTC)}</span>
                  </div>
                )}
                {form.expectedCTC != null && (
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] text-slate-400 w-32 shrink-0">Expected CTC</span>
                    <span className="text-[13.5px] font-semibold text-[#0E733B]">{ctcLabel(form.expectedCTC)}</span>
                  </div>
                )}
                {!form.ctetStatus && !form.stetStatus && !form.availableFrom && !form.currentCTC && !form.expectedCTC && (
                  <Empty label="No job preferences set yet." />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>CTET status</label>
                    <select className={`${inp} cursor-pointer`} value={draft.ctetStatus} onChange={(e) => setD("ctetStatus", e.target.value)}>
                      <option value="">— Select —</option>
                      <option value="cleared">Cleared</option>
                      <option value="not_cleared">Not cleared</option>
                      <option value="not_applicable">Not applicable</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>STET / State TET</label>
                    <input className={inp} value={draft.stetStatus} onChange={(e) => setD("stetStatus", e.target.value)} placeholder="e.g. UPTET cleared" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Available from</label>
                  <input type="date" className={`${inp} cursor-pointer`} value={draft.availableFrom} onChange={(e) => setD("availableFrom", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Current CTC (₹/month)</label>
                    <input type="number" className={inp} value={draft.currentCTC ?? ""}
                      onChange={(e) => setD("currentCTC", e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g. 55000" />
                  </div>
                  <div>
                    <label className={lbl}>Expected CTC (₹/month)</label>
                    <input type="number" className={inp} value={draft.expectedCTC ?? ""}
                      onChange={(e) => setD("expectedCTC", e.target.value ? Number(e.target.value) : null)}
                      placeholder="e.g. 70000" />
                  </div>
                </div>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Qualifications ── */}
          <Section title="Qualifications" onEdit={editing ? undefined : () => startEdit("qualifications")}>
            {!isEditing("qualifications") ? (
              form.qualifications.length > 0 ? (
                <div className="space-y-3">
                  {form.qualifications.map((q, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4 text-[#0E733B]" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="font-semibold text-[13.5px] text-charcoal">{q.degree || "—"}</p>
                        <p className="text-[12.5px] text-slate-500">{q.institution}{q.year ? ` · ${q.year}` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty label="No qualifications added yet." />
              )
            ) : (
              <div>
                {draft.qualifications.length === 0 ? (
                  <p className="text-[13px] text-slate-400 italic mb-3">No qualifications yet.</p>
                ) : (
                  <div className="space-y-3 mb-3">
                    {draft.qualifications.map((q, i) => (
                      <div key={i} className="border border-line rounded-xl p-4 bg-slate-50/50 relative">
                        <button type="button" onClick={() => removeQual(i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid sm:grid-cols-[1fr_1fr_80px] gap-3">
                          <div>
                            <label className={lbl}>Degree</label>
                            <input className={inp} value={q.degree} onChange={(e) => updateQual(i, "degree", e.target.value)} placeholder="e.g. B.Ed, M.Sc Physics" />
                          </div>
                          <div>
                            <label className={lbl}>Institution</label>
                            <input className={inp} value={q.institution} onChange={(e) => updateQual(i, "institution", e.target.value)} placeholder="University / college" />
                          </div>
                          <div>
                            <label className={lbl}>Year</label>
                            <input className={inp} value={q.year} onChange={(e) => updateQual(i, "year", e.target.value)} placeholder="2020" maxLength={4} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={addQual} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0E733B] hover:underline underline-offset-2 mb-1">
                  <Plus className="w-3.5 h-3.5" /> Add another degree
                </button>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Work Experience ── */}
          <Section title="Work Experience" onEdit={editing ? undefined : () => startEdit("experience")}>
            {!isEditing("experience") ? (
              form.experience.length > 0 ? (
                <div className="space-y-4">
                  {form.experience.map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase className="w-4 h-4 text-slate-500" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="font-semibold text-[13.5px] text-charcoal">{e.role || "—"}</p>
                        <p className="text-[12.5px] text-slate-500">{e.school}</p>
                        {(e.from || e.to) && (
                          <p className="text-[12px] text-slate-400 mt-0.5">{e.from}{e.from && e.to ? " – " : ""}{e.to}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty label="No work experience added yet." />
              )
            ) : (
              <div>
                {draft.experience.length === 0 ? (
                  <p className="text-[13px] text-slate-400 italic mb-3">No experience yet.</p>
                ) : (
                  <div className="space-y-3 mb-3">
                    {draft.experience.map((e, i) => (
                      <div key={i} className="border border-line rounded-xl p-4 bg-slate-50/50 relative">
                        <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className={lbl}>School / institution</label>
                            <input className={inp} value={e.school} onChange={(ev) => updateExp(i, "school", ev.target.value)} placeholder="School name" />
                          </div>
                          <div>
                            <label className={lbl}>Role</label>
                            <input className={inp} value={e.role} onChange={(ev) => updateExp(i, "role", ev.target.value)} placeholder="e.g. PGT Physics" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={lbl}>From</label>
                            <input className={inp} value={e.from} onChange={(ev) => updateExp(i, "from", ev.target.value)} placeholder="e.g. Jun 2020" />
                          </div>
                          <div>
                            <label className={lbl}>To</label>
                            <input className={inp} value={e.to} onChange={(ev) => updateExp(i, "to", ev.target.value)} placeholder="e.g. Mar 2024 or Present" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={addExp} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0E733B] hover:underline underline-offset-2 mb-1">
                  <Plus className="w-3.5 h-3.5" /> Add another role
                </button>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Resume ── */}
          <Section title="Resume" onEdit={editing ? undefined : () => startEdit("resume")}>
            {!isEditing("resume") ? (
              form.resumeUrl ? (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-3 bg-slate-50 border border-line rounded-xl hover:border-[#0E733B] hover:bg-emerald-50/40 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-500" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[13.5px] text-[#0E733B] group-hover:underline truncate">View resume PDF</p>
                    <p className="text-[11.5px] text-slate-400 truncate">{form.resumeUrl}</p>
                  </div>
                </a>
              ) : (
                <Empty label="No resume link added yet." />
              )
            ) : (
              <div>
                <label className={lbl}>Resume PDF link</label>
                <div className="relative mb-1.5">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    className={`${inp} pl-9`}
                    value={draft.resumeUrl}
                    onChange={(e) => setD("resumeUrl", e.target.value)}
                    placeholder="Google Drive PDF link, Dropbox, or any direct PDF URL…"
                  />
                </div>
                <p className="text-[11.5px] text-slate-400 leading-relaxed mb-3">Upload to Google Drive, set sharing to "Anyone with link", and paste the URL here.</p>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

          {/* ── Achievements ── */}
          <Section title="Achievements & Honours" onEdit={editing ? undefined : () => startEdit("achievements")}>
            {!isEditing("achievements") ? (
              form.achievements.length > 0 ? (
                <div className="space-y-3">
                  {form.achievements.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4 text-amber-600" strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="font-semibold text-[13.5px] text-charcoal">{a.title || "—"}</p>
                        <p className="text-[12.5px] text-slate-500">{a.issuer}{a.year ? ` · ${a.year}` : ""}</p>
                        {a.description && <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{a.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty label="No achievements added. Awards, recognitions or certifications help you stand out." />
              )
            ) : (
              <div>
                {draft.achievements.length === 0 ? (
                  <p className="text-[13px] text-slate-400 italic mb-3">No achievements yet.</p>
                ) : (
                  <div className="space-y-3 mb-3">
                    {draft.achievements.map((a, i) => (
                      <div key={i} className="border border-line rounded-xl p-4 bg-slate-50/50 relative">
                        <button type="button" onClick={() => removeAchv(i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid sm:grid-cols-[1fr_1fr_80px] gap-3 mb-3">
                          <div>
                            <label className={lbl}>Title</label>
                            <input className={inp} value={a.title} onChange={(e) => updateAchv(i, "title", e.target.value)} placeholder="e.g. Best Teacher Award" />
                          </div>
                          <div>
                            <label className={lbl}>Issuer / organisation</label>
                            <input className={inp} value={a.issuer} onChange={(e) => updateAchv(i, "issuer", e.target.value)} placeholder="e.g. CBSE" />
                          </div>
                          <div>
                            <label className={lbl}>Year</label>
                            <input className={inp} value={a.year} onChange={(e) => updateAchv(i, "year", e.target.value)} placeholder="2023" maxLength={4} />
                          </div>
                        </div>
                        <div>
                          <label className={lbl}>Description <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span></label>
                          <textarea rows={2} className={`${inp} resize-none`} value={a.description} onChange={(e) => updateAchv(i, "description", e.target.value)} placeholder="Brief description…" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={addAchv} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0E733B] hover:underline underline-offset-2 mb-1">
                  <Plus className="w-3.5 h-3.5" /> Add achievement
                </button>
                <EditFooter onSave={saveSection} onCancel={cancelEdit} saving={saving} />
              </div>
            )}
          </Section>

        </div>
      </div>
    </div>
  );
}
