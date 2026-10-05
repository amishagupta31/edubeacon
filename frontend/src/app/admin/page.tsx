"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useUser, useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import {
  Users, Building2, Handshake, Trophy, RefreshCw, ChevronDown, ChevronUp,
  Lock, AlertTriangle, Loader2, LogOut, Search, Download, X, LayoutGrid,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown,
  KeyRound, Mail, Eye, EyeOff, Megaphone, Plus, Trash2, Save,
} from "lucide-react";

type Tab = "conference" | "vendor" | "interest" | "award";
interface Counts { conference: number; vendor: number; interest: number; award: number }
type Row = Record<string, unknown>;

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Admin session token from POST /api/admin/auth/login. Expires after 8h server-side.
const TOKEN_KEY = "eb_admin_token";
const readToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
const writeToken = (t: string) => {
  try { localStorage.setItem(TOKEN_KEY, t); } catch { /* storage blocked */ }
};
const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ }
};

/** Columns shown in the table. Everything else appears in the expanded detail panel. */
const COLUMNS: Record<Tab, { key: string; label: string }[]> = {
  conference: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "school", label: "School" },
    { key: "role", label: "Role" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Registered" },
  ],
  vendor: [
    { key: "companyName", label: "Company" },
    { key: "contactPerson", label: "Contact" },
    { key: "email", label: "Email" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Submitted" },
  ],
  interest: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "school", label: "School" },
    { key: "vendorName", label: "Interested In" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Submitted" },
  ],
  award: [
    { key: "nomineeName", label: "Nominee" },
    { key: "category", label: "Category" },
    { key: "nominatorName", label: "Nominator" },
    { key: "nominatorEmail", label: "Nominator Email" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Submitted" },
  ],
};

const STATUS_OPTIONS: Record<Tab, string[]> = {
  conference: ["pending", "confirmed", "cancelled"],
  vendor: ["pending", "approved", "rejected"],
  interest: ["new", "contacted", "closed"],
  award: ["submitted", "shortlisted", "winner", "not-selected"],
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  contacted: "bg-violet-50 text-violet-700 ring-violet-600/20",
  closed: "bg-slate-100 text-slate-600 ring-slate-500/20",
  submitted: "bg-amber-50 text-amber-700 ring-amber-600/20",
  shortlisted: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  winner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "not-selected": "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const TABS: {
  id: Tab; label: string; icon: React.ElementType;
  title: string; subtitle: string; accent: string;
}[] = [
  {
    id: "conference", label: "Conference", icon: Users,
    title: "Conference Registrations",
    subtitle: "Schools and educators registered for the conference",
    accent: "text-emerald-600",
  },
  {
    id: "vendor", label: "Vendors", icon: Building2,
    title: "Vendor Applications",
    subtitle: "Companies applying to list solutions and sponsor",
    accent: "text-blue-600",
  },
  {
    id: "interest", label: "Interest Leads", icon: Handshake,
    title: "Interest Leads",
    subtitle: "Schools expressing interest in vendor solutions",
    accent: "text-violet-600",
  },
  {
    id: "award", label: "Award Nominations", icon: Trophy,
    title: "Award Nominations",
    subtitle: "Nominations for the Excellence in Education Awards",
    accent: "text-amber-600",
  },
];

const LABEL: Record<string, string> = {
  clerkUserId: "Clerk User ID", createdAt: "Created", updatedAt: "Updated",
  companyName: "Company Name", contactPerson: "Contact Person",
  companyDescription: "Company Description", productDescription: "Product Description",
  nomineeName: "Nominee Name", nomineeOrg: "Nominee Organization",
  nominatorName: "Nominator Name", nominatorEmail: "Nominator Email",
  vendorName: "Interested In", servicesExplored: "Services Explored",
  aiTools: "AI Tools", whatsapp: "WhatsApp",
};

