import "dotenv/config";
import fs from "fs";
import path from "path";
import { conferenceEmail, vendorEmail, interestEmail, awardEmail } from "../lib/emailTemplates";

const OUT = path.resolve(process.cwd(), "email-previews");

const samples = {
  conference: conferenceEmail({
    name: "Anjali Verma", email: "anjali@example.com", role: "Principal",
    school: "Delhi Public School", city: "Dehradun", state: "Uttarakhand",
    phone: "9876543210", experience: "10 – 15 Years",
    aiTools: ["ChatGPT", "Gemini"],
    servicesExplored: ["AI Labs", "Robotics", "STEM Labs"],
  }),
  vendor: vendorEmail({
    companyName: "FutureLearn Technologies", contactPerson: "Rahul Mehta",
    designation: "Founder", email: "rahul@example.com", phone: "9876543210",
    category: "AI Labs", website: "https://futurelearn.example.com",
  }),
  interest: interestEmail({
    name: "Priya Sharma", school: "St. Xavier's School", designation: "Principal",
    email: "priya@example.com", phone: "9876543210",
    vendorName: "FutureLearn Technologies",
    requirement: "Looking to set up an AI lab for grades 8–12.",
  }),
  award: awardEmail({
    category: "Best Innovation in Teaching", nomineeName: "Dr. Suresh Kumar",
    nomineeOrg: "Modern School", nominatorName: "Anjali Verma",
    nominatorEmail: "anjali@example.com",
  }),
};

fs.mkdirSync(OUT, { recursive: true });

for (const [key, mail] of Object.entries(samples)) {
  const file = path.join(OUT, `${key}.html`);
  fs.writeFileSync(file, mail.html, "utf8");
  console.log(`${key.padEnd(11)} → ${file}`);
  console.log(`${"".padEnd(11)}   subject: ${mail.subject}`);
}

console.log(`\nOpen any file above in a browser to preview.`);
