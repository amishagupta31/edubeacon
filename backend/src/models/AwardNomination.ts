import { Schema, model, models, Document } from "mongoose";

export interface IAwardNomination extends Document {
  category: string;
  nomineeName: string;
  nomineeOrg: string;
  reason: string;
  nominatorName: string;
  nominatorEmail: string;
  status: "submitted" | "shortlisted" | "winner" | "not-selected";
}

const schema = new Schema<IAwardNomination>(
  {
    category: { type: String, required: true },
    nomineeName: { type: String, required: true },
    nomineeOrg: String,
    reason: String,
    nominatorName: String,
    nominatorEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["submitted", "shortlisted", "winner", "not-selected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default models.AwardNomination || model<IAwardNomination>("AwardNomination", schema);
