import { Response } from "express";

import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { triggerWebhooks } from "../services/webhook.dispatcher.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

async function ownedRepository(repositoryId: string, userId?: string) {
  return Repository.findOne({ _id: repositoryId, owner: userId });
}

export const createPullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const repository: any = await ownedRepository(req.body.repository, req.userId);
    if (!repository) {
      res.status(404).json({ success: false, message: "Repository not found" });
      return;
    }

    if (req.body.sourceBranch === req.body.targetBranch) {
      res.status(400).json({ success: false, message: "Source and target branches must be different" });
      return;
    }

    const pullRequest = await PullRequest.create({
      repository: repository._id,
      creator: req.userId,
      title: req.body.title,
      description: req.body.description || "",
      reviewers: req.body.reviewers || [],
      sourceBranch: req.body.sourceBranch,
      targetBranch: req.body.targetBranch,
      changedFiles: req.body.changedFiles || 0,
      commits: req.body.commits || 0,
    });

    repository.pullRequests += 1;
    await repository.save();
    
    await pullRequest.populate("creator", "name email");
    triggerWebhooks(repository._id, "pull_request", pullRequest);

    res.status(201).json({ success: true, data: pullRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepositoryPullRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const repository = await ownedRepository(String(req.params.repositoryId), req.userId);
    if (!repository) {
      res.status(404).json({ success: false, message: "Repository not found" });
      return;
    }
    const pullRequests = await PullRequest.find({ repository: repository._id })
      .populate("creator", "name email")
      .populate("reviewers", "name email")
      .populate("reviews.reviewer", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: pullRequests.length, data: pullRequests });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch pull requests" });
  }
};

export const reviewPullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status !== "Open") {
      res.status(400).json({ success: false, message: "Only open pull requests can be reviewed" });
      return;
    }

    const status = req.body.status;
    if (status !== "Approved" && status !== "Changes Requested") {
      res.status(400).json({ success: false, message: "Invalid review status" });
      return;
    }

    pullRequest.reviews = pullRequest.reviews.filter(
      (review: any) => review.reviewer.toString() !== req.userId
    );
    pullRequest.reviews.push({ reviewer: req.userId, status, comment: req.body.comment || "" });
    pullRequest.mergeStatus = status === "Approved" ? "Approved" : "Rejected";
    await pullRequest.save();
    res.json({ success: true, data: pullRequest });
  } catch {
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

export const mergePullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository: any = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status !== "Open" || pullRequest.mergeStatus !== "Approved") {
      res.status(400).json({ success: false, message: "An approved open pull request is required before merging" });
      return;
    }

    pullRequest.status = "Merged";
    pullRequest.mergedAt = new Date();
    await pullRequest.save();

    repository.pullRequests = Math.max(0, repository.pullRequests - 1);
    repository.lastCommitMessage = `Merged PR: ${pullRequest.title}`;
    repository.lastCommitAt = pullRequest.mergedAt;
    await repository.save();
    res.json({ success: true, data: pullRequest, repositoryAnalyticsUpdated: true });
  } catch {
    res.status(500).json({ success: false, message: "Failed to merge pull request" });
  }
};

export const closePullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository: any = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status !== "Open") {
      res.status(400).json({ success: false, message: "Only open pull requests can be closed" });
      return;
    }
    pullRequest.status = "Closed";
    await pullRequest.save();
    repository.pullRequests = Math.max(0, repository.pullRequests - 1);
    await repository.save();
    res.json({ success: true, data: pullRequest });
  } catch {
    res.status(500).json({ success: false, message: "Failed to close pull request" });
  }
};

export const reopenPullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository: any = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status !== "Closed") {
      res.status(400).json({ success: false, message: "Only closed pull requests can be reopened" });
      return;
    }
    pullRequest.status = "Open";
    pullRequest.mergeStatus = "Pending";
    await pullRequest.save();
    repository.pullRequests += 1;
    await repository.save();
    res.json({ success: true, data: pullRequest });
  } catch {
    res.status(500).json({ success: false, message: "Failed to reopen pull request" });
  }
};

export const updatePullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status !== "Open") {
      res.status(400).json({ success: false, message: "Only open pull requests can be edited" });
      return;
    }
    const fields = ["title", "description", "reviewers", "sourceBranch", "targetBranch", "changedFiles", "commits"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) pullRequest[field] = req.body[field];
    });
    if (pullRequest.sourceBranch === pullRequest.targetBranch) {
      res.status(400).json({ success: false, message: "Source and target branches must be different" });
      return;
    }
    await pullRequest.save();
    res.json({ success: true, data: pullRequest });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update pull request" });
  }
};

export const deletePullRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pullRequest: any = await PullRequest.findById(req.params.id);
    if (!pullRequest) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }
    const repository: any = await ownedRepository(pullRequest.repository.toString(), req.userId);
    if (!repository) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (pullRequest.status === "Open") repository.pullRequests = Math.max(0, repository.pullRequests - 1);
    await pullRequest.deleteOne();
    await repository.save();
    res.json({ success: true, message: "Pull request deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete pull request" });
  }
};
