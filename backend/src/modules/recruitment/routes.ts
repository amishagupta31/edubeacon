import { Router, Request, Response } from "express";
import { requireAuth, AuthedRequest, clerk } from "../../middleware/clerkAuth";
import { requireRole, RoleRequest } from "../../middleware/requireRole";
import RecruitmentProfile, { ACCOUNT_TYPES, AccountType } from "./model";
import Institution from "./institution.model";
import Job, { JOB_STATUSES, JobStatus } from "./job.model";
import Application, { IApplication } from "./application.model";
import Offer, { OFFER_STATUSES, OfferStatus, IOffer } from "./offer.model";
import NegotiationMessage from "./negotiation.model";
import { IJob } from "./job.model";

const router = Router();

// Simple in-memory throttle on registration, mirroring the admin-login approach.
// Per-instance only — see docs for the limitation.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_REGISTRATIONS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function throttled(key: string): boolean {
  const rec = attempts.get(key);
  if (!rec) return false;
  if (Date.now() > rec.until) { attempts.delete(key); return false; }
  return rec.count >= MAX_REGISTRATIONS;
}

function record(key: string) {
  const rec = attempts.get(key);
  if (!rec || Date.now() > rec.until) attempts.set(key, { count: 1, until: Date.now() + WINDOW_MS });
  else rec.count += 1;
}

const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

/**
 * POST /api/recruitment/register
 *
 * Creates the caller's recruitment profile. Identity comes from the verified
 * Clerk token, never from the body — the client supplies only profile fields
 * and the requested accountType.
 *
 * accountType is accepted here once, at creation. It is NOT updatable later;
 * there is deliberately no PATCH route for it.
 */
