"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useSignUp, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import {
  GraduationCap, Building2, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff, ChevronRight, ShieldCheck, Sparkles, FileSignature,
} from "lucide-react";
import { API, DASHBOARD_PATH, AccountType } from "@/features/recruitment/useRecruitmentProfile";

type Step = "pick-role" | "details" | "verify" | "creating" | "success" | "signin-email" | "signin-verify";

interface CreatedProfile {
  accountType: AccountType;
  email: string;
  fullName?: string;
  phone?: string;
  institutionName?: string;
  contactPerson?: string;
  createdAt?: string;
}

export default function RegisterClient() {
  const router = useRouter();
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [step, setStep] = useState<Step>("pick-role");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [form, setForm] = useState({
    email: "", fullName: "", phone: "", institutionName: "", contactPerson: "",
  });
  const [terms, setTerms] = useState(false);
  const [code, setCode] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signInMethod, setSignInMethod] = useState<"otp" | "password">("otp");
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [created, setCreated] = useState<CreatedProfile | null>(null);

  // Once the user starts registering, signing in mid-flow must not bounce them
  // away — otherwise the success screen would be skipped.
  const flowStarted = useRef(false);

  // Someone arriving already signed in and registered goes straight to their dashboard.
  useEffect(() => {
    if (flowStarted.current) return;
    if (!isLoaded || !isSignedIn) return;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API}/api/recruitment/me`, {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        });
        if (!res.ok) return;
        const p = await res.json();
        if (p?.accountType) router.replace(DASHBOARD_PATH[p.accountType as AccountType]);
      } catch { /* stay on the form */ }
    })();
  }, [isLoaded, isSignedIn, getToken, router]);

  const goToDashboardAfterSignIn = async () => {
    const token = await getToken();
    const res = await fetch(`${API}/api/recruitment/me`, {
      headers: { Authorization: `Bearer ${token ?? ""}` },
    });
    if (res.ok) {
      const p = await res.json();
      if (p?.accountType) { router.replace(DASHBOARD_PATH[p.accountType as AccountType]); return; }
    }
    router.replace("/recruitment/register");
  };

  const sendSignInCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setBusy(true); setErr("");
    const email = signInEmail.trim();
    try {
      if (clerk.session) { try { await clerk.signOut(); } catch { /* ignore */ } }

      if (signInMethod === "password") {
        // Password sign-in — completes in one step, no OTP needed
        const { error } = await signIn.create({ identifier: email, password: signInPassword });
        if (error) {
          if (error.code === "form_password_incorrect") setErr("Incorrect password. Try again or use the OTP option.");
          else if (error.code === "form_identifier_not_found") setErr("No account found with that email.");
          else setErr(error.message || "Sign-in failed.");
          return;
        }
        if (signIn.status === "complete") {
          const { error: fe } = await signIn.finalize();
          if (fe) { setErr(fe.message || "Sign-in failed."); return; }
        }
        await goToDashboardAfterSignIn();
        return;
      }

      // OTP sign-in
      const { error } = await signIn.create({ identifier: email });
      if (error) {
        if (error.code === "form_identifier_not_found") setErr("No account found with that email.");
        else setErr(error.message || "Could not find that account.");
        return;
      }
      const { error: sendErr } = await signIn.emailCode.sendCode();
      if (sendErr) { setErr(sendErr.message || "Could not send code."); return; }
      setMode("signin"); setStep("signin-verify");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifySignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || code.length < 6) return;
    setBusy(true); setErr("");
    try {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) { setErr(error.message || "That code didn't work."); return; }
      if (signIn.status === "complete") {
        const { error: fe } = await signIn.finalize();
        if (fe) { setErr(fe.message || "Sign-in failed."); return; }
      }
      await goToDashboardAfterSignIn();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || !signUp) return;
    setBusy(true); setErr("");
    const email = form.email.trim();
    try {
      if (clerk.session) { try { await clerk.signOut(); } catch { /* ignore */ } }

      let { error: createErr } = await signUp.create({ emailAddress: email });

      if (createErr?.code === "session_exists") {
        try { await clerk.signOut(); } catch { /* ignore */ }
        ({ error: createErr } = await signUp.create({ emailAddress: email }));
      }

      // Existing Clerk identity → sign in with a code instead
      if (createErr?.code === "form_identifier_exists") {
        const { error: siErr } = await signIn.create({ identifier: email });
        if (siErr) { setErr(siErr.message || "Could not send code."); return; }
        const { error: sendErr } = await signIn.emailCode.sendCode();
        if (sendErr) { setErr(sendErr.message || "Could not send code."); return; }
        setMode("signin"); setStep("verify"); return;
      }
      if (createErr) { setErr(createErr.message || "Could not send code."); return; }

      if (signUp.missingFields.includes("password")) {
        const pw = `Rc${Math.random().toString(36).slice(2)}${Date.now()}!Aa`;
        const { error: pwErr } = await signUp.password({ password: pw });
        if (pwErr) { setErr(pwErr.message || "Could not send code."); return; }
      }
      const { error: codeErr } = await signUp.verifications.sendEmailCode();
      if (codeErr) { setErr(codeErr.message || "Could not send code."); return; }
      setMode("signup"); setStep("verify");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const verifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || !signUp || code.length < 6 || !accountType) return;
    setBusy(true); setErr("");
    try {
      if (mode === "signin") {
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
          if (fe) { setErr(fe.message || "Sign-up failed."); return; }
        }
      }

      setStep("creating");

      // Clerk session now exists; create the role profile server-side.
      const token = await getToken();
      const res = await fetch(`${API}/api/recruitment/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token ?? ""}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          acceptedTerms: true,
          fullName: form.fullName,
          phone: form.phone,
          institutionName: form.institutionName,
          contactPerson: form.contactPerson,
        }),
      });

      if (res.status === 409) {
        // Already registered — route to whichever dashboard they belong to.
        const body = await res.json().catch(() => ({}));
        const t = (body.accountType as AccountType) ?? accountType;
        router.replace(DASHBOARD_PATH[t]);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErr(body.error || "Could not complete registration.");
        setStep("verify");
        return;
      }

      // Show what was created, with role and details, before entering the dashboard.
      setCreated((await res.json()) as CreatedProfile);
      setStep("success");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setStep("verify");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full border border-line rounded-xl px-4 py-2.5 text-[14px] text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";
  const label = "block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";
  const btn =
    "w-full bg-[#0E733B] text-white py-3 rounded-xl font-bold text-[14px] hover:bg-[#0B5C2F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2";

  const isSchool = accountType === "SCHOOL_ADMIN";
  const detailsValid =
    form.email.trim() && terms &&
    (isSchool ? form.institutionName.trim() : form.fullName.trim());

  const isSignInStep = step === "signin-email" || step === "signin-verify";

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-[#F5F7F5]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
      <AuthBrandPanel signIn={isSignInStep} />
      <div className="flex items-center justify-center px-4 sm:px-8 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="mb-7">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0E733B]">EduBeacon Recruitment</p>
          <h1 className="mt-2 text-[28px] sm:text-[30px] font-bold leading-tight text-[#0C2A1B]">
            {step === "success" ? "You're all set" : isSignInStep ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-[14.5px] text-slate-600 mt-1.5">
            {step === "success"
              ? "Your account is ready."
              : isSignInStep
              ? "Sign in to continue to your dashboard."
              : "Join as a teacher or a school — it takes a minute."}
          </p>
        </div>

        {/* ── Register / Sign In tabs (hidden during success / creating / verify steps) ── */}
        {(step === "pick-role" || step === "details" || step === "signin-email") && (
          <div role="tablist" className="flex bg-white ring-1 ring-slate-200 rounded-full p-1 mb-5">
            <button
              role="tab"
              aria-selected={!isSignInStep}
              onClick={() => { setStep("pick-role"); setErr(""); }}
              className={`flex-1 py-2.5 text-[14px] font-semibold rounded-full transition-all ${
                !isSignInStep ? "bg-[#0C2A1B] text-white shadow-sm" : "text-slate-600 hover:text-[#0C2A1B]"
              }`}
            >
              Register
            </button>
            <button
              role="tab"
              aria-selected={isSignInStep}
              onClick={() => { flowStarted.current = true; setStep("signin-email"); setErr(""); setCode(""); }}
              className={`flex-1 py-2.5 text-[14px] font-semibold rounded-full transition-all ${
                isSignInStep ? "bg-[#0C2A1B] text-white shadow-sm" : "text-slate-600 hover:text-[#0C2A1B]"
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_-24px_rgba(12,42,27,0.35)] p-6 sm:p-7">
          {/* ── Step 1: role ── */}
          {step === "pick-role" && (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-slate-700 mb-1">I want to…</p>
              {([
                { type: "TEACHER" as AccountType, icon: GraduationCap, title: "Find a teaching job", desc: "Build one profile and apply to verified schools" },
                { type: "SCHOOL_ADMIN" as AccountType, icon: Building2, title: "Hire teachers for my school", desc: "Post roles, AI-screen applicants and send offers" },
              ]).map(({ type, icon: Icon, title, desc }) => (
                <button
                  key={type}
                  onClick={() => { flowStarted.current = true; setAccountType(type); setStep("details"); }}
                  className="text-left border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-[#0E733B] hover:bg-[#F3FAF6] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0 group-hover:bg-[#0C2A1B] transition-colors">
                      <Icon className="w-5 h-5 text-[#0E733B] group-hover:text-[#8FE3B0] transition-colors" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[15.5px] text-[#0C2A1B]">{title}</p>
                      <p className="text-[13px] text-slate-600 mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0E733B] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </button>
              ))}
              <p className="text-[12px] text-slate-500 text-center mt-2">
                Account type is set once and can&apos;t be changed later.
              </p>
            </div>
          )}

          {/* ── Step 2: details ── */}
          {step === "details" && (
            <form onSubmit={sendCode} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => { setStep("pick-role"); setErr(""); }}
                className="flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-charcoal transition-colors -mt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change account type
              </button>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <p className="text-[12.5px] font-semibold text-[#0E733B]">
                  {isSchool ? "School / Institution account" : "Teacher / Candidate account"}
                </p>
              </div>

              {isSchool ? (
                <>
                  <div>
                    <label className={label}>Institution name *</label>
                    <input required className={input} value={form.institutionName}
                      onChange={(e) => setForm({ ...form, institutionName: e.target.value })} />
                  </div>
                  <div>
                    <label className={label}>Contact person</label>
                    <input className={input} value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
                  </div>
                </>
              ) : (
                <div>
                  <label className={label}>Full name *</label>
                  <input required className={input} value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
              )}

              <div>
                <label className={label}>{isSchool ? "Official email *" : "Email address *"}</label>
                <input required type="email" className={input} value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} />
              </div>

              <div>
                <label className={label}>Phone</label>
                <input type="tel" inputMode="numeric" maxLength={10} className={input} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#0E733B] cursor-pointer shrink-0" />
                <span className="text-[12.5px] text-slate-600 leading-relaxed">
                  I accept the terms of use and privacy notice.
                </span>
              </label>

              {err && <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>}

              <div id="clerk-captcha" className="empty:hidden" />

              <button type="submit" disabled={busy || !detailsValid} className={btn}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "Sending code…" : "Verify email to continue"}
              </button>
              {isSchool && (
                <p className="text-[11.5px] text-slate-500 text-center">
                  Institution verification is a separate review; registering doesn&apos;t grant a verified badge.
                </p>
              )}
            </form>
          )}

          {/* ── Step 3: verify ── */}
          {step === "verify" && (
            <form onSubmit={verifyAndRegister} className="flex flex-col gap-4">
              <p className="text-[13.5px] text-slate-600 text-center">
                Enter the 6-digit code sent to<br />
                <strong className="text-charcoal">{form.email}</strong>
              </p>
              <input
                type="text" inputMode="numeric" required autoFocus maxLength={6} placeholder="000000"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
                className="w-full border border-line rounded-xl px-4 py-3.5 text-[22px] text-center tracking-[0.45em] font-bold text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10"
              />
              {err && <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>}
              <button type="submit" disabled={busy || code.length < 6} className={btn}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "Verifying…" : "Verify & create account"}
              </button>
              <button type="button" onClick={() => { setStep("details"); setCode(""); setErr(""); }}
                className="text-[12.5px] text-slate-500 hover:text-charcoal transition-colors">
                ← Use a different email
              </button>
            </form>
          )}

          {/* ── Step 4: creating ── */}
          {step === "creating" && (
            <div className="py-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#0E733B] mx-auto mb-4" strokeWidth={1.6} />
              <p className="font-bold text-[15px] text-charcoal mb-1">Email verified</p>
              <p className="text-[13px] text-slate-600 flex items-center justify-center gap-2 mt-3">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Setting up your account…
              </p>
            </div>
          )}

          {/* ── Step 5: success — role + details confirmation ── */}
          {step === "success" && created && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[#0E733B]" strokeWidth={1.8} />
                </div>
                <h2 className="font-display font-bold text-[21px] text-charcoal mb-1.5">
                  Registration successful
                </h2>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">
                  Your account is active and your email is verified.
                </p>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3.5 mb-4">
                {created.accountType === "SCHOOL_ADMIN"
                  ? <Building2 className="w-5 h-5 text-[#0E733B] shrink-0" strokeWidth={1.8} />
                  : <GraduationCap className="w-5 h-5 text-[#0E733B] shrink-0" strokeWidth={1.8} />}
                <div className="min-w-0">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E733B]">
                    Account type
                  </p>
                  <p className="font-bold text-[14.5px] text-charcoal">
                    {created.accountType === "SCHOOL_ADMIN" ? "School / Institution" : "Teacher / Candidate"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="border border-line rounded-xl divide-y divide-line mb-5">
                {(created.accountType === "SCHOOL_ADMIN"
                  ? [
                      ["Institution", created.institutionName],
                      ["Contact person", created.contactPerson],
                      ["Email", created.email],
                      ["Phone", created.phone],
                    ]
                  : [
                      ["Full name", created.fullName],
                      ["Email", created.email],
                      ["Phone", created.phone],
                    ]
                )
                  .filter(([, v]) => v && String(v).trim())
                  .map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4 px-4 py-2.5">
                      <span className="text-[12.5px] text-slate-500 shrink-0">{k}</span>
                      <span className="text-[13px] font-semibold text-charcoal text-right break-words">{v}</span>
                    </div>
                  ))}
                <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="text-[12.5px] text-slate-500">Email verified</span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0E733B]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                  </span>
                </div>
                {created.accountType === "SCHOOL_ADMIN" && (
                  <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <span className="text-[12.5px] text-slate-500">Institution verified</span>
                    <span className="text-[12px] font-bold text-amber-700">Pending review</span>
                  </div>
                )}
              </div>

              {created.accountType === "SCHOOL_ADMIN" && (
                <p className="text-[12px] text-slate-500 leading-relaxed mb-5 text-center">
                  Complete your institution profile to be considered for verification.
                </p>
              )}

              <button
                onClick={() => router.replace(
                  created.accountType === "TEACHER"
                    ? "/recruitment/onboarding"
                    : DASHBOARD_PATH[created.accountType]
                )}
                className={btn}
              >
                {created.accountType === "TEACHER" ? "Complete your profile →" : "Go to my dashboard →"}
              </button>
            </div>
          )}

          {/* ── Sign In: enter email (+ optional password) ── */}
          {step === "signin-email" && (
            <form onSubmit={sendSignInCode} className="flex flex-col gap-4">

              {/* OTP / Password toggle */}
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button type="button"
                  onClick={() => { setSignInMethod("otp"); setErr(""); }}
                  className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-md transition-all ${signInMethod === "otp" ? "bg-white shadow text-charcoal" : "text-slate-500"}`}>
                  Email OTP
                </button>
                <button type="button"
                  onClick={() => { setSignInMethod("password"); setErr(""); }}
                  className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-md transition-all ${signInMethod === "password" ? "bg-white shadow text-charcoal" : "text-slate-500"}`}>
                  Password
                </button>
              </div>

              <div>
                <label className={label}>Registered email *</label>
                <input
                  required type="email" autoFocus className={input}
                  value={signInEmail}
                  placeholder="you@example.com"
                  onChange={(e) => { setSignInEmail(e.target.value); setErr(""); }}
                />
              </div>

              {signInMethod === "password" && (
                <div>
                  <label className={label}>Password *</label>
                  <div className="relative">
                    <input
                      required type={showPassword ? "text" : "password"} className={input}
                      value={signInPassword}
                      placeholder="Enter your password"
                      onChange={(e) => { setSignInPassword(e.target.value); setErr(""); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {err && (
                <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>
              )}
              <div id="clerk-captcha-signin" className="empty:hidden" />
              <button type="submit" disabled={busy || !signInEmail.trim() || (signInMethod === "password" && !signInPassword)} className={btn}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy
                  ? (signInMethod === "password" ? "Signing in…" : "Sending code…")
                  : (signInMethod === "password" ? "Sign In" : "Send sign-in code")}
              </button>
              <p className="text-[12px] text-slate-500 text-center">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => { setStep("pick-role"); setErr(""); }}
                  className="text-[#0E733B] font-semibold hover:underline">
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* ── Sign In: enter OTP ── */}
          {step === "signin-verify" && (
            <form onSubmit={verifySignIn} className="flex flex-col gap-4">
              <p className="text-[13.5px] text-slate-600 text-center">
                Enter the 6-digit code sent to<br />
                <strong className="text-charcoal">{signInEmail}</strong>
              </p>
              <input
                type="text" inputMode="numeric" required autoFocus maxLength={6} placeholder="000000"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
                className="w-full border border-line rounded-xl px-4 py-3.5 text-[22px] text-center tracking-[0.45em] font-bold text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10"
              />
              {err && (
                <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{err}</p>
              )}
              <button type="submit" disabled={busy || code.length < 6} className={btn}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button type="button" onClick={() => { setStep("signin-email"); setCode(""); setErr(""); }}
                className="text-[12.5px] text-slate-500 hover:text-charcoal transition-colors">
                ← Use a different email
              </button>
            </form>
          )}
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0E733B]" /> Every account is email-verified with a one-time code
        </p>
      </div>
      </div>
    </div>
  );
}

function AuthBrandPanel({ signIn }: { signIn: boolean }) {
  const [stats, setStats] = useState<{ teachers: number; schools: number; openJobs: number } | null>(null);
  useEffect(() => {
    fetch(`${API}/api/recruitment/stats`).then((r) => (r.ok ? r.json() : null)).then(setStats).catch(() => {});
  }, []);

  return (
    <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden text-white p-12 xl:p-16" style={{ background: "linear-gradient(160deg, #071A10 0%, #0C2A1B 50%, #0E3524 100%)" }}>
      <Image src="/images/recruitment/hero-teacher.jpg" alt="" fill sizes="50vw" className="object-cover object-top opacity-25" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#071A10] via-[#0C2A1B]/80 to-[#0C2A1B]/40" />
      <div aria-hidden className="absolute -right-24 top-1/3 w-80 h-80 rounded-full bg-[#10B981]/20 blur-3xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#8FE3B0]">
          <Sparkles className="w-3.5 h-3.5" /> {signIn ? "Good to see you again" : "Join EduBeacon Recruitment"}
        </span>
        <h2 className="mt-6 text-[36px] xl:text-[42px] font-bold leading-[1.1] tracking-tight max-w-[14ch]">
          Where schools and teachers <span className="text-[#8FE3B0]">find each other.</span>
        </h2>
        <ul className="mt-8 flex flex-col gap-4 max-w-md">
          {[
            [GraduationCap, "Teachers", "One profile, one-click applications, every stage tracked."],
            [Building2, "Schools", "AI-screened applicants, one pipeline, offer letters in-app."],
            [FileSignature, "Both", "Offers and salary talks on the record — no middlemen."],
          ].map(([Icon, t, d]) => {
            const I = Icon as React.ElementType;
            return (
              <li key={t as string} className="flex gap-3.5">
                <span className="w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center shrink-0"><I className="w-4 h-4 text-[#8FE3B0]" /></span>
                <span><span className="block text-[14.5px] font-semibold">{t as string}</span><span className="block text-[13.5px] text-white/70">{d as string}</span></span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative grid grid-cols-3 gap-3 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-5 backdrop-blur">
        {[
          [stats?.teachers, "Teacher candidates"],
          [stats?.schools, "Schools"],
          [stats?.openJobs, "Open roles"],
        ].map(([v, l], i) => (
          <div key={l as string} className={i ? "border-l border-white/10 pl-4" : ""}>
            <p className="text-[26px] font-bold leading-none tabular-nums">{v === undefined ? "—" : (v as number).toLocaleString("en-IN")}</p>
            <p className="mt-1.5 text-[12px] text-white/70">{l as string}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
