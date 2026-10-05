"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Rendered immediately, then replaced by whatever the admin has saved.
// Keeps the strip from flashing empty and survives the backend being down.
const FALLBACK = {
  enabled: true,
  label: "Live",
  items: [
    "Principal Conclave on AI in School Education",
    "25th October 2026  ·  9:00 AM onwards",
    "Shivalik University, Dehradun",
    "Organised by Edubeacon & India Genius Foundation",
    "Registrations Now Open",
  ],
};

interface Ticker {
  enabled: boolean;
  label: string;
  items: string[];
}

export default function EventTicker() {
  const [ticker, setTicker] = useState<Ticker>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/api/settings/ticker`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.items?.length) setTicker(data);
      })
      .catch(() => { /* keep the fallback */ });
    return () => { cancelled = true; };
  }, []);

  if (!ticker.enabled) return null;

  const marquee = ticker.items.join("   ");

  return (
    <div className="relative bg-[#FF9933] overflow-hidden flex items-stretch">
      {/* Label */}
      <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#0A0E17] z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white whitespace-nowrap">
          {ticker.label}
        </span>
      </div>

      <div className="w-px bg-black/15 shrink-0" />

      {/* Scrolling track — duplicated for a seamless loop */}
      <div className="flex-1 overflow-hidden py-2.5">
        <div className="flex animate-ticker whitespace-nowrap">
          <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10">
            {marquee}
          </span>
          <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10" aria-hidden="true">
            {marquee}
          </span>
        </div>
      </div>
    </div>
  );
}
