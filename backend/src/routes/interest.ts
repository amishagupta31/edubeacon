import { Router, Request, Response } from "express";
import InterestLead from "../models/InterestLead";

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save interest lead" });
  }
});

export default router;
