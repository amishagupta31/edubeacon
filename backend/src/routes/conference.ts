import { Router, Response } from "express";
import { requireAuth, AuthedRequest } from "../middleware/clerkAuth";
import ConferenceRegistration from "../models/ConferenceRegistration";

const router = Router();

// POST /api/registrations/conference — create or update
router.post("/", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const registration = await ConferenceRegistration.findOneAndUpdate(
      { clerkUserId: req.userId },
      { ...req.body, clerkUserId: req.userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, id: registration._id });
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
