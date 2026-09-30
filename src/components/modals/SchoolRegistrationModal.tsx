"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Download,
  Calendar,
} from "lucide-react";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import ModalShell from "./ModalShell";

const roleOptions = [
  "Chairman",
  "Manager",
  "Director",
  "Principal",
  "Vice Principal",
  "PGT",
];

const classLevelOptions = [
  "PG",
  "Primary",
  "Middle",
  "Secondary",
  "Senior Secondary",
];

const aiToolOptions = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Grok",
  "Other",
];

const experienceOptions = [
  "0 – 2 Years",
  "3 – 5 Years",
  "6 – 10 Years",
  "11 – 15 Years",
  "15+ Years",
];

const exploringOptions = [
  "Teacher Training",
  "Student Counselling",
  "Recruitment Services",
  "AI / Robotics / STEM Labs",
  "Special Classes – Art Therapy / Music / Yoga / IIT Coaching / NEET",
  "Smart Screens / Projectors",
  "Marketing Services",
  "Admission Agents",
  "School Cafeteria Vendors / Vending Machines",
  "Printing & Publishing",
  "ERP / CRM / Billing",
  "Other",
];

const stateOptions = [
  "Uttarakhand",
  "Delhi NCR",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Rajasthan",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Madhya Pradesh",
  "Gujarat",
  "Bihar",
  "Other State / UT",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SchoolRegistrationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [form, setForm] = useState({
    // Page 1: Personal & Institutional Details
    name: "",
    email: "",
    role: "Principal",
    otherRole: "",
    school: "",
    address: "",
    city: "",
    state: "Uttarakhand",
    phone: "",
    whatsapp: "",
    sameAsPhone: true,
    associationName: "",

    // Page 2: Academic Profile & AI Integration
    teachingExperience: "6 – 10 Years",
    classesTaught: ["Secondary", "Senior Secondary"] as string[],
    subjectsTaught: "",
    usesAiInWork: true,
    aiTools: ["ChatGPT", "Gemini"] as string[],
    otherAiTool: "",

    // Page 3: Services / products being explored
    exploringServices: [] as string[],
    otherExploring: "",
  });

  // Strict numerical-only handler (strips non-digits, max 10 digits)
  const handlePhoneChange = (val: string) => {
    const numericOnly = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({
      ...f,
      phone: numericOnly,
      whatsapp: f.sameAsPhone ? numericOnly : f.whatsapp,
    }));
  };

  // Strict numerical-only handler for WhatsApp
  const handleWhatsappChange = (val: string) => {
    const numericOnly = val.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({
      ...f,
      whatsapp: numericOnly,
    }));
  };

  const toggleClassLevel = (level: string) => {
    setForm((f) => ({
      ...f,
      classesTaught: f.classesTaught.includes(level)
        ? f.classesTaught.filter((l) => l !== level)
        : [...f.classesTaught, level],
    }));
  };

  const toggleAiTool = (tool: string) => {
    setForm((f) => ({
      ...f,
      aiTools: f.aiTools.includes(tool)
        ? f.aiTools.filter((t) => t !== tool)
        : [...f.aiTools, tool],
    }));
  };

  const toggleExploring = (option: string) => {
    setForm((f) => ({
      ...f,
      exploringServices: f.exploringServices.includes(option)
        ? f.exploringServices.filter((o) => o !== option)
        : [...f.exploringServices, option],
    }));
  };

  const handleNextToExploring = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.school.trim() || !form.phone.trim() || !form.city.trim()) {
      alert("Please fill in all required fields on Page 1.");
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!emailVerified) {
      alert("Please verify your email address before continuing.");
      return;
    }
    if (form.phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (form.whatsapp.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }
    setStep(2);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Clerk: email-code verification, scoped to this conference registration only ──
  const clerk = useClerk();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [verifyMode, setVerifyMode] = useState<"signup" | "signin" | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Editing the email after sending/verifying a code invalidates that attempt
  const handleEmailChange = (value: string) => {
    setForm((f) => ({ ...f, email: value }));
    if (emailVerified || codeSent) {
      setEmailVerified(false);
      setCodeSent(false);
      setVerifyMode(null);
      setCode("");
      setVerifyError("");
    }
  };

  // ClerkJS surfaces a raw "TypeError: Failed to fetch" for connectivity blips — show
  // something a visitor can actually act on instead of the technical message.
  const describeVerificationError = (err: unknown, fallback: string) => {
    if (err instanceof Error && /failed to fetch|network ?error|load failed/i.test(err.message)) {
      return "Network error, please check your internet connection and try again.";
    }
    return err instanceof Error ? err.message : fallback;
  };

  const sendVerificationCode = async () => {
    const email = form.email.trim();
    if (!email) return;
    setVerifyError("");
    setIsSendingCode(true);
    try {
      // Clerk allows only one active session per browser. If this browser is already
      // signed in (e.g. from an earlier registration), "session_exists" would otherwise
      // block a fresh sign-up here.
      if (clerk.session) {
        const alreadySignedInAsThisEmail = clerk.user?.emailAddresses?.some(
          (e) => e.emailAddress.toLowerCase() === email.toLowerCase()
        );
        if (alreadySignedInAsThisEmail) {
          // Already verified as this exact person in this browser — no need to re-verify
          setEmailVerified(true);
          return;
        }
        // A different email on this device — clear the old session before starting fresh
        try {
          await clerk.signOut();
        } catch {
          // A network blip here shouldn't block the attempt below — signUp.create()
          // will tell us plainly (via "session_exists") if the old session is still around.
        }
      }

      let { error: createError } = await signUp.create({ emailAddress: email });

      // If a stale session is still around (e.g. the sign-out above didn't land because of a
      // network blip), clear it and retry once instead of leaving the person stuck.
      if (createError && createError.code === "session_exists") {
        try {
          await clerk.signOut();
        } catch {
          // ignore — the retry below will surface a clear error if this still fails
        }
        ({ error: createError } = await signUp.create({ emailAddress: email }));
      }

      if (createError && createError.code === "form_identifier_exists") {
        // Already registered with Clerk before — sign them back in with an email code instead
        const { error: signInError } = await signIn.create({ identifier: email });
        if (signInError) {
          setVerifyError(signInError.message || "Could not send a verification code. Please try again.");
          return;
        }
        const supportsEmailCode = signIn.supportedFirstFactors?.some((f) => f.strategy === "email_code");
        if (!supportsEmailCode) {
          setVerifyError("This email can't be verified by code. Please use a different email address.");
          return;
        }
        const { error: sendError } = await signIn.emailCode.sendCode();
        if (sendError) {
          setVerifyError(sendError.message || "Could not send a verification code. Please try again.");
          return;
        }
        setVerifyMode("signin");
        setCodeSent(true);
        return;
      }

      if (createError) {
        setVerifyError(createError.message || "Could not send a verification code. Please try again.");
        return;
      }

      // Some Clerk instances require a password to sign up — fill one in automatically
      if (signUp.missingFields.includes("password")) {
        const generatedPassword = `Edb${Math.random().toString(36).slice(2)}${Date.now()}!Aa`;
        const { error: passwordError } = await signUp.password({ password: generatedPassword });
        if (passwordError) {
          setVerifyError(passwordError.message || "Could not send a verification code. Please try again.");
          return;
        }
      }

      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) {
        setVerifyError(codeError.message || "Could not send a verification code. Please try again.");
        return;
      }
      setVerifyMode("signup");
      setCodeSent(true);
    } catch (err) {
      setVerifyError(describeVerificationError(err, "Could not send a verification code. Please try again."));
    } finally {
      setIsSendingCode(false);
    }
  };

  const finalizeRegistration = async () => {
    setIsSubmitting(true);
    const registration = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role === "Other" ? form.otherRole.trim() : form.role,
      school: form.school.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      associationName: form.associationName.trim(),
      teachingExperience: form.teachingExperience,
      classesTaught: form.classesTaught.join(", "),
      subjectsTaught: form.subjectsTaught.trim(),
      usesAiInWork: form.usesAiInWork ? "Yes" : "No",
      aiTools: (
        form.aiTools.includes("Other") && form.otherAiTool.trim()
          ? [...form.aiTools.filter((t) => t !== "Other"), form.otherAiTool.trim()]
          : form.aiTools
      ).join(", "),
      exploringServices: (
        form.exploringServices.includes("Other") && form.otherExploring.trim()
          ? [...form.exploringServices.filter((o) => o !== "Other"), form.otherExploring.trim()]
          : form.exploringServices
      ).join(", "),
      registeredAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    try {
      // Store the registration on the now-verified Clerk user (visible in the Clerk Dashboard)
      await clerk.user?.update({
        unsafeMetadata: {
          ...(clerk.user.unsafeMetadata || {}),
          conferenceRegistration: registration,
        },
      });
    } catch (err) {
      console.error("Failed to save conference registration to Clerk:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleVerifyInlineCode = async () => {
    if (code.length < 6) return;
    setVerifyError("");
    setIsVerifying(true);
    try {
      if (verifyMode === "signup") {
        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) {
          setVerifyError(error.message || "That code didn't work. Please try again.");
          return;
        }
        if (signUp.status === "complete") {
          const { error: finalizeError } = await signUp.finalize();
          if (finalizeError) {
            setVerifyError(finalizeError.message || "Could not verify your email. Please try again.");
            return;
          }
          setEmailVerified(true);
        } else {
          setVerifyError("That code didn't complete verification. Please check it and try again.");
        }
      } else if (verifyMode === "signin") {
        const { error } = await signIn.emailCode.verifyCode({ code });
        if (error) {
          setVerifyError(error.message || "That code didn't work. Please try again.");
          return;
        }
        if (signIn.status === "complete") {
          const { error: finalizeError } = await signIn.finalize();
          if (finalizeError) {
            setVerifyError(finalizeError.message || "Could not verify your email. Please try again.");
            return;
          }
          setEmailVerified(true);
        } else {
          setVerifyError("That code didn't complete verification. Please check it and try again.");
        }
      }
    } catch (err) {
      setVerifyError(describeVerificationError(err, "That code didn't work. Please try again."));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      alert("Please verify your email address on Page 1 before completing registration.");
      setStep(1);
      return;
    }
    await finalizeRegistration();
  };

  const handleDownloadBadge = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    // Background Dark Emerald Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#05160E");
    bgGrad.addColorStop(0.5, "#0B4B27");
    bgGrad.addColorStop(1, "#04130A");
    ctx.fillStyle = bgGrad;

    // Rounded Card
    const r = 36;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle Outer Card Border
    ctx.strokeStyle = "rgba(110, 231, 183, 0.4)";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Ambient radial glow
    const glowGrad = ctx.createRadialGradient(width - 150, 150, 10, width - 150, 150, 400);
    glowGrad.addColorStop(0, "rgba(52, 211, 153, 0.25)");
    glowGrad.addColorStop(1, "rgba(52, 211, 153, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Dot Grid
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    for (let x = 40; x < width - 40; x += 32) {
      for (let y = 40; y < height - 40; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Header - Logo Box
    const logoX = 70;
    const logoY = 65;
    const logoSize = 64;
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(logoX, logoY, logoSize, logoSize, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EB", logoX + logoSize / 2, logoY + logoSize / 2);

    // Brand Name & Subtitle
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("EduBeacon 2026", logoX + logoSize + 20, logoY + 30);

    ctx.fillStyle = "#6EE7B7";
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("AI, NEP & THE FUTURE OF LEARNING", logoX + logoSize + 20, logoY + 56);

    // Role Tag Pill (Top Right)
    const displayRole = (form.role === "Other" ? form.otherRole : form.role) || "DELEGATE";
    const roleText = displayRole.toUpperCase();
    ctx.font = "bold 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const pillWidth = ctx.measureText(roleText).width + 36;
    const pillHeight = 44;
    const pillX = width - 70 - pillWidth;
    const pillY = 75;

    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.strokeStyle = "rgba(52, 211, 153, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#6EE7B7";
    ctx.textAlign = "center";
    ctx.fillText(roleText, pillX + pillWidth / 2, pillY + 28);

    // Divider Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, 160);
    ctx.lineTo(width - 70, 160);
    ctx.stroke();

    // Main Tagline
    ctx.textAlign = "left";
    ctx.fillStyle = "#34D399";
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("CONFIRMED CONFERENCE DELEGATE", 70, 205);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const headline = form.role === "PGT"
      ? "Teachers Who Inspire. Ideas That Transform."
      : "Welcome to EduBeacon";
    ctx.fillText(headline, 70, 252);

    // Profile Box
    const boxX = 70;
    const boxY = 290;
    const boxW = width - 140;
    const boxH = 230;

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.stroke();

    // Avatar Icon
    const avX = boxX + 35;
    const avY = boxY + 45;
    const avR = 55;
    const avGrad = ctx.createLinearGradient(avX, avY, avX + avR * 2, avY + avR * 2);
    avGrad.addColorStop(0, "#34D399");
    avGrad.addColorStop(1, "#5EEAD4");
    ctx.fillStyle = avGrad;
    ctx.beginPath();
    ctx.arc(avX + avR, avY + avR, avR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#04130A";
    ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initial = (form.name || "D").trim().charAt(0).toUpperCase();
    ctx.fillText(initial, avX + avR, avY + avR);

    // Participant Text Info
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(form.name || "Delegate Name", boxX + 175, boxY + 75);

    ctx.fillStyle = "#A7F3D0";
    ctx.font = "600 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText(displayRole, boxX + 175, boxY + 115);

    ctx.fillStyle = "#E2E8F0";
    ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const schoolLocation = form.city ? `${form.school} • ${form.city}, ${form.state}` : form.school;
    ctx.fillText(schoolLocation, boxX + 175, boxY + 155);

    // AI Tools Stack (if applicable)
    if (form.usesAiInWork && form.aiTools.length > 0) {
      let tagX = boxX + 175;
      ctx.fillStyle = "#6EE7B7";
      ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("AI Stack:", tagX, boxY + 198);
      tagX += 78;

      form.aiTools.slice(0, 4).forEach((tool) => {
        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        const tw = ctx.measureText(tool).width + 20;
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(tagX, boxY + 180, tw, 28, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#E6FFFA";
        ctx.fillText(tool, tagX + 10, boxY + 199);
        tagX += tw + 10;
      });
    }

    // Bottom Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, 560);
    ctx.lineTo(width - 70, 560);
    ctx.stroke();

    // Footer Info
    ctx.fillStyle = "#34D399";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("🗓️  25 October 2026", 70, 615);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("📍  Dehradun, Uttarakhand, India", 430, 615);

    ctx.textAlign = "right";
    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("VERIFIED DELEGATE PASS", width - 70, 615);

    // Instant Fast Download
    const imageURL = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    const safeName = (form.name || "Delegate").trim().replace(/[^a-zA-Z0-9]/g, "_");
    downloadLink.download = `EduBeacon-Delegate-Badge-${safeName}.png`;
    downloadLink.href = imageURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // ── Success State: Registration Confirmed & Participant Creative Badge ──
  if (submitted) {
    return (
      <ModalShell title="Registration Confirmed! 🎉" onClose={onClose} size="lg">
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <CheckCircle2 className="w-7 h-7 text-[#0E733B]" />
          </div>

          <h3 className="font-display text-[22px] font-bold text-charcoal mb-1">
            Welcome to EduBeacon, {form.name}!
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg mx-auto">
            Your conference pass application for <strong>{form.school}</strong> ({form.city}, {form.state}) has been confirmed.
          </p>

          {/* Generated Personalized Participant Creative Badge */}
          <div className="max-w-sm mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#061A10] via-[#0E733B] to-[#061A10] p-6 text-white shadow-2xl relative overflow-hidden border border-emerald-400/30 text-left">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-xs">
                  EB
                </div>
                <div>
                  <h4 className="font-extrabold text-xs leading-none">EduBeacon 2026</h4>
                  <span className="text-[8.5px] text-emerald-300 uppercase tracking-wider font-semibold">AI, NEP & the Future of Learning</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {form.role.toUpperCase()}
              </span>
            </div>

            <div className="relative z-10 mb-3">
              <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-emerald-300 block mb-0.5">
                CONFIRMED DELEGATE
              </span>
              <h4 className="font-extrabold font-display text-[19px] leading-tight text-white">
                {form.role === "PGT" ? "Teachers Who Inspire. Ideas That Transform." : "Welcome to EduBeacon"}
              </h4>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-[#061A10] font-black text-lg flex items-center justify-center shrink-0">
                {form.name.charAt(0) || "D"}
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-extrabold text-sm text-white truncate">{form.name}</h5>
                <p className="text-[11px] text-emerald-200 truncate">{form.role === "Other" ? form.otherRole : form.role}</p>
                <p className="text-[10.5px] text-slate-300 truncate">{form.school}</p>
              </div>
            </div>

            {form.usesAiInWork && form.aiTools.length > 0 && (
              <div className="relative z-10 mb-3 flex flex-wrap gap-1">
                <span className="text-[9px] text-emerald-300 font-semibold mr-1">AI Stack:</span>
                {form.aiTools.map((tool) => (
                  <span key={tool} className="text-[8.5px] font-semibold bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-400/20">
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-200 border-t border-white/15 pt-2.5">
              <span className="flex items-center gap-1 font-bold text-emerald-300">
                <Calendar className="w-3 h-3" /> 11 Oct 2026
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-emerald-300" /> Shivalik University, Dehradun
              </span>
            </div>
          </div>

          {/* Action Buttons: Instant High-Res Download & Close */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadBadge}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Delegate Badge</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Conference Event Registration" onClose={onClose} size="lg">
      {/* 3-Step Progress Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {(() => {
            const stepItems = [
              { n: 1 as const, label: "Personal & School Details" },
              { n: 2 as const, label: "Academic Profile & AI Tools" },
              { n: 3 as const, label: "Exploring Services" },
            ];
            return stepItems.map((item, i) => (
              <div key={item.n} className={`flex items-center ${i < stepItems.length - 1 ? "flex-1" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step === item.n
                      ? "bg-[#0E733B] text-white"
                      : step > item.n
                        ? "bg-emerald-100 text-[#0E733B]"
                        : "bg-gray-100 text-slate-400"
                    }`}>
                    {item.n}
                  </span>
                  <span className={`text-xs font-bold hidden sm:inline ${step === item.n ? "text-charcoal" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </div>
                {i < stepItems.length - 1 && (
                  <div className="h-0.5 flex-1 mx-3 bg-gray-200">
                    <div className={`h-full bg-[#0E733B] transition-all duration-300 ${step > item.n ? "w-full" : "w-0"}`} />
                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      </div>

      {/* ──────────────── PAGE 1: Personal & Institutional Details ──────────────── */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Dr. Arvind Sharma"
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email Address — verified inline via Clerk before the delegate can continue */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="email"
                  placeholder="e.g. arvind.sharma@school.edu"
                  disabled={emailVerified}
                  className="flex-1 min-w-0 border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B] focus:ring-1 focus:ring-[#0E733B]/20 disabled:bg-emerald-50/60 disabled:text-slate-500"
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                {emailVerified ? (
                  <span className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0E733B] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  EMAIL_REGEX.test(form.email.trim()) && (
                    <button
                      type="button"
                      onClick={sendVerificationCode}
                      disabled={isSendingCode}
                      className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0E733B] text-xs font-bold hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                    >
                      {isSendingCode ? "Sending..." : codeSent ? "Resend Code" : "Verify Email"}
                    </button>
                  )
                )}
              </div>

              {!emailVerified && codeSent && (
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    className="w-32 border border-line rounded-xl px-3 py-2 text-sm font-bold tracking-[0.3em] text-center text-charcoal focus:outline-none focus:border-[#0E733B]"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleVerifyInlineCode();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyInlineCode}
                    disabled={isVerifying || code.length < 6}
                    className="px-4 py-2 rounded-xl bg-[#0E733B] hover:bg-[#0B5C2F] text-white text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                  <span className="text-[11px] text-slate-500">Code sent to your email</span>
                </div>
              )}

              {verifyError && (
                <p className="mt-1.5 text-[11px] font-semibold text-red-600">{verifyError}</p>
              )}

              {/* Required mount point for Clerk's bot-protection (Smart/Invisible CAPTCHA) challenge */}
              <div id="clerk-captcha" className="mt-2" />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Role *
              </label>
              <select
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Custom Role Input if Other */}
            {form.role === "Other" && (
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specify Role *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Academic Coordinator / Trustee"
                  className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                  value={form.otherRole}
                  onChange={(e) => setForm({ ...form, otherRole: e.target.value })}
                />
              </div>
            )}

            {/* School / Institution Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                School / Institution Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Heritage International Senior Secondary School"
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Address
              </label>
              <input
                type="text"
                placeholder="e.g. Rajpur Road, Hathibarkala"
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Dehradun"
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                State *
              </label>
              <select
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                {stateOptions.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Phone Number (Strict Numerical) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (10 Digits) *
              </label>
              <div className="relative">
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onKeyDown={(e) => {
                    // Block non-numerical keys except backspace, delete, tab, arrows
                    if (
                      !/^[0-9]$/.test(e.key) &&
                      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
                      !e.ctrlKey &&
                      !e.metaKey
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            {/* WhatsApp Number (Strict Numerical) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp Number (10 Digits) *
                </label>
                <label className="flex items-center gap-1 text-[11px] text-[#0E733B] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sameAsPhone}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm({
                        ...form,
                        sameAsPhone: checked,
                        whatsapp: checked ? form.phone : form.whatsapp,
                      });
                    }}
                    className="accent-[#0E733B]"
                  />
                  Same as Phone
                </label>
              </div>
              <input
                required
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                placeholder="e.g. 9876543210"
                disabled={form.sameAsPhone}
                className={`w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B] ${form.sameAsPhone ? "bg-gray-50 text-slate-500 cursor-not-allowed" : ""
                  }`}
                value={form.whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    !/^[0-9]$/.test(e.key) &&
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {/* Association Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Association Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CBSE Sahodaya Complex / National Progressive Schools Alliance"
                className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                value={form.associationName}
                onChange={(e) => setForm({ ...form, associationName: e.target.value })}
              />
            </div>

          </div>

          {/* Step 1 Next Button */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Page 1 of 3 • Basic Information
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Next: Academic Profile & AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ──────────────── PAGE 2: Academic Profile & Teaching & AI Integration ──────────────── */}
      {step === 2 && (
        <form onSubmit={handleNextToExploring} className="space-y-5">

          {/* Total experience in teaching */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Experience in Teaching / Leadership *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {experienceOptions.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setForm({ ...form, teachingExperience: exp })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${form.teachingExperience === exp
                      ? "bg-[#0E733B] text-white border-[#0E733B] shadow-xs"
                      : "border-line bg-[#F8FAF8] text-slate-700 hover:border-emerald-300"
                    }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Which classes do they teach */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Which Classes Do You Teach / Oversee? *
            </label>
            <div className="flex flex-wrap gap-2">
              {classLevelOptions.map((lvl) => {
                const isSelected = form.classesTaught.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggleClassLevel(lvl)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${isSelected
                        ? "bg-[#0E733B] text-white border-[#0E733B]"
                        : "border-line bg-white text-slate-700 hover:border-emerald-300"
                      }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subjects they teach */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subjects You Teach / Academic Focus Area
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics, STEM, Physics, English, Computer Science, Administration"
              className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
              value={form.subjectsTaught}
              onChange={(e) => setForm({ ...form, subjectsTaught: e.target.value })}
            />
          </div>

          {/* Interested in AI check box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.usesAiInWork}
                onChange={(e) => setForm({ ...form, usesAiInWork: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-[#0E733B]"
              />
              <div>
                <span className="font-bold text-xs text-charcoal block">
                  Do you use AI in your day-to-day work or classroom teaching?
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Check to unlock dedicated AI workshop invitations and priority seat reservations.
                </span>
              </div>
            </label>

            {/* Which AI Tool options (ChatGPT Claude Gemini grok other) */}
            {form.usesAiInWork && (
              <div className="mt-4 pt-3 border-t border-emerald-200/60">
                <label className="block text-[11px] font-bold text-[#0E733B] uppercase tracking-wider mb-2">
                  Which AI Tools Do You Currently Use?
                </label>
                <div className="flex flex-wrap gap-2">
                  {aiToolOptions.map((tool) => {
                    const isSelected = form.aiTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleAiTool(tool)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${isSelected
                            ? "bg-[#0E733B] text-white border-[#0E733B]"
                            : "border-emerald-200 bg-white text-slate-700 hover:border-[#0E733B]"
                          }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>

                {form.aiTools.includes("Other") && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Specify other AI tools (e.g. Midjourney, Perplexity, Canva Magic)"
                      className="w-full border border-line rounded-xl px-3 py-1.5 text-xs bg-white text-charcoal focus:outline-none focus:border-[#0E733B]"
                      value={form.otherAiTool}
                      onChange={(e) => setForm({ ...form, otherAiTool: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Page 1</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Next: Exploring Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
      {/* ──────────────── PAGE 3: Services / Products Being Explored ──────────────── */}
      {step === 3 && (
        <form onSubmit={handleCompleteRegistration} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Are You Exploring Any New Services or Products?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exploringOptions.map((option) => {
                const isSelected = form.exploringServices.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${isSelected
                        ? "bg-emerald-50 border-[#0E733B] text-charcoal"
                        : "border-line bg-[#F8FAF8] text-slate-700 hover:border-emerald-300"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleExploring(option)}
                      className="w-4 h-4 mt-px accent-[#0E733B] shrink-0"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {form.exploringServices.includes("Other") && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Please specify the service or product you are exploring"
                  className="w-full border border-line rounded-xl px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-[#0E733B]"
                  value={form.otherExploring}
                  onChange={(e) => setForm({ ...form, otherExploring: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Page 2</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all ${isSubmitting ? "opacity-75 cursor-not-allowed hover:scale-100" : ""
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Registration...</span>
                </>
              ) : (
                <span>Complete Registration →</span>
              )}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}
