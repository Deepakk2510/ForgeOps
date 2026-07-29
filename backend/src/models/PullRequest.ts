import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Approved", "Changes Requested"],
      required: true,
    },
    comment: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const pullRequestSchema = new Schema(
  {
    repository: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    reviewers: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    status: { type: String, enum: ["Open", "Merged", "Closed"], default: "Open" },
    mergeStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    sourceBranch: { type: String, required: true, trim: true },
    targetBranch: { type: String, required: true, trim: true },
    changedFiles: { type: Number, default: 0, min: 0 },
    commits: { type: Number, default: 0, min: 0 },
    reviews: { type: [reviewSchema], default: [] },
    mergedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const PullRequest = model("PullRequest", pullRequestSchema);
