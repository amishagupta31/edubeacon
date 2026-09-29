import { img } from "./images";
import {
  FlaskConical,
  Bot,
  Cog,
  Monitor,
  Smartphone,
  Building2,
  Stethoscope,
  Laptop,
  BookOpen,
  Shirt,
  HardHat,
  GraduationCap,
  BarChart3,
  Sparkles,
  Trophy,
  Crown,
  Lightbulb,
  Rocket,
  Award,
  Compass,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────
   Site Configuration
───────────────────────────────────────── */
export const siteConfig = {
  name: "Edubeacon",
  tagline: "Connecting Schools, Innovation and Opportunity",
  email: "connect@edubeacon.com",
  phone: "+91 98765 43210",
  location: "Hotel Aketa, Dehradun, Uttarakhand",
  conferenceDate: new Date("2026-10-11T10:00:00+05:30"),
  conferenceVenue: "Shivalik University",
  conferenceCity: "Dehradun, Uttarakhand, India",
  conferenceLocationMapUrl: "https://www.google.com/maps/search/?api=1&query=Shivalik+University+Dehradun",
  conferenceEventName: "AI, NEP & the Future of Learning, An EduBeacon Conference",
  conferenceEventDate: "25 October 2026",
};

/* ─────────────────────────────────────────
   Community Stats
───────────────────────────────────────── */
export const communityStats = [
  { value: "500+", label: "Schools" },
  { value: "1,200+", label: "Education Leaders" },
  { value: "300+", label: "Startups & Vendors" },
  { value: "25+", label: "Solution Categories" },
  { value: "12+", label: "Events & Conferences" },
];

/* ─────────────────────────────────────────
   Solution Categories
───────────────────────────────────────── */
export type SolutionCategory =
  | "All"
  | "STEM & Science"
  | "AI & Technology"
  | "Smart Classrooms"
  | "EdTech Platforms"
  | "School ERP"
  | "Assessment"
  | "Teacher Training"
  | "Healthcare"
  | "Books & Publishing"
  | "Uniforms & Supplies"
  | "Infrastructure"
  | "Robotics"
  | "Sports & Activity"
  | "Olympiad"
  | "Adventure & Entertainment"
  | "Recognition, Awards & Prizes"
  | "Other Services";

export interface SolutionCategoryItem {
  id: string;
  icon: LucideIcon;
  name: SolutionCategory | string;
  description: string;
  color: string;
}

export const solutionCategories: SolutionCategoryItem[] = [
  {
    id: "stem",
    icon: FlaskConical,
    name: "STEM Labs",
    description: "Science, technology, engineering and mathematics labs for modern schools.",
    color: "sky-pastel",
  },
  {
    id: "ai",
    icon: Bot,
    name: "AI Labs",
    description: "Artificial intelligence and machine learning labs for future-ready education.",
    color: "lavender-pastel",
  },
  {
    id: "robotics",
    icon: Cog,
    name: "Robotics Labs",
    description: "Hands-on robotics and coding environments for students.",
    color: "mint-pastel",
  },
  {
    id: "smart-classroom",
    icon: Monitor,
    name: "Smart Classrooms",
    description: "Interactive panels, projectors and digital classroom infrastructure.",
    color: "peach-pastel",
  },
  {
    id: "edtech",
    icon: Smartphone,
    name: "EdTech Platforms",
    description: "Learning management systems, e-learning and digital content platforms.",
    color: "sky-pastel",
  },
  {
    id: "erp",
    icon: Building2,
    name: "School ERP",
    description: "Comprehensive school management, admissions, and administration software.",
    color: "sage-pastel",
  },
  {
    id: "assessment",
    icon: BarChart3,
    name: "Assessment Solutions",
    description: "Testing platforms, performance analytics and learning outcome tools.",
    color: "lavender-pastel",
  },
  {
    id: "training",
    icon: GraduationCap,
    name: "Teacher Training",
    description: "Professional development, certification and capacity building programs.",
    color: "sky-pastel",
  },
  {
    id: "books",
    icon: BookOpen,
    name: "Books & Publishers",
    description: "Textbooks, supplementary materials, e-books and educational content.",
    color: "peach-pastel",
  },
  {
    id: "olympiad",
    icon: Trophy,
    name: "Olympiad",
    description: "Competitive academic olympiads, talent search exams, and national-level student challenges.",
    color: "amber-pastel",
  },
  {
    id: "adventure",
    icon: Compass,
    name: "Adventure & Entertainment",
    description: "Outdoor camps, experiential field trips, edutainment activities, and adventure learning.",
    color: "mint-pastel",
  },
  {
    id: "awards",
    icon: Award,
    name: "Recognition, Awards & Prizes",
    description: "School awards, student felicitation trophies, certificates, and recognition prize programs.",
    color: "rose-pastel",
  },
  {
    id: "healthcare",
    icon: Stethoscope,
    name: "Healthcare Solutions",
    description: "School health management, wellness and medical services.",
    color: "rose-pastel",
  },
  {
    id: "software",
    icon: Laptop,
    name: "Educational Software",
    description: "Curriculum-aligned software and digital tools for teaching and learning.",
    color: "lavender-pastel",
  },
  {
    id: "uniforms",
    icon: Shirt,
    name: "Uniform Suppliers",
    description: "School uniforms, sportswear and institutional apparel suppliers.",
    color: "mint-pastel",
  },
  {
    id: "infrastructure",
    icon: HardHat,
    name: "School Infrastructure",
    description: "Furniture, construction, playground and campus infrastructure solutions.",
    color: "sage-pastel",
  },
  {
    id: "other",
    icon: Sparkles,
    name: "Other Services",
    description: "Transport, safety, security and other education support services.",
    color: "peach-pastel",
  },
];

/* ─────────────────────────────────────────
   Featured Vendors / Solution Providers
───────────────────────────────────────── */
export interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  featured: boolean;
  logo?: string;
  tagline?: string;
}

