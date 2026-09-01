export default function Eyebrow({
  children,
  tone = "charcoal",
}: {
  children: React.ReactNode;
  tone?: "charcoal" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase ${
        tone === "light" ? "text-warm-white/70" : "text-charcoal/50"
      }`}
    >
      <span
        className={`h-[6px] w-[6px] rounded-full ${
          tone === "light" ? "bg-lilac" : "bg-lilac-deep"
        }`}
      />
      {children}
    </span>
  );
}
