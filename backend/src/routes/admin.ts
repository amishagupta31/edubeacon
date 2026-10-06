import { Router, Response } from "express";
import { requireAdmin, AuthedRequest } from "../middleware/clerkAuth";
import ConferenceRegistration from "../modules/conference-registrations/model";
import VendorRegistration from "../modules/vendor-registrations/model";
import InterestLead from "../modules/interest-leads/model";
import AwardNomination from "../modules/award-nominations/model";
import { Model, Document } from "mongoose";

const router = Router();

// All admin routes require admin auth
router.use(requireAdmin);

// GET /api/admin/registrations?type=conference|vendor|interest|award
// GET /api/admin/registrations  → counts only
router.get("/", async (req: AuthedRequest, res: Response) => {
  const type = req.query.type as string | undefined;

  try {
    if (type === "conference") {
      const data = await ConferenceRegistration.find().sort({ createdAt: -1 }).lean();
      res.json(data);
      return;
    }
    if (type === "vendor") {
      const data = await VendorRegistration.find().sort({ createdAt: -1 }).lean();
      res.json(data);
      return;
    }
    if (type === "interest") {
      const data = await InterestLead.find().sort({ createdAt: -1 }).lean();
      res.json(data);
      return;
    }
    if (type === "award") {
      const data = await AwardNomination.find().sort({ createdAt: -1 }).lean();
      res.json(data);
      return;
    }

    // No type → return counts dashboard
    const [conference, vendor, interest, award] = await Promise.all([
      ConferenceRegistration.countDocuments(),
      VendorRegistration.countDocuments(),
      InterestLead.countDocuments(),
      AwardNomination.countDocuments(),
    ]);
    res.json({ conference, vendor, interest, award });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// PATCH /api/admin/registrations — update status
router.patch("/", async (req: AuthedRequest, res: Response) => {
  const { type, id, status } = req.body as { type: string; id: string; status: string };

  const modelMap: Record<string, Model<Document>> = {
    conference: ConferenceRegistration as Model<Document>,
    vendor: VendorRegistration as Model<Document>,
    interest: InterestLead as Model<Document>,
    award: AwardNomination as Model<Document>,
  };

  const Model = modelMap[type];
  if (!Model) {
    res.status(400).json({ error: "Invalid type" });
    return;
  }

  try {
    await Model.findByIdAndUpdate(id, { status });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
