import { Router, Request, Response } from "express";
import InterestLead from "../models/InterestLead";
import { sendMail } from "../lib/mailer";
import { interestEmail } from "../lib/emailTemplates";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const lead = await InterestLead.create(req.body);
    res.json({ success: true, id: lead._id });

    const { subject, html, text } = interestEmail(lead.toObject());
    void sendMail({ to: lead.email, subject, html, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save interest lead" });
  }
});

export default router;
