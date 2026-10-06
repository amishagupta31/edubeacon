import { Router, Request, Response } from "express";
import VendorRegistration from "./model";
import { sendMail } from "../../lib/mailer";
import { vendorEmail } from "../../lib/emailTemplates";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { companyName, contactPerson, email } = req.body;
  if (!companyName || !contactPerson || !email) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const registration = await VendorRegistration.create(req.body);
    res.json({ success: true, id: registration._id });

    const { subject, html, text } = vendorEmail(registration.toObject());
    void sendMail({ to: registration.email, subject, html, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save vendor registration" });
  }
});

export default router;
