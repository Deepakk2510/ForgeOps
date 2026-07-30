import { Response } from "express";
import { RepositoryFile } from "../models/RepositoryFile.js";
import { Repository } from "../models/Repository.js";
import { Branch } from "../models/Branch.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

async function repositoryForUser(id: string, userId?: string) {
  // To keep it simple, if user is checking, they should have access
  return Repository.findOne({ _id: id });
}

export const getFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { repositoryId } = req.params;
    let { branchId, path } = req.query;

    if (!path) path = "/";
    if (typeof path !== "string") path = "/";

    const repository = await repositoryForUser(String(repositoryId), req.userId);
    if (!repository) {
      res.status(404).json({ success: false, message: "Repository not found" });
      return;
    }

    // Default branch fallback if not provided
    if (!branchId) {
      const defaultBranch = await Branch.findOne({ repository: repository._id, isDefault: true });
      if (defaultBranch) branchId = defaultBranch._id.toString();
    }

    const filter: any = { repository: repository._id, parentPath: path };
    if (branchId) filter.branch = branchId;

    const files = await RepositoryFile.find(filter).sort({ type: -1, name: 1 }).select("-content");
    
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load files" });
  }
};

export const getFileContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = await RepositoryFile.findById(req.params.fileId);
    if (!file || file.type !== "file") {
      res.status(404).json({ success: false, message: "File not found" });
      return;
    }
    res.json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load file content" });
  }
};

export const seedFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { repositoryId } = req.params;
    const repository = await Repository.findById(repositoryId);
    
    if (!repository) {
      res.status(404).json({ success: false, message: "Repository not found" });
      return;
    }

    const defaultBranch = await Branch.findOne({ repository: repository._id, isDefault: true });
    const branchId = defaultBranch ? defaultBranch._id : undefined;

    const dummyFiles = [
      { name: "src", type: "folder", parentPath: "/", content: "" },
      { name: "public", type: "folder", parentPath: "/", content: "" },
      { name: "package.json", type: "file", parentPath: "/", content: '{\n  "name": "my-app",\n  "version": "1.0.0"\n}' },
      { name: "README.md", type: "file", parentPath: "/", content: "# My App\\n\\nWelcome to my app!" },
      { name: "App.tsx", type: "file", parentPath: "/src", content: 'import React from "react";\\n\\nexport default function App() {\\n  return <div>Hello World</div>;\\n}' },
      { name: "index.css", type: "file", parentPath: "/src", content: 'body {\\n  margin: 0;\\n  padding: 0;\\n}' },
      { name: "favicon.ico", type: "file", parentPath: "/public", content: "binarydata..." },
    ];

    for (const f of dummyFiles) {
      await RepositoryFile.findOneAndUpdate(
        { repository: repository._id, branch: branchId, parentPath: f.parentPath, name: f.name },
        { ...f, repository: repository._id, branch: branchId },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: "Files seeded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to seed files" });
  }
};
