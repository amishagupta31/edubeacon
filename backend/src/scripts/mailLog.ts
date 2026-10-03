import "dotenv/config";

// Usage: npm run mail:log -- "<xkeysib-api-key>" [recipient]
// Asks Brevo what actually happened to recently sent messages.
const API = "https://api.brevo.com/v3";

async function get(path: string, key: string) {
  const res = await fetch(`${API}${path}`, { headers: { "api-key": key } });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body } as {
    ok: boolean; status: number; body: Record<string, unknown>;
  };
}

async function main() {
  const key = (process.argv[2] ?? process.env.BREVO_API_KEY ?? "").trim();
  const recipient = (process.argv[3] ?? "").trim();

  if (!key) {
    console.error('Usage: npm run mail:log -- "<xkeysib-...>" [recipient]');
    process.exit(1);
  }

  // ── 1. Key valid? ──
  const acct = await get("/account", key);
  if (!acct.ok) {
    console.error(`API key rejected (HTTP ${acct.status})`);
    console.error(JSON.stringify(acct.body));
    process.exit(1);
  }
  console.log(`Account: ${acct.body.email}\n`);

  // ── 2. Is MAIL_FROM a verified sender? ──
  const from =
    (process.env.MAIL_FROM ?? "").match(/<(.+)>/)?.[1] ??
    process.env.MAIL_FROM ?? "";

  const senders = await get("/senders", key);
  if (senders.ok) {
    const list = (senders.body.senders ?? []) as { name: string; email: string; active: boolean }[];
    console.log(`VERIFIED SENDERS (${list.length})`);
    if (!list.length) console.log("  (none)");
    for (const s of list) {
      console.log(`  ${s.active ? "active  " : "INACTIVE"}  ${s.name} <${s.email}>`);
    }

    const match = list.find((s) => s.email.toLowerCase() === from.toLowerCase());
    console.log();
    if (match && match.active) {
      console.log(`MAIL_FROM (${from}) is verified and active.`);
    } else if (match) {
      console.log(`PROBLEM: MAIL_FROM (${from}) exists but is NOT ACTIVE.`);
      console.log(`  Confirm it at https://app.brevo.com/senders/list`);
    } else {
      console.log(`PROBLEM: MAIL_FROM (${from}) is NOT a verified sender.`);
      console.log(`  Brevo accepts the message over SMTP, then silently drops it.`);
      console.log(`  Fix: add and verify it at https://app.brevo.com/senders/list`);
      console.log(`  Or:  set MAIL_FROM in .env to one of the verified addresses above.`);
    }
  }

  // ── 3. What happened to recent messages? ──
  const q = new URLSearchParams({ limit: "20", sort: "desc" });
  if (recipient) q.set("email", recipient);

  const events = await get(`/smtp/statistics/events?${q}`, key);
  console.log(`\nRECENT EVENTS${recipient ? ` for ${recipient}` : ""}`);

  if (!events.ok) {
    console.log(`  could not read events (HTTP ${events.status})`);
    console.log(`  ${JSON.stringify(events.body)}`);
  } else {
    const list = (events.body.events ?? []) as {
      email: string; event: string; date: string; subject?: string; reason?: string;
    }[];

    if (!list.length) {
      console.log("  No events recorded.");
      console.log("  Brevo never received these messages — check the sender problem above,");
      console.log("  or confirm the backend actually reached Brevo (look for [mail] SENT).");
    }

    for (const e of list) {
      const when = new Date(e.date).toLocaleString();
      console.log(`  ${e.event.toUpperCase().padEnd(14)} ${when}  ${e.email}`);
      if (e.reason) console.log(`  ${"".padEnd(14)} reason: ${e.reason}`);
    }

    const bad = list.filter((e) =>
      ["blocked", "hardBounce", "softBounce", "spam", "invalid", "deferred", "error"].includes(e.event)
    );
    if (bad.length) {
      console.log(`\n${bad.length} message(s) did not deliver. The reasons above explain why.`);
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
