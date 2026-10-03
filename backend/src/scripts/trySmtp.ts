import "dotenv/config";
import nodemailer from "nodemailer";

// Usage: npm run try:smtp -- "<login>" "<password>" [host] [port]
// Tests a credential pair directly without touching .env.
async function main() {
  const user = process.argv[2] ?? process.env.SMTP_USER ?? "";
  const pass = process.argv[3] ?? process.env.SMTP_PASS ?? "";
  const host = process.argv[4] ?? process.env.SMTP_HOST ?? "smtp-relay.brevo.com";
  const port = Number(process.argv[5] ?? process.env.SMTP_PORT ?? 587);

  if (!user || !pass) {
    console.error('Usage: npm run try:smtp -- "<login>" "<password>" [host] [port]');
    process.exit(1);
  }

  console.log(`host:  ${host}:${port}`);
  console.log(`login: ${user}`);
  console.log(`pass:  ${pass.slice(0, 12)}…${pass.slice(-4)} (${pass.length} chars)\n`);

  const tx = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
  });

  try {
    await tx.verify();
    console.log("SUCCESS — these credentials work.");
    console.log("\nPut them in backend/.env:");
    console.log(`  SMTP_USER=${user}`);
    console.log(`  SMTP_PASS=${pass}`);
    console.log("\nThen restart the backend.");
  } catch (err: unknown) {
    const e = err as { responseCode?: number; response?: string; message?: string };
    console.error(`FAILED — ${e.response ?? e.message}`);

    if (e.responseCode === 535) {
      console.error(`
The login is being rejected. For Brevo, the SMTP login is NOT your account
email — it is a dedicated address ending in @smtp-brevo.com.

Find it at:  Brevo dashboard → SMTP & API → SMTP tab → "Login"
It looks like:  8a1b2c001@smtp-brevo.com

Pair that with your xsmtpsib-… key as the password.`);
    }
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
