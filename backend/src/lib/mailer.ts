import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;
let initialised = false;

function getTransporter(): Transporter | null {
  if (initialised) return transporter;
  initialised = true;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Status is reported once at startup by reportMailStatus(), so stay quiet here.
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,   // 465 = implicit TLS; 587 upgrades via STARTTLS
    auth: { user, pass },
  });

  return transporter;
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// ANSI colours - disabled when the output is piped to a file or CI
const tty = process.stdout.isTTY;
const green = (s: string) => (tty ? `\x1b[32m${s}\x1b[0m` : s);
const red = (s: string) => (tty ? `\x1b[31m${s}\x1b[0m` : s);
const yellow = (s: string) => (tty ? `\x1b[33m${s}\x1b[0m` : s);
const dim = (s: string) => (tty ? `\x1b[2m${s}\x1b[0m` : s);

const trim = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}...` : s);

/** Turns a nodemailer error into one readable line instead of a stack trace. */
function reason(err: unknown): string {
  const e = err as { code?: string; responseCode?: number; response?: string; message?: string };

  if (e?.responseCode === 535 || e?.code === "EAUTH") {
    return "authentication rejected - check SMTP_USER / SMTP_PASS";
  }
  if (e?.code === "ECONNECTION" || e?.code === "ETIMEDOUT" || e?.code === "ESOCKET") {
    return "could not reach the SMTP server - check SMTP_HOST / SMTP_PORT or your network";
  }
  if (e?.responseCode === 550 || e?.responseCode === 553) {
    return `sender rejected - ${e.response ?? "MAIL_FROM is not an authorised sender"}`;
  }
  if (e?.responseCode === 554) {
    return `message rejected - ${e.response ?? "flagged as spam"}`;
  }
  return e?.response ?? e?.message ?? String(err);
}

/**
 * Sends an email. Never throws - a failed send must not fail the registration
 * it is confirming. Returns whether the message was actually handed to SMTP.
 */
export async function sendMail({ to, subject, html, text }: MailInput): Promise<boolean> {
  const tx = getTransporter();

  const label = `${to}  ${dim("|")}  ${trim(subject, 52)}`;

  if (!tx) {
    console.log(`${yellow("[mail] SKIPPED")}  ${label}`);
    console.log(`${dim("       reason: SMTP not configured - set SMTP_HOST / SMTP_USER / SMTP_PASS in .env")}`);
    return false;
  }

  const started = Date.now();
  try {
    const info = await tx.sendMail({
      from: process.env.MAIL_FROM || "EduBeacon <noreply@edubeacon.com>",
      replyTo: process.env.MAIL_REPLY_TO || undefined,
      to,
      subject,
      text,
      html,
    });
    console.log(`${green("[mail] SENT   ")}  ${label}  ${dim(`(${Date.now() - started}ms)`)}`);
    return true;
  } catch (err) {
    console.error(`${red("[mail] FAILED ")}  ${label}`);
    console.error(`${dim("       reason:")} ${red(reason(err))}`);
    return false;
  }
}

/** Verifies SMTP credentials. Used by the test script. */
export async function verifyMailer(): Promise<boolean> {
  const tx = getTransporter();
  if (!tx) return false;
  try {
    await tx.verify();
    return true;
  } catch (err) {
    console.error(`${red("[mail] verify failed:")} ${reason(err)}`);
    return false;
  }
}

/** Logged once at startup so mail problems surface immediately, not on first send. */
export async function reportMailStatus(): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    const missing = [
      !host && "SMTP_HOST",
      !user && "SMTP_USER",
      !pass && "SMTP_PASS",
    ].filter(Boolean).join(", ");
    console.log(`${yellow("[mail] DISABLED")} - missing ${missing} in .env (emails will be skipped)`);
    return;
  }

  const ok = await verifyMailer();
  console.log(
    ok
      ? `${green("[mail] READY")} - ${user} via ${host}`
      : `${red("[mail] NOT WORKING")} - ${user} via ${host} (registrations will still save)`
  );
}
