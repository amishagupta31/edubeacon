import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import Admin from "../models/Admin";

// Usage: npm run seed:admin -- email@example.com "Full Name"
async function main() {
  const email = (process.argv[2] ?? "").toLowerCase().trim();
  const name = process.argv[3] ?? "";

  if (!email || !email.includes("@")) {
    console.error("Usage: npm run seed:admin -- <email> [name]");
    process.exit(1);
  }

  await connectDB();

  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, name, active: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin saved: ${admin.email}${admin.name ? ` (${admin.name})` : ""}`);

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
