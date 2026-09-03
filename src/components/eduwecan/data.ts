import {
  GraduationCap,
  Compass,
  BookOpen,
  Award,
  HeartHandshake,
  Search,
  Lightbulb,
  Handshake,
  Rocket,
  Trophy,
  School,
  Landmark,
  Building2,
  Gift,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { ewcImg } from "./images";

export const siteConfig = {
  name: "EduBeacon",
  tagline: "The Future of Education, Connected.",
};

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export const hero = {
  eyebrow: "EDUCATION. CONNECTED.",
  lines: ["The Future", "of Education,", "Connected."],
  description:
    "Where schools, innovators, and opportunities come together.",
  primaryCta: "Explore EduBeacon →",
};

/* ─────────────────────────────────────────
   About
───────────────────────────────────────── */
export const about = {
  eyebrow: "About EduWeCan",
  heading: "Education Opens Doors. We Help You Find Them.",
  body: "EduWeCan is designed to make education and opportunity easier to navigate. Whether a learner is exploring academic paths, searching for guidance, discovering new opportunities, or preparing for the next step, EduWeCan brings meaningful resources and support into one connected experience.",
  stats: [
    { value: "10K+", label: "Learners Supported" },
    { value: "500+", label: "Learning Opportunities" },
    { value: "100+", label: "Mentors & Educators" },
  ],
  image: ewcImg.classroom,
};

/* ─────────────────────────────────────────
   Statistics — illustrative placeholders
───────────────────────────────────────── */
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  bg: string;
}

export const stats: StatItem[] = [
  { value: 10, suffix: "K+", label: "Learners Supported", bg: "var(--color-ewc-lavender)" },
  { value: 500, suffix: "+", label: "Learning Opportunities", bg: "var(--color-ewc-blue)" },
  { value: 100, suffix: "+", label: "Mentors & Educators", bg: "var(--color-ewc-peach)" },
  { value: 50, suffix: "+", label: "Partner Communities", bg: "var(--color-ewc-sage)" },
];
export const statsDisclaimer = "Illustrative figures — to be replaced with verified data.";

/* ─────────────────────────────────────────
   Core Features / Guidance
───────────────────────────────────────── */
export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
}

export const features: FeatureItem[] = [
  {
    icon: GraduationCap,
    title: "Quality Education",
    description: "Help learners discover meaningful educational resources and learning pathways.",
    bg: "var(--color-ewc-lavender)",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description: "Direction, mentorship and insights to help learners make confident career decisions.",
    bg: "var(--color-ewc-blue)",
  },
  {
    icon: BookOpen,
    title: "Learning Opportunities",
    description: "Connect with courses, programs, experiences and opportunities for growth.",
    bg: "var(--color-ewc-peach)",
  },
  {
    icon: Award,
    title: "Scholarships & Support",
    description: "Valuable educational opportunities and support resources made easier to discover.",
    bg: "var(--color-ewc-sage)",
  },
  {
    icon: HeartHandshake,
    title: "Community & Mentorship",
    description: "Meaningful connections between learners, educators, mentors and communities.",
    bg: "var(--color-ewc-lilac)",
  },
];

/* ─────────────────────────────────────────
   Explore — editorial grid panels
───────────────────────────────────────── */
export interface GridPanel {
  title: string;
  description: string;
  image: string;
  span: "wide" | "tall" | "square";
  bg: string;
}

export const gridPanels: GridPanel[] = [
  {
    title: "Learn together, not alone",
    description: "Study groups and shared spaces where questions are welcome and progress is a team sport.",
    image: ewcImg.studyGroup,
    span: "wide",
    bg: "var(--color-ewc-lavender)",
  },
  {
    title: "Mentors who show up",
    description: "Real educators, real attention — guidance that adapts to how you actually learn.",
    image: ewcImg.mentor,
    span: "tall",
    bg: "var(--color-ewc-peach)",
  },
  {
    title: "Every classroom, brighter",
    description: "Bright, engaged classrooms where every student gets a real chance to participate.",
    image: ewcImg.classroom,
    span: "square",
    bg: "var(--color-ewc-blue)",
  },
  {
    title: "A love for the library",
    description: "Endless shelves, quiet corners, and the kind of curiosity that libraries were built for.",
    image: ewcImg.library,
    span: "square",
    bg: "var(--color-ewc-sage)",
  },
  {
    title: "Collaboration over competition",
    description: "Laptops out, ideas flowing — the best learning happens when people build together.",
    image: ewcImg.collaborate,
    span: "wide",
    bg: "var(--color-ewc-lilac)",
  },
];

/* ─────────────────────────────────────────
   Opportunities — discovery cards
───────────────────────────────────────── */
export interface OpportunityItem {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
}

export const opportunities: OpportunityItem[] = [
  {
    icon: BookOpen,
    title: "Courses",
    description: "Structured learning paths across subjects, skills and interests.",
    bg: "var(--color-ewc-lavender)",
  },
  {
    icon: Award,
    title: "Scholarships",
    description: "Financial support to help remove barriers to education.",
    bg: "var(--color-ewc-blue)",
  },
  {
    icon: Compass,
    title: "Career Programs",
    description: "Guided programs that connect learning to real career direction.",
    bg: "var(--color-ewc-peach)",
  },
  {
    icon: Handshake,
    title: "Mentorship",
    description: "One-on-one relationships with people who've walked the path before you.",
    bg: "var(--color-ewc-sage)",
  },
  {
    icon: Users2,
    title: "Workshops",
    description: "Hands-on sessions that turn ideas into applied, practical skills.",
    bg: "var(--color-ewc-lilac)",
  },
  {
    icon: Lightbulb,
    title: "Learning Resources",
    description: "A growing library of guides, tools and materials, free to explore.",
    bg: "var(--color-ewc-peach)",
  },
];

