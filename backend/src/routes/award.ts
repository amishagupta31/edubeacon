import { Router, Request, Response } from "express";
import AwardNomination from "../models/AwardNomination";

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save award nomination" });
  }
});

export default router;
