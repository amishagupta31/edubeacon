import { Schema, model, models, Document } from "mongoose";

export interface ISiteSetting extends Document {
  key: string;
  value: unknown;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.SiteSetting || model<ISiteSetting>("SiteSetting", schema);

// Shown until an admin saves their own text.
export const DEFAULT_TICKER = {
  enabled: true,
  label: "Live",
  items: [
    "Principal Conclave on AI in School Education",
    "25th October 2026  ·  9:00 AM onwards",
    "Shivalik University, Dehradun",
    "Organised by Edubeacon & India Genius Foundation",
    "Registrations Now Open",
  ],
};
