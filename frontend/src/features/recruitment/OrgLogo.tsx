const PALETTES = [
  ["#0E733B", "#0B5C2F"], ["#10B981", "#047857"], ["#1A4D33", "#0C2A1B"],
  ["#0F766E", "#115E59"], ["#15803D", "#166534"], ["#059669", "#065F46"],
];

export function orgInitials(name: string) {
  const words = name.split(/\s+/).filter((w) => w && !/^(of|the|and|&|-|—)$/i.test(w));
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function OrgLogo({ name, className = "w-[88px] h-[88px] text-[26px] rounded-lg" }: { name: string; className?: string }) {
  const [from, to] = PALETTES[name.charCodeAt(0) % PALETTES.length];
  return (
    <div
      className={`${className} shrink-0 flex items-center justify-center font-bold text-white tracking-tight`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      {orgInitials(name)}
    </div>
  );
}
