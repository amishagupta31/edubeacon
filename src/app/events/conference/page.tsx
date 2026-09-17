"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  Trophy,
  Star,
  Layers,
  Handshake,
  Mic,
  Ruler,
  ChevronDown,
  Mail,
  Phone,
  Compass,
  Zap,
  BookOpen,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Cpu,
  Share2,
  Quote,
  HeartHandshake,
  Award,
  Landmark,
  School,
  Rocket,
  Coffee,
  Check,
  Download,
  ChevronRight
} from "lucide-react";
import Container from "@/components/ui/Container";
import SpeakersSection from "@/components/SpeakersSection";
import { useModal } from "@/components/modals/ModalProvider";
import { img } from "@/lib/images";
import { conferenceAgenda, siteConfig, sponsorshipPackages } from "@/lib/data";

// ── 4 Conference Tracks ──
const conferenceTracks = [
  {
    num: "01",
    title: "Education Leadership",
    desc: "Leadership, institutional transformation and the future of education.",
    icon: GraduationCap,
    topics: ["Institutional Governance", "Curriculum Evolution", "Culture & Wellbeing"],
  },
  {
    num: "02",
    title: "AI & Emerging Technology",
    desc: "AI, digital transformation, smart classrooms and emerging technologies.",
    icon: Cpu,
    topics: ["Responsible AI", "Automated Assessment", "Smart Campus Infrastructure"],
  },
  {
    num: "03",
    title: "EdTech & Innovation",
    desc: "Startups, solution providers, product showcases and school–startup collaboration.",
    icon: Sparkles,
    topics: ["Institutional Pilots", "Product Validation", "Scalable Classroom Tech"],
  },
  {
    num: "04",
    title: "Investment & Partnerships",
    desc: "VC conversations, university partnerships, founders and institutional opportunities.",
    icon: TrendingUp,
    topics: ["VC × Higher Ed", "Ecosystem Syndicates", "Commercial Scaling"],
  },
];

// ── 8 Experiences Awaiting Attendees ──
const experienceCards = [
  {
    num: "01",
    title: "Innovation Showcase",
    desc: "Explore emerging technologies, products and ideas designed to transform learning and education.",
    icon: Zap,
  },
  {
    num: "02",
    title: "School & Educator Connect",
    desc: "Meet school leaders and educators, understand real challenges and explore solutions that can create measurable impact.",
    icon: Building2,
  },
  {
    num: "03",
    title: "EdTech & Startup Connect",
    desc: "Discover promising innovators and connect them with institutions looking for new possibilities.",
    icon: Sparkles,
  },
  {
    num: "04",
    title: "Leadership Conversations",
    desc: "Engage with senior education leaders, experts and changemakers through meaningful conversations.",
    icon: Mic,
  },
  {
    num: "05",
    title: "Workshops & Masterclasses",
    desc: "Learn practical strategies through focused sessions led by experienced educators, innovators and industry experts.",
    icon: BookOpen,
  },
  {
    num: "06",
    title: "Partnership Lounge",
    desc: "Create focused opportunities for schools, startups, institutions and partners to explore meaningful collaborations.",
    icon: Handshake,
  },
  {
    num: "07",
    title: "Innovation Awards",
    desc: "Recognise institutions, educators and innovators creating meaningful change across the education ecosystem.",
    icon: Trophy,
  },
  {
    num: "08",
    title: "Investor & Founder Connect",
    desc: "Give promising education startups an opportunity to showcase their solutions and connect with potential partners and investors.",
    icon: TrendingUp,
  },
];

// ── 4 Featured Sessions ──
const featuredSessions = [
  {
    title: "AI in Education",
    desc: "Learn practical approaches to using AI responsibly and effectively across teaching, learning, assessment and institutional operations.",
    icon: Cpu,
    badge: "Masterclass Workshop",
    highlight: "Responsible AI & Classrooms",
  },
  {
    title: "Deep Connection – EdTech Showcase",
    desc: "A focused presentation bringing innovative education solutions closer to institutions and education decision-makers.",
    icon: Zap,
    badge: "Solution Presentation",
    highlight: "Live Product Demos",
  },
  {
    title: "VC × University Dialogue",
    desc: "A focused conversation between venture capital leaders and universities around innovation, entrepreneurship, technology adoption and opportunities for collaboration.",
    icon: TrendingUp,
    badge: "Strategic Roundtable",
    highlight: "Institutional Innovation",
  },
  {
    title: "University × Founder Connect",
    desc: "Create meaningful conversations between universities, education founders and solution providers to explore pilots, partnerships and innovation opportunities.",
    icon: Handshake,
    badge: "Curated Exchange",
    highlight: "Pilots & Joint Ventures",
  },
];

// ── 4 Why EduBeacon Blocks ──
const whyBlocks = [
  {
    num: "01",
    title: "DISCOVER WHAT'S NEXT",
    desc: "Explore emerging technologies, innovative models and new approaches that are shaping the future of education.",
  },
  {
    num: "02",
    title: "MEET THE RIGHT PEOPLE",
    desc: "Connect with school leaders, educators, founders, technology providers and education decision-makers.",
  },
  {
    num: "03",
    title: "TURN CONNECTIONS INTO PARTNERSHIPS",
    desc: "Move beyond conversations and explore pilots, collaborations, implementations and long-term partnerships.",
  },
  {
    num: "04",
    title: "BUILD FOR THE FUTURE",
    desc: "Take away insights, relationships and practical ideas that can create lasting impact.",
  },
];

// ── 5-Stage Journey ──
const journeySteps = [
  { num: "01", stage: "DISCOVER", desc: "Explore ideas, technologies and people." },
  { num: "02", stage: "CONNECT", desc: "Meet the people who understand your challenges and opportunities." },
  { num: "03", stage: "COLLABORATE", desc: "Exchange knowledge and build meaningful partnerships." },
  { num: "04", stage: "IMPLEMENT", desc: "Take ideas beyond the conference and into the real world." },
  { num: "05", stage: "GROW", desc: "Build stronger institutions, businesses and education ecosystems." },
];