router.post("/register", requireAuth, async (req: AuthedRequest, res: Response) => {
  if (!req.userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  if (throttled(req.userId)) {
    res.status(429).json({ error: "Too many attempts. Try again later." });
    return;
  }

  const accountType = str(req.body?.accountType, 20) as AccountType;
  if (!ACCOUNT_TYPES.includes(accountType)) {
    res.status(400).json({ error: "Invalid account type" });
    return;
  }
  if (req.body?.acceptedTerms !== true) {
    res.status(400).json({ error: "You must accept the terms to continue" });
    return;
  }

  try {
    const existing = await RecruitmentProfile.findOne({ clerkUserId: req.userId });
    if (existing) {
      // Already registered — do not allow a second profile or a role switch.
      res.status(409).json({ error: "This account is already registered", accountType: existing.accountType });
      return;
    }

    // Email comes from Clerk (already verified), not from the request body.
    const user = await clerk.users.getUser(req.userId);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? "";
    if (!email) {
      res.status(400).json({ error: "No verified email on this account" });
      return;
    }

    const base = {
      clerkUserId: req.userId,
      email,
      accountType,
      acceptedTermsAt: new Date(),
      active: true,
    };

    const fields =
      accountType === "TEACHER"
        ? { fullName: str(req.body?.fullName, 120), phone: str(req.body?.phone, 20) }
        : {
            institutionName: str(req.body?.institutionName, 160),
            contactPerson: str(req.body?.contactPerson, 120),
            phone: str(req.body?.phone, 20),
          };

    if (accountType === "TEACHER" && !fields.fullName) {
      res.status(400).json({ error: "Full name is required" });
      return;
    }
    if (accountType === "SCHOOL_ADMIN" && !fields.institutionName) {
      res.status(400).json({ error: "Institution name is required" });
      return;
    }

    const profile = await RecruitmentProfile.create({ ...base, ...fields });
    record(req.userId);

    res.status(201).json({
      accountType: profile.accountType,
      email: profile.email,
      fullName: profile.fullName,
      phone: profile.phone,
      institutionName: profile.institutionName,
      contactPerson: profile.contactPerson,
      createdAt: profile.createdAt,
    });
  } catch (err: unknown) {
    // Unique index on clerkUserId is the final guard against a race.
    if ((err as { code?: number })?.code === 11000) {
      res.status(409).json({ error: "This account is already registered" });
      return;
    }
    console.error("Recruitment register error:", err);
    res.status(500).json({ error: "Could not complete registration" });
  }
});

/**
 * GET /api/recruitment/me
 * Returns the caller's own profile. Scoped to req.userId — a caller can never
 * read another account's profile through this route.
 */
router.get("/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  if (!req.userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const profile = await RecruitmentProfile.findOne({
      clerkUserId: req.userId,
      active: true,
    }).select(
      "accountType email fullName phone institutionName contactPerson " +
      "bio ctetStatus stetStatus subjectSpecialisations preferredCities " +
      "qualifications experience currentCTC expectedCTC availableFrom resumeUrl createdAt"
    );

    if (!profile) { res.json(null); return; }   // not registered yet — not an error
    res.json(profile);
  } catch (err) {
    console.error("Recruitment me error:", err);
    res.status(500).json({ error: "Could not load profile" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Teacher CV profile
// ════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/recruitment/profile/teacher
 * Teacher updates their CV fields. Identity from token — never from body.
 */
router.put("/profile/teacher", requireAuth, requireRole("TEACHER"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = {};

  if (body.fullName !== undefined)    update.fullName   = str(body.fullName, 120);
  if (body.phone !== undefined)       update.phone      = str(body.phone, 20);
  if (body.resumeUrl !== undefined)   update.resumeUrl  = str(body.resumeUrl, 500);
  if (body.bio !== undefined)         update.bio        = str(body.bio, 1000);
  if (body.stetStatus !== undefined)  update.stetStatus = str(body.stetStatus, 100);
  if (body.currentCTC !== undefined)  update.currentCTC = Number(body.currentCTC) || null;
  if (body.expectedCTC !== undefined) update.expectedCTC = Number(body.expectedCTC) || null;
  if (body.availableFrom !== undefined) {
    const d = new Date(str(body.availableFrom, 30));
    update.availableFrom = isNaN(d.getTime()) ? null : d;
  }

  const validCtet = ["cleared", "not_cleared", "not_applicable", ""];
  if (body.ctetStatus !== undefined && validCtet.includes(body.ctetStatus as string)) {
    update.ctetStatus = body.ctetStatus;
  }

  if (Array.isArray(body.subjectSpecialisations)) {
    update.subjectSpecialisations = (body.subjectSpecialisations as unknown[])
      .map((s) => str(s, 60)).filter(Boolean).slice(0, 10);
  }
  if (Array.isArray(body.preferredCities)) {
    update.preferredCities = (body.preferredCities as unknown[])
      .map((c) => str(c, 60)).filter(Boolean).slice(0, 5);
  }
  if (Array.isArray(body.qualifications)) {
    update.qualifications = (body.qualifications as { degree?: string; institution?: string; year?: string }[])
      .filter((q) => q?.degree)
      .map((q) => ({ degree: str(q.degree, 100), institution: str(q.institution, 160), year: str(q.year, 4) }))
      .slice(0, 10);
  }
  if (Array.isArray(body.achievements)) {
    update.achievements = (body.achievements as { title?: string; issuer?: string; year?: string; description?: string }[])
      .filter((a) => a?.title)
      .map((a) => ({ title: str(a.title, 160), issuer: str(a.issuer, 160), year: str(a.year, 4), description: str(a.description, 500) }))
      .slice(0, 20);
  }
  if (Array.isArray(body.experience)) {
    update.experience = (body.experience as { school?: string; role?: string; from?: string; to?: string }[])
      .filter((e) => e?.school)
      .map((e) => ({ school: str(e.school, 160), role: str(e.role, 100), from: str(e.from, 20), to: str(e.to, 20) }))
      .slice(0, 15);
  }

  try {
    const profile = await RecruitmentProfile.findOneAndUpdate(
      { clerkUserId: req.userId },
      update,
      { new: true }
    ).select("-__v");
    if (!profile) { res.status(404).json({ error: "Profile not found" }); return; }
    res.json(profile);
  } catch (err) {
    console.error("Teacher profile update error:", err);
    res.status(500).json({ error: "Could not update profile" });
  }
});

// ── Role-gated probes. These prove tenant/role separation end to end and are
//    the seam the Teacher and School feature routes will hang off. ──
router.get("/teacher/overview", requireAuth, requireRole("TEACHER"), (req: RoleRequest, res: Response) => {
  res.json({ accountType: req.accountType, sections: [] });
});

router.get("/school/overview", requireAuth, requireRole("SCHOOL_ADMIN"), (req: RoleRequest, res: Response) => {
  res.json({ accountType: req.accountType, activeJobs: 0, totalApplications: 0, shortlisted: 0 });
});

// ════════════════════════════════════════════════════════════════════════════
// Institution profile — SCHOOL_ADMIN only, scoped to the caller's own record
// ════════════════════════════════════════════════════════════════════════════

/**
 * Fields a school may set. `verificationStatus`, `verifiedAt` and
 * `ownerClerkUserId` are deliberately absent: an institution cannot verify
 * itself, nor reassign ownership, by posting those keys.
 */
const EDITABLE: { key: string; max: number }[] = [
  { key: "name", max: 160 },
  { key: "institutionType", max: 60 },
  { key: "board", max: 60 },
  { key: "establishedYear", max: 4 },
  { key: "officialEmail", max: 160 },
  { key: "contactPerson", max: 120 },
  { key: "contactPhone", max: 20 },
  { key: "website", max: 200 },
  { key: "addressLine", max: 240 },
  { key: "city", max: 80 },
  { key: "state", max: 80 },
  { key: "pincode", max: 10 },
  { key: "description", max: 2000 },
];

const PUBLIC_FIELDS =
  "name institutionType board establishedYear officialEmail contactPerson " +
  "contactPhone website addressLine city state pincode description achievements " +
  "verificationStatus verifiedAt updatedAt";

/** GET /api/recruitment/institution — the caller's own institution. */
router.get("/institution", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  try {
    const inst = await Institution.findOne({ ownerClerkUserId: req.userId }).select(PUBLIC_FIELDS);
    if (inst) { res.json(inst); return; }

    // No record yet — seed one from the registration details so the form opens
    // pre-filled rather than blank.
    const profile = await RecruitmentProfile.findOne({ clerkUserId: req.userId });
    const created = await Institution.create({
      ownerClerkUserId: req.userId,
      name: profile?.institutionName || "",
      officialEmail: profile?.email || "",
      contactPerson: profile?.contactPerson || "",
      contactPhone: profile?.phone || "",
    });
    res.json(await Institution.findById(created._id).select(PUBLIC_FIELDS));
  } catch (err) {
    console.error("Institution read error:", err);
    res.status(500).json({ error: "Could not load institution profile" });
  }
});

/** PUT /api/recruitment/institution — update the caller's own institution. */
router.put("/institution", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  // Whitelist only. Anything else in the payload — including verificationStatus
  // or ownerClerkUserId — is ignored rather than trusted.
  const update: Record<string, string> = {};
  for (const { key, max } of EDITABLE) {
    if (key in body) update[key] = str(body[key], max);
  }

  if (!update.name || !update.name.trim()) {
    res.status(400).json({ error: "Institution name is required" });
    return;
  }
  if (update.officialEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.officialEmail)) {
    res.status(400).json({ error: "Enter a valid official email address" });
    return;
  }
  if (update.website && !/^https?:\/\//i.test(update.website)) {
    update.website = `https://${update.website}`;
  }
  if (update.establishedYear && !/^\d{4}$/.test(update.establishedYear)) {
    res.status(400).json({ error: "Established year must be a 4-digit year" });
    return;
  }

  // Achievements array
  const achievementsUpdate: { title: string; year: string; description: string }[] | undefined =
    Array.isArray(body.achievements)
      ? (body.achievements as { title?: string; year?: string; description?: string }[])
          .filter((a) => a?.title)
          .map((a) => ({ title: str(a.title, 160), year: str(a.year, 4), description: str(a.description, 500) }))
          .slice(0, 20)
      : undefined;

  try {
    const instUpdate: Record<string, unknown> = { ...update, ownerClerkUserId: req.userId };
    if (achievementsUpdate !== undefined) instUpdate.achievements = achievementsUpdate;

    const inst = await Institution.findOneAndUpdate(
      { ownerClerkUserId: req.userId },   // scoping clause — not a client id
      instUpdate,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select(PUBLIC_FIELDS);

    res.json(inst);
  } catch (err) {
    console.error("Institution update error:", err);
    res.status(500).json({ error: "Could not save institution profile" });
  }
});

/**
 * GET /api/recruitment/institutions/:id
 * Public profile of a school — readable by anyone (teachers, guests).
 */
router.get("/institutions/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: "Invalid institution id" });
      return;
    }
    const inst = await Institution.findById(req.params.id).select(
      "name institutionType board establishedYear officialEmail contactPerson " +
      "contactPhone website addressLine city state pincode description achievements " +
      "verificationStatus verifiedAt updatedAt"
    );
    if (!inst) { res.status(404).json({ error: "Institution not found" }); return; }
    res.json(inst);
  } catch (err) {
    console.error("Public institution read error:", err);
    res.status(500).json({ error: "Could not load institution profile" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Jobs — SCHOOL_ADMIN creates / manages; teachers browse PUBLISHED listings
// ════════════════════════════════════════════════════════════════════════════

const JOB_LIST_FIELDS =
  "_id title roleType board classes employment openings description " +
  "institutionId institutionName city state status deadline publishedAt applicantCount createdAt";

/** Whitelist for job body fields. */
const JOB_EDITABLE: { key: string; max: number }[] = [
  { key: "title", max: 160 },
  { key: "roleType", max: 60 },
  { key: "board", max: 60 },
  { key: "classes", max: 60 },
  { key: "employment", max: 60 },
  { key: "description", max: 5000 },
];

/**
 * POST /api/recruitment/jobs
 * School creates a new job (DRAFT or PUBLISHED).
 */
router.post("/jobs", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const title = str(body.title, 160);
  if (!title) { res.status(400).json({ error: "Job title is required" }); return; }

  const status = (str(body.status, 20) || "DRAFT") as JobStatus;
  if (!JOB_STATUSES.includes(status) || status === "CLOSED") {
    res.status(400).json({ error: "Status must be DRAFT or PUBLISHED" });
    return;
  }

  try {
    // Pull current institution snapshot so the listing has location info.
    const inst = await Institution.findOne({ ownerClerkUserId: req.userId });

    // Require a complete institution profile before posting any job.
    const REQUIRED_INST: (keyof typeof inst & string)[] = ["name", "city", "state", "description", "officialEmail"];
    const missingInst = REQUIRED_INST.filter((k) => !String((inst as Record<string, unknown>)?.[k] ?? "").trim());
    if (missingInst.length > 0) {
      res.status(403).json({
        error: "Complete your institution profile before posting jobs. Missing: " + missingInst.join(", "),
        code: "PROFILE_INCOMPLETE",
        missingFields: missingInst,
      });
      return;
    }

    const openings = Math.max(1, Math.min(999, Number(body.openings) || 1));
    const deadlineRaw = str(body.deadline, 30);
    const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
    if (deadline && isNaN(deadline.getTime())) {
      res.status(400).json({ error: "Invalid deadline date" });
      return;
    }

    const requirements = Array.isArray(body.requirements)
      ? (body.requirements as { text?: string; screening?: string }[])
          .filter((r) => str(r?.text, 300))
          .map((r) => ({
            text: str(r.text, 300),
            screening: r?.screening === "hard" ? "hard" as const : "scored" as const,
          }))
      : [];

    const stages = Array.isArray(body.stages)
      ? (body.stages as unknown[]).map((s) => str(s, 100)).filter(Boolean)
      : [];

    const ch = (body.channels ?? {}) as Record<string, unknown>;
    const channels = {
      portal: ch.portal !== false,
      careers: ch.careers !== false,
      whatsapp: ch.whatsapp === true,
    };

    const job = await Job.create({
      ownerClerkUserId: req.userId,
      institutionId: inst?._id ?? null,
      institutionName: inst?.name || "",
      city: inst?.city || "",
      state: inst?.state || "",

      title,
      roleType: str(body.roleType, 60) || "Teaching",
      board: str(body.board, 60),
      classes: str(body.classes, 60),
      employment: str(body.employment, 60),
      openings,
      description: str(body.description, 5000),

      requirements,
      stages,
      channels,
      deadline,

      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Job create error:", err);
    res.status(500).json({ error: "Could not create job" });
  }
});

/**
 * GET /api/recruitment/jobs/mine
 * School lists its own jobs (all statuses).
 */
router.get("/jobs/mine", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  try {
    const jobs = await Job.find({ ownerClerkUserId: req.userId })
      .select(JOB_LIST_FIELDS)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(jobs);
  } catch (err) {
    console.error("Jobs mine error:", err);
    res.status(500).json({ error: "Could not load jobs" });
  }
});

/**
 * PUT /api/recruitment/jobs/:id
 * School updates its own job. Cannot change ownerClerkUserId or applicantCount.
 */
router.put("/jobs/:id", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  try {
    const job = await Job.findOne({ _id: req.params.id, ownerClerkUserId: req.userId });
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    // Whitelist scalar fields
    for (const { key, max } of JOB_EDITABLE) {
      if (key in body) (job as Record<string, unknown>)[key] = str(body[key], max);
    }

    if (body.openings !== undefined) job.openings = Math.max(1, Math.min(999, Number(body.openings) || 1));

    if (body.deadline !== undefined) {
      const d = str(body.deadline, 30);
      job.deadline = d ? new Date(d) : null;
      if (job.deadline && isNaN(job.deadline.getTime())) {
        res.status(400).json({ error: "Invalid deadline date" });
        return;
      }
    }

    if (Array.isArray(body.requirements)) {
      job.requirements = (body.requirements as { text?: string; screening?: string }[])
        .filter((r) => str(r?.text, 300))
        .map((r) => ({
          text: str(r.text, 300),
          screening: r?.screening === "hard" ? "hard" as const : "scored" as const,
        }));
    }

    if (Array.isArray(body.stages)) {
      job.stages = (body.stages as unknown[]).map((s) => str(s, 100)).filter(Boolean);
    }

    if (body.channels && typeof body.channels === "object") {
      const ch = body.channels as Record<string, unknown>;
      job.channels = {
        portal: ch.portal !== false,
        careers: ch.careers !== false,
        whatsapp: ch.whatsapp === true,
      };
    }

    // Status transitions
    if (body.status && typeof body.status === "string") {
      const next = body.status as JobStatus;
      if (JOB_STATUSES.includes(next)) {
        if (next === "PUBLISHED" && job.status === "DRAFT") {
          if (!job.title.trim()) {
            res.status(400).json({ error: "Add a title before publishing" });
            return;
          }
          job.publishedAt = new Date();
        }
        if (next === "CLOSED") job.closedAt = new Date();
        job.status = next;
      }
    }

    await job.save();
    res.json(job);
  } catch (err) {
    console.error("Job update error:", err);
    res.status(500).json({ error: "Could not update job" });
  }
});

/**
 * DELETE /api/recruitment/jobs/:id
 * School deletes its own DRAFT job. Published/closed jobs cannot be deleted
 * (close them instead).
 */
router.delete("/jobs/:id", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, ownerClerkUserId: req.userId });
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    if (job.status !== "DRAFT") {
      res.status(400).json({ error: "Only draft jobs can be deleted. Close the job instead." });
      return;
    }
    await job.deleteOne();
    res.json({ deleted: true });
  } catch (err) {
    console.error("Job delete error:", err);
    res.status(500).json({ error: "Could not delete job" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Public teacher directory — no auth required
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/recruitment/teachers
 * Public directory of teachers who have filled their profile.
 * Returns only teachers who have at least a bio or subjects set.
 */
router.get("/teachers", async (_req: Request, res: Response) => {
  try {
    const teachers = await RecruitmentProfile.find({
      accountType: "TEACHER",
      active: true,
      $or: [
        { bio: { $exists: true, $ne: "" } },
        { subjectSpecialisations: { $exists: true, $not: { $size: 0 } } },
      ],
    })
      .select("_id fullName bio subjectSpecialisations ctetStatus preferredCities availableFrom currentCTC expectedCTC achievements")
      .sort({ updatedAt: -1 })
      .limit(60)
      .lean();
    res.json(teachers);
  } catch (err) {
    console.error("Teachers directory error:", err);
    res.status(500).json({ error: "Could not load teachers" });
  }
});

/**
 * GET /api/recruitment/teachers/:id
 * Full public profile of one teacher (no auth required).
 * Deliberately excludes contact details (phone, email, resumeUrl) — schools
 * must be logged in to see those; this is the public showcase view.
 */
router.get("/teachers/:id", async (req: Request, res: Response) => {
  try {
    const tid = String(req.params.id);
    if (!tid.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: "Invalid teacher id" });
      return;
    }
    const teacher = await RecruitmentProfile.findOne({
      _id: tid, accountType: "TEACHER", active: true,
    }).select(
      "_id fullName bio subjectSpecialisations ctetStatus stetStatus " +
      "preferredCities availableFrom currentCTC expectedCTC " +
      "qualifications experience achievements updatedAt"
    ).lean();
    if (!teacher) { res.status(404).json({ error: "Teacher not found" }); return; }
    res.json(teacher);
  } catch (err) {
    console.error("Teacher profile read error:", err);
    res.status(500).json({ error: "Could not load teacher profile" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Public job board — no auth required, only PUBLISHED jobs exposed
// ════════════════════════════════════════════════════════════════════════════

const PUBLIC_JOB_FIELDS =
  "_id title roleType board classes employment openings description " +
  "institutionId institutionName city state deadline publishedAt applicantCount";

/**
 * GET /api/recruitment/jobs
 * Browse all PUBLISHED jobs. Supports query filters:
 *   ?search=physics  — title or description keyword
 *   ?roleType=Teaching
 *   ?board=CBSE
 *   ?employment=Full-time, permanent
 *   ?city=Delhi
 *   ?page=1&limit=20
 */
router.get("/jobs", async (req: Request, res: Response) => {
  try {
    const q = req.query;
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(q.limit) || 20));

    // Only published, non-expired jobs.
    const filter: Record<string, unknown> = { status: "PUBLISHED" };

    if (q.roleType && typeof q.roleType === "string") filter.roleType = q.roleType;
    if (q.board && typeof q.board === "string") filter.board = q.board;
    if (q.employment && typeof q.employment === "string") filter.employment = q.employment;

    if (q.city && typeof q.city === "string") {
      filter.city = { $regex: q.city, $options: "i" };
    }

    if (q.search && typeof q.search === "string") {
      const escaped = q.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { institutionName: { $regex: escaped, $options: "i" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .select(PUBLIC_JOB_FIELDS)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Jobs browse error:", err);
    res.status(500).json({ error: "Could not load jobs" });
  }
});

/**
 * GET /api/recruitment/jobs/:id
 * View a single PUBLISHED job — full detail for the teacher.
 */
router.get("/jobs/:id", async (req: Request, res: Response) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: "PUBLISHED" })
      .select(PUBLIC_JOB_FIELDS + " requirements stages")
      .lean();
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    res.json(job);
  } catch (err) {
    console.error("Job detail error:", err);
    res.status(500).json({ error: "Could not load job" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Applications — teachers apply; schools manage the pipeline
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/recruitment/jobs/:id/apply
 * Teacher applies for a published job. One application per teacher per job.
 */
router.post("/jobs/:id/apply", requireAuth, requireRole("TEACHER"), async (req: RoleRequest, res: Response) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: "PUBLISHED" });
    if (!job) { res.status(404).json({ error: "Job not found or no longer accepting applications" }); return; }

    const profile = await RecruitmentProfile.findOne({ clerkUserId: req.userId });
    if (!profile) { res.status(403).json({ error: "Complete your recruitment profile first", code: "PROFILE_INCOMPLETE" }); return; }

    // Require minimum profile: full name, phone, and at least bio or a qualification.
    const missingTeacher: string[] = [];
    if (!String(profile.fullName || "").trim()) missingTeacher.push("fullName");
    if (!String(profile.phone || "").trim()) missingTeacher.push("phone");
    const hasBio = String(profile.bio || "").trim().length > 0;
    const hasQual = Array.isArray(profile.qualifications) && profile.qualifications.length > 0;
    if (!hasBio && !hasQual) missingTeacher.push("bio or qualifications");
    if (missingTeacher.length > 0) {
      res.status(403).json({
        error: "Complete your profile before applying. Missing: " + missingTeacher.join(", "),
        code: "PROFILE_INCOMPLETE",
        missingFields: missingTeacher,
      });
      return;
    }

    const existing = await Application.findOne({ jobId: job._id, teacherClerkUserId: req.userId });
    if (existing) { res.status(409).json({ error: "You have already applied for this job" }); return; }

    const coverNote = str(req.body?.coverNote, 1000);

    const app = await Application.create({
      jobId: job._id,
      jobTitle: job.title,
      institutionName: job.institutionName,
      city: job.city,
      state: job.state,
      board: job.board,
      ownerClerkUserId: job.ownerClerkUserId,
      teacherClerkUserId: req.userId!,
      teacherName: profile.fullName || profile.email,
      teacherEmail: profile.email,
      teacherPhone: profile.phone || "",
      coverNote,
      stages: job.stages.length ? job.stages : ["Applied", "Screening", "Interview", "Offer"],
      stageIndex: 0,
      currentStage: job.stages[0] || "Applied",
    });

    // Increment applicant count on job
    await Job.updateOne({ _id: job._id }, { $inc: { applicantCount: 1 } });

    res.status(201).json({ applied: true, applicationId: app._id, stage: app.currentStage });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 11000) {
      res.status(409).json({ error: "You have already applied for this job" });
      return;
    }
    console.error("Apply error:", err);
    res.status(500).json({ error: "Could not submit application" });
  }
});

/**
 * GET /api/recruitment/applications/mine
 * Teacher sees all their own applications with current stage.
 */
router.get("/applications/mine", requireAuth, requireRole("TEACHER"), async (req: RoleRequest, res: Response) => {
  try {
    const apps = await Application.find({ teacherClerkUserId: req.userId })
      .select("jobId jobTitle institutionName city state board currentStage stageIndex stages status appliedAt")
      .sort({ appliedAt: -1 })
      .limit(100)
      .lean();
    res.json(apps);
  } catch (err) {
    console.error("My applications error:", err);
    res.status(500).json({ error: "Could not load applications" });
  }
});

/**
 * GET /api/recruitment/jobs/:id/applications
 * School fetches all applicants for one of its jobs, grouped by stage.
 */
router.get("/jobs/:id/applications", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, ownerClerkUserId: req.userId }).lean() as IJob | null;
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    const apps = await Application.find({ jobId: req.params.id })
      .select("_id teacherName teacherEmail teacherPhone coverNote currentStage stageIndex stages status aiScore schoolNotes appliedAt")
      .sort({ stageIndex: -1, appliedAt: -1 })
      .lean();

    res.json({ job: { title: job.title, stages: job.stages }, applications: apps });
  } catch (err) {
    console.error("Job applications error:", err);
    res.status(500).json({ error: "Could not load applications" });
  }
});

