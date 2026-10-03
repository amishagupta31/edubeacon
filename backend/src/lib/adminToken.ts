import jwt from "jsonwebtoken";

const TTL = "8h";

export interface AdminTokenPayload {
  sub: string;    // admin _id
  email: string;
  kind: "admin";
}

function secret(): string {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be set to at least 32 characters");
  }
  return s;
}

export function signAdminToken(payload: Omit<AdminTokenPayload, "kind">): string {
  return jwt.sign({ ...payload, kind: "admin" }, secret(), { expiresIn: TTL });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret()) as AdminTokenPayload;
    return decoded.kind === "admin" ? decoded : null;
  } catch {
    return null;
  }
}
