import "dotenv/config";
import { sendMail, verifyMailer } from "../lib/mailer";
import { conferenceEmail, vendorEmail, interestEmail, awardEmail } from "../lib/emailTemplates";

const SAMPLES: Record<string, () => { subject: string; html: string; text: string }> = {
  conference: () =>
    conferenceEmail({
      name: "Anjali Verma", email: "anjali@example.com", role: "Principal",
      school: "Delhi Public School", city: "Dehradun", state: "Uttarakhand",
      phone: "9876543210", experience: "10 – 15 Years",
      aiTools: ["ChatGPT", "Gemini"],
      servicesExplored: ["AI Labs", "Robotics", "STEM Labs"],
    }),
  vendor: () =>
    vendorEmail({
      companyName: "FutureLearn Technologies", contactPerson: "Rahul Mehta",
      designation: "Founder", email: "rahul@example.com", phone: "9876543210",
      category: "AI Labs", website: "https://futurelearn.example.com",
    }),
  interest: () =>
    interestEmail({
      name: "Priya Sharma", school: "St. Xavier's School", designation: "Principal",
      email: "priya@example.com", phone: "9876543210",
      vendorName: "FutureLearn Technologies",
      requirement: "Looking to set up an AI lab for grades 8–12.",
    }),
  award: () =>
    awardEmail({
      category: "Best Innovation in Teaching", nomineeName: "Dr. Suresh Kumar",
      nomineeOrg: "Modern School", nominatorName: "Anjali Verma",
      nominatorEmail: "anjali@example.com",
    }),
};

// Usage: npm run test:email -- <to-address> [conference|vendor|interest|award|all]
async function main() {
  const to = (process.argv[2] ?? "").trim();
  const which = (process.argv[3] ?? "conference").toLowerCase();

  if (!to || !to.includes("@")) {
    console.error("Usage: npm run test:email -- <to-address> [conference|vendor|interest|award|all]");
    process.exit(1);
  }

  console.log("Verifying SMTP connection…");
  const ok = await verifyMailer();
  if (!ok) {
    console.error("SMTP verification failed — check SMTP_HOST / SMTP_USER / SMTP_PASS in .env");
    process.exit(1);
  }
  console.log("SMTP connection OK.\n");

  const keys = which === "all" ? Object.keys(SAMPLES) : [which];

  for (const key of keys) {
    const build = SAMPLES[key];
    if (!build) {
      console.error(`Unknown template "${key}". Options: ${Object.keys(SAMPLES).join(", ")}, all`);
      process.exit(1);
    }
    const { subject, html, text } = build();
    const sent = await sendMail({ to, subject, html, text });
    console.log(`${sent ? "SENT" : "FAILED"}  [${key}]  ${subject}`);
  }

  console.log(`\nDone. Check the inbox for ${to} (and the spam folder).`);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
