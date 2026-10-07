import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import Admin from "./model";
import { signAdminToken } from "../../lib/adminToken";

const router = Router();

// A real bcrypt hash of a random string. Compared against when no admin is
// found so a missing account costs the same time as a wrong password —
// otherwise response timing reveals which emails exist.
const DUMMY_HASH = "$2a$12$N9qo8uLOickgx2ZMRZoMye1VdLCAKR6qZ8dJ1tQ1pQd0Zz8xKQ0Hy";

// Simple in-memory throttle: 5 failures per email per 15 min.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function isLocked(key: string): boolean {
  const rec = attempts.get(key);
  if (!rec) return false;
  if (Date.now() > rec.until) { attempts.delete(key); return false; }
  return rec.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string) {
  const rec = attempts.get(key);
  if (!rec || Date.now() > rec.until) {
    attempts.set(key, { count: 1, until: Date.now() + LOCKOUT_MS });
  } else {
    rec.count += 1;
  }
}

// POST /api/admin/auth/login  { email, password }
router.post("/login", async (req: Request, res: Response) => {
  const email = String(req.body?.email ?? "").toLowerCase().trim();
  const password = String(req.body?.password ?? "");

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (isLocked(email)) {
    res.status(429).json({ error: "Too many failed attempts. Try again in 15 minutes." });
    return;
  }

  try {
    const admin = await Admin.findOne({ email, active: true }).select("+passwordHash");

    // Always run a bcrypt compare, even with no match, to keep timing flat.
    const hash = admin?.passwordHash || DUMMY_HASH;
    const ok = await bcrypt.compare(password, hash);

    if (!admin || !admin.passwordHash || !ok) {
      recordFailure(email);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    attempts.delete(email);
    await Admin.updateOne({ _id: admin._id }, { lastLoginAt: new Date() });

    const token = signAdminToken({ sub: String(admin._id), email: admin.email });
    res.json({
      token,
      admin: { email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
