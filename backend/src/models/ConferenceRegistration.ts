import { Schema, model, models, Document } from "mongoose";

export interface IConferenceRegistration extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  role: string;
  school: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  association: string;
  experience: string;
  classes: string;
  subjects: string;
  aiTools: string[];
  servicesExplored: string[];
  status: "pending" | "confirmed" | "cancelled";
}

const schema = new Schema<IConferenceRegistration>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: String,
    school: String,
    address: String,
    city: String,
    state: String,
    phone: String,
    whatsapp: String,
    association: String,
    experience: String,
    classes: String,
    subjects: String,
    aiTools: [String],
    servicesExplored: [String],
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default models.ConferenceRegistration ||
  model<IConferenceRegistration>("ConferenceRegistration", schema);
