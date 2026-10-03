const ITEMS = [
  "EduBeacon Conference — AI, NEP & the Future of Learning",
  "25th October 2026  ·  10:00 AM – 5:00 PM",
  "Shivalik University, Dehradun",
  "250+ School Leaders  ·  10+ Startups  ·  Awards Ceremony",
  "Registrations Now Open",
];

const marqueeText = ITEMS.join("   ");

export default function EventTicker() {
  return (
    <div className="relative bg-[#FF9933] overflow-hidden flex items-stretch">
      {/* LIVE badge */}
      <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#0A0E17] z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white whitespace-nowrap">
          Live
        </span>
      </div>

      {/* Divider */}
      <div className="w-px bg-black/15 shrink-0" />

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden py-2.5">
        <div className="flex animate-ticker whitespace-nowrap">
          <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10">
            {marqueeText}
          </span>
          <span className="text-[12px] text-[#0A0E17] font-semibold tracking-wide px-10" aria-hidden="true">
            {marqueeText}
          </span>
        </div>
      </div>
    </div>
  );
}
