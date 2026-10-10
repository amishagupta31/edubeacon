"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useSignUp, useAuth } from "@clerk/nextjs";
import { GraduationCap, Building2, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAF8] py-14 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-[26px] text-charcoal">Recruitment Portal</h1>
          <p className="text-[14px] text-slate-600 mt-1.5">
            {step === "success" ? "You're all set" : isSignInStep ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* ── Register / Sign In tabs (hidden during success / creating / verify steps) ── */}
        {(step === "pick-role" || step === "details" || step === "signin-email") && (
          <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setStep("pick-role"); setErr(""); }}
              className={`flex-1 py-2 text-[13.5px] font-bold rounded-lg transition-all ${
                !isSignInStep ? "bg-white shadow-sm text-charcoal" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { flowStarted.current = true; setStep("signin-email"); setErr(""); setCode(""); }}
              className={`flex-1 py-2 text-[13.5px] font-bold rounded-lg transition-all ${
                isSignInStep ? "bg-white shadow-sm text-charcoal" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-line shadow-sm p-7">
          {/* ── Step 1: role ── */}
          {step === "pick-role" && (
            <div className="flex flex-col gap-3">
              {([
                { type: "TEACHER" as AccountType, icon: GraduationCap, title: "Teacher / Candidate", desc: "Build a profile and apply to schools" },
                { type: "SCHOOL_ADMIN" as AccountType, icon: Building2, title: "School / Institution", desc: "Post roles and review applicants" },
              ]).map(({ type, icon: Icon, title, desc }) => (
                <button
                  key={type}
                  onClick={() => { flowStarted.current = true; setAccountType(type); setStep("details"); }}
                  className="text-left border border-line rounded-xl p-5 hover:border-[#0E733B] hover:bg-emerald-50/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <Icon className="w-5 h-5 text-[#0E733B]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-charcoal">{title}</p>
                      <p className="text-[13px] text-slate-600 mt-0.5">{desc}</p>
                    </div>
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
      </div>
    </div>
  );
}
