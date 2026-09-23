import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileStickyCta from "@/components/MobileStickyCta";
import ModalProvider from "@/components/modals/ModalProvider";
import ScrollReveal from "@/components/ScrollReveal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduBeacon — The Future of Education, Connected.",
  description:
    "EduBeacon connects schools, education leaders, startups, vendors and solution providers to create meaningful partnerships and discover the best solutions for the future of education.",
  keywords: "education platform, school solutions, EdTech, STEM labs, education conference, school vendors, India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-warm-ivory text-slate antialiased">
        <ClerkProvider>
          <ModalProvider>
            <ScrollReveal />
            <SiteHeader />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <SiteFooter />
            <MobileStickyCta />
          </ModalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
