"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronRight, ChevronLeft, Check, Plus, Trash2,
  Loader2, Link as LinkIcon, User, BookOpen, Briefcase, GraduationCap, FileText,
} from "lucide-react";
import { API } from "@/features/recruitment/useRecruitmentProfile";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Qualification { degree: string; institution: string; year: string; }
interface Experience { school: string; role: string; from: string; to: string; }

interface WizardData {
  fullName: string;
  phone: string;
  bio: string;
  subjectSpecialisations: string[];
  preferredCities: string[];
  ctetStatus: string;
  stetStatus: string;
  availableFrom: string;
  currentCTC: number | null;
  expectedCTC: number | null;
  qualifications: Qualification[];
  experience: Experience[];
  resumeUrl: string;
}

// ── Step definitions ───────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Personal Info",      desc: "Your name, phone & about you",     icon: User },
  { id: 2, title: "Subjects & Skills",  desc: "What you teach",                   icon: BookOpen },
  { id: 3, title: "Job Preferences",    desc: "What you're looking for",           icon: Briefcase },
  { id: 4, title: "Qualifications",     desc: "Your degrees & certifications",     icon: GraduationCap },
  { id: 5, title: "Experience & Resume",desc: "Work history & CV link",            icon: FileText },
];

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] text-charcoal bg-white " +
  "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all placeholder:text-slate-400";
const labelCls = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center mb-8 px-2">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center">
            {/* Circle */}
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-bold transition-all shrink-0 ${
              done    ? "bg-[#0E733B] text-white shadow-sm"
              : active? "bg-[#0E733B] text-white ring-4 ring-[#0E733B]/20 shadow"
              :         "bg-white border-2 border-slate-200 text-slate-400"
            }`}>
              {done ? <Check className="w-4 h-4" strokeWidth={2.5} /> : n}
            </div>
            {/* Connector */}
            {n < total && (
              <div className={`w-10 sm:w-14 h-0.5 mx-1 transition-all ${n < current ? "bg-[#0E733B]" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step label strip ───────────────────────────────────────────────────────────
function StepLabel({ step }: { step: typeof STEPS[0] }) {
  const Icon = step.icon;
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.8} />
      </div>
      <div>
        <h2 className="font-display font-bold text-[18px] text-charcoal leading-tight">{step.title}</h2>
        <p className="text-[12.5px] text-slate-500 mt-0.5">{step.desc}</p>
      </div>
    </div>
  );
}

