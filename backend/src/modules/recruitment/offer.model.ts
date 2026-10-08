import { Schema, model, models, Document, Types } from "mongoose";

export const OFFER_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "sent",
  "viewed",
  "accepted",
  "declined",
] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export interface ISalaryRow {
  label: string;
  amount: number;
}

export interface IOffer extends Document {
  applicationId: Types.ObjectId;
  jobId: Types.ObjectId;
  // Snapshots
  candidateName: string;
  candidateEmail: string;
  role: string;
  institutionName: string;
  ownerClerkUserId: string; // school
  teacherClerkUserId: string;
  // Letter fields
  template: string;
  joiningDate: Date | null;
  ctc: number;
  probation: string;
  noticePeriod: string;
  offerExpires: string;
  language: string;
  clauses: string[];
  sendVia: { email: boolean; whatsapp: boolean; inApp: boolean };
  salaryRows: ISalaryRow[];
  // Approval
  approvalStatus: { hr: string; principal: string; management: string };
  // Status machine
  status: OfferStatus;
  version: number;
  sentAt: Date | null;
  viewedAt: Date | null;
  acceptedAt: Date | null;
  declinedAt: Date | null;
  declineReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const salaryRowSchema = new Schema<ISalaryRow>(
  { label: String, amount: Number },
  { _id: false }
);

const schema = new Schema<IOffer>(
  {
    applicationId:    { type: Schema.Types.ObjectId, ref: "Application", required: true },
    jobId:            { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidateName:    { type: String, required: true },
    candidateEmail:   { type: String, required: true },
    role:             { type: String, required: true },
    institutionName:  { type: String, required: true },
    ownerClerkUserId: { type: String, required: true },
    teacherClerkUserId: { type: String, required: true },
    template:         { type: String, default: "Teaching — permanent" },
    joiningDate:      { type: Date, default: null },
    ctc:              { type: Number, required: true },
    probation:        { type: String, default: "6 months" },
    noticePeriod:     { type: String, default: "60 days" },
    offerExpires:     { type: String, default: "7 days after sending" },
    language:         { type: String, default: "English" },
    clauses:          { type: [String], default: ["Probation & confirmation", "Child-protection policy", "Leave policy"] },
    sendVia:          { type: { email: Boolean, whatsapp: Boolean, inApp: Boolean }, default: { email: true, whatsapp: true, inApp: true } },
    salaryRows:       { type: [salaryRowSchema], default: [] },
    approvalStatus:   {
      type: { hr: String, principal: String, management: String },
      default: { hr: "Drafting", principal: "Waiting", management: "Waiting" },
    },
    status:           { type: String, enum: OFFER_STATUSES, default: "draft" },
    version:          { type: Number, default: 1 },
    sentAt:           { type: Date, default: null },
    viewedAt:         { type: Date, default: null },
    acceptedAt:       { type: Date, default: null },
    declinedAt:       { type: Date, default: null },
    declineReason:    { type: String, default: "" },
  },
  { timestamps: true }
);

schema.index({ ownerClerkUserId: 1, status: 1, createdAt: -1 });
schema.index({ teacherClerkUserId: 1, status: 1 });
schema.index({ applicationId: 1 }, { unique: true });

export default models.Offer || model<IOffer>("Offer", schema);
