import { Schema, model, models, Document } from "mongoose";

export const INSTITUTION_TYPES = [
  "School", "CBSE School", "ICSE School", "State Board School",
  "International School", "Pre-School", "Coaching Institute",
  "College", "University", "Other",
] as const;

export const BOARDS = [
  "CBSE", "ICSE / CISCE", "State Board", "IB", "IGCSE / Cambridge", "NIOS", "Other",
] as const;

export type VerificationStatus = "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED";

export interface IInstitution extends Document {
  ownerClerkUserId: string;

  name: string;
  institutionType: string;
  board: string;
  establishedYear: string;

  officialEmail: string;
  contactPerson: string;
  contactPhone: string;
  website: string;

  addressLine: string;
  city: string;
  state: string;
  pincode: string;

  description: string;


  verificationStatus: VerificationStatus;
  verifiedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IInstitution>(
  {
    // Ownership key. Every read and write is scoped by this — it is taken from
    // the verified Clerk token, never from a request body or URL parameter.
    ownerClerkUserId: { type: String, required: true, unique: true, index: true },

    name: { type: String, required: true, trim: true },
    institutionType: { type: String, default: "", trim: true },
    board: { type: String, default: "", trim: true },
    establishedYear: { type: String, default: "", trim: true },

    officialEmail: { type: String, default: "", lowercase: true, trim: true },
    contactPerson: { type: String, default: "", trim: true },
    contactPhone: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },

    addressLine: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },

    description: { type: String, default: "", trim: true },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Institution || model<IInstitution>("Institution", schema);
