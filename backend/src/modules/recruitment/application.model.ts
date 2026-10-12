import { Schema, model, models, Document, Types } from "mongoose";
import type { ScreeningResult } from "./screening";

export const APPLICATION_STATUSES = ["active", "rejected", "withdrawn", "offered"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  // Snapshots — copied at apply time so history survives job edits/deletion
  jobTitle: string;
  institutionName: string;
  city: string;
  state: string;
  board: string;
  ownerClerkUserId: string; // school's Clerk ID
  teacherClerkUserId: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  resumeUrl: string;
  coverNote: string;
  // Stage tracking — mirrors job.stages array
  stages: string[];        // snapshot of job.stages at apply time
  stageIndex: number;      // 0-based current position
  currentStage: string;    // convenience denorm
  status: ApplicationStatus;
  aiScore: number | null;
  screening: ScreeningResult | null;
  schoolNotes: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IApplication>(
  {
    jobId:              { type: Schema.Types.ObjectId, ref: "Job", required: true },
    jobTitle:           { type: String, required: true },
    institutionName:    { type: String, required: true },
    city:               { type: String, default: "" },
    state:              { type: String, default: "" },
    board:              { type: String, default: "" },
    ownerClerkUserId:   { type: String, required: true },
    teacherClerkUserId: { type: String, required: true },
    teacherName:        { type: String, required: true },
    teacherEmail:       { type: String, required: true },
    teacherPhone:       { type: String, default: "" },
    resumeUrl:          { type: String, default: "" },
    coverNote:          { type: String, default: "" },
    stages:             { type: [String], default: [] },
    stageIndex:         { type: Number, default: 0 },
    currentStage:       { type: String, default: "" },
    status:             { type: String, enum: APPLICATION_STATUSES, default: "active" },
    aiScore:            { type: Number, default: null },
    screening:          { type: Schema.Types.Mixed, default: null },
    schoolNotes:        { type: String, default: "" },
    appliedAt:          { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate applications from the same teacher to the same job
schema.index({ jobId: 1, teacherClerkUserId: 1 }, { unique: true });
// School fetches all applicants for a job
schema.index({ jobId: 1, stageIndex: 1, status: 1 });
// Teacher fetches their own applications
schema.index({ teacherClerkUserId: 1, appliedAt: -1 });

export default models.Application || model<IApplication>("Application", schema);
