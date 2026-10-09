import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import Admin from "../models/Admin";

const BCRYPT_ROUNDS = 12;

// Usage: npm run seed:admin -- <email> <password> ["Full Name"]
async function main() {
  const email = (process.argv[2] ?? "").toLowerCase().trim();
  const password = process.argv[3] ?? "";
  const name = process.argv[4] ?? "";

  if (!email || !email.includes("@")) {
    console.error('Usage: npm run seed:admin -- <email> <password> ["Full Name"]');
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Password is required and must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, active: true, ...(name ? { name } : {}) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin seeded: ${admin.email}${admin.name ? ` (${admin.name})` : ""}`);
  console.log("Password stored as a bcrypt hash — the raw value is not saved anywhere.");

  const all = await Admin.find({ active: true }).select("email name lastLoginAt");
  console.log(`\nActive admins (${all.length}):`);
  all.forEach((a: { email: string; name: string; lastLoginAt: Date | null }) =>
    console.log(`  · ${a.email}${a.name ? ` — ${a.name}` : ""}${a.lastLoginAt ? ` (last login ${a.lastLoginAt.toISOString().slice(0, 10)})` : ""}`)
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
