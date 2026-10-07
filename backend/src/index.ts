import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/mongodb";
import { reportMailStatus } from "./lib/mailer";

import webhookRouter from "./modules/users/routes";
import conferenceRouter from "./modules/conference-registrations/routes";
import vendorRouter from "./modules/vendor-registrations/routes";
import interestRouter from "./modules/interest-leads/routes";
import awardRouter from "./modules/award-nominations/routes";
import adminRouter from "./routes/admin";
import adminAuthRouter from "./modules/admins/routes";
import settingsRouter from "./modules/site-settings/routes";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: (process.env.FRONTEND_URL ?? "http://localhost:3000")
      .split(",")
      .map((u) => u.trim()),
    credentials: true,
  })
);

// Clerk webhooks need the raw body to verify the svix signature
app.use("/api/webhooks", express.raw({ type: "application/json" }), (req, _res, next) => {
  if (Buffer.isBuffer(req.body)) req.body = JSON.parse(req.body.toString());
  next();
});

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Clerk → MongoDB sync
app.use("/api/webhooks", webhookRouter);

// Registration routes
app.use("/api/registrations/conference", conferenceRouter);
app.use("/api/registrations/vendor", vendorRouter);
app.use("/api/registrations/interest", interestRouter);
app.use("/api/registrations/award", awardRouter);

// Site settings — public reads, admin-only writes
app.use("/api/settings", settingsRouter);

// Admin email + password login (credentials live in MongoDB)
app.use("/api/admin/auth", adminAuthRouter);

// Admin data — accepts the admin JWT or a Clerk session token
app.use("/api/admin/registrations", adminRouter);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`EduBeacon backend running on http://localhost:${PORT}`);
  });
  await reportMailStatus();
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
