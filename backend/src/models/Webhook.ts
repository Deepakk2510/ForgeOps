import mongoose, { Schema, Document } from "mongoose";

export interface IWebhook extends Document {
  repository: mongoose.Types.ObjectId;
  payloadUrl: string;
  secret?: string;
  events: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const webhookSchema = new Schema(
  {
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    payloadUrl: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
    },
    events: {
      type: [String],
      required: true,
      default: ["push", "pull_request", "issue"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Webhook = mongoose.model<IWebhook>("Webhook", webhookSchema);
