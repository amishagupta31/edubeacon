import { Router, Request, Response } from "express";
import { requireAuth, AuthedRequest, clerk } from "../../middleware/clerkAuth";
import { requireRole, RoleRequest } from "../../middleware/requireRole";
import RecruitmentProfile, { ACCOUNT_TYPES, AccountType } from "./model";
import Institution from "./institution.model";
import Job, { JOB_STATUSES, JobStatus } from "./job.model";

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
    }).select("accountType email fullName phone institutionName contactPerson createdAt");

    if (!profile) { res.json(null); return; }   // not registered yet — not an error
    res.json(profile);
  } catch (err) {
    console.error("Recruitment me error:", err);
    res.status(500).json({ error: "Could not load profile" });
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
  "contactPhone website addressLine city state pincode description " +
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

  try {
    const inst = await Institution.findOneAndUpdate(
      { ownerClerkUserId: req.userId },   // scoping clause — not a client id
      { ...update, ownerClerkUserId: req.userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select(PUBLIC_FIELDS);

    res.json(inst);
  } catch (err) {
    console.error("Institution update error:", err);
    res.status(500).json({ error: "Could not save institution profile" });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// Jobs — SCHOOL_ADMIN creates / manages; teachers browse PUBLISHED listings
// ════════════════════════════════════════════════════════════════════════════

const JOB_LIST_FIELDS =
  "_id title roleType board classes employment openings description " +
  "institutionName city state status deadline publishedAt applicantCount createdAt";

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
// Public job board — any authenticated teacher (or any signed-in user) can
// browse PUBLISHED jobs. No write access.
// ════════════════════════════════════════════════════════════════════════════

const PUBLIC_JOB_FIELDS =
  "_id title roleType board classes employment openings description " +
  "institutionName city state deadline publishedAt";

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
router.get("/jobs", requireAuth, async (req: Request, res: Response) => {
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
router.get("/jobs/:id", requireAuth, async (req: Request, res: Response) => {
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

export default router;
