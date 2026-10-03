import { Schema, model, models, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  name: string;
  passwordHash: string;
  active: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    // bcrypt hash — never the raw password. `select: false` keeps it out of
    // every query result unless explicitly asked for with .select("+passwordHash")
    passwordHash: { type: String, default: "", select: false },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Admin || model<IAdmin>("Admin", schema);
