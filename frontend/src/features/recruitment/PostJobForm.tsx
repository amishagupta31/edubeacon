"use client";

import { useState } from "react";
import { Plus, Sparkles, Trash2, GripVertical, Info, Loader2 } from "lucide-react";
import { API } from "./useRecruitmentProfile";

// Mirrors BOARDS in backend/src/modules/recruitment/institution.model.ts
const BOARDS = [
  "CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS", "Other",
] as const;

const ROLE_TYPES = ["Teaching", "Non-teaching", "Administrative", "Leadership"] as const;

const EMPLOYMENT = [
  "Full-time, permanent",
  "Full-time, contract",
  "Part-time",
  "Visiting / guest faculty",
  "Internship",
] as const;

type Screening = "hard" | "scored";

interface Requirement {
  id: string;
  text: string;
  screening: Screening;
}

interface Channels {
  portal: boolean;
  careers: boolean;
  whatsapp: boolean;
}

const DEFAULT_STAGES = [
  "Application review",
  "Screening call",
  "Demo lesson",
  "Panel interview",
  "Offer",
];

const newId = () => Math.random().toString(36).slice(2, 9);

export default function PostJobForm({
  institutionName,
  city,
  authHeader,
  onCancel,
  onSaved,
  onGoToProfile,
}: {
  institutionName: string;
  city?: string;
  authHeader?: () => Promise<Record<string, string>>;
  onCancel?: () => void;
  onSaved?: () => void;
  onGoToProfile?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [roleType, setRoleType] = useState<string>(ROLE_TYPES[0]);
  const [board, setBoard] = useState<string>(BOARDS[0]);
  const [classes, setClasses] = useState("");
  const [employment, setEmployment] = useState<string>(EMPLOYMENT[0]);
  const [openings, setOpenings] = useState("1");
  const [description, setDescription] = useState("");

  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: newId(), text: "", screening: "hard" },
  ]);
  const [stages, setStages] = useState<string[]>(DEFAULT_STAGES);
  const [channels, setChannels] = useState<Channels>({ portal: true, careers: true, whatsapp: false });
  const [deadline, setDeadline] = useState("");

  const [notice, setNotice] = useState<string | null>(null);

  /* ── Requirements ── */
  const addRequirement = () =>
    setRequirements((r) => [...r, { id: newId(), text: "", screening: "scored" }]);

  const setRequirementText = (id: string, text: string) =>
    setRequirements((r) => r.map((q) => (q.id === id ? { ...q, text } : q)));

  const toggleScreening = (id: string) =>
    setRequirements((r) =>
      r.map((q) => (q.id === id ? { ...q, screening: q.screening === "hard" ? "scored" : "hard" } : q))
    );

  const removeRequirement = (id: string) =>
    setRequirements((r) => (r.length > 1 ? r.filter((q) => q.id !== id) : r));

  /* ── Stages ── */
  const removeStage = (i: number) =>
    setStages((s) => (s.length > 1 ? s.filter((_, n) => n !== i) : s));

  const addStage = () => setStages((s) => [...s, ""]);

  const setStage = (i: number, v: string) =>
    setStages((s) => s.map((x, n) => (n === i ? v : x)));

  const [saving, setSaving] = useState(false);

  /* ── Submit ── */
  const submit = async (mode: "draft" | "publish") => {
    if (!title.trim()) {
      setNotice("Add a job title before you can " + (mode === "draft" ? "save a draft." : "publish."));
      return;
    }

    if (!authHeader) {
      setNotice("Cannot save — authentication not available.");
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const headers = await authHeader();
      const payload = {
        title: title.trim(),
        roleType,
        board,
        classes: classes.trim(),
        employment,
        openings: Number(openings) || 1,
        description: description.trim(),
        requirements: requirements.filter((r) => r.text.trim()).map((r) => ({
          text: r.text.trim(),
          screening: r.screening,
        })),
        stages: stages.filter(Boolean),
        channels,
        deadline: deadline || null,
        status: mode === "publish" ? "PUBLISHED" : "DRAFT",
      };

      const res = await fetch(`${API}/api/recruitment/jobs`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.code === "PROFILE_INCOMPLETE" && onGoToProfile) {
          onGoToProfile();
          return;
        }
        throw new Error(data.error || "Could not save job");
      }

      // Success — navigate back to job list
      if (onSaved) onSaved();
      else setNotice(`Job ${mode === "publish" ? "published" : "saved as draft"} successfully!`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const tags = [board, classes.trim(), employment.split(",")[0]].filter(Boolean);
  const label = "block text-[12.5px] font-semibold text-charcoal mb-1.5";
  const field =
    "w-full border border-line rounded-xl px-3.5 py-2.5 text-[13.5px] text-charcoal bg-white " +
    "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 mb-1">
            <button onClick={onCancel} className="text-[#0E733B] font-semibold hover:underline underline-offset-2">
              Dashboard
            </button>
            <span className="mx-1.5">/</span>
            <span>New job</span>
          </p>
          <h1 className="font-display font-bold text-[30px] sm:text-[34px] text-charcoal leading-tight tracking-tight">
            Post a job
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => submit("draft")}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-white border border-line text-[13.5px] font-semibold text-charcoal hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin inline mr-1.5" /> : null}
            Save draft
          </button>
          <button
            onClick={() => submit("publish")}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin inline mr-1.5" /> : null}
            Publish job
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-5">
          <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] text-amber-900 leading-relaxed">{notice}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* ══════════ Left column ══════════ */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* 1. Basics */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h2 className="font-display font-bold text-[17px] text-charcoal mb-5">1. Basics</h2>

            <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className={label}>Job title</label>
                <input
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. PGT Physics" className={field}
                />
              </div>
              <div>
                <label className={label}>Role type</label>
                <select value={roleType} onChange={(e) => setRoleType(e.target.value)} className={`${field} cursor-pointer`}>
                  {ROLE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Board</label>
                <select value={board} onChange={(e) => setBoard(e.target.value)} className={`${field} cursor-pointer`}>
                  {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Classes</label>
                <input
                  type="text" value={classes} onChange={(e) => setClasses(e.target.value)}
                  placeholder="e.g. XI–XII" className={field}
                />
              </div>
              <div>
                <label className={label}>Employment</label>
                <select value={employment} onChange={(e) => setEmployment(e.target.value)} className={`${field} cursor-pointer`}>
                  {EMPLOYMENT.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Openings</label>
                <input
                  type="number" min={1} value={openings}
                  onChange={(e) => setOpenings(e.target.value.replace(/\D/g, "") || "1")}
                  className={field}
                />
              </div>
            </div>
          </section>

          {/* 2. Job description */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display font-bold text-[17px] text-charcoal">2. Job description</h2>
              <button
                onClick={() => setNotice("AI drafting is not wired up yet — no model endpoint exists for it.")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[12.5px] font-bold text-[#0E733B] hover:bg-emerald-100 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> Write with AI
              </button>
            </div>

            <textarea
              rows={9} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities and what a strong candidate looks like…"
              className={`${field} resize-y leading-relaxed`}
            />
            <p className="text-[12px] text-slate-400 mt-2">
              AI drafts from title, board and classes. Edit freely before publishing.
            </p>
          </section>

          {/* 3. Requirements & screening */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h2 className="font-display font-bold text-[17px] text-charcoal mb-1.5">
              3. Requirements &amp; screening
            </h2>
            <p className="text-[13px] text-slate-500 mb-5">
              Hard filters are the only rules that can auto-reject. Everything else feeds the AI fit score.
            </p>

            <div className="divide-y divide-line border-y border-line">
              {requirements.map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-3">
                  <input
                    type="text" value={r.text}
                    onChange={(e) => setRequirementText(r.id, e.target.value)}
                    placeholder="e.g. M.Sc Physics (or equivalent)"
                    className="flex-1 min-w-0 bg-transparent text-[13.5px] text-charcoal placeholder:text-slate-400 focus:outline-none"
                  />

                  {/* Click to flip between auto-reject and scored */}
                  <button
                    onClick={() => toggleScreening(r.id)}
                    title="Click to switch between hard filter and scored"
                    className={`shrink-0 text-[11.5px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                      r.screening === "hard"
                        ? "bg-[#0C2A1B] text-white hover:bg-[#143d28]"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {r.screening === "hard" ? "Hard filter" : "Scored"}
                  </button>

                  <button
                    onClick={() => removeRequirement(r.id)}
                    disabled={requirements.length <= 1}
                    aria-label="Remove requirement"
                    className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addRequirement}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-[13px] font-semibold text-slate-600 hover:border-[#0E733B] hover:text-[#0E733B] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add requirement
            </button>
          </section>

          {/* 4. Hiring stages */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h2 className="font-display font-bold text-[17px] text-charcoal mb-1.5">4. Hiring stages</h2>
            <p className="text-[13px] text-slate-500 mb-5">
              Candidates move through these in order. Rename or remove any that don&apos;t apply.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className="group inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl pl-2 pr-1 py-1.5"
                >
                  <GripVertical className="w-3.5 h-3.5 text-emerald-600/50 shrink-0" />
                  <input
                    type="text" value={s} onChange={(e) => setStage(i, e.target.value)}
                    placeholder="Stage name"
                    size={Math.max(s.length || 10, 8)}
                    className="bg-transparent text-[13px] font-semibold text-emerald-800 placeholder:text-emerald-600/50 focus:outline-none min-w-0"
                  />
                  <button
                    onClick={() => removeStage(i)}
                    disabled={stages.length <= 1}
                    aria-label={`Remove ${s || "stage"}`}
                    className="shrink-0 p-1 rounded-md text-emerald-600/50 hover:text-red-600 hover:bg-white disabled:opacity-25 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={addStage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-slate-300 text-[13px] font-semibold text-slate-600 hover:border-[#0E733B] hover:text-[#0E733B] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add stage
              </button>
            </div>
          </section>
        </div>

        {/* ══════════ Right column ══════════ */}
        <div className="flex flex-col gap-5">
          {/* Candidate preview */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
              Candidate preview
            </p>
            <h3 className="font-display font-bold text-[20px] text-charcoal leading-tight mb-1.5">
              {title.trim() || "Untitled role"}
            </h3>
            <p className="text-[13.5px] text-slate-500 mb-4">
              {institutionName}{city ? ` · ${city}` : ""}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((t) => (
                <span key={t} className="text-[12px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => setNotice("The public job view is not built yet, so there is nothing to preview.")}
              className="text-[13px] font-semibold text-[#0E733B] hover:underline underline-offset-2"
            >
              Open full preview
            </button>
          </section>

          {/* Publish to */}
          <section className="bg-white rounded-2xl border border-line shadow-sm p-6">
            <h3 className="font-display font-bold text-[17px] text-charcoal mb-4">Publish to</h3>

            <div className="flex flex-col gap-3.5 mb-6">
              {([
                ["portal",   "Portal job board"],
                ["careers",  "School careers page"],
                ["whatsapp", "Shareable WhatsApp link"],
              ] as [keyof Channels, string][]).map(([key, text]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={channels[key]}
                    onChange={(e) => setChannels((c) => ({ ...c, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-[#0E733B] cursor-pointer"
                  />
                  <span className="text-[13.5px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                    {text}
                  </span>
                </label>
              ))}
            </div>

            <label className={label}>Application deadline</label>
            <input
              type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className={`${field} cursor-pointer`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