const prettyKey = (k: string) =>
  LABEL[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function fmt(val: unknown): string {
  if (val === null || val === undefined || val === "") return "—";
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    return new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return String(val);
}

const PAGE_SIZES = [10, 25, 50, 100];

/** Sort values by natural type: dates chronologically, numbers numerically, text alphabetically. */
function compare(a: unknown, b: unknown): number {
  const blank = (v: unknown) => v === null || v === undefined || v === "";
  if (blank(a) && blank(b)) return 0;
  if (blank(a)) return 1;   // empties always sink to the bottom
  if (blank(b)) return -1;

  const sa = Array.isArray(a) ? a.join(", ") : String(a);
  const sb = Array.isArray(b) ? b.join(", ") : String(b);

  const isDate = /^\d{4}-\d{2}-\d{2}T/.test(sa) && /^\d{4}-\d{2}-\d{2}T/.test(sb);
  if (isDate) return Date.parse(sa) - Date.parse(sb);

  const na = Number(sa), nb = Number(sb);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;

  return sa.localeCompare(sb, undefined, { sensitivity: "base" });
}

/** Page indices with ellipsis gaps, e.g. [1, "…", 4, 5, 6, "…", 12] */
function pageRange(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "gap", total];
  if (current >= total - 3) return [1, "gap", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "gap", current - 1, current, current + 1, "gap", total];
}

