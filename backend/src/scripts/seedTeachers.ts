/**
 * seedTeachers.ts
 *
 * Seeds 10 realistic teacher profiles + sample applications against
 * existing published jobs so schools can browse candidates and see
 * who has applied.
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/seedTeachers.ts
 *   npx ts-node --transpile-only src/scripts/seedTeachers.ts --wipe
 *
 * --wipe  deletes only the seed teacher profiles and their applications.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import RecruitmentProfile from "../modules/recruitment/model";
import Job from "../modules/recruitment/job.model";
import Application from "../modules/recruitment/application.model";

const WIPE = process.argv.includes("--wipe");

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);

// ── Deterministic fake Clerk IDs ──────────────────────────────────────────────

const TEACHER_IDS = [
  "seed_t_arjun_mehta",
  "seed_t_kavita_nair",
  "seed_t_rohan_gupta",
  "seed_t_meera_joshi",
  "seed_t_deepak_sharma",
  "seed_t_sunita_patel",
  "seed_t_vikram_das",
  "seed_t_priya_krishnan",
  "seed_t_amit_chaudhary",
  "seed_t_neha_agarwal",
];

// ── Teacher profiles ──────────────────────────────────────────────────────────

const TEACHERS = [
  {
    clerkUserId: TEACHER_IDS[0],
    email: "arjun.mehta.edu@gmail.com",
    fullName: "Arjun Mehta",
    phone: "9876501234",
    bio: "Passionate Physics educator with 7 years of CBSE senior-secondary experience. Consistently delivered 95%+ board-exam pass rates. Strong in conceptual teaching and hands-on lab work.",
    subjectSpecialisations: ["Physics", "Mathematics"],
    ctetStatus: "cleared" as const,
    stetStatus: "HTET cleared",
    currentCTC: 68000,
    expectedCTC: 82000,
    preferredCities: ["Gurugram", "Delhi", "Noida"],
    availableFrom: daysFromNow(30),
    resumeUrl: "https://drive.google.com/file/arjun-mehta-resume",
    qualifications: [
      { degree: "M.Sc Physics", institution: "Delhi University", year: "2015" },
      { degree: "B.Ed", institution: "Jamia Millia Islamia", year: "2016" },
    ],
    experience: [
      { school: "Modern School Vasant Vihar", role: "PGT Physics", from: "Jul 2016", to: "Mar 2020" },
      { school: "DPS R.K. Puram", role: "PGT Physics", from: "Apr 2020", to: "Present" },
    ],
    achievements: [
      { title: "Best Teacher Award", issuer: "DPS R.K. Puram", year: "2022", description: "Awarded for outstanding student outcomes and innovative lab-based teaching methods." },
      { title: "CTET Paper I & II Gold Standard", issuer: "CBSE", year: "2016", description: "" },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[1],
    email: "kavita.nair.teacher@gmail.com",
    fullName: "Kavita Nair",
    phone: "9845012345",
    bio: "IGCSE-trained Biology teacher with Cambridge Teaching Qualification and 5 years at international schools in Mumbai and Pune. Specialize in inquiry-based and project-led learning.",
    subjectSpecialisations: ["Biology", "Environmental Science", "Chemistry"],
    ctetStatus: "not_applicable" as const,
    stetStatus: "",
    currentCTC: 72000,
    expectedCTC: 88000,
    preferredCities: ["Mumbai", "Pune", "Bengaluru"],
    availableFrom: daysFromNow(15),
    resumeUrl: "https://notion.so/kavita-nair-portfolio",
    qualifications: [
      { degree: "M.Sc Life Sciences", institution: "University of Pune", year: "2017" },
      { degree: "Cambridge Teaching Qualification (CTeQ)", institution: "Cambridge International", year: "2018" },
    ],
    experience: [
      { school: "Jamnabai Narsee School", role: "IGCSE Biology Teacher", from: "Aug 2018", to: "Jun 2021" },
      { school: "Dhirubhai Ambani International School", role: "IGCSE Biology & ESS", from: "Jul 2021", to: "Present" },
    ],
    achievements: [
      { title: "Cambridge Excellence Award", issuer: "Cambridge International Education", year: "2021", description: "Recognised for outstanding IGCSE Biology student outcomes." },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[2],
    email: "rohan.gupta.maths@gmail.com",
    fullName: "Rohan Gupta",
    phone: "9911223344",
    bio: "TGT Mathematics with 6 years of experience in CBSE and ICSE schools. Expert at making abstract concepts accessible through visualization and real-world examples. Maths Olympiad coach.",
    subjectSpecialisations: ["Mathematics", "Statistics"],
    ctetStatus: "cleared" as const,
    stetStatus: "UPTET cleared",
    currentCTC: 52000,
    expectedCTC: 65000,
    preferredCities: ["Noida", "Delhi", "Lucknow"],
    availableFrom: daysFromNow(45),
    resumeUrl: "https://drive.google.com/file/rohan-gupta-cv",
    qualifications: [
      { degree: "M.Sc Mathematics", institution: "Allahabad University", year: "2016" },
      { degree: "B.Ed", institution: "CSJM University Kanpur", year: "2017" },
    ],
    experience: [
      { school: "St. Joseph's Academy Allahabad", role: "TGT Mathematics", from: "Jul 2017", to: "May 2020" },
      { school: "Cambridge School Noida", role: "TGT Mathematics", from: "Jun 2020", to: "Present" },
    ],
    achievements: [
      { title: "Maths Olympiad State Coach", issuer: "CBSE Regional Office", year: "2023", description: "Coached students to district Maths Olympiad wins three years running." },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[3],
    email: "meera.joshi.english@gmail.com",
    fullName: "Meera Joshi",
    phone: "9820334455",
    bio: "Primary English teacher with 8 years of experience in CBSE and ICSE schools. Certified phonics instructor and trained in Whole Language approach. Passionate about early literacy and creative writing.",
    subjectSpecialisations: ["English Language", "English Literature", "EVS"],
    ctetStatus: "cleared" as const,
    stetStatus: "",
    currentCTC: 45000,
    expectedCTC: 58000,
    preferredCities: ["Mumbai", "Thane", "Pune"],
    availableFrom: daysFromNow(7),
    resumeUrl: "https://linkedin.com/in/meera-joshi-educator",
    qualifications: [
      { degree: "M.A English Literature", institution: "Mumbai University", year: "2013" },
      { degree: "B.Ed (English)", institution: "SNDTUniversity", year: "2014" },
      { degree: "Jolly Phonics Certification", institution: "Jolly Learning UK", year: "2019" },
    ],
    experience: [
      { school: "Podar International School Santacruz", role: "PRT English", from: "Jun 2014", to: "Mar 2019" },
      { school: "Arya Vidya Mandir Bandra", role: "PRT English & Class Teacher", from: "Apr 2019", to: "Present" },
    ],
    achievements: [
      { title: "Jolly Phonics Master Trainer", issuer: "Jolly Learning UK", year: "2019", description: "" },
      { title: "Early Literacy Improvement Award", issuer: "AVM Bandra", year: "2022", description: "Improved reading readiness scores by 32% across Grade 1 in one academic year." },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[4],
    email: "deepak.sharma.cs@gmail.com",
    fullName: "Deepak Sharma",
    phone: "9971445566",
    bio: "Computer Science teacher with a software engineering background (4 years industry, then moved to teaching). Strong in Python, data structures, databases and web fundamentals. Taught CS to CBSE Classes XI-XII for 5 years.",
    subjectSpecialisations: ["Computer Science", "Informatics Practices", "Mathematics"],
    ctetStatus: "cleared" as const,
    stetStatus: "CTET Paper II cleared",
    currentCTC: 60000,
    expectedCTC: 75000,
    preferredCities: ["Noida", "Gurugram", "Delhi"],
    availableFrom: daysFromNow(21),
    resumeUrl: "https://github.com/deepaksharma-teacher",
    qualifications: [
      { degree: "B.Tech Computer Science", institution: "AKTU Lucknow", year: "2013" },
      { degree: "B.Ed (CS & Maths)", institution: "IGNOU", year: "2018" },
    ],
    experience: [
      { school: "Tata Consultancy Services", role: "Software Engineer", from: "Jul 2013", to: "Jun 2017" },
      { school: "Lotus Valley International School Noida", role: "PGT Computer Science", from: "Jul 2017", to: "Mar 2022" },
      { school: "Ryan International School Noida", role: "PGT Computer Science", from: "Apr 2022", to: "Present" },
    ],
    achievements: [
      { title: "Google for Education Champion", issuer: "Google", year: "2021", description: "Recognised for innovative use of Google Workspace tools in CBSE CS classroom." },
      { title: "100% CBSE CS Board Pass Rate", issuer: "CBSE", year: "2023", description: "Achieved 100% pass rate with 6 students scoring above 95 in CS." },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[5],
    email: "sunita.patel.hindi@gmail.com",
    fullName: "Sunita Patel",
    phone: "9898556677",
    bio: "Experienced Hindi teacher with 9 years in CBSE and State Board schools. Expert in Hindi-A and Hindi-B syllabi, Sahitya and grammar. Known for bringing classical literature alive in the classroom.",
    subjectSpecialisations: ["Hindi Language", "Hindi Literature", "Sanskrit"],
    ctetStatus: "cleared" as const,
    stetStatus: "UPTET cleared, REET cleared",
    currentCTC: 48000,
    expectedCTC: 60000,
    preferredCities: ["Noida", "Delhi", "Jaipur", "Lucknow"],
    availableFrom: daysAgo(5),
    resumeUrl: "https://drive.google.com/file/sunita-patel-hindi",
    qualifications: [
      { degree: "M.A Hindi Sahitya", institution: "Rajasthan University Jaipur", year: "2012" },
      { degree: "B.Ed", institution: "Maharishi Dayanand Saraswati University", year: "2013" },
    ],
    experience: [
      { school: "Kendriya Vidyalaya Jaipur", role: "TGT Hindi", from: "Sep 2013", to: "Mar 2018" },
      { school: "Delhi International School Rohini", role: "TGT Hindi", from: "Apr 2018", to: "Present" },
    ],
    achievements: [
      { title: "Sahitya Puraskar — Best Hindi Teacher", issuer: "Rajasthan Sahitya Akademi", year: "2017", description: "" },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[6],
    email: "vikram.das.history@gmail.com",
    fullName: "Vikram Das",
    phone: "9830667788",
    bio: "History and Social Studies teacher from Kolkata with a decade of ICSE teaching experience. Specialist in narrative-style teaching and inter-school quiz/debate coaching. Authored two supplementary ICSE history guides.",
    subjectSpecialisations: ["History", "Civics", "Geography", "Social Science"],
    ctetStatus: "cleared" as const,
    stetStatus: "WBTET cleared",
    currentCTC: 55000,
    expectedCTC: 68000,
    preferredCities: ["Kolkata", "Bhubaneswar", "Delhi"],
    availableFrom: daysFromNow(10),
    resumeUrl: "https://drive.google.com/file/vikram-das-history-cv",
    qualifications: [
      { degree: "M.A Modern History", institution: "Jadavpur University", year: "2011" },
      { degree: "B.Ed", institution: "Calcutta University", year: "2012" },
    ],
    experience: [
      { school: "South Point High School Kolkata", role: "TGT History", from: "Jun 2012", to: "May 2017" },
      { school: "La Martiniere for Boys Kolkata", role: "TGT History & Civics", from: "Jun 2017", to: "Present" },
    ],
    achievements: [
      { title: "Published Author — ICSE History Guide", issuer: "Pearson Education India", year: "2019", description: "Authored two supplementary ICSE history guides widely used across schools in West Bengal." },
      { title: "National Quiz Coaching Award", issuer: "CBSE National Quiz", year: "2023", description: "" },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[7],
    email: "priya.krishnan.econ@gmail.com",
    fullName: "Priya Krishnan",
    phone: "9740778899",
    bio: "Senior Economics teacher with 8 years of CBSE Class XI-XII experience. Consistent 98%+ board-exam results. Coached students to top state ranks in the Economics Olympiad. Currently also teaching Business Studies.",
    subjectSpecialisations: ["Economics", "Business Studies", "Accountancy"],
    ctetStatus: "cleared" as const,
    stetStatus: "KTET cleared",
    currentCTC: 65000,
    expectedCTC: 78000,
    preferredCities: ["Noida", "Bengaluru", "Hyderabad"],
    availableFrom: daysFromNow(14),
    resumeUrl: "https://notion.so/priya-krishnan-educator",
    qualifications: [
      { degree: "M.A Economics", institution: "Jawaharlal Nehru University", year: "2013" },
      { degree: "B.Ed", institution: "Bangalore University", year: "2014" },
    ],
    experience: [
      { school: "Bangalore International School", role: "PGT Economics", from: "Aug 2014", to: "Jun 2019" },
      { school: "DPS Bengaluru East", role: "PGT Economics & Business Studies", from: "Jul 2019", to: "Present" },
    ],
    achievements: [
      { title: "Economics Olympiad State Rank 1 Coach", issuer: "CBSE Karnataka", year: "2022", description: "Coached student to state top rank in Economics Olympiad two years running." },
      { title: "Star Teacher Award", issuer: "Delhi Public School Society", year: "2023", description: "" },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[8],
    email: "amit.chaudhary.pe@gmail.com",
    fullName: "Amit Chaudhary",
    phone: "9667889900",
    bio: "Physical Education teacher and sports coordinator with 10 years of experience. Former state-level basketball player. Organized five annual sports days and multiple inter-school tournaments. NIS certified in Basketball.",
    subjectSpecialisations: ["Physical Education", "Basketball", "Athletics", "Yoga"],
    ctetStatus: "not_applicable" as const,
    stetStatus: "",
    currentCTC: 50000,
    expectedCTC: 62000,
    preferredCities: ["Noida", "Delhi", "Gurugram", "Chandigarh"],
    availableFrom: daysFromNow(20),
    resumeUrl: "https://drive.google.com/file/amit-chaudhary-sports-cv",
    qualifications: [
      { degree: "M.P.Ed", institution: "Lakshmibai National University of Physical Education", year: "2012" },
      { degree: "NIS Certificate — Basketball", institution: "SAI National Institute of Sports", year: "2014" },
    ],
    experience: [
      { school: "Army Public School Delhi Cantt", role: "PGT Physical Education", from: "Jun 2012", to: "May 2017" },
      { school: "GD Goenka World School Gurugram", role: "PE Teacher & Sports Coordinator", from: "Jun 2017", to: "Present" },
    ],
    achievements: [
      { title: "NIS Basketball Certification", issuer: "SAI National Institute of Sports", year: "2014", description: "" },
      { title: "Best Sports Coordinator — NCR", issuer: "Haryana School Sports Federation", year: "2022", description: "Recognised for coordinating five consecutive annual sports days and state-level team entries." },
    ],
  },
  {
    clerkUserId: TEACHER_IDS[9],
    email: "neha.agarwal.counsellor@gmail.com",
    fullName: "Neha Agarwal",
    phone: "9999001122",
    bio: "School counsellor and psychologist with 6 years of experience in international and CBSE schools. Trained in CBT, career counselling and child safeguarding. Fluent in English and Hindi; conversational French.",
    subjectSpecialisations: ["School Counselling", "Psychology", "Career Guidance"],
    ctetStatus: "not_applicable" as const,
    stetStatus: "",
    currentCTC: 58000,
    expectedCTC: 72000,
    preferredCities: ["Mumbai", "Delhi", "Noida", "Gurugram"],
    availableFrom: daysFromNow(30),
    resumeUrl: "https://linkedin.com/in/neha-agarwal-counsellor",
    qualifications: [
      { degree: "M.Sc Clinical Psychology", institution: "Tata Institute of Social Sciences Mumbai", year: "2016" },
      { degree: "RCI Rehabilitation Council Certification", institution: "Rehabilitation Council of India", year: "2017" },
      { degree: "Child Safeguarding Certificate", institution: "Child Safeguarding International", year: "2020" },
    ],
    experience: [
      { school: "Ecole Mondiale World School Mumbai", role: "School Counsellor", from: "Sep 2017", to: "Jul 2020" },
      { school: "Oberoi International School Mumbai", role: "Senior School Counsellor", from: "Aug 2020", to: "Present" },
    ],
    achievements: [
      { title: "RCI Registered Psychologist", issuer: "Rehabilitation Council of India", year: "2017", description: "" },
      { title: "Child Safeguarding Excellence Award", issuer: "UNICEF India Partners", year: "2021", description: "Recognised for implementing best-practice safeguarding protocols across two international schools." },
    ],
  },
];

// ── Application seeds ─────────────────────────────────────────────────────────
// Each entry: teacherIdx → matches index in TEACHERS array
// jobMatchKey: { title substring, schoolClerkId prefix } to find the job
// We'll resolve the actual job IDs at seed time.

interface AppSeed {
  teacherIdx: number;
  jobTitleHint: string;
  coverNote: string;
  stageIndex: number;
  status: "active" | "rejected" | "withdrawn" | "offered";
  appliedDaysAgo: number;
  aiScore: number | null;
}

const APPLICATION_SEEDS: AppSeed[] = [
  // Arjun Mehta → PGT Physics at Greenfield
  {
    teacherIdx: 0,
    jobTitleHint: "PGT Physics",
    coverNote: "I have been teaching CBSE Class XI-XII Physics for 7 years with consistent 95%+ board results. I am confident I can contribute strongly to Greenfield's senior secondary programme and would welcome the opportunity to discuss further.",
    stageIndex: 2,
    status: "active",
    appliedDaysAgo: 4,
    aiScore: 91,
  },
  // Arjun Mehta → TGT Mathematics at Greenfield (second application)
  {
    teacherIdx: 0,
    jobTitleHint: "TGT Mathematics",
    coverNote: "Mathematics is my second subject. I am comfortable teaching up to Class X and would be happy to support the school in both Physics and Maths if needed.",
    stageIndex: 0,
    status: "active",
    appliedDaysAgo: 2,
    aiScore: 74,
  },
  // Kavita Nair → IGCSE Biology
  {
    teacherIdx: 1,
    jobTitleHint: "IGCSE Biology",
    coverNote: "I hold the Cambridge Teaching Qualification and have 5 years of direct IGCSE Biology teaching experience at two top Mumbai international schools. Inquiry-based lab work is my specialty.",
    stageIndex: 3,
    status: "active",
    appliedDaysAgo: 5,
    aiScore: 95,
  },
  // Rohan Gupta → TGT Mathematics (DPS Noida)
  {
    teacherIdx: 2,
    jobTitleHint: "TGT Mathematics",
    coverNote: "Six years of CBSE middle and secondary Maths teaching. I specialize in visualization-based learning and have coached students to win district-level Maths Olympiad three years running.",
    stageIndex: 1,
    status: "active",
    appliedDaysAgo: 3,
    aiScore: 87,
  },
  // Rohan Gupta → PGT Economics (Lotus Valley) — rejected
  {
    teacherIdx: 2,
    jobTitleHint: "PGT Economics",
    coverNote: "While my primary background is Mathematics, I have a strong understanding of micro and macro Economics and am keen to expand into this subject.",
    stageIndex: 0,
    status: "rejected",
    appliedDaysAgo: 8,
    aiScore: 38,
  },
  // Meera Joshi → PRT English
  {
    teacherIdx: 3,
    jobTitleHint: "PRT English",
    coverNote: "Eight years of primary English teaching with phonics certification and Whole Language training. I have a track record of improving reading readiness scores by 30%+ in my current school. Would love to bring this to Greenfield.",
    stageIndex: 2,
    status: "active",
    appliedDaysAgo: 6,
    aiScore: 89,
  },
  // Deepak Sharma → PGT Computer Science
  {
    teacherIdx: 4,
    jobTitleHint: "PGT Computer Science",
    coverNote: "4 years as a software engineer before switching to teaching gives me real-world CS context I bring into every lesson. Strong Python, SQL, networking fundamentals. 5 years CBSE CS teaching, 100% pass rate.",
    stageIndex: 3,
    status: "offered",
    appliedDaysAgo: 12,
    aiScore: 97,
  },
  // Sunita Patel → TGT Hindi
  {
    teacherIdx: 5,
    jobTitleHint: "TGT Hindi",
    coverNote: "Nine years of CBSE Hindi teaching, both Hindi-A and Hindi-B. Cleared CTET and UPTET. Currently available immediately. Would be glad to discuss joining before term begins.",
    stageIndex: 2,
    status: "active",
    appliedDaysAgo: 7,
    aiScore: 85,
  },
  // Vikram Das → TGT History (Heritage Kolkata)
  {
    teacherIdx: 6,
    jobTitleHint: "TGT History",
    coverNote: "A decade of ICSE history teaching in Kolkata. I run inter-school quiz and debate coaching and have authored two supplementary ICSE history guides currently used by schools in West Bengal.",
    stageIndex: 1,
    status: "active",
    appliedDaysAgo: 5,
    aiScore: 92,
  },
  // Priya Krishnan → PGT Economics (Lotus Valley)
  {
    teacherIdx: 7,
    jobTitleHint: "PGT Economics",
    coverNote: "Eight years of CBSE XI-XII Economics with consistently outstanding board results. I also coach Economics Olympiad and teach Business Studies. Relocating from Bengaluru — Noida is my target city.",
    stageIndex: 1,
    status: "active",
    appliedDaysAgo: 2,
    aiScore: 93,
  },
  // Amit Chaudhary → Sports Coordinator & PE Teacher
  {
    teacherIdx: 8,
    jobTitleHint: "Sports Coordinator",
    coverNote: "10 years of PE and sports coordination in Delhi NCR schools. NIS certified in Basketball. I organized 5 annual sports days and led teams to state-level competition. Lotus Valley's sports programme would be an exciting challenge.",
    stageIndex: 0,
    status: "active",
    appliedDaysAgo: 1,
    aiScore: null,
  },
  // Neha Agarwal → School Counsellor (Bombay International — CLOSED, tests history)
  {
    teacherIdx: 9,
    jobTitleHint: "School Counsellor",
    coverNote: "TISS-trained school counsellor with 6 years at Mumbai international schools. Experienced in CBT, career counselling, and child safeguarding. RCI registered.",
    stageIndex: 2,
    status: "active",
    appliedDaysAgo: 35,
    aiScore: 88,
  },
  // Kavita Nair → EAL Support Teacher (Bombay International)
  {
    teacherIdx: 1,
    jobTitleHint: "EAL",
    coverNote: "Beyond Biology, I have co-taught EAL students at my current school for 3 years and understand language support needs well. Happy to take on an EAL role in conjunction with or independent of a Biology post.",
    stageIndex: 0,
    status: "withdrawn",
    appliedDaysAgo: 3,
    aiScore: 66,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  await connectDB();
  console.log();

  if (WIPE) {
    console.log("⚠️  --wipe: removing seed teacher profiles and their applications...");
    const del = await RecruitmentProfile.deleteMany({ clerkUserId: { $in: TEACHER_IDS } });
    const delApps = await Application.deleteMany({ teacherClerkUserId: { $in: TEACHER_IDS } });
    console.log(`   Deleted ${del.deletedCount} profiles, ${delApps.deletedCount} applications\n`);
  }

  // ── 1. Upsert teacher profiles ────────────────────────────────────────────
  console.log("👩‍🏫  Seeding 10 teacher profiles...");
  for (const t of TEACHERS) {
    await RecruitmentProfile.findOneAndUpdate(
      { clerkUserId: t.clerkUserId },
      {
        clerkUserId:            t.clerkUserId,
        email:                  t.email,
        accountType:            "TEACHER",
        fullName:               t.fullName,
        phone:                  t.phone,
        bio:                    t.bio,
        resumeUrl:              t.resumeUrl,
        subjectSpecialisations: t.subjectSpecialisations,
        ctetStatus:             t.ctetStatus,
        stetStatus:             t.stetStatus,
        currentCTC:             t.currentCTC,
        expectedCTC:            t.expectedCTC,
        preferredCities:        t.preferredCities,
        availableFrom:          t.availableFrom,
        qualifications:         t.qualifications,
        experience:             t.experience,
        achievements:           t.achievements ?? [],
        acceptedTermsAt:        daysAgo(60),
        active:                 true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const cities = t.preferredCities.slice(0, 2).join(", ");
    console.log(`   ✓ ${t.fullName} — ${t.subjectSpecialisations[0]} · ${cities}`);
  }

  // ── 2. Seed applications ──────────────────────────────────────────────────
  console.log("\n📋  Seeding applications...");

  // Fetch all jobs to resolve by title hint
  const allJobs = await Job.find({}).lean();

  let created = 0, skipped = 0;

  for (const app of APPLICATION_SEEDS) {
    const teacher = TEACHERS[app.teacherIdx];

    // Find matching job by title hint (case-insensitive substring)
    const job = allJobs.find((j) =>
      j.title.toLowerCase().includes(app.jobTitleHint.toLowerCase())
    );

    if (!job) {
      console.log(`   ⚠  No job found for hint "${app.jobTitleHint}" — skipping`);
      skipped++;
      continue;
    }

    const stages: string[] = (job.stages as string[]) ?? ["Application review", "Offer"];
    const currentStage = stages[Math.min(app.stageIndex, stages.length - 1)] ?? "Application review";

    try {
      await Application.findOneAndUpdate(
        { jobId: job._id, teacherClerkUserId: teacher.clerkUserId },
        {
          jobId:              job._id,
          jobTitle:           job.title,
          institutionName:    job.institutionName,
          city:               job.city ?? "",
          state:              job.state ?? "",
          board:              job.board ?? "",
          ownerClerkUserId:   job.ownerClerkUserId,
          teacherClerkUserId: teacher.clerkUserId,
          teacherName:        teacher.fullName,
          teacherEmail:       teacher.email,
          teacherPhone:       teacher.phone,
          coverNote:          app.coverNote,
          stages,
          stageIndex:         app.stageIndex,
          currentStage,
          status:             app.status,
          aiScore:            app.aiScore,
          schoolNotes:        "",
          appliedAt:          daysAgo(app.appliedDaysAgo),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const emoji =
        app.status === "offered"   ? "🎯" :
        app.status === "rejected"  ? "❌" :
        app.status === "withdrawn" ? "↩️" : "📄";
      console.log(
        `   ${emoji} ${teacher.fullName} → "${job.title}" @ ${job.institutionName} [stage ${app.stageIndex}: ${currentStage}]`
      );
      created++;
    } catch (err: unknown) {
      if ((err as { code?: number })?.code === 11000) {
        console.log(`   ↩  Already exists: ${teacher.fullName} → "${job.title}" (skipped)`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  // ── 3. Update applicantCount on jobs ─────────────────────────────────────
  console.log("\n🔢  Updating applicantCount on affected jobs...");
  const counts = await Application.aggregate([
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
  ]);
  for (const { _id, count } of counts) {
    await Job.updateOne({ _id }, { $set: { applicantCount: count } });
  }
  console.log(`   Updated ${counts.length} jobs`);

  // ── 4. Summary ────────────────────────────────────────────────────────────
  const totalTeachers = await RecruitmentProfile.countDocuments({ accountType: "TEACHER" });
  const totalApps = await Application.countDocuments();

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Teacher seed complete

   This run:    ${TEACHERS.length} teacher profiles · ${created} applications (${skipped} skipped)
   DB totals:   ${totalTeachers} teachers · ${totalApps} applications

   Browse teachers (public):
     GET /api/recruitment/teachers

   Browse teachers with filters:
     GET /api/recruitment/teachers?search=physics
     GET /api/recruitment/teachers?subject=Mathematics
     GET /api/recruitment/teachers?city=Delhi

   View applications for a job (requires school auth):
     GET /api/recruitment/jobs/:id/applications

   To wipe and re-seed:
     npx ts-node --transpile-only src/scripts/seedTeachers.ts --wipe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
