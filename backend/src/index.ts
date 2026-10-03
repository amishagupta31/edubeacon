import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/mongodb";

import webhookRouter from "./routes/webhooks";
import conferenceRouter from "./routes/conference";
import vendorRouter from "./routes/vendor";
import interestRouter from "./routes/interest";
import awardRouter from "./routes/award";
import adminRouter from "./routes/admin";

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

// Admin (Clerk token + ADMIN_EMAILS check)
app.use("/api/admin/registrations", adminRouter);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`EduBeacon backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
