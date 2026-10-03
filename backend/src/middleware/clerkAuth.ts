import { createClerkClient, verifyToken } from "@clerk/backend";
import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";

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

// Clerk token + email must be an active admin in the `admins` collection.
// ADMIN_EMAILS stays as a bootstrap path so the first admin can get in before
// the collection is seeded; a matching env email is upserted into the DB.
export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractBearer(req);
  if (!token) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerk.users.getUser(payload.sub);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? "";

    let admin = await Admin.findOne({ email, active: true });

    if (!admin) {
      const envAdmins = (process.env.ADMIN_EMAILS ?? "")
        .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

      if (!envAdmins.includes(email)) {
        res.status(403).json({ error: "Forbidden: not an admin" });
        return;
      }

      admin = await Admin.findOneAndUpdate(
        { email },
        {
          email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          active: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await Admin.updateOne({ _id: admin._id }, { lastLoginAt: new Date() });

    req.userId = payload.sub;
    req.userEmail = email;
    next();
  } catch (err) {
    console.error("requireAdmin error:", err);
    res.status(403).json({ error: "Forbidden: invalid token" });
  }
}