function toCSV(rows: Row[], columns: { key: string; label: string }[]) {
  const esc = (v: unknown) => `"${fmt(v).replace(/"/g, '""')}"`;
  const head = columns.map((c) => esc(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")).join("\n");
  return `${head}\n${body}`;
}

// ════════════════════════════════════════════════════════════════════════════
// Sign-In Gate — password (default) or email OTP, plus password reset
// ════════════════════════════════════════════════════════════════════════════
type Method = "password" | "otp";
type Stage = "credentials" | "verify-otp";

function AdminSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [method, setMethod] = useState<Method>("password");
  const [stage, setStage] = useState<Stage>("credentials");
  const [otpMode, setOtpMode] = useState<"signup" | "signin">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  const reset = (m?: Method) => {
    setStage("credentials");
    setCode(""); setPassword(""); setNewPassword("");
    setErr(""); setNotice("");
    if (m) setMethod(m);
  };

  const clearSession = async () => {
    if (clerk.session) { try { await clerk.signOut(); } catch { /* ignore */ } }
  };

  // ── Password sign-in — validated against the `admins` collection in MongoDB ──
  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch(`${API}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErr(body.error || "Invalid email or password");
        return;
      }

      const { token } = await res.json();
      writeToken(token);
      await clearSession();  // drop any stale Clerk session
      onSignedIn();
    } catch {
      setErr(`Cannot reach the server at ${API}. Is the backend running?`);
    } finally {
      setBusy(false);
    }
  };

  // ── OTP: send code ──
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || !signUp) return;
    setBusy(true); setErr("");
    try {
      await clearSession();

      let { error: createErr } = await signUp.create({ emailAddress: email });

      if (createErr?.code === "session_exists") {
        await clearSession();
        ({ error: createErr } = await signUp.create({ emailAddress: email }));
      }

      // Existing account → sign-in code
      if (createErr?.code === "form_identifier_exists") {
        const { error: siErr } = await signIn.create({ identifier: email });
        if (siErr) { setErr(siErr.message || "Could not send code."); return; }
        const { error: sendErr } = await signIn.emailCode.sendCode();
        if (sendErr) { setErr(sendErr.message || "Could not send code."); return; }
        setOtpMode("signin"); setStage("verify-otp"); return;
      }

      if (createErr) { setErr(createErr.message || "Could not send code."); return; }

      // New account → sign-up code
      if (signUp.missingFields.includes("password")) {
        const pw = `Adm${Math.random().toString(36).slice(2)}${Date.now()}!Aa`;
        const { error: pwErr } = await signUp.password({ password: pw });
        if (pwErr) { setErr(pwErr.message || "Could not send code."); return; }
      }
      const { error: codeErr } = await signUp.verifications.sendEmailCode();
      if (codeErr) { setErr(codeErr.message || "Could not send code."); return; }
      setOtpMode("signup"); setStage("verify-otp");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // ── OTP: verify ──
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || !signUp || code.length < 6) return;
    setBusy(true); setErr("");
    try {
      if (otpMode === "signin") {
        const { error } = await signIn.emailCode.verifyCode({ code });
        if (error) { setErr(error.message || "That code didn't work."); return; }
        if (signIn.status === "complete") {
          const { error: fe } = await signIn.finalize();
          if (fe) { setErr(fe.message || "Sign-in failed."); return; }
        }
      } else {
        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) { setErr(error.message || "That code didn't work."); return; }
        if (signUp.status === "complete") {
          const { error: fe } = await signUp.finalize();
          if (fe) { setErr(fe.message || "Sign-in failed."); return; }
        }
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Verification failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#04312c] focus:ring-2 focus:ring-[#04312c]/10 transition-all";
  const btnCls =
    "w-full bg-[#04312c] text-white py-3 rounded-xl font-bold text-[14px] hover:bg-[#062013] transition-colors disabled:opacity-40 flex items-center justify-center gap-2";
  const codeInputCls =
    "w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[22px] text-center tracking-[0.5em] font-bold text-slate-800 focus:outline-none focus:border-[#04312c] focus:ring-2 focus:ring-[#04312c]/10 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#04312c] via-[#06241f] to-[#0A0E17]">
      <div className="w-full max-w-[390px]">
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-emerald-300" />
          </div>
          <h1 className="font-display font-bold text-[22px] text-white">EduBeacon Admin</h1>
          <p className="text-[13px] text-emerald-300/70 mt-1">Sign in to access the dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          {/* Method switcher — only on the credentials stage */}
          {stage === "credentials" && (
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              {([
                { id: "password" as Method, label: "Password", icon: KeyRound },
                { id: "otp" as Method, label: "Email OTP", icon: Mail },
              ]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => reset(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12.5px] font-bold transition-all ${
                    method === id ? "bg-white text-[#04312c] shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {notice && stage !== "credentials" && (
            <p className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg mb-4">
              {notice}
            </p>
          )}

          {/* ── Stage: credentials ── */}
          {stage === "credentials" && (
            <form onSubmit={method === "password" ? signInWithPassword : sendOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Admin Email
                </label>
                <input
                  type="email" required autoFocus
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  className={inputCls}
                />
              </div>

              {method === "password" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {method === "otp" && (
                <p className="text-[12.5px] text-slate-500 leading-relaxed -mt-1">
                  We&apos;ll email you a 6-digit code. No password needed.
                </p>
              )}

              {err && <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>}

              {/* Clerk mounts its bot-protection widget here (OTP path uses signUp.create) */}
              <div id="clerk-captcha" className="empty:hidden" />

              <button type="submit" disabled={busy} className={btnCls}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy
                  ? (method === "password" ? "Signing in…" : "Sending code…")
                  : (method === "password" ? "Sign In" : "Send Verification Code")}
              </button>
            </form>
          )}

          {/* ── Stage: verify OTP ── */}
          {stage === "verify-otp" && (
            <form onSubmit={verifyOtp} className="flex flex-col gap-4">
              <p className="text-[13px] text-slate-500 text-center">
                Code sent to<br /><strong className="text-slate-800">{email}</strong>
              </p>
              <input
                type="text" inputMode="numeric" required autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
                maxLength={6}
                className={codeInputCls}
              />
              {err && <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>}
              <button type="submit" disabled={busy || code.length < 6} className={btnCls}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "Verifying…" : "Verify & Sign In"}
              </button>
              <button type="button" onClick={() => reset()} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to sign in
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Entry — gate on Clerk session
// ════════════════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [storageRead, setStorageRead] = useState(false);

  // localStorage is unavailable during SSR — read it after mount
  useEffect(() => {
    setAdminToken(readToken());
    setStorageRead(true);
  }, []);

  if (!isLoaded || !storageRead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8F7]">
        <Loader2 className="w-6 h-6 animate-spin text-[#04312c]" />
      </div>
    );
  }

  // Either auth path grants access: DB password token, or a Clerk OTP session
  if (!adminToken && !isSignedIn) {
    return <AdminSignIn onSignedIn={() => setAdminToken(readToken())} />;
  }

  return (
    <Dashboard
      adminToken={adminToken}
      onSignOut={() => { clearToken(); setAdminToken(null); }}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Ticker editor — the orange strip across the top of the site
// ════════════════════════════════════════════════════════════════════════════
interface Ticker { enabled: boolean; label: string; items: string[] }

function TickerEditor({ authHeader }: { authHeader: () => Promise<Record<string, string>> }) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/settings/ticker`)
      .then((r) => r.json())
      .then((d) => setTicker(d))
      .catch(() => setMsg({ kind: "err", text: "Could not load the current ticker." }))
      .finally(() => setLoading(false));
  }, []);

  const update = (patch: Partial<Ticker>) => {
    setTicker((t) => (t ? { ...t, ...patch } : t));
    setMsg(null);
  };

  const setItem = (i: number, text: string) =>
    setTicker((t) => {
      if (!t) return t;
      const items = [...t.items];
      items[i] = text;
      return { ...t, items };
    });

  const addItem = () =>
    setTicker((t) => (t && t.items.length < 12 ? { ...t, items: [...t.items, ""] } : t));

  const removeItem = (i: number) =>
    setTicker((t) => (t ? { ...t, items: t.items.filter((_, n) => n !== i) } : t));

  const move = (i: number, dir: -1 | 1) =>
    setTicker((t) => {
      if (!t) return t;
      const j = i + dir;
      if (j < 0 || j >= t.items.length) return t;
      const items = [...t.items];
      [items[i], items[j]] = [items[j], items[i]];
      return { ...t, items };
    });

  const save = async () => {
    if (!ticker) return;
    const items = ticker.items.map((i) => i.trim()).filter(Boolean);
    if (!items.length) {
      setMsg({ kind: "err", text: "Add at least one line before saving." });
      return;
    }
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${API}/api/settings/ticker`, {
        method: "PUT",
        headers: await authHeader(),
        body: JSON.stringify({ ...ticker, items }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: body.error || "Could not save." });
        return;
      }
      setTicker(body.value);
      setMsg({ kind: "ok", text: "Saved. Reload the public site to see it." });
    } catch {
      setMsg({ kind: "err", text: "Could not reach the server." });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${API}/api/settings/ticker/reset`, {
        method: "POST",
        headers: await authHeader(),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setTicker(body.value);
        setMsg({ kind: "ok", text: "Restored the default text." });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !ticker) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#04312c]" />
      </div>
    );
  }

  const preview = ticker.items.filter(Boolean).join("   ");

  return (
    <div className="max-w-3xl">
      {/* Live preview */}
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Preview</p>
      <div className="rounded-xl overflow-hidden border border-slate-200 mb-7">
        {ticker.enabled ? (
          <div className="relative bg-[#FF9933] overflow-hidden flex items-stretch">
            <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#0A0E17]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white whitespace-nowrap">
                {ticker.label || "Live"}
              </span>
            </div>
            <div className="w-px bg-black/15 shrink-0" />
            <div className="flex-1 overflow-hidden py-2.5">
              <div className="flex animate-ticker whitespace-nowrap">
                <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10">{preview}</span>
                <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10" aria-hidden="true">{preview}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 py-4 text-center text-[13px] text-slate-400">
            Strip is hidden on the site
          </div>
        )}
      </div>

      {/* Visibility + label */}
      <div className="flex flex-wrap items-end gap-5 mb-6">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={ticker.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="w-4 h-4 accent-[#04312c] cursor-pointer"
          />
          <span className="text-[13.5px] font-semibold text-slate-700">Show the strip on the site</span>
        </label>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Badge text
          </label>
          <input
            type="text"
            value={ticker.label}
            maxLength={24}
            onChange={(e) => update({ label: e.target.value })}
            className="w-40 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#04312c] focus:ring-2 focus:ring-[#04312c]/10"
          />
        </div>
      </div>

      {/* Items */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Scrolling lines ({ticker.items.length}/12)
        </p>
        <button
          onClick={addItem}
          disabled={ticker.items.length >= 12}
          className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#04312c] hover:underline disabled:opacity-40 disabled:no-underline"
        >
          <Plus className="w-3.5 h-3.5" /> Add line
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {ticker.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 text-[11px] font-bold text-slate-300 tabular-nums text-right">{i + 1}</span>
            <input
              type="text"
              value={item}
              maxLength={160}
              placeholder="Enter text for this line…"
              onChange={(e) => setItem(i, e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[13.5px] focus:outline-none focus:border-[#04312c] focus:ring-2 focus:ring-[#04312c]/10"
            />
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => move(i, -1)} disabled={i === 0}
                aria-label="Move up"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => move(i, 1)} disabled={i === ticker.items.length - 1}
                aria-label="Move down"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeItem(i)} disabled={ticker.items.length <= 1}
                aria-label="Remove line"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {msg && (
        <p className={`text-[13px] px-4 py-2.5 rounded-xl mb-4 ${
          msg.kind === "ok"
            ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
            : "text-red-600 bg-red-50 border border-red-100"
        }`}>
          {msg.text}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#04312c] text-white text-[13.5px] font-bold hover:bg-[#062013] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          onClick={reset} disabled={saving}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          Restore Default
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Dashboard — sidebar + content
// ════════════════════════════════════════════════════════════════════════════
function Dashboard({ adminToken, onSignOut }: { adminToken: string | null; onSignOut: () => void }) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Email shown in the sidebar: from the JWT for password login, from Clerk for OTP
  const adminEmail = adminToken
    ? (() => {
        try { return JSON.parse(atob(adminToken.split(".")[1])).email as string; }
        catch { return "Admin"; }
      })()
    : user?.primaryEmailAddress?.emailAddress ?? "";

  const handleSignOut = async () => {
    onSignOut();
    try { await signOut(); } catch { /* no Clerk session to drop */ }
  };

  const [tab, setTab] = useState<Tab>("conference");
  const [view, setView] = useState<"records" | "settings">("records");
  const [counts, setCounts] = useState<Counts | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const meta = TABS.find((t) => t.id === tab)!;
  const columns = COLUMNS[tab];

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const authHeader = useCallback(async () => {
    // Prefer the DB-issued admin token; fall back to the Clerk session (OTP path)
    const token = adminToken ?? (await getToken());
    return { Authorization: `Bearer ${token ?? ""}`, "Content-Type": "application/json" };
  }, [adminToken, getToken]);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/registrations`, { headers: await authHeader() });
      if (res.status === 403) { setError("denied"); return; }
      if (!res.ok) { setError("error"); return; }
      setCounts(await res.json());
      setError(null);
    } catch {
      setError("offline");
    }
  }, [authHeader]);

  const fetchRows = useCallback(async (t: Tab) => {
    setLoading(true); setRows([]); setExpanded(null);
    try {
      const res = await fetch(`${API}/api/admin/registrations?type=${t}`, { headers: await authHeader() });
      if (res.ok) setRows(await res.json());
    } catch { /* surfaced by fetchCounts */ }
    setLoading(false);
  }, [authHeader]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => {
    fetchRows(tab);
    setSearch(""); setStatusFilter("all");
    setSortKey("createdAt"); setSortDir("desc"); setPage(1);
  }, [tab, fetchRows]);

  // Filtering changes the result set — snap back to the first page
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const changeStatus = async (id: string, status: string) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    await fetch(`${API}/api/admin/registrations`, {
      method: "PATCH",
      headers: await authHeader(),
      body: JSON.stringify({ type: tab, id, status }),
    });
    fetchCounts();
  };

  const exportCSV = () => {
    const blob = new Blob([toCSV(filtered, columns)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edubeacon-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const r = compare(a[sortKey], b[sortKey]);
    return sortDir === "asc" ? r : -r;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paged = sorted.slice(startIdx, startIdx + pageSize);

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const sidebar = (
    <aside className="w-[244px] shrink-0 bg-[#04312c] flex flex-col fixed inset-y-0 left-0 z-30">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/[0.08]">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-[13px] text-white shrink-0">
          EB
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[14px] text-white leading-tight truncate">EduBeacon</p>
          <p className="text-[10.5px] text-emerald-400/80 font-semibold uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
          Registrations
        </p>
        <div className="flex flex-col gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = view === "records" && tab === id;
            return (
              <button
                key={id}
                onClick={() => { setTab(id); setView("records"); }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span className="flex-1 text-left truncate">{label}</span>
                <span
                  className={`text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-md min-w-[22px] text-center ${
                    active ? "bg-white/20 text-white" : "bg-white/[0.07] text-white/50"
                  }`}
                >
                  {counts ? counts[id] : "·"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
          Site Content
        </p>
        <button
          onClick={() => setView("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
            view === "settings"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
              : "text-white/60 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <Megaphone className="w-4 h-4 shrink-0" strokeWidth={2} />
          <span className="flex-1 text-left truncate">Ticker Strip</span>
        </button>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/[0.08]">
        <div className="px-2 mb-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-1">Signed in as</p>
          <p className="text-[12px] text-emerald-200 truncate" title={adminEmail}>
            {adminEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  // ── Error screens ────────────────────────────────────────────────────────
  if (error === "offline" || error === "denied") {
    const offline = error === "offline";
    return (
      <div className="flex min-h-screen">
        {sidebar}
        <div className="flex-1 ml-[244px] flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${offline ? "bg-amber-100" : "bg-red-100"}`}>
              {offline
                ? <AlertTriangle className="w-6 h-6 text-amber-600" />
                : <Lock className="w-6 h-6 text-red-600" />}
            </div>
            <h3 className="font-display font-bold text-[20px] text-slate-800 mb-2">
              {offline ? "Backend Offline" : "Access Denied"}
            </h3>
            <p className="text-[13.5px] text-slate-500 leading-relaxed mb-5">
              {offline ? (
                <>Cannot reach the API at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">{API}</code>. Start it with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">npm run dev</code> in the backend folder.</>
              ) : (
                <><strong className="text-slate-700">{adminEmail}</strong> is not an active admin. Seed it with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">npm run seed:admin</code>.</>
              )}
            </p>
            {offline && (
              <button onClick={fetchCounts} className="bg-[#04312c] text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#062013] transition-colors">
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const total = counts ? counts.conference + counts.vendor + counts.interest + counts.award : null;

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">
      {sidebar}

      <div className="flex-1 ml-[244px] min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200/80 px-7 py-5 sticky top-0 z-20">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <h1 className="font-display font-bold text-[21px] text-slate-900 leading-tight">
                {view === "settings" ? "Ticker Strip" : meta.title}
              </h1>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {view === "settings"
                  ? "The scrolling announcement bar at the top of the public site"
                  : meta.subtitle}
              </p>
            </div>
            {view === "records" && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={exportCSV}
                  disabled={!filtered.length}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-[12.5px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={() => { fetchRows(tab); fetchCounts(); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#04312c] text-white text-[12.5px] font-semibold hover:bg-[#062013] transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>
            )}
          </div>
        </header>

        {view === "settings" ? (
          <div className="p-7">
            <TickerEditor authHeader={authHeader} />
          </div>
        ) : (
        <div className="p-7">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {TABS.map(({ id, label, icon: Icon, accent }) => {
              const active = tab === id;
              const value = counts ? counts[id] : null;
              const pct = total && total > 0 && value !== null ? Math.round((value / total) * 100) : 0;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`group text-left bg-white rounded-2xl p-5 border transition-all ${
                    active
                      ? "border-[#04312c] shadow-md ring-1 ring-[#04312c]/10"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center ${accent}`}>
                      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                    {value !== null ? (
                      <span className="font-display text-[28px] font-bold text-slate-900 tabular-nums leading-none">
                        {value}
                      </span>
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                    )}
                  </div>
                  <p className="text-[12px] font-bold text-slate-600 uppercase tracking-wide mb-2">{label}</p>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${active ? "bg-[#04312c]" : "bg-slate-300"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search records…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-[13px] focus:outline-none focus:border-[#04312c] focus:ring-2 focus:ring-[#04312c]/10 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  statusFilter === "all" ? "bg-[#04312c] text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                All
              </button>
              {STATUS_OPTIONS[tab].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-all ${
                    statusFilter === s ? "bg-[#04312c] text-white" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label htmlFor="pageSize" className="text-[12px] text-slate-400 font-medium">Rows</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 focus:outline-none focus:border-[#04312c] cursor-pointer"
                >
                  {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <span className="text-[12.5px] text-slate-400 font-medium tabular-nums">
                {filtered.length} of {rows.length} records
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#04312c]" />
                <p className="text-[13px] text-slate-400">Loading records…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-[14px] font-semibold text-slate-600">No records found</p>
                <p className="text-[12.5px] text-slate-400">
                  {rows.length > 0 ? "Try adjusting your search or filter." : "Records will appear here once submitted."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80">
                      <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-400 w-10">#</th>
                      {columns.map((col) => {
                        const isSorted = sortKey === col.key;
                        return (
                          <th key={col.key} className="px-4 py-3.5 text-left whitespace-nowrap">
                            <button
                              onClick={() => toggleSort(col.key)}
                              className={`group inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider transition-colors ${
                                isSorted ? "text-[#04312c]" : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              {col.label}
                              {isSorted ? (
                                sortDir === "asc"
                                  ? <ChevronUp className="w-3 h-3" strokeWidth={3} />
                                  : <ChevronDown className="w-3 h-3" strokeWidth={3} />
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              )}
                            </button>
                          </th>
                        );
                      })}
                      <th className="px-4 py-3.5 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paged.map((row, i) => {
                      const id = row._id as string;
                      const open = expanded === id;
                      return (
                        <>
                          <tr key={id} className={`transition-colors ${open ? "bg-emerald-50/40" : "hover:bg-slate-50/60"}`}>
                            <td className="px-5 py-3.5 text-slate-300 text-[11px] font-semibold tabular-nums">{startIdx + i + 1}</td>
                            {columns.map((col) => (
                              <td key={col.key} className="px-4 py-3.5 text-slate-700">
                                {col.key === "status" ? (
                                  <select
                                    value={row.status as string}
                                    onChange={(e) => changeStatus(id, e.target.value)}
                                    className={`text-[11px] font-bold capitalize px-2.5 py-1 rounded-full ring-1 ring-inset cursor-pointer focus:outline-none focus:ring-2 appearance-none pr-6 bg-no-repeat ${STATUS_COLOR[row.status as string] ?? "bg-slate-100 text-slate-600 ring-slate-500/20"}`}
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                      backgroundPosition: "right 6px center",
                                      backgroundSize: "10px",
                                    }}
                                  >
                                    {STATUS_OPTIONS[tab].map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                ) : col.key === "email" || col.key === "nominatorEmail" ? (
                                  <a href={`mailto:${row[col.key]}`} className="text-slate-600 hover:text-[#04312c] hover:underline truncate block max-w-[200px]">
                                    {fmt(row[col.key])}
                                  </a>
                                ) : col.key === "name" || col.key === "companyName" || col.key === "nomineeName" ? (
                                  <span className="font-semibold text-slate-800 truncate block max-w-[180px]" title={fmt(row[col.key])}>
                                    {fmt(row[col.key])}
                                  </span>
                                ) : (
                                  <span className="truncate block max-w-[180px] text-slate-600" title={fmt(row[col.key])}>
                                    {fmt(row[col.key])}
                                  </span>
                                )}
                              </td>
                            ))}
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => setExpanded(open ? null : id)}
                                aria-label={open ? "Collapse" : "Expand"}
                                className={`p-1.5 rounded-lg transition-all ${open ? "bg-[#04312c] text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                              >
                                {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>

                          {open && (
                            <tr key={`${id}-detail`} className="bg-emerald-50/20">
                              <td colSpan={columns.length + 2} className="px-5 py-5">
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                                  {Object.entries(row)
                                    .filter(([k]) => !["_id", "__v"].includes(k))
                                    .map(([k, v]) => (
                                      <div key={k} className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/60">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                          {prettyKey(k)}
                                        </p>
                                        <p className="text-[12.5px] text-slate-700 break-words leading-snug">{fmt(v)}</p>
                                      </div>
                                    ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filtered.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-slate-200/80 bg-slate-50/50">
                <p className="text-[12.5px] text-slate-500 tabular-nums">
                  Showing <strong className="text-slate-700">{startIdx + 1}</strong>–
                  <strong className="text-slate-700">{Math.min(startIdx + pageSize, sorted.length)}</strong> of{" "}
                  <strong className="text-slate-700">{sorted.length}</strong>
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={safePage === 1}
                    aria-label="First page"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {pageRange(safePage, totalPages).map((p, idx) =>
                    p === "gap" ? (
                      <span key={`gap-${idx}`} className="px-1.5 text-slate-300 text-[12px] select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        aria-current={p === safePage ? "page" : undefined}
                        className={`min-w-[30px] h-[30px] px-2 rounded-lg text-[12.5px] font-bold tabular-nums transition-all ${
                          p === safePage
                            ? "bg-[#04312c] text-white shadow-sm"
                            : "text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={safePage === totalPages}
                    aria-label="Last page"
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700 border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