/**
 * PUT /api/recruitment/applications/:id/stage
 * School moves a candidate to a different stage.
 */
router.put("/applications/:id/stage", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const stageIndex = Number(req.body?.stageIndex);
  if (isNaN(stageIndex) || stageIndex < 0) {
    res.status(400).json({ error: "Valid stageIndex is required" });
    return;
  }
  try {
    const app = await Application.findOne({ _id: req.params.id, ownerClerkUserId: req.userId });
    if (!app) { res.status(404).json({ error: "Application not found" }); return; }
    if (app.status !== "active") {
      res.status(400).json({ error: "Cannot move a rejected or withdrawn application" });
      return;
    }

    const maxIdx = Math.max(0, app.stages.length - 1);
    app.stageIndex = Math.min(stageIndex, maxIdx);
    app.currentStage = app.stages[app.stageIndex] || "";
    if (req.body?.notes) app.schoolNotes = str(req.body.notes, 1000);
    await app.save();
    res.json({ stageIndex: app.stageIndex, currentStage: app.currentStage });
  } catch (err) {
    console.error("Stage move error:", err);
    res.status(500).json({ error: "Could not update stage" });
  }
});

/**
 * PUT /api/recruitment/applications/:id/status
 * School rejects, withdraws or marks offered. Teachers can withdraw their own.
 */