// ── 9 Discussion Themes ──
const discussionThemes = [
  {
    num: "01",
    title: "AI & Digital Transformation",
    desc: "Moving beyond experimentation toward meaningful implementation of AI and digital technologies in classrooms.",
    tag: "Technology",
  },
  {
    num: "02",
    title: "Future-Ready Classrooms",
    desc: "How learning environments, teaching methods and technology must evolve for tomorrow's learners.",
    tag: "Pedagogy",
  },
  {
    num: "03",
    title: "School–Startup Collaboration",
    desc: "Creating stronger bridges between institutions facing challenges and innovators building solutions.",
    tag: "Ecosystem",
  },
  {
    num: "04",
    title: "Personalised Learning",
    desc: "Using data, technology and human-centred approaches to support diverse learning styles and paces.",
    tag: "Analytics",
  },
  {
    num: "05",
    title: "Teacher Development",
    desc: "Empowering educators with the modern skills, tools, and peer communities they need to thrive.",
    tag: "Faculty",
  },
  {
    num: "06",
    title: "Education Leadership",
    desc: "Building institutions capable of adapting, innovating, and leading through rapid societal change.",
    tag: "Governance",
  },
  {
    num: "07",
    title: "Skills & Employability",
    desc: "Connecting foundational education with the vocational skills and opportunities learners need for the future.",
    tag: "Workforce",
  },
  {
    num: "08",
    title: "Inclusive Education",
    desc: "Using technological innovation to make high-quality learning accessible, equitable, and universally inclusive.",
    tag: "Impact",
  },
  {
    num: "09",
    title: "Global Education Partnerships",
    desc: "Creating opportunities for institutions and innovators to learn, collaborate, and grow across international borders.",
    tag: "Global",
  },
];

// ── University Innovation & Investment Connect Pillars ──
const universityConnectPillars = [
  {
    title: "University Leaders",
    desc: "Explore emerging technologies, partnerships and innovation opportunities.",
    icon: Landmark,
    badge: "Higher Ed Executives",
  },
  {
    title: "Founders",
    desc: "Present solutions designed for higher education and institutional challenges.",
    icon: Rocket,
    badge: "Solution Innovators",
  },
  {
    title: "Investors",
    desc: "Discover emerging education technology ventures and innovation opportunities.",
    icon: TrendingUp,
    badge: "Venture Capital & Angels",
  },
];

const universityCollaborations = [
  "University–Startup Partnerships",
  "Innovation Labs",
  "Technology Pilots",
  "Research & Industry Collaboration",
  "Entrepreneurship Programs",
  "Investment Conversations",
];

// ── 3 Special Experiences ──
const specialExperiences = [
  {
    title: "Leadership Roundtables",
    desc: "Small-group conversations where education leaders can openly discuss challenges, opportunities, and confidential strategy under Chatham House Rule.",
    badge: "Executive Only",
  },
  {
    title: "Live Fireside Conversations",
    desc: "Unfiltered conversations with educators, founders, and changemakers about their journeys, hard lessons learned, and audacious visions.",
    badge: "Plenary Stage",
  },
  {
    title: "The Unconference",
    desc: "A participant-driven experience where attendees become contributors, pitching topics in real time and sharing lived pedagogical experiences.",
    badge: "Open Floor",
  },
];

// ── 8 Who Should Attend Profiles ──
const attendeeProfiles = [
  { title: "School Leaders", desc: "Principals, directors, school owners, trustees, and education decision-makers.", icon: GraduationCap },
  { title: "Educators", desc: "Teachers, curriculum leaders, instructional designers, and academic coordinators.", icon: BookOpen },
  { title: "EdTech Founders", desc: "Entrepreneurs building groundbreaking software, hardware, and services for learning.", icon: Sparkles },
  { title: "Technology Providers", desc: "Companies creating infrastructure, school ERPs, AI labs, and hardware solutions.", icon: Cpu },
  { title: "Higher Education", desc: "Universities, colleges, academic deans, and research leaders.", icon: Building2 },
  { title: "Corporate & CSR Partners", desc: "Organisations supporting education grants, talent pipelines, and social impact.", icon: Briefcase },
  { title: "Investors", desc: "Venture funds, angel syndicates, and foundations backing education technology.", icon: TrendingUp },
  { title: "Policy & Board Leaders", desc: "Government advisors, education board officials, and systemic reformers.", icon: Users },
];

// ── Networking & Connections ──
const networkingFlow = [
  {
    step: "01",
    title: "Curated Networking",
    desc: "Meet school leaders, educators, founders, universities, investors and technology providers.",
    icon: Users,
    timing: "Continuous Across Summit",
  },
  {
    step: "02",
    title: "Networking Lunch",
    desc: "Continue conversations in a relaxed setting while connecting with fellow delegates.",
    icon: Coffee,
    timing: "Mid-Day Plenary Dining",
  },
  {
    step: "03",
    title: "Tea & Connect",
    desc: "Informal conversations, introductions and relationship-building between sessions.",
    icon: Clock,
    timing: "Morning & Afternoon Breaks",
  },
  {
    step: "04",
    title: "1:1 Meetings",
    desc: "Create focused conversations between institutions, startups, partners and investors.",
    icon: Handshake,
    timing: "Curated Partnership Lounge",
  },
];

// ── Recognition & Felicitation ──
const recognitionCategories = [
  {
    title: "Certificate of Participation",
    desc: "Formal credentialing and CPD recognition acknowledging delegates' active contribution to the national education summit.",
    icon: Award,
    badge: "All Registered Delegates",
  },
  {
    title: "Institutional Recognition",
    desc: "Honouring progressive schools and colleges championing innovative pedagogy, student wellbeing, and modern infrastructure.",
    icon: Building2,
    badge: "Schools & Colleges",
  },
  {
    title: "Educator Recognition",
    desc: "Celebrating inspiring teachers, academic coordinators, and mentors who create transformative learning journeys.",
    icon: GraduationCap,
    badge: "Teachers & Mentors",
  },
  {
    title: "Innovation Recognition",
    desc: "Spotlighting EdTech pioneers and technologists deploying high-impact solutions in learning environments.",
    icon: Sparkles,
    badge: "Founders & Technologists",
  },
  {
    title: "Partner Appreciation",
    desc: "Acknowledging sponsors, university hosts, and strategic alliance partners who empower the EduBeacon network.",
    icon: HeartHandshake,
    badge: "Alliance Partners",
  },
];

