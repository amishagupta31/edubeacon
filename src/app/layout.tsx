import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

import ModalProvider from "@/components/modals/ModalProvider";
import ScrollReveal from "@/components/ScrollReveal";

// Self-hosted (not next/font/google): `next/font/google` needs a live,
// build-time network call to fonts.gstatic.com, which fails inside network-
// restricted CI/Cloud Build containers ("next/font/google queries have
// exactly one entry" / "Module not found ...turbopack-next/internal/font").
// These are the same Inter/Fraunces variable-weight files Google Fonts was
// serving, just vendored into the repo so the build has zero font-fetch
// network dependency.
const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const fraunces = localFont({
  src: [
    { path: "../fonts/Fraunces-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/Fraunces-Italic-Variable.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduBeacon — The Future of Education, Connected.",
  description:
    "EduBeacon connects schools, education leaders, startups, vendors and solution providers to create meaningful partnerships and discover the best solutions for the future of education.",
  keywords: "education platform, school solutions, EdTech, STEM labs, education conference, school vendors, India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <head>...</head>
      <body className="min-h-full flex flex-col bg-warm-ivory text-slate antialiased">
        <ClerkProvider>
          <ModalProvider>
            <ScrollReveal />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </ModalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
