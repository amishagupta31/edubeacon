import { Router, Request, Response } from "express";
import AwardNomination from "../models/AwardNomination";
import { sendMail } from "../lib/mailer";
import { awardEmail } from "../lib/emailTemplates";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { category, nomineeName, nominatorEmail } = req.body;
  if (!category || !nomineeName || !nominatorEmail) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const nomination = await AwardNomination.create(req.body);
    res.json({ success: true, id: nomination._id });

    const { subject, html, text } = awardEmail(nomination.toObject());
    void sendMail({ to: nomination.nominatorEmail, subject, html, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save award nomination" });
  }
});

export default router;