// ── Testimonials (What Leaders Say) ──
const conferenceTestimonials = [
  {
    quote: "EduBeacon created an environment where educators and innovators could have meaningful conversations about the challenges that actually matter.",
    name: "Dr. Arvind Sharma",
    role: "Director of Academics",
    org: "Heritage International Schools",
  },
  {
    quote: "Unlike crowded commercial expos, EduBeacon's curated 1:1 meetings delivered 12 verified pilot partnerships with top tier K-12 institutions.",
    name: "Meera Nair",
    role: "Co-Founder & CEO",
    org: "NexGen STEM Labs",
  },
  {
    quote: "The keynote discussions on AI implementation gave our leadership team actionable frameworks that we deployed across all 6 campuses.",
    name: "Col. Rajesh Verma (Retd.)",
    role: "President",
    org: "National Progressive Schools Alliance",
  },
];

// ── Delegate Pass Tiers ──
const ticketTiers = [
  {
    name: "School Leader Delegate Pass",
    badge: "For Principals & Trustees",
    price: "Complimentary",
    subtext: "Subject to verification of school credentials",
    features: [
      "Access to all 4 Conference Tracks & Plenaries",
      "Full access to 300+ Solution Exhibition Booths",
      "Networking Luncheon on both days",
      "Delegate Kit & Research Whitepaper",
      "Certificate of Participation (CPD Points)",
    ],
    highlight: true,
    cta: "Apply for School Pass",
    modal: "school-register" as const,
  },
  {
    name: "Standard Industry Delegate",
    badge: "For Vendors & EdTech Teams",
    price: "₹14,999",
    subtext: "+ GST per delegate",
    features: [
      "All-stage conference access for 2 days",
      "Exhibition Floor & Demo Pod Access",
      "Networking Luncheon & Evening Tea",
      "Access to official Delegate Networking App",
      "Access to Attendee Directory (Post-Event)",
    ],
    highlight: false,
    cta: "Book Industry Pass",
    modal: "vendor-register" as const,
  },
  {
    name: "VIP All-Access & Awards Gala",
    badge: "All Inclusions + Gala",
    price: "₹24,999",
    subtext: "+ GST per delegate",
    features: [
      "All Standard features with Reserved VIP Seating",
      "Exclusive Invitation to EduBeacon Awards Gala Dinner",
      "Access to Private VIP Speaker Lounge",
      "1-on-1 Pre-Matched Curated Meetings (Up to 5)",
      "Featured Listing in Official Conference Guide",
    ],
    highlight: false,
    cta: "Book VIP Gala Pass",
    modal: "vendor-register" as const,
  },
];

// ── 12 FAQs ──
const faqs = [
  { q: "What is EduBeacon?", a: "EduBeacon is a global education innovation ecosystem that brings together school owners, principals, educators, EdTech founders, solution providers, and policy makers to discover, collaborate, and grow." },
  { q: "Who can attend?", a: "The conference is curated for K-12 school leaders, principals, educators, EdTech startups, corporate partners, higher-ed institutions, investors, and policymakers." },
  { q: "Why should schools participate?", a: "Schools gain access to 300+ verified solution providers, explore cutting-edge technologies (AI, Robotics, STEM, ERPs), attend keynote masterclasses, and receive certified professional development." },
  { q: "Why should EdTech startups participate?", a: "Startups can demonstrate their solutions directly to over 500+ verified school decision-makers, secure pre-arranged 1:1 curated meetings, and explore institutional partnerships." },
  { q: "Can companies become partners or sponsors?", a: "Yes. We offer Title, Diamond, Gold, and Silver sponsorship packages, exhibition booth spaces, and bespoke branding packages." },
  { q: "Can I apply to become a speaker?", a: "Yes. Educators, researchers, and innovative founders can submit session abstracts and speaker applications through our inquiry form." },
  { q: "Are workshops and masterclasses included in the pass?", a: "Yes. All delegate passes include full access to hands-on workshops, plenary tracks, and masterclasses across both days." },
  { q: "How can I register?", a: "Simply click 'Register Now' or choose your delegate tier on this page. School leaders can apply for complimentary passes subject to verification." },
  { q: "How can my organisation become a sponsor?", a: "Review our sponsorship tiers on this page and submit an inquiry or download the official sponsorship prospectus." },
  { q: "Where and when will the event take place?", a: "The Annual Summit takes place on 15–16 November 2027 at Hotel Aketa, Rajpur Road, Dehradun, Uttarakhand, India." },
  { q: "What opportunities are available for early-stage startups?", a: "Startups can join the EdTech Launchpad, participate in investor pitching rounds, and exhibit in the dedicated Innovation Showcase dome." },
  { q: "Can schools explore and test technology solutions live at the event?", a: "Yes. The Exhibition Floor features interactive smart classroom setups, robotics arenas, and AI demo pods where teachers and leaders can test solutions hands-on." },
];

