import { Router, Request, Response } from "express";
import { Webhook } from "svix";
import User from "./model";

const router = Router();

// POST /api/webhooks/clerk
// Clerk calls this on user.created / user.updated / user.deleted
router.post("/clerk", async (req: Request, res: Response) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  const svixId = req.headers["svix-id"] as string;
  const svixTs = req.headers["svix-timestamp"] as string;
  const svixSig = req.headers["svix-signature"] as string;

  if (!svixId || !svixTs || !svixSig) {
    res.status(400).json({ error: "Missing svix headers" });
    return;
  }

  let payload: { type: string; data: Record<string, unknown> };
  try {
    const wh = new Webhook(secret);
    payload = wh.verify(JSON.stringify(req.body), {
      "svix-id": svixId,
      "svix-timestamp": svixTs,
      "svix-signature": svixSig,
    }) as typeof payload;
  } catch {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  const { type, data } = payload;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  try {
    if (type === "user.created" || type === "user.updated") {
      const email = (
        (data.email_addresses as { email_address: string }[])?.[0]?.email_address ?? ""
      ).toLowerCase();

      await User.findOneAndUpdate(
        { clerkId: data.id as string },
        {
          clerkId: data.id as string,
          email,
          firstName: (data.first_name as string) ?? "",
          lastName: (data.last_name as string) ?? "",
          imageUrl: (data.image_url as string) ?? "",
          isAdmin: adminEmails.includes(email),
        },
        { upsert: true, new: true }
      );
    }

    if (type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: data.id as string });
    }
  } catch (err) {
    console.error("Webhook DB sync error:", err);
    res.status(500).json({ error: "DB sync failed" });
    return;
  }

  res.json({ received: true });
});

export default router;