export const featuredVendors: Vendor[] = [
  {
    id: "v-deep-connection",
    name: "Deep Connection",
    category: "EdTech Platforms",
    description:
      "A focused education innovation platform bringing next-generation learning solutions closer to schools, institutions, and education decision-makers.",
    featured: true,
    tagline: "Connecting Innovation With Institutions",
  },
  {
    id: "v-igo",
    name: "India Genius Olympiad",
    category: "Olympiad",
    description:
      "Premier national-level academic olympiads and talent search competitions fostering analytical thinking, problem solving, and excellence in K-12 students.",
    featured: true,
    tagline: "Inspiring Academic Excellence",
  },
  {
    id: "v1",
    name: "NovaStem India",
    category: "STEM Labs",
    description:
      "India's leading STEM lab setup company, delivering world-class science and innovation labs to 400+ schools.",
    featured: true,
    tagline: "Empowering Future Scientists",
  },
  {
    id: "v2",
    name: "BrightPath ERP",
    category: "School ERP",
    description:
      "Comprehensive school management platform covering admissions, attendance, fees, timetable and parent communication.",
    featured: true,
    tagline: "Simplify School Operations",
  },
  {
    id: "v3",
    name: "RoboKidz",
    category: "Robotics Labs",
    description:
      "Age-appropriate robotics and coding curriculum with complete lab setup and teacher training included.",
    featured: false,
    tagline: "Coding for Every Child",
  },
  {
    id: "v4",
    name: "SmartWall Technologies",
    category: "Smart Classrooms",
    description:
      "Interactive flat panels, smart boards and digital classroom infrastructure for K–12 schools.",
    featured: true,
    tagline: "Classrooms of Tomorrow",
  },
  {
    id: "v5",
    name: "LearnEdge LMS",
    category: "EdTech Platforms",
    description:
      "AI-powered learning management system with curriculum mapping, assessments and student analytics.",
    featured: false,
    tagline: "Personalized Learning at Scale",
  },
  {
    id: "v6",
    name: "MindTree Publishers",
    category: "Books & Publishers",
    description:
      "Award-winning educational content publisher for CBSE, ICSE and State Board curricula.",
    featured: false,
    tagline: "Content That Inspires",
  },
];

/* ─────────────────────────────────────────
   Speakers
───────────────────────────────────────── */
export interface Speaker {
  name: string;
  title: string;
  organization: string;
  expertise: string[];
  image: string;
  topic?: string;
}