/* ─────────────────────────────────────────
   The Journey — horizontal storytelling
───────────────────────────────────────── */
export interface HorizontalCard {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
}

export const horizontalCards: HorizontalCard[] = [
  {
    icon: Search,
    title: "Discover",
    description: "Explore possibilities and educational pathways.",
    bg: "var(--color-ewc-lavender)",
  },
  {
    icon: BookOpen,
    title: "Learn",
    description: "Access resources and knowledge that support growth.",
    bg: "var(--color-ewc-blue)",
  },
  {
    icon: Handshake,
    title: "Connect",
    description: "Build connections with mentors, educators and communities.",
    bg: "var(--color-ewc-peach)",
  },
  {
    icon: Compass,
    title: "Explore",
    description: "Discover programs, scholarships and opportunities.",
    bg: "var(--color-ewc-sage)",
  },
  {
    icon: Rocket,
    title: "Grow",
    description: "Develop confidence, skills and direction.",
    bg: "var(--color-ewc-lilac)",
  },
  {
    icon: Trophy,
    title: "Succeed",
    description: "Move toward meaningful academic and career goals.",
    bg: "var(--color-ewc-lavender)",
  },
];

/* ─────────────────────────────────────────
   Community — "Better Together"
───────────────────────────────────────── */
export const community = {
  eyebrow: "Community",
  heading: "Better Together",
  body: "Learning becomes more meaningful when learners can connect, share experiences, receive guidance, and grow with a supportive community.",
  image: ewcImg.collaborate,
};

/* ─────────────────────────────────────────
   Ecosystem / Partners — fictional placeholder
   organizations, clearly illustrative and not
   real confirmed partnerships.
───────────────────────────────────────── */
export interface PartnerCategory {
  tier: string;
  icon: LucideIcon;
  image: string;
  bg: string;
  names: string[];
}

export const partnerCategories: PartnerCategory[] = [
  {
    tier: "Partner Schools",
    icon: School,
    image: ewcImg.classroom,
    bg: "var(--color-ewc-lavender)",
    names: ["Northfield Academy", "Rivergate School", "Maple Hill Collegiate", "Brightwater School"],
  },
  {
    tier: "Education Partners",
    icon: BookOpen,
    image: ewcImg.studyGroup,
    bg: "var(--color-ewc-blue)",
    names: ["LearnForward", "Pathway Education Group", "OpenClass Collective", "Brightline Learning"],
  },
  {
    tier: "Universities",
    icon: Landmark,
    image: ewcImg.library,
    bg: "var(--color-ewc-peach)",
    names: ["Ashfield University", "Meridian State University", "Kingsley Institute of Technology", "Fairmont College"],
  },
  {
    tier: "Industry Partners",
    icon: Building2,
    image: ewcImg.mentor,
    bg: "var(--color-ewc-sage)",
    names: ["Northbeam Technologies", "Clearview Analytics", "Ridgeline Ventures", "Cobalt Studios"],
  },
  {
    tier: "Sponsors & Supporters",
    icon: Gift,
    image: ewcImg.collaborate,
    bg: "var(--color-ewc-lilac)",
    names: ["Halcyon Foundation", "Evergreen Trust", "Solace Community Fund", "Wayfinder Foundation"],
  },
];
export const partnersDisclaimer = "Illustrative placeholder organizations — to be replaced with real partner names and logos.";

/* ─────────────────────────────────────────
   Stories of Growth — placeholder testimonials
───────────────────────────────────────── */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "EduWeCan didn't just help me find a course — it helped me find a direction. My mentor still checks in on me a year later.",
    name: "Maya Chen",
    role: "Finding Direction",
    image: ewcImg.portrait4,
  },
  {
    quote: "The community support here is real. When I was ready to give up on my application, people from this platform talked me through it.",
    name: "David Okafor",
    role: "Receiving Mentorship",
    image: ewcImg.portrait3,
  },
  {
    quote: "As a mentor, I've watched learners go from unsure to unstoppable. That's the whole reason I keep coming back.",
    name: "Priya Nair",
    role: "Building Confidence",
    image: ewcImg.portrait1,
  },
  {
    quote: "The scholarship program covered what my family couldn't. It didn't just fund my education — it funded my confidence.",
    name: "Lucas Alvarez",
    role: "Academic Growth",
    image: ewcImg.portrait2,
  },
];
export const testimonialsDisclaimer = "Sample stories — placeholder content for future replacement with real learner testimonials.";

/* ─────────────────────────────────────────
   Final CTA
───────────────────────────────────────── */
export const finalCta = {
  heading: "Your Next Opportunity Could Start Today.",
  body: "Explore, learn, connect, and take the next step toward your future with EduWeCan.",
  cta: "Start Exploring",
};
