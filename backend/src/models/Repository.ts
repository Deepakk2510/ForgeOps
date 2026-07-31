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
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Private",
    },

    starredBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: ["Active", "Building", "Archived"],
      default: "Active",
    },

    readme: {
      type: String,
      default: `# Project Title

## Description

Describe your project here.

## Features

- Feature 1
- Feature 2

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage

Explain how to use your project.

## Author

Built with ❤️ using ForgeOps.
`,
    },

    topics: {
      type: [String],
      default: [],
    },

    defaultBranch: {
      type: String,
      default: "main",
      trim: true,
      lowercase: true,
    },

    license: {
      type: String,
      default: "MIT",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    githubFullName: {
      type: String,
      trim: true,
    },

    isImported: {
      type: Boolean,
      default: false,
    },

    forks: {
      type: Number,
      default: 0,
      min: 0,
    },

    openIssues: {
      type: Number,
      default: 0,
      min: 0,
    },

    pullRequests: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastCommitMessage: {
      type: String,
      default: "Initial commit",
      trim: true,
    },

    lastCommitAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Repository = model("Repository", repositorySchema);