export const speakers: Speaker[] = [
  {
    name: "Dr. Priya Sharma",
    title: "Secretary, Department of School Education",
    organization: "Ministry of Education",
    expertise: ["Education Policy", "Future of Education"],
    image: img.speakerW1,
    topic: "NEP 2020, Two Years On",
  },
  {
    name: "Rajesh Kumar",
    title: "Founder & CEO",
    organization: "EduTech Ventures",
    expertise: ["EdTech", "Innovation", "Startups"],
    image: img.speakerM1,
    topic: "Scaling EdTech in Emerging Markets",
  },
  {
    name: "Dr. Ananya Krishnan",
    title: "Director of Curriculum",
    organization: "The GEMS Foundation",
    expertise: ["Curriculum Design", "STEM", "AI in Education"],
    image: img.speakerW2,
    topic: "AI-Ready Curricula for K–12",
  },
  {
    name: "Arjun Mehta",
    title: "Co-Founder",
    organization: "NovaStem India",
    expertise: ["Robotics", "STEM Education", "Innovation"],
    image: img.speakerM2,
    topic: "Making STEM Accessible",
  },
  {
    name: "Dr. Sunita Rao",
    title: "Vice Chancellor",
    organization: "Amity University",
    expertise: ["Higher Education", "Education Leadership"],
    image: img.speakerW3,
    topic: "Bridging School and University Education",
  },
  {
    name: "Vikram Bhat",
    title: "Managing Director, India",
    organization: "Pearson Education",
    expertise: ["Publishing", "Digital Learning", "Assessment"],
    image: img.speakerM3,
    topic: "The Future of Educational Content",
  },
  {
    name: "Meena Agarwal",
    title: "Chief Academic Officer",
    organization: "Delhi Public School Society",
    expertise: ["Education Leadership", "Teacher Training"],
    image: img.speakerW4,
    topic: "Developing the Teachers of Tomorrow",
  },
  {
    name: "Sanjay Patel",
    title: "Head of EdTech Investments",
    organization: "Nexus Venture Partners",
    expertise: ["Investment", "Startups", "EdTech"],
    image: img.speakerM4,
    topic: "What Investors Want in EdTech",
  },
];

/* ─────────────────────────────────────────
   Conference Agenda
───────────────────────────────────────── */
export type SessionType = "KEYNOTE" | "PANEL" | "WORKSHOP" | "NETWORKING" | "DEMO" | "AWARDS";

export interface Session {
  time: string;
  type: SessionType;
  title: string;
  description: string;
  speaker?: string;
}

export interface AgendaDay {
  id: string;
  label: string;
  date: string;
  sessions: Session[];
}