export default function ConferencePage() {
  const { openModal } = useModal();
  const [activeDay, setActiveDay] = useState("day-1");
  const [compareOpen, setCompareOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Participant creative interactive demo state
  const [creativeTheme, setCreativeTheme] = useState<"leader" | "teacher">("leader");
  const [previewName, setPreviewName] = useState("Dr. Ananya Sharma");
  const [previewDesignation, setPreviewDesignation] = useState("Principal & Academic Director");
  const [previewSchool, setPreviewSchool] = useState("Heritage International School");
  const [copiedLink, setCopiedLink] = useState(false);

  const currentDay = conferenceAgenda.find((d) => d.id === activeDay) || conferenceAgenda[0];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-[#F8FAF8] text-charcoal min-h-screen">

      {/* ──────────────── 1. FULL-SCREEN IMMERSIVE CONFERENCE HERO ──────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#0A1A10] text-white">
        {/* Background Real HTML Video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-70 scale-105 filter brightness-105 contrast-105"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Translucent Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A10]/90 via-[#061A10]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061A10] via-transparent to-[#061A10]/40" />

          {/* Ambient Mint Radial Glows */}
          <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto py-16 md:py-24">
          <Container>
            <div className="max-w-2xl">
              {/* Hero Top Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-[11px] font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GLOBAL EDUCATION NETWORK • CONNECTED
              </div>

              {/* Main Headline */}
              <h1 className="font-extrabold font-display text-[40px] sm:text-[54px] md:text-[64px] leading-[1.05] tracking-tight text-white mb-5">
                The Future of Education,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">
                  Connected.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-slate-200 text-[16px] sm:text-[18px] leading-relaxed mb-8 max-w-[50ch] font-normal drop-shadow-sm">
                Where schools, educators, innovators and opportunities come together to shape the future of learning.
              </p>

              {/* Event Date & Location Pill with Google Maps Link */}
              <div className="inline-flex flex-wrap items-center gap-4 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3.5 mb-8 text-xs text-slate-200 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Calendar className="w-4 h-4" /> 15–16 November 2027
                </span>
                <span className="text-slate-400">•</span>
                <a
                  href="https://share.google/g2ShK4g4eKqOSN45a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-100 hover:text-emerald-300 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                  <span>Hotel Aketa, Dehradun</span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30">Maps ↗</span>
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openModal("school-register")}
                  className="px-8 py-4 rounded-full font-bold text-[14.5px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Register Now →
                </button>

                <button
                  onClick={() => openModal("vendor-register")}
                  className="px-8 py-4 rounded-full font-bold text-[14.5px] uppercase tracking-wider text-charcoal bg-white shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Become a Partner →
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* ──────────────── 2. HERO CREDIBILITY STATS STRIP (4 METRICS) ──────────────── */}
        <div className="relative z-10 w-full border-t border-white/10 bg-[#061A10]/90 backdrop-blur-xl py-6">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "500+", label: "Schools Connected" },
                { value: "300+", label: "Vendors & Partners" },
                { value: "10K+", label: "Education Connections" },
                { value: "50+", label: "Knowledge Sessions" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center px-4 ${
                    i < 3 ? "md:border-r md:border-white/10" : ""
                  }`}
                >
                  <p className="font-extrabold text-[32px] sm:text-[40px] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[12.5px] text-slate-300 font-semibold mt-1.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ──────────────── MEGA EXPO CALLOUT RIBBON ──────────────── */}
      <div className="bg-gradient-to-r from-[#061A10] via-[#0E733B] to-[#061A10] text-white py-3.5 text-center text-xs sm:text-sm font-bold uppercase tracking-widest shadow-inner border-y border-emerald-500/30">
        INDIA&apos;S PREMIER EDUCATION LEADERSHIP SUMMIT & MEGA INNOVATION EXPO
      </div>

      {/* ──────────────── 3. EDITORIAL OVERVIEW SECTION ──────────────── */}
      <section id="overview" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0E733B]" />
              <span>OVERVIEW</span>
            </div>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal leading-[1.1] tracking-tight">
              Education Is Changing. <br />
              <span className="text-[#0E733B]">The Ecosystem Must Change With It.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Big Editorial Statement */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100">
              <p className="font-display font-extrabold text-[28px] sm:text-[34px] text-[#0E733B] leading-tight mb-4">
                &ldquo;Education is no longer evolving in isolation.&rdquo;
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                — EduBeacon Core Philosophy
              </p>
            </div>

            {/* Right Story Copy */}
            <div className="lg:col-span-7 space-y-4 text-slate-600 text-[15.5px] leading-relaxed font-normal">
              <p>
                Technology, changing learner expectations, new skills and evolving school needs are reshaping education at every level.
              </p>
              <p>
                EduBeacon brings the people shaping this transformation into one connected ecosystem. From school leaders and educators to startups, technology providers, institutions and industry partners, EduBeacon creates opportunities to discover new possibilities, exchange knowledge and build meaningful partnerships.
              </p>
              <p className="font-bold text-charcoal pt-2 text-[17px]">
                &ldquo;Because the future of education is not built by one stakeholder. It is built together.&rdquo;
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 4. FOUR CONFERENCE TRACKS ──────────────── */}
      <section id="tracks" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FOUR CONFERENCE TRACKS
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              One Ecosystem. Four Conversations Shaping Education.
            </h2>
            <p className="text-slate-500 text-[15px]">
              Explore the four core streams framing plenary addresses, masterclasses, and executive roundtables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conferenceTracks.map((track) => (
              <div
                key={track.num}
                className="group p-7 rounded-3xl bg-white border border-line hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center group-hover:bg-[#0E733B] group-hover:text-white transition-colors">
                      <track.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                      TRACK {track.num}
                    </span>
                  </div>

                  <h3 className="font-bold text-[18px] text-charcoal mb-2 group-hover:text-[#0E733B] transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-[13px] text-slate-600 leading-relaxed mb-5">
                    {track.desc}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-1.5">
                  {track.topics.map((t) => (
                    <div key={t} className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 5. WHAT AWAITS YOU AT EDUBEACON (8 CARDS) ──────────────── */}
      <section id="experience" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-[#0E733B] text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-3 border border-emerald-500/20">
              <span>EXPERIENCES</span>
            </div>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal leading-[1.1] mb-3 tracking-tight">
              More Than a Conference
            </h2>
            <p className="text-slate-500 text-[15.5px] leading-relaxed">
              Explore experiences designed to turn conversations into connections—and connections into action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {experienceCards.map((card) => (
              <div
                key={card.num}
                className="group p-6 rounded-2xl bg-[#F8FAF8] border border-line shadow-xs hover:shadow-xl hover:bg-white hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center group-hover:bg-[#0E733B] group-hover:text-white transition-colors">
                      <card.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-emerald-500 transition-colors">
                      {card.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-[17px] text-charcoal mb-2 group-hover:text-[#0E733B] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 6. FEATURED SESSIONS ──────────────── */}
      <section id="featured-sessions" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FEATURED SESSIONS
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Ideas. Conversations. Real-World Impact.
            </h2>
            <p className="text-slate-600 text-[15.5px] leading-relaxed">
              From practical AI workshops to investor conversations and leadership discussions, experience focused sessions designed around the future of education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredSessions.map((session, idx) => (
              <div
                key={session.title}
                className="group p-8 rounded-3xl bg-white border border-line shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                      {session.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      SESSION 0{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center shrink-0 group-hover:bg-[#0E733B] group-hover:text-white transition-colors">
                      <session.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-bold font-display text-[20px] text-charcoal group-hover:text-[#0E733B] transition-colors">
                        {session.title}
                      </h3>
                      <span className="text-[11.5px] font-semibold text-emerald-700">
                        {session.highlight}
                      </span>
                    </div>
                  </div>

                  <p className="text-[14px] text-slate-600 leading-relaxed mt-3">
                    {session.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Interactive Format • Audience Q&A
                  </span>
                  <button
                    onClick={() => openModal("school-register")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E733B] hover:text-[#0B5C2F] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Reserve Session Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 7. WHY EDUBEACON (4 LARGE BLOCKS) ──────────────── */}
      <section id="why" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              VALUE PROPOSITION
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Why Be Part of EduBeacon?
            </h2>
            <p className="text-slate-500 text-[15px]">
              Come for the ideas. Stay for the connections. Leave with opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyBlocks.map((b) => (
              <div
                key={b.num}
                className="p-7 rounded-3xl bg-[#F8FAF8] border border-emerald-100/80 flex flex-col justify-between hover:bg-white hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
              >
                <div>
                  <span className="text-[28px] font-black font-display text-[#0E733B]/40 block mb-3">
                    {b.num}
                  </span>
                  <h3 className="font-bold text-[15px] uppercase tracking-wider text-charcoal mb-2">
                    {b.title}
                  </h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-normal">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 8. EDUBEACON 5-STAGE JOURNEY ──────────────── */}
      <section className="py-16 md:py-20 bg-[#FDFBF7] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              JOURNEY
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Your EduBeacon Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {journeySteps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-white border border-line shadow-xs flex flex-col text-center items-center hover:border-emerald-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0E733B] font-extrabold text-sm flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h4 className="font-bold text-[14px] uppercase tracking-wider text-charcoal mb-1">
                  {step.stage}
                </h4>
                <p className="text-[12px] text-slate-500 leading-snug">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 9. DISCUSSION THEMES (9 CARDS) ──────────────── */}
      <section id="themes" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              CURATED TRACKS
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Conversations That Matter
            </h2>
            <p className="text-slate-500 text-[15px]">
              Explore the questions shaping the future of education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discussionThemes.map((theme) => (
              <div
                key={theme.num}
                className="p-6 rounded-2xl bg-[#F8FAF8] border border-line hover:border-[#0E733B] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {theme.tag}
                  </span>
                  <span className="text-xs font-extrabold text-slate-300">
                    THEME {theme.num}
                  </span>
                </div>
                <h3 className="font-bold text-[16px] text-charcoal mb-2">
                  {theme.title}
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {theme.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 10. UNIVERSITY INNOVATION & INVESTMENT CONNECT ──────────────── */}
      <section id="university-connect" className="py-16 md:py-24 bg-[#0A1A10] text-white relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full inline-block mb-3">
              UNIVERSITY INNOVATION & INVESTMENT CONNECT
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[46px] text-white leading-tight mb-3 tracking-tight">
              Where Universities Meet Innovation
            </h2>
            <p className="text-slate-300 text-[15.5px] leading-relaxed">
              Bring together universities, founders, EdTech innovators and investors to explore how emerging technologies and entrepreneurial ideas can move from concept to institutional implementation.
            </p>
          </div>

          {/* 3 Executive Stakeholder Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {universityConnectPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-7 rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-md hover:bg-white/[0.12] hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
                      <pillar.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-[20px] text-white mb-2 font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-[13.5px] text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 4th Block: Potential Collaborations Executive Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.09] via-white/[0.05] to-emerald-950/40 border border-emerald-500/30 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 block mb-2">
                  AREAS OF ENGAGEMENT
                </span>
                <h3 className="font-bold font-display text-[24px] sm:text-[28px] text-white mb-3">
                  Potential Collaborations & Outcomes
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Facilitating multi-stakeholder agreements, venture acceleration, and applied technology adoption across higher education ecosystems.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {universityCollaborations.map((collab) => (
                    <div key={collab} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{collab}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => openModal("vendor-register")}
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg shadow-emerald-900/40 hover:scale-105 transition-all text-center"
                >
                  Join University Roundtable →
                </button>
                <button
                  onClick={() => openModal("interest", { vendorName: "University Connect" })}
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
                >
                  Submit Pilot Proposal
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 11. SPECIAL EXPERIENCES (3 CARDS) ──────────────── */}
      <section className="py-16 md:py-20 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">
              FORMAT INNOVATION
            </span>
            <h2 className="font-bold font-display text-[30px] md:text-[40px] text-charcoal mt-2 tracking-tight">
              EduBeacon Beyond the Stage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialExperiences.map((exp) => (
              <div
                key={exp.title}
                className="p-7 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#0E733B] px-3 py-1 rounded-full mb-4 inline-block">
                    {exp.badge}
                  </span>
                  <h3 className="font-bold text-[18px] text-charcoal mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 12. WHO SHOULD ATTEND (8 PROFILES) ──────────────── */}
      <section id="who" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              DELEGATE COMMUNITY
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Built for the Education Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {attendeeProfiles.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[#F8FAF8] border border-line flex flex-col items-start gap-3 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E733B] flex items-center justify-center">
                  <p.icon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-charcoal mb-1">{p.title}</h4>
                  <p className="text-[12.5px] text-slate-500 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 13. DEDICATED PILLARS: FOR SCHOOLS & FOR INNOVATORS ──────────────── */}
      <section className="py-16 md:py-24 bg-[#FDFBF7] border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Schools */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] mb-2 block">
                  FOR INSTITUTIONS
                </span>
                <h3 className="font-bold font-display text-[26px] sm:text-[32px] text-charcoal mb-4">
                  Why Schools Should Join
                </h3>
                <ul className="space-y-3 mb-8 text-[14px] text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>DISCOVER:</strong> Find relevant solutions for real institutional challenges.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>CONNECT:</strong> Meet founders, educators and experts beyond traditional networks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>EXPLORE:</strong> Experience new technologies before making implementation decisions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>PARTNER:</strong> Find organisations interested in solving real education problems.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>GROW:</strong> Bring new ideas and capabilities back to your institution.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => openModal("school-register")}
                className="w-full text-center py-3.5 rounded-full font-bold text-[13.5px] uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md transition-colors"
              >
                For Schools → Join EduBeacon
              </button>
            </div>

            {/* For Startups & Innovators */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] mb-2 block">
                  FOR SOLUTION PROVIDERS
                </span>
                <h3 className="font-bold font-display text-[26px] sm:text-[32px] text-charcoal mb-4">
                  Why Innovators Should Join
                </h3>
                <ul className="space-y-3 mb-8 text-[14px] text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>DISCOVER YOUR MARKET:</strong> Understand what schools and institutions actually need.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>MEET DECISION-MAKERS:</strong> Connect directly with evaluators and buyers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>DEMONSTRATE LIVE:</strong> Show your technology in a real education-focused arena.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>BUILD PARTNERSHIPS:</strong> Explore pilots, collaborations and multi-branch rollouts.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0 mt-0.5" />
                    <span><strong>GROW YOUR NETWORK:</strong> Meet educators, institutions, partners and investors.</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => openModal("vendor-register")}
                className="w-full text-center py-3.5 rounded-full font-bold text-[13.5px] uppercase tracking-wider text-charcoal bg-emerald-50 border border-emerald-200 hover:bg-[#0E733B] hover:text-white transition-colors"
              >
                For Innovators → Become a Partner
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 14. NETWORKING & CONNECTIONS (FLOW & PIPELINE) ──────────────── */}
      <section id="networking" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              NETWORKING & CONNECTIONS
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              The Best Opportunities Often Begin Between Sessions.
            </h2>
            <p className="text-slate-600 text-[15.5px] leading-relaxed">
              EduBeacon creates intentional spaces for meaningful conversations, introductions and partnerships beyond the main stage.
            </p>
          </div>

          {/* 4 Connected Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-12">
            {networkingFlow.map((item, idx) => (
              <div
                key={item.title}
                className="relative p-7 rounded-3xl bg-[#F8FAF8] border border-line hover:border-emerald-300 hover:shadow-lg hover:bg-white transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                      <item.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-black text-slate-300">
                      STEP {item.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-[18px] text-charcoal mb-2 font-display">
                    {item.title}
                  </h3>

                  <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="border-t border-gray-200/60 pt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#0E733B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timing}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Partnership Pipeline Strip */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 max-w-4xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#0E733B] mb-4">
              THE EDUBEACON CONNECTION PIPELINE
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3">
              {["School Leader", "Conversation", "Startup / Innovator", "Partnership", "Implementation", "Impact"].map((item, idx, arr) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-xl bg-white border border-emerald-200 font-bold text-xs text-charcoal text-center whitespace-nowrap shadow-2xs">
                    {item}
                  </div>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-emerald-500 rotate-90 md:rotate-0 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 15. THE EDUBEACON COMMUNITY / PARTICIPANT CREATIVES ──────────────── */}
      <section id="community-creatives" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              THE EDUBEACON COMMUNITY
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Meet the People Joining the Movement.
            </h2>
            <p className="text-slate-600 text-[15.5px] leading-relaxed">
              Celebrate every participant and make their EduBeacon journey shareable from the moment they register.
            </p>
          </div>

          {/* Interactive Creative Generator Preview Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl border border-line p-6 sm:p-10 shadow-sm">
            
            {/* Left Controls & Flow Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => {
                      setCreativeTheme("leader");
                      setPreviewName("Dr. Ananya Sharma");
                      setPreviewDesignation("Principal & Academic Director");
                      setPreviewSchool("Heritage International School");
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      creativeTheme === "leader"
                        ? "bg-[#0E733B] text-white shadow-sm"
                        : "bg-[#F8FAF8] text-slate-700 hover:bg-emerald-50"
                    }`}
                  >
                    Theme 01: School Leaders
                  </button>
                  <button
                    onClick={() => {
                      setCreativeTheme("teacher");
                      setPreviewName("Prof. Rajesh Menon");
                      setPreviewDesignation("Lead STEM Educator & Mentor");
                      setPreviewSchool("National Progressive Academy");
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      creativeTheme === "teacher"
                        ? "bg-[#0E733B] text-white shadow-sm"
                        : "bg-[#F8FAF8] text-slate-700 hover:bg-emerald-50"
                    }`}
                  >
                    Theme 02: Teachers & Educators
                  </button>
                </div>

                <h3 className="font-bold font-display text-[22px] text-charcoal">
                  {creativeTheme === "leader" ? "Welcome to EduBeacon" : "Teachers Who Inspire. Ideas That Transform."}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {creativeTheme === "leader" 
                    ? "Meet the leaders shaping the future of education."
                    : "Celebrating educators whose ideas and mentorship drive real classroom transformation."}
                </p>
              </div>

              {/* 5-Stage Shareable Flow */}
              <div className="space-y-2.5 bg-[#F8FAF8] p-4 rounded-2xl border border-line">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0E733B] block mb-1">
                  REGISTRATION & CREATIVE FLOW:
                </span>
                {[
                  "1. Complete registration via official delegate form",
                  "2. Receive instant registration confirmation & delegate ID",
                  "3. Auto-generate your personalized EduBeacon participant creative",
                  "4. Live preview with your designation & school logo",
                  "5. One-click share to LinkedIn, Twitter, WhatsApp or download HD badge",
                ].map((step) => (
                  <div key={step} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E733B] shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Live Interactive Text Inputs for Testing Badge */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Participant Name
                    </label>
                    <input
                      type="text"
                      value={previewName}
                      onChange={(e) => setPreviewName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-line bg-white focus:outline-none focus:border-[#0E733B]"
                      placeholder="e.g. Dr. Ananya Sharma"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={previewDesignation}
                      onChange={(e) => setPreviewDesignation(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-line bg-white focus:outline-none focus:border-[#0E733B]"
                      placeholder="e.g. Principal"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={previewSchool}
                    onChange={(e) => setPreviewSchool(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-line bg-white focus:outline-none focus:border-[#0E733B]"
                    placeholder="e.g. Heritage International School"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openModal("school-register")}
                  className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-sm transition-colors"
                >
                  Register to Get Your Badge →
                </button>
                <button
                  onClick={handleCopyShare}
                  className="px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#0E733B]" />
                  <span>{copiedLink ? "Badge Link Copied!" : "Simulate Social Share"}</span>
                </button>
              </div>
            </div>

            {/* Right: Live Participant Creative Visual Badge Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[360px] sm:max-w-[400px] rounded-3xl bg-gradient-to-br from-[#061A10] via-[#0E733B] to-[#061A10] p-6 text-white shadow-2xl relative overflow-hidden border border-emerald-400/30">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Badge Top Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-sm border border-white/20">
                      EB
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm leading-none tracking-tight">EduBeacon 2027</h4>
                      <span className="text-[9px] text-emerald-300 uppercase tracking-widest font-semibold">National Leadership Summit</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
                    {creativeTheme === "leader" ? "DELEGATE" : "EDUCATOR"}
                  </span>
                </div>

                {/* Creative Headline */}
                <div className="relative z-10 mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 block mb-0.5">
                    {creativeTheme === "leader" ? "CONFIRMED PARTICIPANT" : "INSPIRING EDUCATOR"}
                  </span>
                  <h3 className="font-extrabold font-display text-[22px] leading-tight text-white">
                    {creativeTheme === "leader" ? "Welcome to EduBeacon" : "Teachers Who Inspire. Ideas That Transform."}
                  </h3>
                </div>

                {/* Profile Card Center */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 mb-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-[#061A10] font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {previewName.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-extrabold text-base text-white truncate">{previewName || "Participant Name"}</h5>
                    <p className="text-xs text-emerald-200 truncate">{previewDesignation || "Designation"}</p>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">{previewSchool || "School Name"}</p>
                  </div>
                </div>

                {/* Date & Venue Footer */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-200 border-t border-white/15 pt-3">
                  <span className="flex items-center gap-1 font-bold text-emerald-300">
                    <Calendar className="w-3.5 h-3.5" /> 15–16 Nov 2027
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" /> Dehradun, India
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ──────────────── 16. VOICES SHAPING THE FUTURE (SPEAKERS RAIL) ──────────────── */}
      <div id="speakers">
        <SpeakersSection />
      </div>

      {/* ──────────────── 17. 2-DAY INTERACTIVE AGENDA ──────────────── */}
      <section id="agenda" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              INTERACTIVE SCHEDULE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-charcoal mt-3 mb-2">
              Two-Day Conference Program
            </h2>
            <p className="text-slate-600 text-sm">
              Plenary addresses, innovation debates, vendor demos, and curated 1:1 meetings.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            {conferenceAgenda.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeDay === day.id
                    ? "bg-[#0E733B] text-white shadow-md shadow-emerald-700/20"
                    : "bg-white text-slate-700 border border-line hover:border-emerald-300"
                }`}
              >
                {day.label} — {day.date}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {currentDay.sessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-line p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-emerald-200 transition-all shadow-xs"
              >
                <div className="w-20 shrink-0 font-display font-extrabold text-[#0E733B] text-base">
                  {session.time}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {session.type}
                    </span>
                    {session.speaker && (
                      <span className="text-[11px] text-slate-500">
                        by <strong className="text-charcoal">{session.speaker}</strong>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-charcoal">{session.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{session.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 18. RECOGNITION & FELICITATION ──────────────── */}
      <section id="recognition" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              RECOGNITION & FELICITATION
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Celebrating Participation. Recognising Contribution.
            </h2>
            <p className="text-slate-600 text-[15.5px] leading-relaxed">
              Recognise the schools, educators, innovators, institutions and partners who contribute to the EduBeacon ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {recognitionCategories.map((cat) => (
              <div
                key={cat.title}
                className="p-7 rounded-3xl bg-[#F8FAF8] border border-emerald-100 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:bg-white transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0E733B] flex items-center justify-center">
                      <cat.icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-[18px] text-charcoal mb-2 font-display">
                    {cat.title}
                  </h3>

                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recognition Callout Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-[#F8FAF8] to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h4 className="font-bold font-display text-[20px] text-charcoal mb-1">
                Nominate Your Institution or Exemplary Educator
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nominate deserving educators, innovative school programs, or collaborative partnerships for formal summit recognition and felicitation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => openModal("award-nominate")}
                className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-sm transition-all"
              >
                Submit Nomination →
              </button>
              <button
                onClick={() => openModal("school-register")}
                className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-charcoal bg-white border border-line hover:bg-emerald-50 transition-all"
              >
                Register Delegates
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 19. SPONSORSHIP PACKAGES & PROSPECTUS ──────────────── */}
      <section id="sponsorship" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              SPONSORSHIP OPPORTUNITIES
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Powered by the Education Ecosystem
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate-500">
              Showcase your brand before 1,200+ decision makers and secure guaranteed curated 1-on-1 school meetings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {sponsorshipPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="relative flex flex-col rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1"
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0E733B] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-base font-extrabold text-charcoal mt-1 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4 flex-1">
                  {pkg.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-700 mb-6 border-t border-line pt-4 font-medium">
                  {pkg.exhibitionSpace && <p>• Exhibition: <strong>{pkg.exhibitionSpace}</strong></p>}
                  {pkg.guaranteedMeetings && <p>• <strong>{pkg.guaranteedMeetings}</strong> Curated Meetings</p>}
                  {pkg.speakingSlot && <p>• {pkg.speakingSlot}</p>}
                </div>

                <button
                  onClick={() => openModal("sponsor-register", { packageId: pkg.id, packageName: pkg.name })}
                  className="w-full text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-[#0E733B] hover:bg-[#0B5C2F] text-white shadow-sm transition-all hover:scale-[1.02]"
                >
                  Register as {pkg.name.replace(" Partner", "")} →
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setCompareOpen((v) => !v)}
              className="text-xs font-bold text-[#0E733B] hover:underline"
            >
              {compareOpen ? "Hide" : "Compare"} All Deliverables ↓
            </button>
          </div>

          {/* Quick Sponsor Registration & Custom Inquiries Banner */}
          <div className="mt-10 bg-gradient-to-r from-[#064E3B] via-[#0E733B] to-[#059669] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Direct Sponsor & Exhibitor Onboarding</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Register Your Brand as an Official Sponsor
              </h3>
              <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
                Lock in your exhibition booth, keynote slot, and guaranteed 1-on-1 meetings with 1,200+ school leaders & trustees.
              </p>
            </div>
            <button
              onClick={() => openModal("sponsor-register", { packageId: "gold" })}
              className="shrink-0 bg-white text-[#0E733B] hover:bg-emerald-50 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
            >
              Register as Sponsor →
            </button>
          </div>

          {compareOpen && (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm p-2">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-emerald-50 text-[#0E733B]">
                    <th className="text-left p-3 font-bold">Deliverable</th>
                    <th className="p-3 text-center">Silver</th>
                    <th className="p-3 text-center">Gold</th>
                    <th className="p-3 text-center">Diamond</th>
                    <th className="p-3 text-center">Title</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-medium">Exhibition Space</td><td className="text-center">6×6 ft</td><td className="text-center">8×8 ft</td><td className="text-center">10×10 ft</td><td className="text-center font-bold">Custom Island</td></tr>
                  <tr><td className="p-3 font-medium">Curated Meetings</td><td className="text-center">5</td><td className="text-center">10</td><td className="text-center">15</td><td className="text-center font-bold">20+ Guaranteed</td></tr>
                  <tr><td className="p-3 font-medium">Speaking Slot</td><td className="text-center">—</td><td className="text-center">10 mins</td><td className="text-center">20 mins</td><td className="text-center font-bold">Plenary Keynote</td></tr>
                  <tr><td className="p-3 font-medium">Magazine Feature</td><td className="text-center">✓</td><td className="text-center">Half Page</td><td className="text-center">Full Page</td><td className="text-center font-bold">Cover Story</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </section>

      {/* ──────────────── 20. DELEGATE PASSES & REGISTRATION TIERS ──────────────── */}
      <section id="passes" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              DELEGATE PASSES
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[44px] text-charcoal mt-3 mb-2 tracking-tight">
              Choose Your Delegate Tier
            </h2>
            <p className="text-slate-500 text-sm">
              All passes include 2-day access, networking luncheons, and official conference kit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ticketTiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                  tier.highlight
                    ? "bg-white border-[#0E733B] shadow-xl ring-2 ring-emerald-400/20"
                    : "bg-white border-line shadow-xs hover:border-emerald-200"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-3 inline-block">
                    {tier.badge}
                  </span>
                  <h3 className="font-bold text-lg text-charcoal mb-1">{tier.name}</h3>
                  <div className="my-3">
                    <span className="font-extrabold text-2xl text-[#0E733B]">{tier.price}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tier.subtext}</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 my-6 border-t border-line pt-4">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0E733B] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openModal(tier.modal)}
                  className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                    tier.highlight
                      ? "bg-[#0E733B] hover:bg-[#0B5C2F] text-white shadow-md"
                      : "bg-emerald-50 text-[#0E733B] hover:bg-[#0E733B] hover:text-white"
                  }`}
                >
                  {tier.cta} →
                </button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 21. TESTIMONIALS (WHAT LEADERS SAY) ──────────────── */}
      <section id="testimonials" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              VOICES OF IMPACT
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              What Leaders Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {conferenceTestimonials.map((t) => (
              <div
                key={t.name}
                className="p-7 rounded-3xl bg-white border border-emerald-100 flex flex-col justify-between shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div>
                  <Quote className="w-8 h-8 text-emerald-400 mb-4 opacity-70" />
                  <p className="text-[14px] leading-relaxed text-slate-700 italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="font-bold text-sm text-charcoal">{t.name}</p>
                  <p className="text-xs text-[#0E733B] font-semibold">{t.role}</p>
                  <p className="text-xs text-slate-400">{t.org}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 22. PREVIOUS EDITIONS TIMELINE ──────────────── */}
      <section id="editions" className="py-14 md:py-20 bg-[#FDFBF7] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B]">
              EDITIONS
            </span>
            <h2 className="font-bold font-display text-[28px] md:text-[38px] text-charcoal mt-2 tracking-tight">
              EduBeacon Through the Years
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { year: "2025", title: "First Edition", desc: "Inaugural summit establishing the school-founder alliance." },
              { year: "2026", title: "Growing the Network", desc: "Expansion to 12 regional roadshow chapters nationwide." },
              { year: "2027", title: "Building the Ecosystem", desc: "Flagship National Leadership Mega-Summit at Hotel Aketa, Dehradun." },
            ].map((ed) => (
              <div key={ed.year} className="p-6 rounded-2xl bg-white border border-line text-center shadow-xs">
                <span className="text-2xl font-black font-display text-[#0E733B] block mb-1">
                  {ed.year}
                </span>
                <h4 className="font-bold text-sm text-charcoal mb-1">{ed.title}</h4>
                <p className="text-xs text-slate-500">{ed.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ──────────────── 23. OFFICIAL VENUE & EMBEDDED LOCATION MAP ──────────────── */}
      <section id="venue" className="py-16 md:py-24 bg-white border-b border-line">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              OFFICIAL VENUE & MAP
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Conference Venue & Location
            </h2>
            <p className="text-slate-500 text-sm">
              Conveniently located on Rajpur Road, Dehradun with full conference, exhibition, and parking amenities.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-[#F8FAF8] border border-emerald-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0E733B] bg-emerald-100/60 px-3 py-1 rounded-md">
                  <MapPin className="w-4 h-4" /> Dehradun, Uttarakhand
                </div>
                <h3 className="text-2xl font-bold font-display text-charcoal">
                  Hotel Aketa
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Rajpur Road, Hathibarkala, Dehradun, Uttarakhand 248001. A premier hospitality and convention venue with state-of-the-art auditorium facilities, exhibition lawns, and leadership lounges.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-line px-3.5 py-2 rounded-xl shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0" />
                    <span>Free Dedicated Valet Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-line px-3.5 py-2 rounded-xl shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0" />
                    <span>High-Speed Campus Wi-Fi & AV</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-line px-3.5 py-2 rounded-xl shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0E733B] shrink-0" />
                    <span>Executive Networking Lawn & Lounges</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://share.google/g2ShK4g4eKqOSN45a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-md hover:scale-105 transition-all text-center"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions on Google Maps ↗
                  </a>
                </div>
              </div>

              {/* Right Embedded Interactive Map */}
              <div className="lg:col-span-7">
                <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] rounded-2xl overflow-hidden border border-emerald-200/80 shadow-md bg-white">
                  <iframe
                    title="Hotel Aketa Dehradun Location Map"
                    src="https://maps.google.com/maps?q=Hotel+Aketa,+Rajpur+Road,+Hathibarkala,+Dehradun,+Uttarakhand+248001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* ──────────────── 24. ACCORDION FAQS (12 FAQS) ──────────────── */}
      <section id="faqs" className="py-16 md:py-24 bg-[#F8FAF8] border-b border-line">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E733B] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-bold font-display text-[32px] md:text-[42px] text-charcoal mt-3 mb-2 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-white overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-5 py-4 font-bold text-sm text-charcoal flex items-center justify-between gap-4 hover:text-[#0E733B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ──────────────── 25. FINAL EMOTIONAL CTA ──────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#061A10] via-[#0A2618] to-[#061A10] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-emerald-300 mb-3 block">
              DISCOVER • COLLABORATE • GROW
            </span>
            <h2 className="font-extrabold font-display text-[34px] sm:text-[48px] text-white leading-tight mb-4">
              The Future Is Better Connected.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-[44ch] mx-auto">
              Discover new possibilities. Build meaningful partnerships. Grow together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => openModal("school-register")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#0E733B] hover:bg-[#0B5C2F] shadow-lg hover:scale-105 transition-all"
              >
                Register for EduBeacon →
              </button>
              <button
                onClick={() => openModal("vendor-register")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-charcoal bg-white shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all"
              >
                Become a Partner →
              </button>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
