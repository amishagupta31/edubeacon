"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { API } from "./useRecruitmentProfile";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  _id: string;
  senderName: string;
  isSchool: boolean;
  body: string;
  createdAt: string;
}

const LEVERS = [
  { id: "joining-bonus", label: "Joining bonus", defaultOn: true },
  { id: "accommodation", label: "Staff accommodation", defaultOn: false },
  { id: "transport", label: "Transport", defaultOn: false },
  { id: "child-fee", label: "Child fee concession", defaultOn: false },
  { id: "extra-leave", label: "Extra leave days", defaultOn: false },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function SalaryNegotiation({
  offerId,
  authHeader,
  onBack,
}: {
  offerId?: string;
  authHeader?: () => Promise<Record<string, string>>;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(!!offerId);
  const [sending, setSending] = useState(false);
  const [counterCtc, setCounterCtc] = useState("86000");
  const [aiDismissed, setAiDismissed] = useState(false);
  const [enabledLevers, setEnabledLevers] = useState<Set<string>>(
    new Set(LEVERS.filter((l) => l.defaultOn).map((l) => l.id))
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggleLever = (id: string) =>
    setEnabledLevers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  // ── Load messages from API ──
  const loadMessages = useCallback(async () => {
    if (!offerId || !authHeader) return;
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/offers/${offerId}/messages`, { headers });
      if (res.ok) setMessages(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [offerId, authHeader]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    const body = reply.trim();
    setReply("");

    if (!offerId || !authHeader) {
      // Demo mode — append locally
      setMessages((m) => [...m, {
        _id: String(Date.now()), senderName: "You", isSchool: true, body, createdAt: new Date().toISOString(),
      }]);
      return;
    }

    setSending(true);
    try {
      const headers = await authHeader();
      const res = await fetch(`${API}/api/recruitment/offers/${offerId}/messages`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((m) => [...m, msg]);
      }
    } catch { /* silent */ }
    finally { setSending(false); }
  };

  const useAiDraft = () => {
    setReply(
      "Hi, thank you for your patience. We are pleased to offer a counter of ₹86,000 / month CTC, along with a one-time joining bonus. We believe this reflects both your experience and the budget band for this role. Please let us know if you would like to discuss further."
    );
    setAiDismissed(true);
  };

  const field =
    "w-full border border-line rounded-lg px-3 py-2 text-[13px] text-charcoal bg-white " +
    "focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all";

  function timeLabel(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return (
    <div className="max-w-full">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Salary negotiation</p>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">

        {/* ══════════ Left: Chat thread ══════════ */}
        <div className="bg-white rounded-2xl border border-line shadow-sm flex flex-col min-h-[520px]">
          <div className="px-5 py-4 border-b border-line">
            <p className="text-[13px] font-bold text-charcoal">Thread</p>
          </div>

          <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto max-h-[420px]">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-[#0E733B] animate-spin" />
                <span className="ml-2 text-[13px] text-slate-400">Loading thread…</span>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-[13px] text-slate-400 text-center py-10 italic">
                No messages yet. Start the conversation below.
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className={`flex flex-col ${msg.isSchool ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.isSchool ? "bg-[#0C2A1B] text-white rounded-br-sm" : "bg-slate-100 text-charcoal rounded-bl-sm"
                  }`}>
                    <p className={`text-[11px] font-bold mb-1 ${msg.isSchool ? "text-emerald-400" : "text-slate-500"}`}>
                      {msg.senderName}
                    </p>
                    <p>{msg.body}</p>
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-1 px-1">{timeLabel(msg.createdAt)}</p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-5 py-4 border-t border-line">
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply(); }}
                placeholder="Write a reply… (Ctrl+Enter to send)"
                className="flex-1 min-w-0 resize-none border border-line rounded-xl px-3.5 py-2.5 text-[13px] text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all"
              />
              <button
                onClick={sendReply}
                disabled={!reply.trim() || sending}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0E733B] text-white text-[13px] font-bold hover:bg-[#0B5C2F] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ Right: AI + Counter + Rounds ══════════ */}
        <div className="flex flex-col gap-4">

          {/* AI Suggestion */}
          {!aiDismissed && (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5">
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3" /> AI Suggestion
              </p>
              <p className="text-[13px] text-charcoal font-semibold leading-snug mb-2">
                Counter at <strong>₹86,000</strong> plus a one-time joining bonus. Stays under the max band and needs Principal sign-off.
              </p>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                Based on budget band, demo score, and similar offers in this city.
              </p>
              <div className="flex items-center gap-2">
                <button onClick={useAiDraft} className="px-4 py-2 rounded-xl bg-[#0E733B] text-white text-[12.5px] font-bold hover:bg-[#0B5C2F] transition-all">
                  Use &amp; draft message
                </button>
                <button onClick={() => setAiDismissed(true)} className="px-4 py-2 rounded-xl border border-line bg-white text-[12.5px] font-semibold text-charcoal hover:bg-slate-50 transition-all">
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Counter-offer */}
          <div className="bg-white rounded-2xl border border-line shadow-sm p-5">
            <h3 className="font-display font-bold text-[14px] text-charcoal mb-4">Counter-offer</h3>

            <p className="text-[11.5px] font-semibold text-slate-500 mb-1.5">Monthly CTC</p>
            <div className="relative mb-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">₹</span>
              <input
                type="text"
                value={Number(counterCtc).toLocaleString("en-IN")}
                onChange={(e) => setCounterCtc(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-6 pr-3.5 py-3 border border-line rounded-xl text-[20px] font-bold text-charcoal bg-white focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/10 transition-all tabular-nums"
              />
            </div>
            <p className="text-[11.5px] text-slate-400 mb-5">Breakup recalculates automatically</p>

            <p className="text-[11.5px] font-semibold text-slate-500 mb-3">Alternate levers</p>
            <div className="space-y-2.5 mb-5">
              {LEVERS.map((l) => (
                <label key={l.id} className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input type="checkbox" checked={enabledLevers.has(l.id)} onChange={() => toggleLever(l.id)} className="w-4 h-4 rounded accent-[#0E733B] cursor-pointer" />
                  <span className="text-[13px] text-charcoal group-hover:text-[#0E733B] transition-colors">{l.label}</span>
                </label>
              ))}
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#0C2A1B] text-white text-[13px] font-bold hover:bg-[#0E733B] transition-all">
              Send to Principal for sign-off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
