import { Schema, model } from "mongoose";

const repositoryFileSchema = new Schema(
  {
    repository: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" }, 
    parentPath: { type: String, required: true, default: "/" }, 
    name: { type: String, required: true }, 
    type: { type: String, enum: ["file", "folder"], required: true },
    content: { type: String, default: "" },
    size: { type: Number, default: 0 },
    commitMessage: { type: String, default: "Initial commit" },
    commitDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure a file/folder is unique within its parent directory
repositoryFileSchema.index({ repository: 1, branch: 1, parentPath: 1, name: 1 }, { unique: true });

export const RepositoryFile = model("RepositoryFile", repositoryFileSchema);
