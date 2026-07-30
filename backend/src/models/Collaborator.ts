import { Schema, model } from "mongoose";

const collaboratorSchema = new Schema(
  {
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Write", "Read"],
      default: "Read",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

collaboratorSchema.index({ repository: 1, user: 1 }, { unique: true });

export const Collaborator = model("Collaborator", collaboratorSchema);
