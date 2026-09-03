import { GraduationCap, BookOpen, Star, Sparkles } from "lucide-react";

/**
 * Layered decorative background: soft pastel blobs, thin lines, dots
 * and a few education glyphs, all continuous CSS animations at low
 * opacity so the layout underneath stays clean and readable. Purely
 * decorative — safe to render behind any section with `relative`.
 */
export default function FloatingShapes({
  variant = "hero",
}: {
  variant?: "hero" | "soft" | "minimal";
}) {
  if (variant === "minimal") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ewc-float absolute right-[8%] top-[15%] h-3 w-3 rounded-full bg-[var(--color-ewc-lavender-deep)] opacity-40" />
        <div
          className="ewc-drift absolute left-[12%] bottom-[20%] h-2 w-2 rounded-full bg-[var(--color-ewc-blue-deep)] opacity-40"
          style={{ animationDelay: "1.4s" }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large soft blobs — background layer, slowest movement */}
      <div
        className="ewc-drift absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-ewc-lavender)", animationDuration: "14s" }}
      />
      <div
        className="ewc-drift absolute -right-32 top-[20%] h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--color-ewc-blue)", animationDuration: "18s", animationDelay: "2s" }}
      />
      <div
        className="ewc-drift absolute bottom-[-10%] left-[18%] h-[320px] w-[320px] rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--color-ewc-peach)", animationDuration: "16s", animationDelay: "1s" }}
      />

      {/* Thin lines */}
      <div
        className="ewc-float absolute left-[30%] top-[12%] h-24 w-px opacity-30"
        style={{ background: "var(--color-ewc-muted)", animationDuration: "9s" }}
      />
      <div
        className="ewc-float absolute right-[22%] bottom-[18%] h-16 w-px opacity-25"
        style={{ background: "var(--color-ewc-muted)", animationDuration: "11s", animationDelay: "3s" }}
      />

      {/* Dots */}
      <div className="ewc-float absolute left-[8%] top-[55%] h-2.5 w-2.5 rounded-full bg-[var(--color-ewc-sage-deep)] opacity-60" style={{ animationDuration: "7s" }} />
      <div className="ewc-drift absolute right-[14%] top-[10%] h-2 w-2 rounded-full bg-[var(--color-ewc-peach-deep)] opacity-60" style={{ animationDuration: "8s", animationDelay: "2.5s" }} />
      <div className="ewc-float absolute right-[38%] bottom-[10%] h-3 w-3 rounded-full bg-[var(--color-ewc-lavender-deep)] opacity-50" style={{ animationDuration: "10s", animationDelay: "1.2s" }} />

      {/* Education glyphs, faint */}
      <GraduationCap
        className="ewc-spin-slow absolute left-[6%] bottom-[14%] h-9 w-9 opacity-[0.15]"
        style={{ color: "var(--color-ewc-lavender-deep)", animationDuration: "22s" }}
        strokeWidth={1.25}
      />
      <BookOpen
        className="ewc-float absolute right-[10%] top-[38%] h-8 w-8 opacity-[0.18]"
        style={{ color: "var(--color-ewc-blue-deep)", animationDuration: "9s", animationDelay: "0.6s" }}
        strokeWidth={1.25}
      />
      <Star
        className="ewc-drift absolute left-[42%] top-[8%] h-5 w-5 opacity-[0.2]"
        style={{ color: "var(--color-ewc-peach-deep)", animationDuration: "13s" }}
        strokeWidth={1.25}
      />
      <Sparkles
        className="ewc-float absolute right-[28%] bottom-[26%] h-6 w-6 opacity-[0.18]"
        style={{ color: "var(--color-ewc-sage-deep)", animationDuration: "10s", animationDelay: "1.8s" }}
        strokeWidth={1.25}
      />
    </div>
  );
}
