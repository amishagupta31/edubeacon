"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2, MapPin, X, Loader2, CheckCircle2, AlertTriangle, ArrowRight, Info, Mail, Phone, Link as LinkIcon, Send,
} from "lucide-react";
import { API } from "./useRecruitmentProfile";

export interface ApplyJob { _id: string; title: string; institutionName: string; city: string }
export default function ApplyModal({ job, onClose, onSuccess, authHeader, goToProfile }: {
  job: ApplyJob; onClose: () => void; onSuccess: (jobId: string) => void;
  authHeader: () => Promise<Record<string, string>>; goToProfile: () => void;
}) {
  const [coverNote, setCoverNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileGap, setProfileGap] = useState<string[] | null>(null);
  const [phone, setPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [email, setEmail] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const headers = await authHeader();
        const res = await fetch(`${API}/api/recruitment/me`, { headers });
        if (!res.ok) { setProfileGap(["profile"]); return; }
        const data = await res.json();
        setPhone(data.phone || ""); setResumeUrl(data.resumeUrl || ""); setEmail(data.email || "");
        const missing: string[] = [];
        if (!String(data.fullName || "").trim()) missing.push("Full name");
        if (!String(data.phone || "").trim()) missing.push("Phone number");
        if (!String(data.bio || "").trim() && !(Array.isArray(data.qualifications) && data.qualifications.length)) missing.push("Bio or qualification");
        setProfileGap(missing.length ? missing : null);
      } catch { setProfileGap(["Could not load profile"]); }
      finally { setCheckingProfile(false); setTimeout(() => textRef.current?.focus(), 50); }
    })();
  }, [authHeader]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileGap) { setErr("Complete your profile first."); return; }
    setBusy(true); setErr("");
    try {
      const headers = await authHeader();
      if (phone.trim() || resumeUrl.trim()) await fetch(`${API}/api/recruitment/profile/teacher`, { method: "PUT", headers, body: JSON.stringify({ phone: phone.trim(), resumeUrl: resumeUrl.trim() }) });
      const res = await fetch(`${API}/api/recruitment/jobs/${job._id}/apply`, { method: "POST", headers, body: JSON.stringify({ coverNote: coverNote.trim() }) });
      const body = await res.json();
      if (!res.ok) {
        if (body.code === "PROFILE_INCOMPLETE") { setProfileGap(body.missingFields ?? ["incomplete profile"]); return; }
        setErr(body.error || "Could not submit application."); return;
      }
      setDone(true); onSuccess(job._id);
    } catch { setErr("Network error. Please try again."); }
    finally { setBusy(false); }
  };

  const inp = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0E733B] to-[#3DBA77] shrink-0" />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0E733B] mb-0.5">Applying for</p>
            <h2 className="font-bold text-[17px] text-slate-900 leading-snug truncate">{job.title}</h2>
            <p className="text-[12.5px] text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 shrink-0" /> {job.institutionName}
              {job.city && <><span className="text-slate-400">·</span><MapPin className="w-3 h-3 shrink-0" />{job.city}</>}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {checkingProfile ? (
            <div className="flex items-center justify-center py-14"><Loader2 className="w-5 h-5 animate-spin text-[#0E733B]" /><span className="ml-2.5 text-[13.5px] text-slate-500">Loading profile…</span></div>
          ) : done ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0E733B] to-[#3DBA77] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[20px] text-slate-900 mb-2">Application submitted!</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">Your application for <strong>{job.title}</strong> at {job.institutionName} has been sent.<br />Track it in <strong>My Applications</strong>.</p>
              <button onClick={onClose} className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-[#0E733B] to-[#3DBA77] text-white font-bold text-[14px] hover:opacity-90 transition-all shadow-md">Done</button>
            </div>
          ) : profileGap ? (
            <div className="px-6 py-8">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="font-bold text-[14px] text-amber-900 mb-1">Complete your profile first</p>
                    <p className="text-[13px] text-amber-800/80 leading-relaxed">Schools need your details. Please add:</p>
                    <ul className="mt-2 space-y-1">
                      {profileGap.map((f) => <li key={f} className="text-[12.5px] font-semibold text-amber-900 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              <button onClick={() => { onClose(); goToProfile(); }} className="w-full flex items-center justify-center gap-2 bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-2xl font-bold text-[14px] transition-all">Go to My Profile <ArrowRight className="w-4 h-4" /></button>
              <button onClick={onClose} className="mt-2.5 w-full py-2.5 rounded-2xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3"><Info className="w-3.5 h-3.5 text-slate-500 shrink-0" /><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">Your contact details</p></div>
                <div className="flex flex-col gap-3">
                  {email && <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Email <span className="font-normal text-slate-600">(from account)</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" /><input value={email} readOnly className={`${inp} pl-9 bg-slate-100 text-slate-500 cursor-not-allowed`} /></div></div>}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" className={`${inp} pl-9`} /></div></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 mb-1">Resume link</label><div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" /><input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="PDF or Drive URL" className={`${inp} pl-9`} /></div></div>
                  </div>
                </div>
                <p className="text-[10.5px] text-slate-600 mt-2">These save to your profile when you submit.</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-1.5">Cover note <span className="font-normal normal-case">(optional · max 1000 chars)</span></label>
                <textarea ref={textRef} value={coverNote} onChange={(e) => setCoverNote(e.target.value.slice(0, 1000))} rows={5}
                  placeholder="Tell the school why you're a great fit…"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-[13.5px] text-slate-800 resize-none focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all" />
                <p className="text-right text-[11px] text-slate-600 mt-1">{coverNote.length} / 1000</p>
              </div>
              {err && <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{err}</p>}
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0E733B] to-[#0B8F44] hover:opacity-90 text-white py-3 rounded-2xl font-bold text-[14px] transition-all disabled:opacity-50 shadow-md hover:shadow-lg">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {busy ? "Submitting…" : "Submit Application"}
                </button>
                <button type="button" onClick={onClose} className="px-5 py-3 rounded-2xl border border-slate-200 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
