import "dotenv/config";
import { createClerkClient } from "@clerk/backend";

// Usage: npm run check:admin -- email@example.com
async function main() {
  const email = (process.argv[2] ?? "").toLowerCase().trim();
  if (!email) {
    console.error("Usage: npm run check:admin -- <email>");
    process.exit(1);
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const { data: users } = await clerk.users.getUserList({ emailAddress: [email] });

  if (!users.length) {
    console.log(`No Clerk account exists for ${email}.`);
    console.log("→ Sign in once with the 'Email OTP' tab at /admin to create it.");
    return;
  }

  const u = users[0];
  console.log(`Clerk account found for ${email}`);
  console.log(`  id:            ${u.id}`);
  console.log(`  name:          ${[u.firstName, u.lastName].filter(Boolean).join(" ") || "(none)"}`);
  console.log(`  password set:  ${u.passwordEnabled ? "YES — password login works" : "NO — use Email OTP, or set one below"}`);
  console.log(`  last sign-in:  ${u.lastSignInAt ? new Date(u.lastSignInAt).toISOString() : "never"}`);
}

main().catch((err) => {
  console.error("Check failed:", err?.errors ?? err);
  process.exit(1);
});
