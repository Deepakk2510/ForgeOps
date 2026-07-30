import { Schema, model } from "mongoose";

const branchSchema = new Schema({
  repository: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
  name: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
  isCurrent: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

branchSchema.index({ repository: 1, name: 1 }, { unique: true });
export const Branch = model("Branch", branchSchema);
