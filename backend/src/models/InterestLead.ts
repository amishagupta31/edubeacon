import { Schema, model, models, Document } from "mongoose";

export interface IInterestLead extends Document {
  name: string;
  school: string;
  designation: string;
  phone: string;
  email: string;
  requirement: string;
  vendorName: string;
  status: "new" | "contacted" | "closed";
}

const schema = new Schema<IInterestLead>(
  {
    name: { type: String, required: true },
    school: String,
    designation: String,
    phone: String,
    email: { type: String, required: true },
    requirement: String,
    vendorName: String,
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default models.InterestLead || model<IInterestLead>("InterestLead", schema);
