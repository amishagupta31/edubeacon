import { Schema, model, models, Document } from "mongoose";
 
export type AccountType = "TEACHER" | "SCHOOL_ADMIN";

export const ACCOUNT_TYPES: AccountType[] = ["TEACHER", "SCHOOL_ADMIN"];

export interface IRecruitmentProfile extends Document {
  clerkUserId: string;
  email: string;
  accountType: AccountType;

  // Teacher fields
  fullName: string;
  phone: string;

  // School fields
  institutionName: string;
  contactPerson: string;

  acceptedTermsAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IRecruitmentProfile>(
  {
    // One profile per Clerk identity. The unique index is the duplicate-account guard.
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    accountType: { type: String, required: true, enum: ACCOUNT_TYPES },

    fullName: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },

    institutionName: { type: String, default: "", trim: true },
    contactPerson: { type: String, default: "", trim: true },

    acceptedTermsAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.RecruitmentProfile ||
  model<IRecruitmentProfile>("RecruitmentProfile", schema);
