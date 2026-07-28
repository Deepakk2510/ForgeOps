import { Response } from "express";
import { Repository } from "../models/Repository.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

// Create Repository
export const createRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.create({
      ...req.body,
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      data: repository,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Repositories (Current User Only)
export const getRepositories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repositories = await Repository.find({
      owner: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: repositories.length,
      data: repositories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
};

// Get Single Repository
export const getRepositoryById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found",
      });
      return;
    }

    res.json({
      success: true,
      data: repository,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
    });
  }
};

// Update Repository
export const updateRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found or access denied",
      });
      return;
    }

    res.json({
      success: true,
      data: repository,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update repository",
    });
  }
};

// Delete Repository
export const deleteRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found or access denied",
      });
      return;
    }

    res.json({
      success: true,
      message: "Repository deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete repository",
    });
  }
};