router.put("/applications/:id/status", requireAuth, async (req: AuthedRequest, res: Response) => {
  const next = str(req.body?.status, 20);
  if (!["rejected", "withdrawn", "offered", "active"].includes(next)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  try {
    const app = await Application.findById(req.params.id);
    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    // Schools can reject/offer; teachers can only withdraw their own
    const isSchool = app.ownerClerkUserId === req.userId;
    const isOwner  = app.teacherClerkUserId === req.userId;
    if (!isSchool && !isOwner) { res.status(403).json({ error: "Forbidden" }); return; }
    if (next === "withdrawn" && !isOwner) { res.status(403).json({ error: "Only the applicant can withdraw" }); return; }
    if ((next === "rejected" || next === "offered") && !isSchool) { res.status(403).json({ error: "Only the school can reject or offer" }); return; }

    app.status = next as IApplication["status"];
    await app.save();
    res.json({ status: app.status });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Could not update status" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Offers — school creates; teacher views/responds
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/recruitment/offers
 * School creates a draft offer for a candidate.
 */
router.post("/offers", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const applicationId = str(body.applicationId, 30);
  if (!applicationId) { res.status(400).json({ error: "applicationId is required" }); return; }

  try {
    const app = await Application.findOne({ _id: applicationId, ownerClerkUserId: req.userId });
    if (!app) { res.status(404).json({ error: "Application not found" }); return; }

    const ctc = Number(body.ctc);
    if (!ctc || ctc < 1000) { res.status(400).json({ error: "Valid CTC is required" }); return; }

    // One offer per application
    const existing = await Offer.findOne({ applicationId });
    if (existing) { res.json(existing); return; }

    const joiningRaw = str(body.joiningDate, 30);
    const joiningDate = joiningRaw ? new Date(joiningRaw) : null;

    const salaryRows = Array.isArray(body.salaryRows)
      ? (body.salaryRows as { label?: string; amount?: number }[])
          .filter((r) => r?.label)
          .map((r) => ({ label: str(r.label, 100), amount: Number(r.amount) || 0 }))
      : [];

    const offer = await Offer.create({
      applicationId: app._id,
      jobId: app.jobId,
      candidateName: app.teacherName,
      candidateEmail: app.teacherEmail,
      role: app.jobTitle,
      institutionName: app.institutionName,
      ownerClerkUserId: req.userId,
      teacherClerkUserId: app.teacherClerkUserId,
      ctc,
      joiningDate,
      template: str(body.template, 80) || "Teaching — permanent",
      probation: str(body.probation, 60) || "6 months",
      noticePeriod: str(body.noticePeriod, 60) || "60 days",
      offerExpires: str(body.offerExpires, 60) || "7 days after sending",
      language: str(body.language, 40) || "English",
      clauses: Array.isArray(body.clauses) ? (body.clauses as unknown[]).map((c) => str(c, 100)) : [],
      sendVia: {
        email: (body.sendVia as Record<string, unknown>)?.email !== false,
        whatsapp: (body.sendVia as Record<string, unknown>)?.whatsapp === true,
        inApp: (body.sendVia as Record<string, unknown>)?.inApp !== false,
      },
      salaryRows,
    });

    // Mark application as offered
    await Application.updateOne({ _id: app._id }, { status: "offered" });

    res.status(201).json(offer);
  } catch (err) {
    console.error("Offer create error:", err);
    res.status(500).json({ error: "Could not create offer" });
  }
});

/**
 * GET /api/recruitment/offers/mine  (SCHOOL_ADMIN)
 * School lists all its offers.
 */
router.get("/offers/mine", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  try {
    const offers = await Offer.find({ ownerClerkUserId: req.userId })
      .select("_id candidateName role ctc status sentAt acceptedAt declinedAt createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(offers);
  } catch (err) {
    console.error("Offers mine error:", err);
    res.status(500).json({ error: "Could not load offers" });
  }
});

/**
 * GET /api/recruitment/offers/received  (TEACHER)
 * Teacher sees offers sent to them.
 */
router.get("/offers/received", requireAuth, requireRole("TEACHER"), async (req: RoleRequest, res: Response) => {
  try {
    const offers = await Offer.find({ teacherClerkUserId: req.userId, status: { $in: ["sent", "viewed", "accepted", "declined"] } })
      .select("_id candidateName role institutionName ctc joiningDate status sentAt acceptedAt declinedAt")
      .sort({ sentAt: -1 })
      .lean();
    res.json(offers);
  } catch (err) {
    console.error("Offers received error:", err);
    res.status(500).json({ error: "Could not load offers" });
  }
});

/**
 * GET /api/recruitment/offers/:id
 * School or the candidate can read their own offer.
 */
router.get("/offers/:id", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const offer = await Offer.findById(req.params.id).lean() as IOffer | null;
    if (!offer) { res.status(404).json({ error: "Offer not found" }); return; }
    if (offer.ownerClerkUserId !== req.userId && offer.teacherClerkUserId !== req.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    // Mark as viewed when teacher reads
    if (offer.teacherClerkUserId === req.userId && offer.status === "sent") {
      await Offer.updateOne({ _id: offer._id }, { status: "viewed", viewedAt: new Date() });
    }
    res.json(offer);
  } catch (err) {
    console.error("Offer read error:", err);
    res.status(500).json({ error: "Could not load offer" });
  }
});

/**
 * PUT /api/recruitment/offers/:id
 * School updates a draft offer's fields.
 */
router.put("/offers/:id", requireAuth, requireRole("SCHOOL_ADMIN"), async (req: RoleRequest, res: Response) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  try {
    const offer = await Offer.findOne({ _id: req.params.id, ownerClerkUserId: req.userId });
    if (!offer) { res.status(404).json({ error: "Offer not found" }); return; }
    if (!["draft", "pending_approval"].includes(offer.status)) {
      res.status(400).json({ error: "Cannot edit an offer that has already been sent" });
      return;
    }

    if (body.ctc) offer.ctc = Number(body.ctc) || offer.ctc;
    if (body.template) offer.template = str(body.template, 80);
    if (body.joiningDate) offer.joiningDate = new Date(str(body.joiningDate, 30));
    if (body.probation) offer.probation = str(body.probation, 60);
    if (body.noticePeriod) offer.noticePeriod = str(body.noticePeriod, 60);
    if (body.offerExpires) offer.offerExpires = str(body.offerExpires, 60);
    if (body.language) offer.language = str(body.language, 40);
    if (Array.isArray(body.clauses)) offer.clauses = (body.clauses as unknown[]).map((c) => str(c, 100));
    if (Array.isArray(body.salaryRows)) {
      offer.salaryRows = (body.salaryRows as { label?: string; amount?: number }[])
        .filter((r) => r?.label)
        .map((r) => ({ label: str(r.label, 100), amount: Number(r.amount) || 0 }));
    }

    offer.version += 1;
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error("Offer update error:", err);
    res.status(500).json({ error: "Could not update offer" });
  }
});

/**
 * PUT /api/recruitment/offers/:id/status
 * Status transitions:
 *   School: draft → pending_approval → approved → sent
 *   Teacher: sent/viewed → accepted | declined
 */
router.put("/offers/:id/status", requireAuth, async (req: AuthedRequest, res: Response) => {
  const next = str(req.body?.status, 30) as OfferStatus;
  if (!OFFER_STATUSES.includes(next)) { res.status(400).json({ error: "Invalid status" }); return; }

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) { res.status(404).json({ error: "Offer not found" }); return; }

    const isSchool = offer.ownerClerkUserId === req.userId;
    const isTeacher = offer.teacherClerkUserId === req.userId;
    if (!isSchool && !isTeacher) { res.status(403).json({ error: "Forbidden" }); return; }

    // Guard allowed transitions
    if (isSchool && !["pending_approval", "approved", "sent"].includes(next)) {
      res.status(400).json({ error: "Schools can only move to pending_approval, approved, or sent" }); return;
    }
    if (isTeacher && !["accepted", "declined"].includes(next)) {
      res.status(400).json({ error: "Candidates can only accept or decline" }); return;
    }
    if (isTeacher && !["sent", "viewed"].includes(offer.status)) {
      res.status(400).json({ error: "Offer has not been sent yet" }); return;
    }

    offer.status = next;
    if (next === "sent") offer.sentAt = new Date();
    if (next === "accepted") offer.acceptedAt = new Date();
    if (next === "declined") {
      offer.declinedAt = new Date();
      offer.declineReason = str(req.body?.reason, 500);
    }
    await offer.save();
    res.json({ status: offer.status });
  } catch (err) {
    console.error("Offer status error:", err);
    res.status(500).json({ error: "Could not update offer status" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Salary negotiation messages — persistent thread per offer
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/recruitment/offers/:id/messages
 * School or candidate reads the negotiation thread.
 */
router.get("/offers/:id/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const offer = await Offer.findById(req.params.id).lean() as IOffer | null;
    if (!offer) { res.status(404).json({ error: "Offer not found" }); return; }
    if (offer.ownerClerkUserId !== req.userId && offer.teacherClerkUserId !== req.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }
    const messages = await NegotiationMessage.find({ offerId: req.params.id })
      .select("senderName isSchool body createdAt")
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    console.error("Messages read error:", err);
    res.status(500).json({ error: "Could not load messages" });
  }
});

/**
 * POST /api/recruitment/offers/:id/messages
 * School or candidate posts to the negotiation thread.
 */
router.post("/offers/:id/messages", requireAuth, async (req: AuthedRequest, res: Response) => {
  const body = str(req.body?.body, 2000);
  if (!body) { res.status(400).json({ error: "Message body is required" }); return; }

  try {
    const offer = await Offer.findById(req.params.id).lean() as IOffer | null;
    if (!offer) { res.status(404).json({ error: "Offer not found" }); return; }
    if (offer.ownerClerkUserId !== req.userId && offer.teacherClerkUserId !== req.userId) {
      res.status(403).json({ error: "Forbidden" }); return;
    }

    const isSchool = offer.ownerClerkUserId === req.userId;
    const profile = await RecruitmentProfile.findOne({ clerkUserId: req.userId });
    const senderName = isSchool
      ? (profile?.institutionName || profile?.contactPerson || "HR")
      : (profile?.fullName || profile?.email || "Candidate");

    const msg = await NegotiationMessage.create({
      offerId: offer._id,
      applicationId: offer.applicationId,
      senderClerkUserId: req.userId,
      senderName,
      isSchool,
      body,
    });

    res.status(201).json({ _id: msg._id, senderName, isSchool, body: msg.body, createdAt: msg.createdAt });
  } catch (err) {
    console.error("Message post error:", err);
    res.status(500).json({ error: "Could not send message" });
  }
});

export default router;
