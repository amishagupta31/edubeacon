/**
 * seedRecruitment.ts
 *
 * Seeds realistic test data for the recruitment portal:
 *   - 5 school accounts (RecruitmentProfile + Institution)
 *   - 3 teacher accounts (RecruitmentProfile)
 *   - 16 jobs (mix of PUBLISHED, DRAFT, CLOSED across schools)
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/seedRecruitment.ts
 *   npx ts-node --transpile-only src/scripts/seedRecruitment.ts --wipe
 *
 * --wipe  deletes ALL existing recruitment profiles, institutions and jobs first.
 *
 * Clerk user IDs are fake (prefixed "seed_") — these profiles won't be reachable
 * via a real Clerk session, but all GET /api/recruitment/jobs endpoints are
 * browsable by any authenticated user so a real teacher account will see all
 * PUBLISHED jobs immediately after seeding.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import RecruitmentProfile from "../modules/recruitment/model";
import Institution from "../modules/recruitment/institution.model";
import Job from "../modules/recruitment/job.model";

const WIPE = process.argv.includes("--wipe");

// ── Fake Clerk IDs (deterministic so re-running is idempotent) ─────────────

const SCHOOL_IDS = [
  "seed_school_greenfield",
  "seed_school_delhi_public",
  "seed_school_bombay_intl",
  "seed_school_heritage",
  "seed_school_lotus_valley",
];

const TEACHER_IDS = [
  "seed_teacher_ananya",
  "seed_teacher_rahul",
  "seed_teacher_priya",
];

// ── School data ────────────────────────────────────────────────────────────

const SCHOOLS = [
  {
    clerkUserId: SCHOOL_IDS[0],
    email: "hr@greenfieldpublic.edu.in",
    institutionName: "Greenfield Public School",
    contactPerson: "Sunita Rao",
    phone: "9811234567",
    institution: {
      name: "Greenfield Public School",
      institutionType: "CBSE School",
      board: "CBSE",
      establishedYear: "1998",
      officialEmail: "hr@greenfieldpublic.edu.in",
      contactPerson: "Sunita Rao",
      contactPhone: "9811234567",
      website: "https://greenfieldpublic.edu.in",
      addressLine: "12 Sector 18, Gurugram",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122015",
      description:
        "Greenfield Public School is a CBSE-affiliated institution serving Classes I–XII. Known for board-exam results and STEM focus.",
      achievements: [
        { title: "CBSE Best School Award — NCR", year: "2023", description: "Recognised among top 10 CBSE schools in the NCR region for academic outcomes." },
        { title: "STEM Excellence Certification", year: "2022", description: "" },
      ],
      verificationStatus: "VERIFIED" as const,
    },
  },
  {
    clerkUserId: SCHOOL_IDS[1],
    email: "recruitment@dps-noida.edu.in",
    institutionName: "Delhi Public School Noida",
    contactPerson: "Vikram Singh",
    phone: "9871122334",
    institution: {
      name: "Delhi Public School Noida",
      institutionType: "CBSE School",
      board: "CBSE",
      establishedYear: "1989",
      officialEmail: "recruitment@dps-noida.edu.in",
      contactPerson: "Vikram Singh",
      contactPhone: "9871122334",
      website: "https://dpsnoida.edu.in",
      addressLine: "Sector 30, Noida",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      description:
        "One of the premier CBSE schools in NCR with a legacy of academic excellence since 1989.",
      achievements: [
        { title: "National Science Olympiad Top Scorers — 3 consecutive years", year: "2023", description: "" },
        { title: "DPS Society Gold Shield — Academics", year: "2022", description: "Awarded by the DPS Society for consistent board-exam performance above national average." },
        { title: "ISO 9001:2015 Certified Institution", year: "2021", description: "" },
      ],
      verificationStatus: "VERIFIED" as const,
    },
  },
  {
    clerkUserId: SCHOOL_IDS[2],
    email: "hr@bombayinternational.edu.in",
    institutionName: "Bombay International School",
    contactPerson: "Reena D'Souza",
    phone: "9820001122",
    institution: {
      name: "Bombay International School",
      institutionType: "International School",
      board: "IGCSE / Cambridge",
      establishedYear: "2003",
      officialEmail: "hr@bombayinternational.edu.in",
      contactPerson: "Reena D'Souza",
      contactPhone: "9820001122",
      website: "https://bombayintl.edu.in",
      addressLine: "Bandra West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      description:
        "Cambridge-affiliated international school offering IGCSE and A-Levels. Strong performing arts and inquiry-based learning programme.",
      achievements: [
        { title: "Cambridge International School of the Year — South Asia", year: "2022", description: "Runner-up recognition from Cambridge Assessment International Education." },
        { title: "QS I-GAUGE Accreditation", year: "2021", description: "" },
      ],
      verificationStatus: "VERIFIED" as const,
    },
  },
  {
    clerkUserId: SCHOOL_IDS[3],
    email: "principal@heritageschool.edu.in",
    institutionName: "Heritage School Kolkata",
    contactPerson: "Amitava Bose",
    phone: "9831234567",
    institution: {
      name: "Heritage School Kolkata",
      institutionType: "ICSE School",
      board: "ICSE / CISCE",
      establishedYear: "1977",
      officialEmail: "principal@heritageschool.edu.in",
      contactPerson: "Amitava Bose",
      contactPhone: "9831234567",
      website: "https://heritageschool.edu.in",
      addressLine: "57 Hindustan Park, Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700029",
      description:
        "Heritage School has been a pillar of ICSE education in Kolkata since 1977. Strong emphasis on humanities, arts and community service.",
      achievements: [
        { title: "ISC Top 10 — Humanities Stream", year: "2023", description: "" },
        { title: "West Bengal Heritage School of the Decade", year: "2020", description: "Awarded by the West Bengal Department of Education for sustained academic and cultural contribution since 1977." },
      ],
      verificationStatus: "IN_REVIEW" as const,
    },
  },
  {
    clerkUserId: SCHOOL_IDS[4],
    email: "staffing@lotusvalley.edu.in",
    institutionName: "Lotus Valley International School",
    contactPerson: "Meena Kapoor",
    phone: "9958765432",
    institution: {
      name: "Lotus Valley International School",
      institutionType: "CBSE School",
      board: "CBSE",
      establishedYear: "2005",
      officialEmail: "staffing@lotusvalley.edu.in",
      contactPerson: "Meena Kapoor",
      contactPhone: "9958765432",
      website: "https://lotusvalley.edu.in",
      addressLine: "Sector 126, Noida",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201303",
      description:
        "A progressive CBSE school with a focus on holistic education, sports and technology integration.",
      achievements: [
        { title: "National Sports School of the Year — UP", year: "2023", description: "Recognised by the UP state sports authority for outstanding inter-school sports performance." },
        { title: "CBSE Innovation in Teaching Award", year: "2022", description: "" },
      ],
      verificationStatus: "VERIFIED" as const,
    },
  },
];

// ── Teacher data ────────────────────────────────────────────────────────────

const TEACHERS = [
  {
    clerkUserId: TEACHER_IDS[0],
    email: "ananya.iyer@gmail.com",
    fullName: "Ananya Iyer",
    phone: "9876543210",
  },
  {
    clerkUserId: TEACHER_IDS[1],
    email: "rahul.verma.educator@gmail.com",
    fullName: "Rahul Verma",
    phone: "9988776655",
  },
  {
    clerkUserId: TEACHER_IDS[2],
    email: "priya.sharma.teacher@gmail.com",
    fullName: "Priya Sharma",
    phone: "9123456780",
  },
];

// ── Job data ────────────────────────────────────────────────────────────────

// We define jobs referencing school index (0-4) so we can attach institutionId after creation.
interface JobSeed {
  schoolIdx: number;
  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;
  requirements: { text: string; screening: "hard" | "scored" }[];
  stages: string[];
  channels: { portal: boolean; careers: boolean; whatsapp: boolean };
  deadline: Date | null;
  status: "PUBLISHED" | "DRAFT" | "CLOSED";
  publishedDaysAgo: number | null;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);

const JOBS: JobSeed[] = [
  // ── Greenfield Public School (CBSE, Gurugram) ──────────────────────────
  {
    schoolIdx: 0,
    title: "PGT Physics",
    roleType: "Teaching",
    board: "CBSE",
    classes: "XI–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "We are looking for an experienced PGT Physics teacher to lead Classes XI and XII. The role involves teaching mechanics, optics, modern physics and practical lab sessions. Strong board-exam results expected.\n\nThe ideal candidate is B.Ed qualified, holds CTET Paper II, and has at least 3 years of senior-secondary teaching experience.",
    requirements: [
      { text: "M.Sc Physics or equivalent", screening: "hard" },
      { text: "B.Ed from a recognised university", screening: "hard" },
      { text: "CTET Paper II cleared", screening: "hard" },
      { text: "Minimum 3 years senior-secondary experience", screening: "scored" },
      { text: "Experience with CBSE board-exam preparation", screening: "scored" },
    ],
    stages: ["Application review", "AI screening", "Subject test", "Demo lesson", "Panel interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(18),
    status: "PUBLISHED",
    publishedDaysAgo: 5,
  },
  {
    schoolIdx: 0,
    title: "TGT Mathematics",
    roleType: "Teaching",
    board: "CBSE",
    classes: "VI–X",
    employment: "Full-time, permanent",
    openings: 2,
    description:
      "Greenfield is hiring two TGT Mathematics teachers for Classes VI–X. Responsibilities include classroom teaching, internal assessments and parent interaction.\n\nCandidates with experience in activity-based and experiential learning preferred.",
    requirements: [
      { text: "B.Sc / M.Sc Mathematics", screening: "hard" },
      { text: "B.Ed from a recognised university", screening: "hard" },
      { text: "CTET Paper I or II", screening: "scored" },
      { text: "2+ years teaching experience (middle or secondary)", screening: "scored" },
    ],
    stages: ["Application review", "Screening call", "Demo lesson", "Panel interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: true },
    deadline: daysFromNow(25),
    status: "PUBLISHED",
    publishedDaysAgo: 3,
  },
  {
    schoolIdx: 0,
    title: "PRT English",
    roleType: "Teaching",
    board: "CBSE",
    classes: "I–V",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Primary English teacher for Classes I–V. Focus on language foundations, reading comprehension and creative writing. Warm, nurturing personality essential.",
    requirements: [
      { text: "B.A / M.A English Literature or Language", screening: "hard" },
      { text: "B.Ed or D.El.Ed", screening: "hard" },
      { text: "CTET Paper I cleared", screening: "scored" },
      { text: "Experience with phonics-based reading programmes", screening: "scored" },
    ],
    stages: ["Application review", "Demo lesson", "Panel interview", "Offer"],
    channels: { portal: true, careers: false, whatsapp: false },
    deadline: daysFromNow(12),
    status: "PUBLISHED",
    publishedDaysAgo: 8,
  },
  {
    schoolIdx: 0,
    title: "Lab Assistant — Chemistry",
    roleType: "Non-teaching",
    board: "CBSE",
    classes: "IX–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Manage the chemistry lab — stock, safety, setup for practicals and disposal. Assist teachers during experiments. No teaching responsibility.",
    requirements: [
      { text: "B.Sc Chemistry (minimum)", screening: "hard" },
      { text: "Lab safety certification or equivalent experience", screening: "scored" },
    ],
    stages: ["Application review", "Practical assessment", "Interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: true },
    deadline: null,
    status: "DRAFT",
    publishedDaysAgo: null,
  },

  // ── Delhi Public School Noida (CBSE, Noida) ───────────────────────────
  {
    schoolIdx: 1,
    title: "PGT Computer Science",
    roleType: "Teaching",
    board: "CBSE",
    classes: "XI–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Teach Computer Science (Python, Data Structures, Databases, Networking) to Classes XI–XII. Maintain computer labs and guide students for competitive programming.\n\nStrong Python and OOP fundamentals required. Experience with CS board-exam patterns a plus.",
    requirements: [
      { text: "B.Tech / M.Sc Computer Science or IT", screening: "hard" },
      { text: "B.Ed with CS as a subject", screening: "scored" },
      { text: "CTET Paper II or equivalent state TET", screening: "scored" },
      { text: "Proficiency in Python, SQL and networking basics", screening: "hard" },
    ],
    stages: ["Application review", "Technical test", "Demo lesson", "Interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(30),
    status: "PUBLISHED",
    publishedDaysAgo: 2,
  },
  {
    schoolIdx: 1,
    title: "TGT Hindi",
    roleType: "Teaching",
    board: "CBSE",
    classes: "VI–X",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Hindi language teacher for middle and secondary school. Responsible for grammar, literature and composition. Knowledge of CBSE Hindi-A and Hindi-B syllabi essential.",
    requirements: [
      { text: "M.A Hindi / Sahitya or equivalent", screening: "hard" },
      { text: "B.Ed", screening: "hard" },
      { text: "CTET / UPTET cleared", screening: "scored" },
    ],
    stages: ["Application review", "Screening call", "Demo lesson", "Offer"],
    channels: { portal: true, careers: true, whatsapp: true },
    deadline: daysFromNow(10),
    status: "PUBLISHED",
    publishedDaysAgo: 10,
  },
  {
    schoolIdx: 1,
    title: "Vice Principal",
    roleType: "Leadership",
    board: "CBSE",
    classes: "I–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "DPS Noida seeks a Vice Principal to assist the Principal in academic leadership, staff management, timetabling and parent relations. Must have prior leadership experience in a CBSE school.",
    requirements: [
      { text: "M.Ed or equivalent postgraduate in education", screening: "hard" },
      { text: "Minimum 10 years teaching + 3 years leadership", screening: "hard" },
      { text: "Experience with CBSE compliance and DISE reporting", screening: "scored" },
    ],
    stages: ["Application review", "Leadership case study", "Board interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(45),
    status: "PUBLISHED",
    publishedDaysAgo: 1,
  },

  // ── Bombay International School (IGCSE, Mumbai) ───────────────────────
  {
    schoolIdx: 2,
    title: "IGCSE Biology Teacher",
    roleType: "Teaching",
    board: "IGCSE / Cambridge",
    classes: "9–11",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Teach IGCSE Biology to Grades 9–11. Prepare students for Cambridge checkpoint and IGCSE examinations. Conduct lab work and develop inquiry-based units.\n\nCandidates with Cambridge Teaching Qualification or experience in IB / IGCSE schools preferred.",
    requirements: [
      { text: "M.Sc Biology / Life Sciences", screening: "hard" },
      { text: "PGCE or Cambridge Teaching Qualification", screening: "scored" },
      { text: "Prior IGCSE or IB teaching experience", screening: "hard" },
      { text: "Hands-on lab instruction experience", screening: "scored" },
    ],
    stages: ["Application review", "Cambridge mock lesson", "Panel interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(21),
    status: "PUBLISHED",
    publishedDaysAgo: 6,
  },
  {
    schoolIdx: 2,
    title: "EAL / ESL Support Teacher",
    roleType: "Teaching",
    board: "IGCSE / Cambridge",
    classes: "5–8",
    employment: "Part-time",
    openings: 1,
    description:
      "Support students with English as an Additional Language in Grades 5–8. Co-teach with subject teachers, run pull-out sessions and monitor language progress.",
    requirements: [
      { text: "CELTA or DELTA qualification", screening: "hard" },
      { text: "Experience with EAL support in international schools", screening: "scored" },
    ],
    stages: ["Application review", "Lesson observation", "Interview", "Offer"],
    channels: { portal: true, careers: false, whatsapp: false },
    deadline: daysFromNow(15),
    status: "PUBLISHED",
    publishedDaysAgo: 4,
  },
  {
    schoolIdx: 2,
    title: "School Counsellor",
    roleType: "Non-teaching",
    board: "IGCSE / Cambridge",
    classes: "All levels",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Full-time school counsellor for Grades 1–12. Individual and group counselling, university guidance for Grades 10–12, child-protection lead.",
    requirements: [
      { text: "M.A / M.Sc Psychology or Counselling", screening: "hard" },
      { text: "RCI registration or equivalent certification", screening: "scored" },
      { text: "Experience in a school setting (2+ years)", screening: "scored" },
    ],
    stages: ["Application review", "Case study interview", "Panel interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: null,
    status: "CLOSED",
    publishedDaysAgo: 40,
  },

  // ── Heritage School Kolkata (ICSE) ────────────────────────────────────
  {
    schoolIdx: 3,
    title: "TGT History",
    roleType: "Teaching",
    board: "ICSE / CISCE",
    classes: "VI–X",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Teach History to Classes VI–X under the ICSE syllabus. Strong narrative teaching style, ability to connect historical events to contemporary issues. Participation in inter-school debate and quiz coaching a plus.",
    requirements: [
      { text: "M.A History from a recognised university", screening: "hard" },
      { text: "B.Ed", screening: "hard" },
      { text: "Minimum 2 years teaching experience", screening: "scored" },
    ],
    stages: ["Application review", "Lesson plan submission", "Demo lesson", "Interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(20),
    status: "PUBLISHED",
    publishedDaysAgo: 7,
  },
  {
    schoolIdx: 3,
    title: "Music Teacher — Western & Indian Classical",
    roleType: "Teaching",
    board: "ICSE / CISCE",
    classes: "I–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Heritage School seeks a versatile music teacher fluent in both Western notation and an Indian classical form (Hindustani or Carnatic). Manage choir, music ensembles and annual school concert.",
    requirements: [
      { text: "Degree or diploma in music (Western + Indian)", screening: "hard" },
      { text: "5+ years teaching in a school setting", screening: "scored" },
      { text: "Ability to conduct choir and manage school concert", screening: "scored" },
    ],
    stages: ["Application review", "Audition & demo", "Principal interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: true },
    deadline: daysFromNow(35),
    status: "PUBLISHED",
    publishedDaysAgo: 2,
  },

  // ── Lotus Valley International School (CBSE, Noida) ──────────────────
  {
    schoolIdx: 4,
    title: "PGT Economics",
    roleType: "Teaching",
    board: "CBSE",
    classes: "XI–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Teach CBSE Economics to Classes XI–XII. Cover micro, macro and Indian economic development. Guide students for board exams and Economics Olympiad.",
    requirements: [
      { text: "M.A / M.Sc Economics", screening: "hard" },
      { text: "B.Ed", screening: "hard" },
      { text: "CTET Paper II", screening: "scored" },
      { text: "3+ years senior-secondary experience", screening: "scored" },
    ],
    stages: ["Application review", "Subject test", "Demo lesson", "Interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: false },
    deadline: daysFromNow(14),
    status: "PUBLISHED",
    publishedDaysAgo: 9,
  },
  {
    schoolIdx: 4,
    title: "Sports Coordinator & PE Teacher",
    roleType: "Teaching",
    board: "CBSE",
    classes: "I–XII",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Lead PE across all sections and coordinate inter-school sports events. Specialisation in at least one field or court sport required. Experience organising annual sports days and state-level participation a strong plus.",
    requirements: [
      { text: "B.P.Ed or M.P.Ed", screening: "hard" },
      { text: "NIS certification or national-level sport participation", screening: "scored" },
      { text: "Experience managing school sports calendar", screening: "scored" },
    ],
    stages: ["Application review", "Physical assessment", "Interview", "Offer"],
    channels: { portal: true, careers: true, whatsapp: true },
    deadline: daysFromNow(28),
    status: "PUBLISHED",
    publishedDaysAgo: 3,
  },
  {
    schoolIdx: 4,
    title: "Administrative Officer",
    roleType: "Administrative",
    board: "CBSE",
    classes: "All levels",
    employment: "Full-time, permanent",
    openings: 1,
    description:
      "Manage day-to-day school administration — admissions, fee records, government compliance filings and coordination with teaching staff. Proficiency in school ERP systems required.",
    requirements: [
      { text: "Bachelor's degree (any discipline)", screening: "hard" },
      { text: "3+ years in school / education administration", screening: "scored" },
      { text: "Proficiency in MS Office and school ERP", screening: "scored" },
    ],
    stages: ["Application review", "Skills test", "HR interview", "Offer"],
    channels: { portal: true, careers: false, whatsapp: false },
    deadline: null,
    status: "DRAFT",
    publishedDaysAgo: null,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  await connectDB();
  console.log();

  if (WIPE) {
    console.log("⚠️  --wipe flag detected. Deleting existing recruitment seed data...");
    const delProfiles = await RecruitmentProfile.deleteMany({
      clerkUserId: { $in: [...SCHOOL_IDS, ...TEACHER_IDS] },
    });
    const delInstitutions = await Institution.deleteMany({
      ownerClerkUserId: { $in: SCHOOL_IDS },
    });
    const delJobs = await Job.deleteMany({
      ownerClerkUserId: { $in: SCHOOL_IDS },
    });
    console.log(
      `   Deleted: ${delProfiles.deletedCount} profiles, ${delInstitutions.deletedCount} institutions, ${delJobs.deletedCount} jobs`
    );
    console.log();
  }

  // ── 1. Upsert school profiles ──────────────────────────────────────────
  console.log("📚 Seeding school profiles...");
  const institutionDocs: (typeof Institution.prototype)[] = [];

  for (const school of SCHOOLS) {
    await RecruitmentProfile.findOneAndUpdate(
      { clerkUserId: school.clerkUserId },
      {
        clerkUserId: school.clerkUserId,
        email: school.email,
        accountType: "SCHOOL_ADMIN",
        institutionName: school.institutionName,
        contactPerson: school.contactPerson,
        phone: school.phone,
        acceptedTermsAt: daysAgo(60),
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const inst = await Institution.findOneAndUpdate(
      { ownerClerkUserId: school.clerkUserId },
      { ownerClerkUserId: school.clerkUserId, ...school.institution },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    institutionDocs.push(inst!);
    console.log(`   ✓ ${school.institutionName} (${school.institution.verificationStatus})`);
  }

  // ── 2. Upsert teacher profiles ─────────────────────────────────────────
  console.log("\n👩‍🏫 Seeding teacher profiles...");
  for (const teacher of TEACHERS) {
    await RecruitmentProfile.findOneAndUpdate(
      { clerkUserId: teacher.clerkUserId },
      {
        clerkUserId: teacher.clerkUserId,
        email: teacher.email,
        accountType: "TEACHER",
        fullName: teacher.fullName,
        phone: teacher.phone,
        acceptedTermsAt: daysAgo(30),
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`   ✓ ${teacher.fullName}`);
  }

  // ── 3. Upsert jobs ─────────────────────────────────────────────────────
  console.log("\n💼 Seeding jobs...");
  let published = 0, draft = 0, closed = 0;

  for (const j of JOBS) {
    const school = SCHOOLS[j.schoolIdx];
    const inst = institutionDocs[j.schoolIdx];

    const publishedAt =
      j.status === "PUBLISHED" && j.publishedDaysAgo !== null
        ? daysAgo(j.publishedDaysAgo)
        : null;

    const closedAt = j.status === "CLOSED" ? daysAgo(5) : null;

    // Idempotent: match on owner + title
    await Job.findOneAndUpdate(
      { ownerClerkUserId: school.clerkUserId, title: j.title },
      {
        ownerClerkUserId: school.clerkUserId,
        institutionId: inst?._id ?? null,
        institutionName: school.institution.name,
        city: school.institution.city,
        state: school.institution.state,
        title: j.title,
        roleType: j.roleType,
        board: j.board,
        classes: j.classes,
        employment: j.employment,
        openings: j.openings,
        description: j.description,
        requirements: j.requirements,
        stages: j.stages,
        channels: j.channels,
        deadline: j.deadline,
        status: j.status,
        publishedAt,
        closedAt,
        applicantCount: j.status === "PUBLISHED"
          ? Math.floor(Math.random() * 40) + 5
          : 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emoji = j.status === "PUBLISHED" ? "🟢" : j.status === "DRAFT" ? "🟡" : "🔴";
    console.log(`   ${emoji} [${j.status}] ${j.title} — ${school.institution.name}`);
    if (j.status === "PUBLISHED") published++;
    else if (j.status === "DRAFT") draft++;
    else closed++;
  }

  // ── 4. Summary ─────────────────────────────────────────────────────────
  const totalProfiles = await RecruitmentProfile.countDocuments();
  const totalInstitutions = await Institution.countDocuments();
  const totalJobs = await Job.countDocuments();

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Seed complete

   Jobs this run:  ${published} published · ${draft} draft · ${closed} closed
   DB totals:      ${totalProfiles} profiles · ${totalInstitutions} institutions · ${totalJobs} jobs

   Teacher browse (real Clerk session required):
     GET /api/recruitment/jobs            → all published jobs
     GET /api/recruitment/jobs?board=CBSE → filter by board
     GET /api/recruitment/jobs?search=physics
     GET /api/recruitment/jobs?roleType=Teaching&city=Noida

   To wipe and re-seed:
     npx ts-node --transpile-only src/scripts/seedRecruitment.ts --wipe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
