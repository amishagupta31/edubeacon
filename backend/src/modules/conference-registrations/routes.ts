import { Router, Response } from "express";
import { requireAuth, AuthedRequest } from "../../middleware/clerkAuth";
import ConferenceRegistration from "./model";
import { sendMail } from "../../lib/mailer";
import { conferenceEmail } from "../../lib/emailTemplates";

const router = Router();

// POST /api/registrations/conference — create or update
router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const existing = await ConferenceRegistration.findOne({ clerkUserId: req.userId });

    const registration = await ConferenceRegistration.findOneAndUpdate(
      { clerkUserId: req.userId },
      { ...req.body, clerkUserId: req.userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, id: registration._id });

    // Confirmation email only on first registration, not on edits.
    // Deliberately not awaited — a mail failure must not fail the registration.
    if (!existing && registration.email) {
      const { subject, html, text } = conferenceEmail(registration.toObject());
      void sendMail({ to: registration.email, subject, html, text });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// GET /api/registrations/conference — fetch own registration
router.get("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const registration = await ConferenceRegistration.findOne({ clerkUserId: req.userId });
    res.json(registration ?? null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch registration" });
  }
});

export default router;
