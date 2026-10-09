import { Router, Request, Response } from "express";
import SiteSetting, { DEFAULT_TICKER } from "../models/SiteSetting";
import { requireAdmin, AuthedRequest } from "../middleware/clerkAuth";

const router = Router();
const TICKER_KEY = "ticker";

const MAX_ITEMS = 12;
const MAX_LEN = 160;

interface Ticker {
  enabled: boolean;
  label: string;
  items: string[];
}

/** Coerces whatever the client sent into a safe, stored shape. */
function sanitise(input: unknown): Ticker | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;

  if (!Array.isArray(raw.items)) return null;

  const items = raw.items
    .map((i) => String(i ?? "").trim().slice(0, MAX_LEN))
    .filter(Boolean)
    .slice(0, MAX_ITEMS);

  if (!items.length) return null;

  return {
    enabled: raw.enabled !== false,
    label: String(raw.label ?? "Live").trim().slice(0, 24) || "Live",
    items,
  };
}

// GET /api/settings/ticker — public, read by the site header strip
router.get("/ticker", async (_req: Request, res: Response) => {
  try {
    const doc = await SiteSetting.findOne({ key: TICKER_KEY });
    res.json(doc?.value ?? DEFAULT_TICKER);
  } catch (err) {
    console.error("Ticker read failed:", err);
    res.json(DEFAULT_TICKER); // never break the site over a settings read
  }
});

// PUT /api/settings/ticker — admin only
router.put("/ticker", requireAdmin, async (req: AuthedRequest, res: Response) => {
  const value = sanitise(req.body);
  if (!value) {
    res.status(400).json({ error: "Provide at least one non-empty ticker item." });
    return;
  }

  try {
    const doc = await SiteSetting.findOneAndUpdate(
      { key: TICKER_KEY },
      { key: TICKER_KEY, value, updatedBy: req.userEmail ?? "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, value: doc.value, updatedAt: doc.updatedAt });
  } catch (err) {
    console.error("Ticker save failed:", err);
    res.status(500).json({ error: "Could not save ticker" });
  }
});

// POST /api/settings/ticker/reset — admin only, restores the built-in text
router.post("/ticker/reset", requireAdmin, async (req: AuthedRequest, res: Response) => {
  try {
    const doc = await SiteSetting.findOneAndUpdate(
      { key: TICKER_KEY },
      { key: TICKER_KEY, value: DEFAULT_TICKER, updatedBy: req.userEmail ?? "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, value: doc.value });
  } catch (err) {
    console.error("Ticker reset failed:", err);
    res.status(500).json({ error: "Could not reset ticker" });
  }
});

export default router;
