import { Schema, model, models, Document, Types } from "mongoose";

export interface INegotiationMessage extends Document {
  offerId: Types.ObjectId;
  applicationId: Types.ObjectId;
  senderClerkUserId: string;
  senderName: string;
  isSchool: boolean;
  body: string;
  createdAt: Date;
}

const schema = new Schema<INegotiationMessage>(
  {
    offerId:            { type: Schema.Types.ObjectId, ref: "Offer", required: true },
    applicationId:      { type: Schema.Types.ObjectId, ref: "Application", required: true },
    senderClerkUserId:  { type: String, required: true },
    senderName:         { type: String, required: true },
    isSchool:           { type: Boolean, required: true },
    body:               { type: String, required: true },
  },
  { timestamps: true }
);

schema.index({ offerId: 1, createdAt: 1 });

export default models.NegotiationMessage || model<INegotiationMessage>("NegotiationMessage", schema);
