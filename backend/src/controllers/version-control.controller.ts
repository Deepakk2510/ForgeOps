import { Response } from "express";
import { randomUUID } from "crypto";
import { Repository } from "../models/Repository.js";
import { Branch } from "../models/Branch.js";
import { Commit } from "../models/Commit.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

async function repositoryForUser(id: string, userId?: string) { return Repository.findOne({ _id: id, owner: userId }); }
async function defaultBranch(repository: any, userId?: string) {
  let branch = await Branch.findOne({ repository: repository._id, isDefault: true });
  if (!branch) branch = await Branch.create({ repository: repository._id, name: repository.defaultBranch, isDefault: true, isCurrent: true, createdBy: userId });
  return branch;
}

export const getBranches = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const repository: any = await repositoryForUser(String(req.params.repositoryId), req.userId); if (!repository) { res.status(404).json({ success: false, message: "Repository not found" }); return; } await defaultBranch(repository, req.userId); const data = await Branch.find({ repository: repository._id }).sort({ isCurrent: -1, isDefault: -1, name: 1 }); res.json({ success: true, data }); } catch { res.status(500).json({ success: false, message: "Failed to load branches" }); }
};
export const createBranch = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const repository: any = await repositoryForUser(req.body.repository, req.userId); if (!repository) { res.status(404).json({ success: false, message: "Repository not found" }); return; } const branch = await Branch.create({ repository: repository._id, name: req.body.name, createdBy: req.userId }); res.status(201).json({ success: true, data: branch }); } catch (error: any) { res.status(400).json({ success: false, message: error.code === 11000 ? "A branch with this name already exists" : error.message }); }
};
export const switchBranch = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const branch: any = await Branch.findById(req.params.id); if (!branch) { res.status(404).json({ success: false, message: "Branch not found" }); return; } const repository = await repositoryForUser(branch.repository.toString(), req.userId); if (!repository) { res.status(403).json({ success: false, message: "Access denied" }); return; } await Branch.updateMany({ repository: branch.repository }, { isCurrent: false }); branch.isCurrent = true; await branch.save(); res.json({ success: true, data: branch }); } catch { res.status(500).json({ success: false, message: "Failed to switch branch" }); }
};
export const deleteBranch = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const branch: any = await Branch.findById(req.params.id); if (!branch) { res.status(404).json({ success: false, message: "Branch not found" }); return; } const repository = await repositoryForUser(branch.repository.toString(), req.userId); if (!repository) { res.status(403).json({ success: false, message: "Access denied" }); return; } if (branch.isDefault || branch.isCurrent) { res.status(400).json({ success: false, message: "Default or current branches cannot be deleted" }); return; } await branch.deleteOne(); res.json({ success: true, message: "Branch deleted" }); } catch { res.status(500).json({ success: false, message: "Failed to delete branch" }); }
};
export const getCommits = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const repository = await repositoryForUser(String(req.params.repositoryId), req.userId); if (!repository) { res.status(404).json({ success: false, message: "Repository not found" }); return; } const filter: Record<string, unknown> = { repository: repository._id }; if (req.query.branchId) filter.branch = req.query.branchId; const data = await Commit.find(filter).populate("branch", "name").populate("author", "name email").sort({ createdAt: -1 }); res.json({ success: true, data }); } catch { res.status(500).json({ success: false, message: "Failed to load commits" }); }
};
export const createCommit = async (req: AuthRequest, res: Response): Promise<void> => {
  try { const branch: any = await Branch.findById(req.body.branch); if (!branch) { res.status(404).json({ success: false, message: "Branch not found" }); return; } const repository: any = await repositoryForUser(branch.repository.toString(), req.userId); if (!repository) { res.status(403).json({ success: false, message: "Access denied" }); return; } const commit = await Commit.create({ repository: repository._id, branch: branch._id, author: req.userId, message: req.body.message, changedFiles: req.body.changedFiles || [], hash: randomUUID().replaceAll("-", "").slice(0, 10) }); repository.lastCommitMessage = commit.message; repository.lastCommitAt = commit.createdAt; await repository.save(); res.status(201).json({ success: true, data: commit }); } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
};
export const getCommit = async (req: AuthRequest, res: Response): Promise<void> => { try { const commit: any = await Commit.findById(req.params.id).populate("branch", "name").populate("author", "name email"); if (!commit) { res.status(404).json({ success: false, message: "Commit not found" }); return; } const repository = await repositoryForUser(commit.repository.toString(), req.userId); if (!repository) { res.status(403).json({ success: false, message: "Access denied" }); return; } res.json({ success: true, data: commit }); } catch { res.status(500).json({ success: false, message: "Failed to load commit" }); } };
