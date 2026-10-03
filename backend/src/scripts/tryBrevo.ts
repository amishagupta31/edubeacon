import "dotenv/config";

// Usage: npm run try:brevo -- "<xkeysib-key>"
// Validates a Brevo API key and lists verified senders.
async function main() {
  const key = (process.argv[2] ?? process.env.BREVO_API_KEY ?? "").trim();

  if (!key) {
    console.error('Usage: npm run try:brevo -- "<xkeysib-...>"');
    process.exit(1);
  }

  console.log(`key: ${key.slice(0, 12)}…${key.slice(-4)} (${key.length} chars)`);
  if (!key.startsWith("xkeysib-")) {
    console.warn('WARNING: a Brevo API key normally starts with "xkeysib-".');
  }
  console.log();

  // 1. Is the key valid at all?
  const acct = await fetch("https://api.brevo.com/v3/account", {
    headers: { "api-key": key },
  });

  if (!acct.ok) {
    console.error(`INVALID KEY — HTTP ${acct.status} ${acct.statusText}`);
    console.error(await acct.text().catch(() => ""));
    console.error(`
The key is being rejected outright. Generate a fresh one at:
  https://app.brevo.com/settings/keys/api

Use the COPY button — selecting the text by hand gives you a truncated
value, because the UI shows it abbreviated with "…".

If a brand-new key also fails, your account is likely pending activation.
Check the Brevo dashboard for a verification banner.`);
    process.exit(1);
  }

  const info = (await acct.json()) as {
    email?: string;
    companyName?: string;
    plan?: { type?: string }[];
  };
  console.log(`VALID KEY`);
  console.log(`  account: ${info.email}`);
  console.log(`  company: ${info.companyName ?? "—"}`);
  console.log(`  plan:    ${info.plan?.[0]?.type ?? "—"}`);

  // 2. Which senders may we send from?
  const sendersRes = await fetch("https://api.brevo.com/v3/senders", {
    headers: { "api-key": key },
  });

  if (sendersRes.ok) {
    const { senders = [] } = (await sendersRes.json()) as {
      senders?: { name: string; email: string; active: boolean }[];
    };
    console.log(`\nVerified senders (${senders.length}):`);
    if (!senders.length) {
      console.log("  (none) — add and verify a sender before sending.");
    }
    for (const s of senders) {
      console.log(`  ${s.active ? "[active]  " : "[inactive]"} ${s.name} <${s.email}>`);
    }

    const from = (process.env.MAIL_FROM ?? "").match(/<(.+)>/)?.[1] ?? process.env.MAIL_FROM ?? "";
    if (from) {
      const match = senders.find(
        (s: { email: string }) => s.email.toLowerCase() === from.toLowerCase()
      );
      console.log(
        match
          ? `\nMAIL_FROM (${from}) is verified — good.`
          : `\nWARNING: MAIL_FROM (${from}) is NOT in the verified list above.\nSending will fail until it is verified, or change MAIL_FROM to one that is.`
      );
    }
  }

  console.log(`\nIf the key is valid, put it in backend/.env as:\n  BREVO_API_KEY=${key}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
