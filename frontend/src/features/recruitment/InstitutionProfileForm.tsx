"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { API } from "./useRecruitmentProfile";

const INSTITUTION_TYPES = [
  "School", "CBSE School", "ICSE School", "State Board School",
  "International School", "Pre-School", "Coaching Institute",
  "College", "University", "Other",
];

const BOARDS = ["CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS", "Other"];

type Verification = "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";

interface Institution {
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
  verificationStatus: Verification;
  updatedAt?: string;
}

const EMPTY: Institution = {
  name: "", institutionType: "", board: "", establishedYear: "",
  officialEmail: "", contactPerson: "", contactPhone: "", website: "",
  addressLine: "", city: "", state: "", pincode: "", description: "",
  verificationStatus: "PENDING",
};

const VERIFICATION_UI: Record<Verification, { label: string; cls: string; icon: React.ElementType }> = {
  PENDING:   { label: "Not yet verified", cls: "bg-amber-50 border-amber-200 text-amber-900", icon: ShieldAlert },
  IN_REVIEW: { label: "Verification in review", cls: "bg-blue-50 border-blue-200 text-blue-900", icon: ShieldAlert },
  VERIFIED:  { label: "Verified institution", cls: "bg-emerald-50 border-emerald-200 text-emerald-900", icon: ShieldCheck },
  REJECTED:  { label: "Verification declined", cls: "bg-red-50 border-red-200 text-red-900", icon: ShieldAlert },
};

/** Completeness across the fields that matter for a credible listing. */
function completeness(d: Institution) {
  const keys: (keyof Institution)[] = [
    "name", "institutionType", "board", "officialEmail", "contactPerson",
    "contactPhone", "addressLine", "city", "state", "description",
  ];
  const filled = keys.filter((k) => String(d[k] ?? "").trim()).length;
  return Math.round((filled / keys.length) * 100);
}

export default function InstitutionProfileForm({
  authHeader,
}: {
  authHeader: () => Promise<Record<string, string>>;
}) {
  const [data, setData] = useState<Institution>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/recruitment/institution`, { headers: await authHeader() });
      if (!res.ok) { setMsg({ kind: "err", text: "Could not load your institution profile." }); return; }
      setData({ ...EMPTY, ...(await res.json()) });
    } catch {
      setMsg({ kind: "err", text: `Cannot reach the server at ${API}.` });
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof Institution, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    setMsg(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) { setMsg({ kind: "err", text: "Institution name is required." }); return; }
    setSaving(true); setMsg(null);
    try {
      // verificationStatus is intentionally not sent — the server ignores it anyway.
      const { verificationStatus: _ignored, updatedAt: _u, ...payload } = data;
      const res = await fetch(`${API}/api/recruitment/institution`, {
        method: "PUT",
        headers: await authHeader(),
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ kind: "err", text: body.error || "Could not save." }); return; }
      setData({ ...EMPTY, ...body });
      setMsg({ kind: "ok", text: "Institution profile saved." });
    } catch {
      setMsg({ kind: "err", text: "Could not reach the server." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#0E733B]" />
      </div>
    );
  }

  const pct = completeness(data);
  const v = VERIFICATION_UI[data.verificationStatus] ?? VERIFICATION_UI.PENDING;
  const VIcon = v.icon;

  const input =
    "w-full border border-line rounded-xl px-4 py-2.5 text-[14px] text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";
  const label = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="max-w-3xl">
      {/* Verification — read only, set by review */}
      <div className={`rounded-2xl border px-5 py-4 mb-5 flex items-start gap-3 ${v.cls}`}>
        <VIcon className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.8} />
        <div>
          <p className="font-bold text-[13.5px]">{v.label}</p>
          <p className="text-[12.5px] opacity-80 mt-0.5 leading-relaxed">
            Verification is carried out by the EduBeacon team and can&apos;t be set from this page.
          </p>
        </div>
      </div>

      {/* Completeness */}
      <div className="bg-white rounded-2xl border border-line p-5 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[12.5px] font-bold text-slate-600">Profile completeness</p>
          <p className="text-[13px] font-bold text-[#0E733B] tabular-nums">{pct}%</p>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#0E733B] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <form onSubmit={save} className="bg-white rounded-2xl border border-line p-6 sm:p-7 flex flex-col gap-5">
        <Section title="Institution details" />
        <div>
          <label className={label}>Institution name *</label>
          <input required className={input} value={data.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Type</label>
            <select className={input} value={data.institutionType} onChange={(e) => set("institutionType", e.target.value)}>
              <option value="">Select…</option>
              {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Board / affiliation</label>
            <select className={input} value={data.board} onChange={(e) => set("board", e.target.value)}>
              <option value="">Select…</option>
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Established</label>
            <input className={input} placeholder="e.g. 1998" maxLength={4} inputMode="numeric"
              value={data.establishedYear}
              onChange={(e) => set("establishedYear", e.target.value.replace(/\D/g, "").slice(0, 4))} />
          </div>
        </div>

        <Section title="Contact" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Official email</label>
            <input type="email" className={input} value={data.officialEmail} onChange={(e) => set("officialEmail", e.target.value)} />
          </div>
          <div>
            <label className={label}>Website</label>
            <input className={input} placeholder="example.edu.in" value={data.website} onChange={(e) => set("website", e.target.value)} />
          </div>
          <div>
            <label className={label}>Contact person</label>
            <input className={input} value={data.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
          </div>
          <div>
            <label className={label}>Contact phone</label>
            <input type="tel" inputMode="numeric" maxLength={10} className={input} value={data.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} />
          </div>
        </div>

        <Section title="Address" />
        <div>
          <label className={label}>Address</label>
          <input className={input} value={data.addressLine} onChange={(e) => set("addressLine", e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>City</label>
            <input className={input} value={data.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label className={label}>State</label>
            <input className={input} value={data.state} onChange={(e) => set("state", e.target.value)} />
          </div>
          <div>
            <label className={label}>PIN code</label>
            <input className={input} inputMode="numeric" maxLength={6} value={data.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
          </div>
        </div>

        <Section title="About" />
        <div>
          <label className={label}>Institution description</label>
          <textarea rows={5} maxLength={2000} className={`${input} resize-none`} value={data.description}
            placeholder="Tell candidates about your institution, culture and what makes it a good place to teach."
            onChange={(e) => set("description", e.target.value)} />
          <p className="text-[11.5px] text-slate-400 mt-1 text-right">{data.description.length} / 2000</p>
        </div>

        {msg && (
          <p className={`text-[13px] px-4 py-2.5 rounded-xl flex items-center gap-2 ${
            msg.kind === "ok"
              ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
              : "text-red-600 bg-red-50 border border-red-100"
          }`}>
            {msg.kind === "ok" && <CheckCircle2 className="w-4 h-4" />}
            {msg.text}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13.5px] font-bold hover:bg-[#0B5C2F] transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save profile"}
          </button>
          {data.updatedAt && (
            <span className="text-[12px] text-slate-400">
              Last saved {new Date(data.updatedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <p className="text-[11.5px] text-slate-400 border-t border-line pt-4">
          Logo, campus images and verification documents need secure file storage and will be added separately.
        </p>
      </form>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E733B] border-b border-line pb-2">
      {title}
    </p>
  );
}
