import { Schema, model, models, Document } from "mongoose";

export type AccountType = "TEACHER" | "SCHOOL_ADMIN";
export const ACCOUNT_TYPES: AccountType[] = ["TEACHER", "SCHOOL_ADMIN"];

export interface IQualification {
  degree: string;
  institution: string;
  year: string;
}

export interface IExperience {
  school: string;
  role: string;
  from: string;
  to: string;
}

export interface IRecruitmentProfile extends Document {
  clerkUserId: string;
  email: string;
  accountType: AccountType;

  // Teacher identity
  fullName: string;
  phone: string;

  // Teacher CV fields
  resumeUrl: string;
  subjectSpecialisations: string[];
  qualifications: IQualification[];
  experience: IExperience[];
  ctetStatus: "cleared" | "not_cleared" | "not_applicable" | "";
  stetStatus: string;
  currentCTC: number | null;
  expectedCTC: number | null;
  preferredCities: string[];
  availableFrom: Date | null;
  bio: string;

  // School fields
  institutionName: string;
  contactPerson: string;

  acceptedTermsAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const qualSchema = new Schema<IQualification>(
  { degree: String, institution: String, year: String },
  { _id: false }
);

const expSchema = new Schema<IExperience>(
  { school: String, role: String, from: String, to: String },
  { _id: false }
);

const schema = new Schema<IRecruitmentProfile>(
  {
    clerkUserId:           { type: String, required: true, unique: true, index: true },
    email:                 { type: String, required: true, lowercase: true, trim: true, index: true },
    accountType:           { type: String, required: true, enum: ACCOUNT_TYPES },

    fullName:              { type: String, default: "", trim: true },
    phone:                 { type: String, default: "", trim: true },

    // CV
    resumeUrl:             { type: String, default: "" },
    subjectSpecialisations:{ type: [String], default: [] },
    qualifications:        { type: [qualSchema], default: [] },
    experience:            { type: [expSchema], default: [] },
    ctetStatus:            { type: String, enum: ["cleared", "not_cleared", "not_applicable", ""], default: "" },
    stetStatus:            { type: String, default: "" },
    currentCTC:            { type: Number, default: null },
    expectedCTC:           { type: Number, default: null },
    preferredCities:       { type: [String], default: [] },
    availableFrom:         { type: Date, default: null },
    bio:                   { type: String, default: "" },

    // School
    institutionName:       { type: String, default: "", trim: true },
    contactPerson:         { type: String, default: "", trim: true },

    acceptedTermsAt:       { type: Date, default: null },
    active:                { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.RecruitmentProfile ||
  model<IRecruitmentProfile>("RecruitmentProfile", schema);
