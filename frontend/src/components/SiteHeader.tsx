"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import type { ComponentType } from "react";
import {
  ChevronDown,
  Compass,
  Trophy,
  HeartHandshake,
  Users,
  BookOpen,
  School,
  Store,
  Mic,
  Handshake,
  Newspaper,
  UserSearch,
  LayoutGrid,
} from "lucide-react";
import Container from "./ui/Container";
import { useModal } from "./modals/ModalProvider";

interface DropdownItem {
  name: string;
  label: string;
  desc: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}

const eventDropdownItems: DropdownItem[] = [
  {
    name: "Roadshows",
    label: "City Roadshows",
    desc: "12+ City Tour bringing live tech demos directly to schools",
    href: "/events/roadshows",
    icon: Compass,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Conference",
    label: "Annual Leadership Conference",
    desc: "Flagship 2-Day Mega-Summit at Bharat Mandapam, New Delhi",
    href: "/events/conference",
    icon: Trophy,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Philanthropy",
    label: "Philanthropy & Social Impact",
    desc: "Adopt-a-School grants, girl-child STEM scholarships & CSR",
    href: "/events/philanthropy",
    icon: HeartHandshake,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Round Table",
    label: "Executive Round Tables",
    desc: "Chatham House Rule strategy salons for school founders",
    href: "/events/roundtable",
    icon: Users,
    accent: "text-[#0E733B] bg-emerald-50",
  },
];

const aboutDropdownItems: DropdownItem[] = [
  {
    name: "Our Story",
    label: "Our Story",
    desc: "Who we are and what we're doing for education",
    href: "/about/our-story",
    icon: BookOpen,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Schools",
    label: "Schools",
    desc: "Schools on EduBeacon, and how to register yours",
    href: "/about/schools",
    icon: School,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Vendors",
    label: "Vendors",
    desc: "Solution providers, and how to list your solution",
    href: "/about/vendors",
    icon: Store,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Speakers",
    label: "Speakers",
    desc: "The voices shaping the future of education",
    href: "/about/speakers",
    icon: Mic,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "Sponsors",
    label: "Sponsors",
    desc: "Our partners and sponsorship opportunities",
    href: "/about/sponsors",
    icon: Handshake,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "News Stories",
    label: "News Stories",
    desc: "Stories and articles published by EduBeacon",
    href: "/about/news-stories",
    icon: Newspaper,
    accent: "text-[#0E733B] bg-emerald-50",
  },
];

const solutionsDropdownItems: DropdownItem[] = [
  {
    name: "Recruitment",
    label: "Teacher Recruitment",
    desc: "Hire qualified teachers, or build a profile and apply to schools",
    href: "/solutions/recruitment",
    icon: UserSearch,
    accent: "text-[#0E733B] bg-emerald-50",
  },
  {
    name: "All Solutions",
    label: "All Solution Categories",
    desc: "STEM labs, AI labs, smart classrooms, ERP and more",
    href: "/solutions",
    icon: LayoutGrid,
    accent: "text-[#0E733B] bg-emerald-50",
  },
];

