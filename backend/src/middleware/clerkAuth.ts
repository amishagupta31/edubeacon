import { createClerkClient, verifyToken } from "@clerk/backend";
import { Request, Response, NextFunction } from "express";
import Admin from "../modules/admins/model";
import { verifyAdminToken } from "../lib/adminToken";

export const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

function extractBearer(req: Request): string | null {
  const h = req.headers.authorization;
  return h?.startsWith("Bearer ") ? h.slice(7) : null;
}

// Verify the Clerk session token sent from the frontend
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractBearer(req);
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session token" });
  }
}

// Accepts either auth path, in this order:
//   1. An admin JWT issued by POST /api/admin/auth/login (email + password in MongoDB)
//   2. A Clerk session token, for the email-OTP path
// Either way the email must exist in `admins` with active: true.
export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractBearer(req);
  if (!token) { res.status(403).json({ error: "Forbidden" }); return; }

  // ── 1. Admin JWT (password login) ──
  const adminPayload = verifyAdminToken(token);
  if (adminPayload) {
    const admin = await Admin.findOne({ email: adminPayload.email, active: true });
    if (!admin) { res.status(403).json({ error: "Forbidden: not an admin" }); return; }
    req.userId = adminPayload.sub;
    req.userEmail = adminPayload.email;
    next();
    return;
  }

  // ── 2. Clerk session token (OTP login) ──
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerk.users.getUser(payload.sub);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? "";

    const admin = await Admin.findOne({ email, active: true });
    if (!admin) { res.status(403).json({ error: "Forbidden: not an admin" }); return; }

    await Admin.updateOne({ _id: admin._id }, { lastLoginAt: new Date() });

    req.userId = payload.sub;
    req.userEmail = email;
    next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    res.status(403).json({ error: "Forbidden: invalid token" });
  }
}
