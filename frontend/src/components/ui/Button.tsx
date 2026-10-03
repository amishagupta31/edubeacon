import Link from "next/link";
import { ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "teal"
  | "teal-outline"
  | "ghost"
  | "outline-light"
  | "light"
  | "gold";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[13.5px] font-semibold tracking-[0.01em] transition-all duration-200 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-edu-blue text-white hover:bg-edu-blue-mid shadow-sm hover:shadow-md",
  secondary:
    "border border-edu-blue/25 text-edu-blue hover:border-edu-blue hover:bg-edu-blue/[0.05]",
  teal: "bg-teal text-white hover:bg-teal-light shadow-sm hover:shadow-md",
  "teal-outline":
    "border-2 border-teal text-teal hover:bg-teal hover:text-white",
  ghost: "text-edu-blue hover:text-teal",
  "outline-light":
    "border border-white/40 text-white hover:bg-white/15",
  light: "bg-white text-edu-blue hover:bg-white/90 shadow-sm",
  gold: "bg-gold text-white hover:opacity-90 shadow-sm",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  type,
  id,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  id?: string;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} id={id}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className={classes}
      id={id}
    >
      {children}
    </button>
  );
}