export const conferenceAgenda: AgendaDay[] = [
  {
    id: "day-1",
    label: "Day 1",
    date: "15 Mar",
    sessions: [
      {
        time: "09:00",
        type: "KEYNOTE",
        title: "Opening Keynote",
        description: "The Future of Education in India, Policy, Technology & Opportunity",
        speaker: "Dr. Priya Sharma",
      },
      {
        time: "10:30",
        type: "PANEL",
        title: "EdTech in the Classroom",
        description: "How schools are adopting technology effectively at scale",
      },
      {
        time: "12:00",
        type: "NETWORKING",
        title: "Exhibition & Networking Lunch",
        description: "Explore vendor booths and connect with education leaders over lunch",
      },
      {
        time: "14:00",
        type: "WORKSHOP",
        title: "STEM Lab Design Workshop",
        description: "Hands-on session: designing future-ready STEM labs for your school",
      },
      {
        time: "15:30",
        type: "DEMO",
        title: "Innovation Showcase",
        description: "Live demonstrations from featured solution providers",
      },
      {
        time: "17:00",
        type: "NETWORKING",
        title: "Curated Vendor–School Meetings",
        description: "Pre-arranged 1:1 meetings between schools and relevant vendors",
      },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    date: "16 Mar",
    sessions: [
      {
        time: "09:00",
        type: "KEYNOTE",
        title: "Morning Keynote",
        description: "AI & the Next Generation of Learners",
        speaker: "Rajesh Kumar",
      },
      {
        time: "10:30",
        type: "PANEL",
        title: "Startup Spotlight",
        description: "Emerging EdTech startups pitching to school leaders and investors",
      },
      {
        time: "12:00",
        type: "NETWORKING",
        title: "Networking Lunch",
        description: "Open networking with all delegates, exhibitors and sponsors",
      },
      {
        time: "14:00",
        type: "WORKSHOP",
        title: "AI in Education Workshop",
        description: "Practical frameworks for integrating AI tools into teaching",
      },
      {
        time: "15:30",
        type: "AWARDS",
        title: "Edubeacon Awards Ceremony",
        description: "Celebrating innovation and excellence in Indian education",
      },
      {
        time: "17:00",
        type: "NETWORKING",
        title: "Closing Gala Dinner",
        description: "An evening of celebration and connection to close the conference",
      },
    ],
  },
];

/* ─────────────────────────────────────────
   Sponsorship Packages
───────────────────────────────────────── */
export interface SponsorPackage {
  id: string;
  name: string;
  tier: "bronze" | "silver" | "gold" | "diamond";
  badge?: string;
  description: string;
  exhibitionSpace?: string;
  guaranteedMeetings?: number;
  speakingSlot?: string;
  features: string[];
  highlighted: boolean;
}

export const sponsorshipPackages: SponsorPackage[] = [
  {
    id: "bronze",
    name: "Bronze Partner",
    tier: "bronze",
    description: "An excellent entry-level partnership for organizations seeking visibility in the education ecosystem.",
    exhibitionSpace: "6×6 ft",
    guaranteedMeetings: 5,
    features: [
      "6×6 ft exhibition space",
      "Logo on event advertisements & banners",
      "5 guaranteed curated meetings with schools",
      "Access to participant contact list",
      "Feature in Edubeacon Magazine",
      "Brand visibility across event touchpoints",
      "2 delegate passes",
    ],
    highlighted: false,
  },
  {
    id: "silver",
    name: "Silver Partner",
    tier: "silver",
    description: "Enhanced visibility with speaking opportunities and a larger exhibition presence.",
    exhibitionSpace: "8×8 ft",
    guaranteedMeetings: 10,
    speakingSlot: "10-minute stage presentation",
    features: [
      "8×8 ft exhibition space",
      "10-minute stage speaking opportunity",
      "10 guaranteed curated meetings with schools",
      "Enhanced logo placement across banners & digital",
      "Access to participant contact list",
      "Edubeacon Magazine half-page feature",
      "Social media promotion",
      "5 delegate passes",
    ],
    highlighted: false,
  },
  {
    id: "gold",
    name: "Gold Partner",
    tier: "gold",
    badge: "MOST POPULAR",
    description: "Premium visibility, speaking slots and founder participation, ideal for growing EdTech companies.",
    exhibitionSpace: "10×10 ft",
    guaranteedMeetings: 15,
    speakingSlot: "20-minute conference presentation",
    features: [
      "10×10 ft premium exhibition space",
      "20-minute conference presentation",
      "Founder invited to panel discussion",
      "15 guaranteed curated meetings with selected schools",
      "Edubeacon team support during meetings",
      "Highly prominent branding across venue",
      "Edubeacon Magazine full-page feature",
      "Priority social media promotion",
      "Delegate list with contact details",
      "10 delegate passes",
    ],
    highlighted: true,
  },
  {
    id: "diamond",
    name: "Diamond Partner",
    tier: "diamond",
    badge: "ELITE PARTNER",
    description: "The highest level of partnership, unrivalled visibility across the entire Edubeacon ecosystem.",
    exhibitionSpace: "Custom, premium location",
    guaranteedMeetings: 20,
    speakingSlot: "Keynote slot available",
    features: [
      "Custom premium exhibition space",
      "Keynote speaking opportunity",
      "20+ curated connections with selected schools",
      "Access to wider Edubeacon event ecosystem",
      "Premium advertising placement across all media",
      "Full-page magazine advertisement (front section)",
      "Elite sponsorship recognition & awards night branding",
      "Dedicated Edubeacon partnership manager",
      "Year-round brand visibility on website & social",
      "Exclusive pre-event networking dinner invite",
      "Unlimited delegate passes",
    ],
    highlighted: false,
  },
];

/* ─────────────────────────────────────────
   Award Categories
───────────────────────────────────────── */
export const awardCategories = [
  {
    icon: Trophy,
    title: "Innovative School of the Year",
    description: "Recognizing schools that have embraced innovation, technology and future-ready education practices.",
  },
  {
    icon: Crown,
    title: "Education Leader of the Year",
    description: "Celebrating exceptional school leaders who are transforming educational outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Best EdTech Innovation",
    description: "Honoring the most impactful EdTech product or platform making a difference in Indian classrooms.",
  },
  {
    icon: FlaskConical,
    title: "Best STEM Initiative",
    description: "Recognizing outstanding STEM programs, labs and initiatives in schools.",
  },
  {
    icon: Bot,
    title: "Best AI in Education Initiative",
    description: "Celebrating the effective integration of artificial intelligence in teaching and learning.",
  },
  {
    icon: Rocket,
    title: "Emerging Education Startup",
    description: "Spotlighting the most promising early-stage EdTech startups making an impact.",
  },
];

/* ─────────────────────────────────────────
   Testimonials
───────────────────────────────────────── */
export const testimonials = [
  {
    quote:
      "Edubeacon helped us discover three technology solutions we didn't know existed. Within two months, we had implemented a new STEM lab and a complete digital learning system.",
    name: "Mrs. Rekha Gupta",
    title: "Principal",
    organization: "Delhi Model School",
  },
  {
    quote:
      "As a startup, finding the right schools to speak to was our biggest challenge. Edubeacon connected us with 20 school principals in a single afternoon.",
    name: "Aditya Singh",
    title: "Co-Founder",
    organization: "RoboKidz",
  },
  {
    quote:
      "The Edubeacon conference is unlike any other education event. The curated meetings format means every conversation is relevant and purposeful.",
    name: "Mr. Prakash Nair",
    title: "School Owner",
    organization: "Sunrise International Schools",
  },
  {
    quote:
      "Our Diamond Partnership gave us visibility across the entire conference. We signed partnerships with 8 new schools directly from the event.",
    name: "Kavita Reddy",
    title: "Head of Partnerships",
    organization: "SmartWall Technologies",
  },
];

/* ─────────────────────────────────────────
   Magazine Articles
───────────────────────────────────────── */
export const magazineArticles = [
  {
    category: "TRENDS",
    title: "The 10 Education Technologies Every School Should Know About in 2027",
    date: "January 2027",
    featured: true,
  },
  {
    category: "LEADERSHIP",
    title: "How India's Most Innovative Schools Are Preparing for the Future",
    date: "December 2026",
    featured: false,
  },
  {
    category: "STARTUP STORY",
    title: "From Idea to 500 Schools: The RoboKidz Journey",
    date: "November 2026",
    featured: false,
  },
  {
    category: "POLICY",
    title: "NEP 2020 Implementation, Where Are We Now?",
    date: "October 2026",
    featured: false,
  },
];

/* ─────────────────────────────────────────
   Partner Logos (placeholder names)
───────────────────────────────────────── */
export const partnerGroups = [
  {
    tier: "Education Partners",
    names: ["Delhi Public Schools", "Amity Group", "Ryan International", "DAV Schools", "Kendriya Vidyalaya"],
  },
  {
    tier: "University Partners",
    names: ["IIT Delhi", "Amity University", "Manipal University", "Symbiosis International", "Ashoka University"],
  },
  {
    tier: "Industry Partners",
    names: ["Google for Education", "Microsoft Education", "NASSCOM Foundation", "CII", "FICCI"],
  },
  {
    tier: "Supporting Organizations",
    names: ["CBSE", "NCERT", "AICTE", "UGC", "Pratham Education"],
  },
];

/* ─────────────────────────────────────────
   Why Attend
───────────────────────────────────────── */
export const whyAttendSchools = [
  "Discover verified and innovative solution providers",
  "Explore the latest education technologies hands-on",
  "Compare solutions across 25+ categories",
  "Connect directly with relevant vendors",
  "Attend expert keynotes and sessions",
  "Network with other school leaders",
  "Discover AI, STEM and Robotics solutions",
  "Build meaningful long-term partnerships",
];

export const whyAttendVendors = [
  "Meet school owners and principals directly",
  "Showcase your product to decision-makers",
  "Generate high-quality qualified leads",
  "Build partnerships with schools across India",
  "Gain significant brand visibility",
  "Participate in the exhibition",
  "Get speaking and panel opportunities",
  "Access the Edubeacon school network year-round",
];
