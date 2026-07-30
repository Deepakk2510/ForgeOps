import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false, // Optional for OAuth users
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values without throwing unique errors
    },

    githubAccessToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);