import { Schema, model } from "mongoose";

const repositorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      required: true,
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },

    stars: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Building", "Archived"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export const Repository = model("Repository", repositorySchema);