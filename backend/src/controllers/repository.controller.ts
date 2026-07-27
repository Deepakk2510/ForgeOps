import { Request, Response } from "express";
import { Repository } from "../models/Repository.js";

// Create Repository
export const createRepository = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.create(req.body);

    res.status(201).json({
      success: true,
      data: repository,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create repository",
      error,
    });
  }
};

// Get All Repositories
export const getRepositories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const repositories = await Repository.find().sort({
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
      error,
    });
  }
};

// Get Single Repository
export const getRepositoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findById(req.params.id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
      error,
    });
  }
};

// Update Repository
export const updateRepository = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update repository",
      error,
    });
  }
};

// Delete Repository
export const deleteRepository = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const repository = await Repository.findByIdAndDelete(req.params.id);

    if (!repository) {
      res.status(404).json({
        success: false,
        message: "Repository not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Repository deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete repository",
      error,
    });
  }
};