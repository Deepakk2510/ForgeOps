import { Schema, model } from "mongoose";

const commitSchema = new Schema({
  repository: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
  branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true, trim: true },
  hash: { type: String, required: true, unique: true },
  changedFiles: { type: [String], default: [] },
}, { timestamps: true });

export const Commit = model("Commit", commitSchema);
