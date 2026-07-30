import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { aiService } from "../services/ai.service.js";
import { PullRequest } from "../models/PullRequest.js";
import { Repository } from "../models/Repository.js";
import { User } from "../models/User.js";

// Helper to get or create an AI system user
async function getAIUser() {
  let aiUser = await User.findOne({ email: "ai@forgeops.dev" });
  if (!aiUser) {
    // Generate a random password since nobody will log in with this
    const randomPassword = Math.random().toString(36).slice(-10);
    // Note: We bypass normal creation because we just want a system user
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(randomPassword, salt);
    
    aiUser = await User.create({
      name: "ForgeOps AI Reviewer",
      email: "ai@forgeops.dev",
      password: hashedPassword,
    });
  }
  return aiUser;
}

export const generatePRDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const repositoryId = String(req.params.repositoryId);
    const branchName = String(req.params.branchName);
    const result = await aiService.generatePRDescription(repositoryId, branchName);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePRReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const repositoryId = String(req.params.repositoryId);
    const pullRequestId = String(req.params.pullRequestId);
    
    const pr: any = await PullRequest.findById(pullRequestId);
    if (!pr) {
      res.status(404).json({ success: false, message: "Pull request not found" });
      return;
    }

    // Call AI Service
    const reviewResult = await aiService.generatePRReview(repositoryId, pr.sourceBranch, pr.title, pr.description);
    
    // Find or create AI user
    const aiUser = await getAIUser();

    // Add review to PR
    pr.reviews = pr.reviews.filter((review: any) => review.reviewer.toString() !== aiUser._id.toString());
    pr.reviews.push({ 
      reviewer: aiUser._id, 
      status: reviewResult.status, 
      comment: reviewResult.comment 
    });
    
    pr.mergeStatus = reviewResult.status === "Approved" ? "Approved" : "Rejected";
    await pr.save();

    // Repopulate for the response
    await pr.populate("reviews.reviewer", "name email avatarUrl");
    await pr.populate("creator", "name email");

    res.json({ success: true, data: pr });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateCommitMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const repositoryId = String(req.params.repositoryId);
    const branchName = String(req.params.branchName);
    const result = await aiService.generateCommitMessage(repositoryId, branchName);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