function NavDropdown({
  label,
  heading,
  items,
  allLink,
  active,
  isRegister,
  onRegisterClick,
  dropdownId,
  openDropdown,
  setOpenDropdown,
  dark,
}: {
  label: string;
  heading: string;
  items: DropdownItem[];
  allLink?: { href: string; text: string };
  active: boolean;
  isRegister?: boolean;
  onRegisterClick?: (type: "partner" | "educator") => void;
  dropdownId: string;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openDropdown === dropdownId;

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpenDropdown]);

  if (isRegister) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          onMouseEnter={() => setOpenDropdown(dropdownId)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full font-bold transition-all ${
            isOpen
              ? "bg-[#0B5C2F] text-white px-5 py-2 text-[12px] uppercase tracking-wider shadow-md"
              : "bg-[#0E733B] hover:bg-[#0B5C2F] px-5 py-2 text-[12px] uppercase tracking-wider text-white shadow-md shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all duration-300"
          }`}
        >
          <span>REGISTER NOW</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div
            onMouseLeave={() => setOpenDropdown(null)}
            className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-line bg-white p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50"
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {heading}
              </span>
            </div>

            <div className="space-y-1 mt-1.5">
              {items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setOpenDropdown(null);
                    onRegisterClick?.(item.name === "As a partner" ? "partner" : "educator");
                  }}
                  className="w-full group flex items-start gap-3 rounded-xl p-2.5 transition-all hover:bg-emerald-50/60 text-left"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.accent}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal group-hover:text-[#0E733B] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
        onMouseEnter={() => setOpenDropdown(dropdownId)}
        className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 font-bold transition-all ${
          dark
            ? isOpen
              ? "bg-white/15 text-white"
              : "text-white/85 hover:bg-white/10 hover:text-white"
            : active || isOpen
              ? "bg-emerald-50 text-[#0E733B]"
              : "text-slate-700 hover:bg-emerald-50 hover:text-[#0E733B]"
        }`}
      >
        <span>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setOpenDropdown(null)}
          className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-line bg-white p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50"
        >
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {heading}
            </span>
            {allLink && (
              <Link
                href={allLink.href}
                onClick={() => setOpenDropdown(null)}
                className="text-[11px] font-bold text-[#0E733B] hover:underline"
              >
                {allLink.text}
              </Link>
            )}
          </div>

          <div className="space-y-1 mt-1.5">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpenDropdown(null)}
                className="group flex items-start gap-3 rounded-xl p-2.5 transition-all hover:bg-emerald-50/60"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.accent}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal group-hover:text-[#0E733B] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(true);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"partner" | "educator">("educator");
  const [modalSuccess, setModalSuccess] = useState<"educator" | "partner" | null>(null);

  // Educator form state
  const [educatorForm, setEducatorForm] = useState({
    schoolName: "",
    principalName: "",
    email: "",
    phone: "",
    city: "",
    requirements: "",
  });

  // Partner form state
  const [partnerForm, setPartnerForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    category: "",
    description: "",
  });

  const closeModal = () => {
    setRegisterModalOpen(false);
    setModalSuccess(null);
  };

  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && registerModalOpen) {
        setRegisterModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [registerModalOpen]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const isEventsActive = pathname.startsWith("/events");
  const isAboutActive = pathname.startsWith("/about");
  // On the recruitment landing page the hero is dark green — use a dark header
  // so the nav feels part of the page rather than floating above it.
  const isDarkHeader = pathname === "/solutions/recruitment";

  return (
    <>
      {/* Register Modal with Tabs */}
      {registerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="sticky top-0 bg-white flex justify-end p-4 border-b border-gray-100">
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-100 sticky top-16 bg-white">
              <button
                onClick={() => setActiveTab("educator")}
                className={`flex-1 py-4 px-4 text-sm font-semibold transition-all ${
                  activeTab === "educator"
                    ? "text-[#0E733B] border-b-2 border-[#0E733B]"
                    : "text-slate-500 hover:text-charcoal"
                }`}
              >
                As an Educator
              </button>
              <button
                onClick={() => setActiveTab("partner")}
                className={`flex-1 py-4 px-4 text-sm font-semibold transition-all ${
                  activeTab === "partner"
                    ? "text-[#0E733B] border-b-2 border-[#0E733B]"
                    : "text-slate-500 hover:text-charcoal"
                }`}
              >
                As a partner
              </button>
            </div>

            {/* Success screen — educator */}
            {modalSuccess === "educator" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0E733B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[18px] text-charcoal mb-2">
                  Welcome to EduBeacon, {educatorForm.schoolName || "your school"}!
                </h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                  Thank you for registering <strong>{educatorForm.schoolName}</strong>.
                  Our team will reach out to <strong>{educatorForm.principalName}</strong> at{" "}
                  <strong>{educatorForm.email}</strong> to help you discover the best solutions for your school.
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-left space-y-1.5">
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Registration received for {educatorForm.schoolName}</p>
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Confirmation email will be sent to {educatorForm.email}</p>
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Our team will connect with you within 2 business days</p>
                </div>
                <button onClick={closeModal} className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-lg font-bold text-sm transition-colors">
                  Done
                </button>
              </div>
            )}

            {/* Success screen — partner */}
            {modalSuccess === "partner" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0E733B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[18px] text-charcoal mb-2">
                  Thanks for partnering with us, {partnerForm.companyName || "your company"}!
                </h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6">
                  We&apos;ve received your solution listing from <strong>{partnerForm.companyName}</strong>.{" "}
                  <strong>{partnerForm.contactPerson}</strong> will hear back at{" "}
                  <strong>{partnerForm.email}</strong> within 2–3 business days once our team reviews your submission.
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-left space-y-1.5">
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Solution listing received for {partnerForm.companyName}</p>
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Review response sent to {partnerForm.email} in 2–3 business days</p>
                  <p className="text-[12px] text-[#0E733B] font-semibold">✓ Our partnerships team will be in touch</p>
                </div>
                <button onClick={closeModal} className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-lg font-bold text-sm transition-colors">
                  Done
                </button>
              </div>
            )}

            {/* Tab Content - Educator Form */}
            {!modalSuccess && activeTab === "educator" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="School Name *"
                    value={educatorForm.schoolName}
                    onChange={(e) => setEducatorForm({ ...educatorForm, schoolName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                  <input
                    type="text"
                    placeholder="Principal Name *"
                    value={educatorForm.principalName}
                    onChange={(e) => setEducatorForm({ ...educatorForm, principalName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={educatorForm.email}
                    onChange={(e) => setEducatorForm({ ...educatorForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={educatorForm.phone}
                    onChange={(e) => setEducatorForm({ ...educatorForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                </div>
                <input
                  type="text"
                  placeholder="City *"
                  value={educatorForm.city}
                  onChange={(e) => setEducatorForm({ ...educatorForm, city: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                />
                <textarea
                  placeholder="What solutions are you looking for? *"
                  value={educatorForm.requirements}
                  onChange={(e) => setEducatorForm({ ...educatorForm, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                />
                <button
                  onClick={() => setModalSuccess("educator")}
                  className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-lg font-bold text-sm transition-colors"
                >
                  Register Your School
                </button>
              </div>
            )}

            {/* Tab Content - Partner Form */}
            {!modalSuccess && activeTab === "partner" && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={partnerForm.companyName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                  <input
                    type="text"
                    placeholder="Contact Person *"
                    value={partnerForm.contactPerson}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                  />
                </div>
                <input
                  type="url"
                  placeholder="Website"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                />
                <select
                  value={partnerForm.category}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                >
                  <option value="">Solution Category *</option>
                  <option value="stem">STEM Labs</option>
                  <option value="ai">AI & Machine Learning</option>
                  <option value="robotics">Robotics</option>
                  <option value="smart-classroom">Smart Classroom</option>
                  <option value="erp">School ERP</option>
                  <option value="assessment">Assessment Tools</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Solution Description *"
                  value={partnerForm.description}
                  onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20"
                />
                <button
                  onClick={() => setModalSuccess("partner")}
                  className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-lg font-bold text-sm transition-colors"
                >
                  Submit Your Solution
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 border-none ${
          scrolled
            ? "pt-3 px-3 sm:px-6 md:px-8 pointer-events-none"
            : isDarkHeader
              ? "bg-[#0C2A1B]"
              : "bg-[#F8FAF8]"
        }`}
      >
      <div
        className={`mx-auto transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "max-w-[1440px] rounded-full bg-white/95 shadow-2xl backdrop-blur-xl px-4 sm:px-6 py-2 flex items-center justify-between border-none"
            : "w-full max-w-[1440px] px-6 md:px-10 xl:px-14 flex h-[72px] items-center justify-between border-none"
        }`}
      >
        {/* ──────────────── Brand Logo ──────────────── */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center py-1 group"
            onClick={(e) => {
              setOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/edubeacon-logo.png"
              alt="eduBeacon Logo"
              width={150}
              height={40}
              className={`w-auto object-contain transition-all ${scrolled ? "h-7 sm:h-8" : "h-8 sm:h-9"}`}
              priority
            />
          </Link>
        </div>

        {/* ──────────────── Desktop Navigation Links (Directly Visible) ──────────────── */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 text-[13px]">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 font-semibold transition-all ${
              isDarkHeader
                ? "text-white/85 hover:text-white hover:bg-white/10"
                : `hover:text-[#0E733B] hover:bg-emerald-50 ${pathname === "/" ? "text-[#0E733B]" : "text-slate-700"}`
            }`}
          >
            Home
          </Link>
          <NavDropdown
            label="Our Solutions"
            heading="Our Solutions"
            items={solutionsDropdownItems}
            active={pathname.startsWith("/solutions")}
            dropdownId="solutions"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dark={isDarkHeader}
          />

          <NavDropdown
            label="About"
            heading="About EduBeacon"
            items={aboutDropdownItems}
            active={isAboutActive}
            dropdownId="about"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dark={isDarkHeader}
          />

          <NavDropdown
            label="Events"
            heading="EduBeacon Events"
            items={eventDropdownItems}
            allLink={{ href: "/events", text: "All Events →" }}
            active={isEventsActive}
            dropdownId="events"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            dark={isDarkHeader}
          />
        </nav>

        {/* ──────────────── Right Action Buttons (Contact Us + Register Dropdown) ──────────────── */}
        <div className="hidden xl:flex items-center gap-2.5">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className={`whitespace-nowrap font-semibold transition-colors px-3 rounded-full ${
              isDarkHeader
                ? "text-[13px] text-white/80 hover:text-white hover:bg-white/10 py-2"
                : scrolled
                  ? "text-[12.5px] font-bold text-[#0E733B] hover:text-[#0B5C2F] hover:bg-emerald-50 py-1.5"
                  : "text-[13px] text-[#0E733B] hover:text-[#0B5C2F] hover:bg-emerald-50 py-2"
            }`}
          >
            Contact Us
          </Link>
          <button
            onClick={() => { setModalSuccess(null); setRegisterModalOpen(true); }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full font-bold transition-all bg-[#0E733B] hover:bg-[#0B5C2F] text-white shadow-md shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all duration-300 ${
              scrolled ? "px-5 py-2 text-[12px] uppercase tracking-wider" : "px-5 py-2.5 text-[13px]"
            }`}
          >
            <span>REGISTER NOW</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ──────────────── Mobile Hamburger ──────────────── */}
        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[1.5px] w-6 transition-transform duration-300 ${isDarkHeader ? "bg-white" : "bg-charcoal"} ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-[1.5px] w-6 transition-opacity duration-300 ${isDarkHeader ? "bg-white" : "bg-charcoal"} ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`h-[1.5px] w-6 transition-transform duration-300 ${isDarkHeader ? "bg-white" : "bg-charcoal"} ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* ──────────────── Mobile Fullscreen / Drawer Menu ──────────────── */}
      {open && (
        <div className="border-t border-line bg-white xl:hidden shadow-2xl max-h-[calc(100vh-72px)] overflow-y-auto pointer-events-auto">
          <Container className="flex flex-col gap-1 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Home
            </Link>
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-[14px] font-medium text-slate text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Our Solutions
            </Link>
            <Link
              href="/solutions/recruitment"
              onClick={() => setOpen(false)}
              className="rounded-lg pl-7 pr-3 py-2 text-[13.5px] font-medium text-slate-600 text-left hover:bg-emerald-50 hover:text-[#0E733B]"
            >
              Teacher Recruitment
            </Link>

            {/* Mobile About Accordion */}
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-2 my-1">
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[14px] font-bold text-[#0E733B]"
              >
                <span>About</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileAboutOpen && (
                <div className="mt-1 space-y-1 pl-2 pt-1 border-t border-emerald-200">
                  {aboutDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                    >
                      • {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Events Accordion */}
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-2 my-1">
              <button
                onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[14px] font-bold text-[#0E733B]"
              >
                <span>Events</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileEventsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileEventsOpen && (
                <div className="mt-1 space-y-1 pl-2 pt-1 border-t border-emerald-200">
                  <Link
                    href="/events"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    • All Events Overview
                  </Link>
                  <Link
                    href="/events/roadshows"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Roadshows (12+ Cities)
                  </Link>
                  <Link
                    href="/events/conference"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Annual Leadership Conference
                  </Link>
                  <Link
                    href="/events/philanthropy"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Philanthropy & CSR
                  </Link>
                  <Link
                    href="/events/roundtable"
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:text-[#0E733B]"
                  >
                    • Executive Round Tables
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="w-full border border-gray-300 text-charcoal py-3 rounded-full font-semibold text-[14px] hover:bg-gray-50 text-center"
              >
                Contact Us
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  setModalSuccess(null);
                  setRegisterModalOpen(true);
                }}
                className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-3 rounded-full font-bold text-[14px] shadow-md transition-colors"
              >
                REGISTER NOW
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
    </>
  );
}
