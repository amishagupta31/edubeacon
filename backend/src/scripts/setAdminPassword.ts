import "dotenv/config";
import { createClerkClient } from "@clerk/backend";

// Usage: npm run set:password -- email@example.com "YourPassword123!"
async function main() {
  const email = (process.argv[2] ?? "").toLowerCase().trim();
  const password = process.argv[3] ?? "";

  if (!email || !password) {
    console.error('Usage: npm run set:password -- <email> "<password>"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const { data: users } = await clerk.users.getUserList({ emailAddress: [email] });

  if (!users.length) {
    console.error(`No Clerk account exists for ${email}.`);
    console.error("Sign in once with the 'Email OTP' tab at /admin to create it, then re-run this.");
    process.exit(1);
  }

  await clerk.users.updateUser(users[0].id, { password });
  console.log(`Password set for ${email}.`);
  console.log("You can now sign in at /admin using the Password tab.");
}

main().catch((err) => {
  console.error("Failed:", err?.errors ?? err);
  process.exit(1);
});
