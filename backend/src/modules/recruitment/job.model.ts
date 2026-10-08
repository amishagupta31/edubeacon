import { Schema, model, models, Document, Types } from "mongoose";

export const ROLE_TYPES = ["Teaching", "Non-teaching", "Administrative", "Leadership"] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time, permanent",
  "Full-time, contract",
  "Part-time",
  "Visiting / guest faculty",
  "Internship",
] as const;

/** DRAFT is school-private. Only PUBLISHED is ever visible to a teacher. */
export const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export type Screening = "hard" | "scored";

export interface IJobRequirement {
  text: string;
  screening: Screening;
}

export interface IJob extends Document {
  /** Ownership key, taken from the verified Clerk token — never from a body or URL. */
  ownerClerkUserId: string;
  institutionId: Types.ObjectId | null;

  // Snapshot of the institution as it was when the job was written. Kept on the
  // job so the board can list and filter without joining, and so a later rename
  // does not silently rewrite history on live postings.
  institutionName: string;
  city: string;
  state: string;

  title: string;
  roleType: string;
  board: string;
  classes: string;
  employment: string;
  openings: number;
  description: string;

  requirements: IJobRequirement[];
  stages: string[];
  channels: { portal: boolean; careers: boolean; whatsapp: boolean };

  deadline: Date | null;

  status: JobStatus;
  publishedAt: Date | null;
  closedAt: Date | null;

  applicantCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const requirementSchema = new Schema<IJobRequirement>(
  {
    text: { type: String, required: true, trim: true },
    screening: { type: String, enum: ["hard", "scored"], default: "scored" },
  },
  { _id: false }
);

const schema = new Schema<IJob>(
  {
    ownerClerkUserId: { type: String, required: true, index: true },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", default: null },

    institutionName: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },

    title: { type: String, required: true, trim: true },
    roleType: { type: String, default: "Teaching", trim: true },
    board: { type: String, default: "", trim: true },
    classes: { type: String, default: "", trim: true },
    employment: { type: String, default: "", trim: true },
    openings: { type: Number, default: 1, min: 1, max: 999 },
    description: { type: String, default: "", trim: true },

    requirements: { type: [requirementSchema], default: [] },
    stages: { type: [String], default: [] },
    channels: {
      portal: { type: Boolean, default: true },
      careers: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },

    deadline: { type: Date, default: null },

    status: { type: String, enum: JOB_STATUSES, default: "DRAFT", index: true },
    publishedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },

    applicantCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// The teacher board: filter by status, newest published first.
schema.index({ status: 1, publishedAt: -1 });
// A school listing its own jobs, newest first.
schema.index({ ownerClerkUserId: 1, createdAt: -1 });

export default models.Job || model<IJob>("Job", schema);