// ── Tag chip input ─────────────────────────────────────────────────────────────
function TagInput({
  tags, onAdd, onRemove, placeholder, colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800",
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
      <div className="flex flex-wrap gap-2 mb-2.5 min-h-[32px]">
        {tags.map((t, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 border text-[12.5px] font-semibold px-3 py-1 rounded-full ${colorClass}`}>
            {t}
            <button type="button" onClick={() => onRemove(i)} className="hover:opacity-60 transition-opacity leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inputCls} flex-1`}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 rounded-xl bg-[#0E733B] text-white hover:bg-[#0B5C2F] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [authReady, setAuthReady] = useState(false);

  const [form, setForm] = useState<WizardData>({
    fullName: "",
    phone: "",
    bio: "",
    subjectSpecialisations: [],
    preferredCities: [],
    ctetStatus: "",
    stetStatus: "",
    availableFrom: "",
    currentCTC: null,
    expectedCTC: null,
    qualifications: [],
    experience: [],
    resumeUrl: "",
  });

  // Prefill from existing profile
  const prefill = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/recruitment/me`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Non-teachers don't belong here
        if (data?.accountType && data.accountType !== "TEACHER") {
          router.replace("/recruitment");
          return;
        }
        setForm((prev) => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          phone: data.phone || prev.phone,
          bio: data.bio || prev.bio,
          subjectSpecialisations: data.subjectSpecialisations?.length ? data.subjectSpecialisations : prev.subjectSpecialisations,
          preferredCities: data.preferredCities?.length ? data.preferredCities : prev.preferredCities,
          ctetStatus: data.ctetStatus || prev.ctetStatus,
          stetStatus: data.stetStatus || prev.stetStatus,
          availableFrom: data.availableFrom ? data.availableFrom.split("T")[0] : prev.availableFrom,
          currentCTC: data.currentCTC ?? prev.currentCTC,
          expectedCTC: data.expectedCTC ?? prev.expectedCTC,
          qualifications: data.qualifications?.length ? data.qualifications : prev.qualifications,
          experience: data.experience?.length ? data.experience : prev.experience,
          resumeUrl: data.resumeUrl || prev.resumeUrl,
        }));
      }
    } catch { /* silent */ }
    finally { setAuthReady(true); }
  }, [isSignedIn, getToken, router]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.replace("/recruitment/register"); return; }
    prefill();
  }, [isLoaded, isSignedIn, prefill, router]);

  const save = useCallback(async (quiet = false) => {
    if (!isSignedIn) return;
    if (!quiet) setSaving(true);
    setErr("");
    try {
      const token = await getToken();
      await fetch(`${API}/api/recruitment/profile/teacher`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token ?? ""}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* silent */ }
    if (!quiet) setSaving(false);
  }, [isSignedIn, getToken, form]);

  const next = async () => {
    setErr("");
    if (step === 1 && !form.fullName.trim()) { setErr("Please enter your full name to continue."); return; }
    await save(true);
    if (step < STEPS.length) setStep((s) => s + 1);
  };

  const back = () => { setErr(""); setStep((s) => Math.max(s - 1, 1)); };

  const finish = async () => {
    setSaving(true);
    setErr("");
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/recruitment/profile/teacher`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token ?? ""}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Could not save profile"); }
      router.replace("/recruitment/teacher");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const set = <K extends keyof WizardData>(key: K, val: WizardData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const addQual = () =>
    setForm((p) => ({ ...p, qualifications: [...p.qualifications, { degree: "", institution: "", year: "" }] }));
  const removeQual = (i: number) =>
    setForm((p) => ({ ...p, qualifications: p.qualifications.filter((_, idx) => idx !== i) }));
  const updateQual = (i: number, field: keyof Qualification, val: string) =>
    setForm((p) => ({ ...p, qualifications: p.qualifications.map((q, idx) => idx === i ? { ...q, [field]: val } : q) }));

  const addExp = () =>
    setForm((p) => ({ ...p, experience: [...p.experience, { school: "", role: "", from: "", to: "" }] }));
  const removeExp = (i: number) =>
    setForm((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i: number, field: keyof Experience, val: string) =>
    setForm((p) => ({ ...p, experience: p.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  if (!isLoaded || !authReady) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-[#0E733B] animate-spin" />
      </div>
    );
  }

  const currentStepDef = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Top bar */}
      <div className="bg-white border-b border-line px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0E733B] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-[15px] text-charcoal">EduBeacon</span>
        </div>
        <div className="text-[12.5px] text-slate-500">
          Step {step} of {STEPS.length}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-[24px] text-charcoal leading-tight">
            Complete your teacher profile
          </h1>
          <p className="text-[13.5px] text-slate-500 mt-1.5 leading-relaxed">
            Help schools discover you — fill in a few details to get started.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} total={STEPS.length} />

        {/* Card */}
        <div className="bg-white rounded-2xl border border-line shadow-sm p-6 sm:p-8">
          <StepLabel step={currentStepDef} />

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Full name *</label>
                <input
                  className={inputCls}
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Your full name as on official documents"
                />
              </div>
              <div>
                <label className={labelCls}>Phone number</label>
                <input
                  className={inputCls}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className={labelCls}>
                  Professional summary{" "}
                  <span className="font-normal normal-case tracking-normal text-slate-400">
                    (helps schools decide to interview you)
                  </span>
                </label>
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none`}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Briefly describe your teaching philosophy, strengths and goals…"
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Subjects & Skills ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Subject specialisations</label>
                <p className="text-[12px] text-slate-400 mb-2">Type a subject and press Enter or click +</p>
                <TagInput
                  tags={form.subjectSpecialisations}
                  onAdd={(t) => set("subjectSpecialisations", [...form.subjectSpecialisations, t])}
                  onRemove={(i) => set("subjectSpecialisations", form.subjectSpecialisations.filter((_, idx) => idx !== i))}
                  placeholder="e.g. Physics, Mathematics, Hindi…"
                  colorClass="bg-emerald-50 border-emerald-200 text-emerald-800"
                />
              </div>
              <div>
                <label className={labelCls}>Preferred cities</label>
                <p className="text-[12px] text-slate-400 mb-2">Where would you like to work?</p>
                <TagInput
                  tags={form.preferredCities}
                  onAdd={(t) => set("preferredCities", [...form.preferredCities, t])}
                  onRemove={(i) => set("preferredCities", form.preferredCities.filter((_, idx) => idx !== i))}
                  placeholder="e.g. Delhi, Pune, Bengaluru…"
                  colorClass="bg-slate-100 border-slate-200 text-slate-700"
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Job Preferences ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>CTET status</label>
                  <select
                    className={`${inputCls} cursor-pointer`}
                    value={form.ctetStatus}
                    onChange={(e) => set("ctetStatus", e.target.value)}
                  >
                    <option value="">— Select —</option>
                    <option value="cleared">Cleared</option>
                    <option value="not_cleared">Not cleared</option>
                    <option value="not_applicable">Not applicable</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>STET / State TET</label>
                  <input
                    className={inputCls}
                    value={form.stetStatus}
                    onChange={(e) => set("stetStatus", e.target.value)}
                    placeholder="e.g. UPTET cleared"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Available from</label>
                <input
                  type="date"
                  className={`${inputCls} cursor-pointer`}
                  value={form.availableFrom}
                  onChange={(e) => set("availableFrom", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Current CTC (₹/month)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.currentCTC ?? ""}
                    onChange={(e) => set("currentCTC", e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 55000"
                  />
                </div>
                <div>
                  <label className={labelCls}>Expected CTC (₹/month)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.expectedCTC ?? ""}
                    onChange={(e) => set("expectedCTC", e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 70000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Qualifications ── */}
          {step === 4 && (
            <div>
              {form.qualifications.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6 text-slate-400" strokeWidth={1.6} />
                  </div>
                  <p className="text-[13.5px] text-slate-500 mb-4">No qualifications added yet.</p>
                  <button
                    type="button"
                    onClick={addQual}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add a degree
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.qualifications.map((q, i) => (
                    <div key={i} className="border border-line rounded-xl p-4 relative bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() => removeQual(i)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Degree {i + 1}
                      </p>
                      <div className="grid sm:grid-cols-[1fr_1fr_80px] gap-3">
                        <div>
                          <label className={labelCls}>Degree / course</label>
                          <input
                            className={inputCls}
                            value={q.degree}
                            onChange={(e) => updateQual(i, "degree", e.target.value)}
                            placeholder="e.g. B.Ed, M.Sc Physics"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>University / college</label>
                          <input
                            className={inputCls}
                            value={q.institution}
                            onChange={(e) => updateQual(i, "institution", e.target.value)}
                            placeholder="Institution name"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Year</label>
                          <input
                            className={inputCls}
                            value={q.year}
                            onChange={(e) => updateQual(i, "year", e.target.value)}
                            placeholder="2020"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQual}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0E733B] hover:underline underline-offset-2 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add another degree
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Experience & Resume ── */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Resume URL */}
              <div>
                <label className={labelCls}>Resume PDF link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    className={`${inputCls} pl-9`}
                    value={form.resumeUrl}
                    onChange={(e) => set("resumeUrl", e.target.value)}
                    placeholder="Google Drive / Dropbox / any direct PDF link…"
                  />
                </div>
                <p className="text-[11.5px] text-slate-400 mt-1.5 leading-relaxed">
                  Upload your resume to Google Drive, set it to "Anyone with link", and paste the link here. Schools can download it from their pipeline.
                </p>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <label className={labelCls}>Work experience</label>
                  <button
                    type="button"
                    onClick={addExp}
                    className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#0E733B] hover:underline underline-offset-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                {form.experience.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center">
                    <p className="text-[13px] text-slate-400">
                      No experience added.{" "}
                      <button type="button" onClick={addExp} className="text-[#0E733B] font-semibold hover:underline">
                        Add your first role
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.experience.map((e, i) => (
                      <div key={i} className="border border-line rounded-xl p-4 bg-slate-50/50 relative">
                        <button
                          type="button"
                          onClick={() => removeExp(i)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Role {i + 1}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className={labelCls}>School / institution</label>
                            <input
                              className={inputCls}
                              value={e.school}
                              onChange={(ev) => updateExp(i, "school", ev.target.value)}
                              placeholder="School name"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Role / designation</label>
                            <input
                              className={inputCls}
                              value={e.role}
                              onChange={(ev) => updateExp(i, "role", ev.target.value)}
                              placeholder="e.g. PGT Physics"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>From</label>
                            <input
                              className={inputCls}
                              value={e.from}
                              onChange={(ev) => updateExp(i, "from", ev.target.value)}
                              placeholder="e.g. Jun 2020"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>To</label>
                            <input
                              className={inputCls}
                              value={e.to}
                              onChange={(ev) => updateExp(i, "to", ev.target.value)}
                              placeholder="e.g. Mar 2024 or Present"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {err && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-700">
              {err}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-line bg-white text-[13.5px] font-bold text-charcoal hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {/* Skip — only on optional steps */}
            {step > 1 && step < STEPS.length && (
              <button
                type="button"
                onClick={() => { setErr(""); setStep((s) => s + 1); }}
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors px-2"
              >
                Skip
              </button>
            )}

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? "Saving…" : "Finish & go to dashboard"}
              </button>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[12px] text-slate-400 mt-5">
          You can update your profile anytime from your dashboard.{" "}
          <button
            type="button"
            onClick={() => router.replace("/recruitment/teacher")}
            className="text-[#0E733B] hover:underline underline-offset-2"
          >
            Skip setup →
          </button>
        </p>
      </div>
    </div>
  );
}
