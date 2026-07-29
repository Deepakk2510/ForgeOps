import { Response } from "express";

import { Issue } from "../models/Issue.js";
import { Repository } from "../models/Repository.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

// -------------------------------------
// Create Issue
// -------------------------------------

export const createIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.findOne({
      _id: req.body.repository,
      owner: req.userId,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found",
      });
      return;
    }

    const issue = await Issue.create({
      repository: repository._id,
      creator: req.userId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      labels: req.body.labels || [],
    });

    repository.openIssues += 1;
    await repository.save();

    res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------------------------
// Get Repository Issues
// -------------------------------------

export const getRepositoryIssues = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.repositoryId,
      owner: req.userId,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found",
      });
      return;
    }

    const issues = await Issue.find({
      repository: repository._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
};

// -------------------------------------
// Update Issue
// -------------------------------------

export const updateIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const issue: any = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
      });
      return;
    }

    const repository = await Repository.findOne({
      _id: issue.repository,
      owner: req.userId,
    });

    if (!repository) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    Object.assign(issue, req.body);

    await issue.save();

    res.json({
      success: true,
      data: issue,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update issue",
    });
  }
};

// -------------------------------------
// Delete Issue
// -------------------------------------

export const deleteIssue = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const issue: any = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: "Issue not found",
      });
      return;
    }

    const repository: any = await Repository.findOne({
      _id: issue.repository,
      owner: req.userId,
    });

    if (!repository) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    await issue.deleteOne();

    if (repository.openIssues > 0) {
      repository.openIssues -= 1;
      await repository.save();
    }

    res.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete issue",
    });
  }
};