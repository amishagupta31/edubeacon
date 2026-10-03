"use client";

import { useEffect, ReactNode } from "react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
}

export default function ModalShell({
  title,
  onClose,
  children,
  size = "md",
}: ModalShellProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-backdrop bg-edu-blue/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full ${size === "lg" ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-line flex items-center justify-between px-6 py-4 rounded-t-2xl">
          <h2 className="font-display text-[20px] font-bold text-edu-blue">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-pastel text-slate-soft transition-colors"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
