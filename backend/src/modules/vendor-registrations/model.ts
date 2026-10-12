import { Schema, model, models, Document } from "mongoose";

export interface IVendorRegistration extends Document {
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  companyDescription: string;
  productDescription: string;
  status: "pending" | "approved" | "rejected";
}

const schema = new Schema<IVendorRegistration>(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    designation: String,
    email: { type: String, required: true },
    phone: String,
    website: String,
    category: String,
    companyDescription: String,
    productDescription: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default models.VendorRegistration ||
  model<IVendorRegistration>("VendorRegistration", schema);
