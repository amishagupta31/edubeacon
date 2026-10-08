"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { API } from "./useRecruitmentProfile";

interface Qualification { degree: string; institution: string; year: string; }
interface Experience { school: string; role: string; from: string; to: string; }

interface ProfileData {
  fullName: string;
  phone: string;
  bio: string;
  ctetStatus: string;
  stetStatus: string;
  currentCTC: number | null;
  expectedCTC: number | null;
  availableFrom: string;
  subjectSpecialisations: string[];
  preferredCities: string[];
  qualifications: Qualification[];
  experience: Experience[];
}

const CTET_OPTIONS = [
  { value: "cleared", label: "Cleared" },
  { value: "not_cleared", label: "Not cleared" },
  { value: "not_applicable", label: "Not applicable" },
  { value: "", label: "—" },
];

const label = "block text-[11.5px] font-semibold text-slate-500 mb-1";
const field =
  "w-full border border-line rounded-lg px-3 py-2 text-[13px] text-charcoal bg-white " +
  "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";

export default function TeacherProfile({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  const [form, setForm] = useState<ProfileData>({
    fullName: "", phone: "", bio: "",
    ctetStatus: "", stetStatus: "",
    currentCTC: null, expectedCTC: null, availableFrom: "",
    subjectSpecialisations: [], preferredCities: [],
    qualifications: [], experience: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temp state for array fields
  const [newSubject, setNewSubject] = useState("");
  const [newCity, setNewCity] = useState("");

  const load = useCallback(async () => {
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/me`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          bio: data.bio || "",
          ctetStatus: data.ctetStatus || "",
          stetStatus: data.stetStatus || "",
          currentCTC: data.currentCTC ?? null,
          expectedCTC: data.expectedCTC ?? null,
          availableFrom: data.availableFrom ? data.availableFrom.split("T")[0] : "",
          subjectSpecialisations: data.subjectSpecialisations || [],
          preferredCities: data.preferredCities || [],
          qualifications: data.qualifications || [],
          experience: data.experience || [],
        });
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setError(null); setSaved(false);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/profile/teacher`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Could not save profile");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const addQual = () => setForm((p) => ({ ...p, qualifications: [...p.qualifications, { degree: "", institution: "", year: "" }] }));
  const removeQual = (i: number) => setForm((p) => ({ ...p, qualifications: p.qualifications.filter((_, idx) => idx !== i) }));
  const updateQual = (i: number, field: keyof Qualification, val: string) =>
    setForm((p) => ({ ...p, qualifications: p.qualifications.map((q, idx) => idx === i ? { ...q, [field]: val } : q) }));

  const addExp = () => setForm((p) => ({ ...p, experience: [...p.experience, { school: "", role: "", from: "", to: "" }] }));
  const removeExp = (i: number) => setForm((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i: number, field: keyof Experience, val: string) =>
    setForm((p) => ({ ...p, experience: p.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#0E733B] animate-spin" />
        <span className="ml-3 text-[14px] text-slate-500">Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="max-w-[820px]">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-[28px] text-charcoal leading-tight tracking-tight">My Profile</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">Schools use this to screen and score your application.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-800">{error}</div>
      )}

      <div className="space-y-5">

        {/* ── Basic info ── */}
        <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
          <h2 className="font-display font-bold text-[15px] text-charcoal mb-4">Basic information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Full name</label>
              <input className={field} value={form.fullName} onChange={f("fullName")} placeholder="Your full name" />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={field} value={form.phone} onChange={f("phone")} placeholder="10-digit mobile" />
            </div>
          </div>
          <div className="mt-4">
            <label className={label}>Bio / professional summary</label>
            <textarea
              rows={3}
              className={`${field} resize-none`}
              value={form.bio}
              onChange={f("bio")}
              placeholder="Brief summary of your teaching philosophy, strengths and goals…"
            />
          </div>
        </section>

        {/* ── Subjects & preferences ── */}
        <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
          <h2 className="font-display font-bold text-[15px] text-charcoal mb-4">Subjects & preferences</h2>

          <div className="mb-4">
            <label className={label}>Subject specialisations</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.subjectSpecialisations.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-[12.5px] font-semibold text-emerald-800 px-3 py-1 rounded-full">
                  {s}
                  <button onClick={() => setForm((p) => ({ ...p, subjectSpecialisations: p.subjectSpecialisations.filter((_, idx) => idx !== i) }))} className="hover:text-red-600 transition-colors">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={`${field} flex-1`}
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSubject.trim()) {
                    setForm((p) => ({ ...p, subjectSpecialisations: [...p.subjectSpecialisations, newSubject.trim()] }));
                    setNewSubject("");
                    e.preventDefault();
                  }
                }}
                placeholder="e.g. Physics, Mathematics…"
              />
              <button
                onClick={() => { if (newSubject.trim()) { setForm((p) => ({ ...p, subjectSpecialisations: [...p.subjectSpecialisations, newSubject.trim()] })); setNewSubject(""); } }}
                className="px-3 py-2 rounded-lg bg-[#0E733B] text-white hover:bg-[#0B5C2F] transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className={label}>Preferred cities</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.preferredCities.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-slate-100 text-[12.5px] font-semibold text-slate-700 px-3 py-1 rounded-full">
                  {c}
                  <button onClick={() => setForm((p) => ({ ...p, preferredCities: p.preferredCities.filter((_, idx) => idx !== i) }))} className="hover:text-red-600 transition-colors">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={`${field} flex-1`}
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCity.trim()) {
                    setForm((p) => ({ ...p, preferredCities: [...p.preferredCities, newCity.trim()] }));
                    setNewCity("");
                    e.preventDefault();
                  }
                }}
                placeholder="e.g. Delhi, Mumbai…"
              />
              <button
                onClick={() => { if (newCity.trim()) { setForm((p) => ({ ...p, preferredCities: [...p.preferredCities, newCity.trim()] })); setNewCity(""); } }}
                className="px-3 py-2 rounded-lg bg-[#0E733B] text-white hover:bg-[#0B5C2F] transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>CTET status</label>
              <select className={`${field} cursor-pointer`} value={form.ctetStatus} onChange={f("ctetStatus")}>
                {CTET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>STET / state TET</label>
              <input className={field} value={form.stetStatus} onChange={f("stetStatus")} placeholder="e.g. UPTET cleared" />
            </div>
            <div>
              <label className={label}>Available from</label>
              <input type="date" className={`${field} cursor-pointer`} value={form.availableFrom} onChange={f("availableFrom")} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={label}>Current CTC (₹/month)</label>
              <input
                type="number"
                className={field}
                value={form.currentCTC ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, currentCTC: e.target.value ? Number(e.target.value) : null }))}
                placeholder="e.g. 55000"
              />
            </div>
            <div>
              <label className={label}>Expected CTC (₹/month)</label>
              <input
                type="number"
                className={field}
                value={form.expectedCTC ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, expectedCTC: e.target.value ? Number(e.target.value) : null }))}
                placeholder="e.g. 70000"
              />
            </div>
          </div>
        </section>

        {/* ── Qualifications ── */}
        <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display font-bold text-[15px] text-charcoal">Qualifications</h2>
            <button onClick={addQual} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0E733B] hover:underline underline-offset-2">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {form.qualifications.length === 0 ? (
            <p className="text-[13px] text-slate-400 italic">No qualifications added yet.</p>
          ) : (
            <div className="space-y-3">
              {form.qualifications.map((q, i) => (
                <div key={i} className="grid sm:grid-cols-[1fr_1fr_80px_32px] gap-2 items-end">
                  <div>
                    {i === 0 && <label className={label}>Degree</label>}
                    <input className={field} value={q.degree} onChange={(e) => updateQual(i, "degree", e.target.value)} placeholder="e.g. B.Ed, M.Sc Physics" />
                  </div>
                  <div>
                    {i === 0 && <label className={label}>Institution</label>}
                    <input className={field} value={q.institution} onChange={(e) => updateQual(i, "institution", e.target.value)} placeholder="University / college" />
                  </div>
                  <div>
                    {i === 0 && <label className={label}>Year</label>}
                    <input className={field} value={q.year} onChange={(e) => updateQual(i, "year", e.target.value)} placeholder="2020" maxLength={4} />
                  </div>
                  <button onClick={() => removeQual(i)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors self-end">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Experience ── */}
        <section className="bg-white rounded-2xl border border-line shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-display font-bold text-[15px] text-charcoal">Work experience</h2>
            <button onClick={addExp} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0E733B] hover:underline underline-offset-2">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {form.experience.length === 0 ? (
            <p className="text-[13px] text-slate-400 italic">No experience added yet.</p>
          ) : (
            <div className="space-y-4">
              {form.experience.map((e, i) => (
                <div key={i} className="border border-line rounded-xl p-4 relative">
                  <button onClick={() => removeExp(i)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={label}>School / institution</label>
                      <input className={field} value={e.school} onChange={(ev) => updateExp(i, "school", ev.target.value)} placeholder="School name" />
                    </div>
                    <div>
                      <label className={label}>Role</label>
                      <input className={field} value={e.role} onChange={(ev) => updateExp(i, "role", ev.target.value)} placeholder="e.g. PGT Physics" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={label}>From</label>
                      <input className={field} value={e.from} onChange={(ev) => updateExp(i, "from", ev.target.value)} placeholder="e.g. Jun 2020" />
                    </div>
                    <div>
                      <label className={label}>To</label>
                      <input className={field} value={e.to} onChange={(ev) => updateExp(i, "to", ev.target.value)} placeholder="e.g. Mar 2024 or Present" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
