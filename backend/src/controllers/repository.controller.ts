import { Response } from "express";
import { Repository } from "../models/Repository.js";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import axios from "axios";

// ----------------------------
// Create Repository
// ----------------------------

export const createRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.create({
      ...req.body,
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      data: {
        ...repository.toObject(),
        stars: repository.starredBy.length,
        isStarred: false,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------
// Get All Repositories
// ----------------------------

export const getGithubRepositories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user: any = await User.findById(req.userId).select("+githubAccessToken");
    if (!user || !user.githubAccessToken) {
      res.status(400).json({
        success: false,
        message: "No GitHub access token found. Please log in with GitHub again.",
      });
      return;
    }

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        sort: "updated",
        per_page: 100,
      },
    });

    const githubRepos = response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "",
      language: repo.language || "Unknown",
      visibility: repo.private ? "Private" : "Public",
      html_url: repo.html_url,
    }));

    res.json({
      success: true,
      data: githubRepos,
    });
  } catch (error: any) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub repositories",
    });
  }
};

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

    const data = repositories.map((repo: any) => ({
      ...repo.toObject(),
      stars: repo.starredBy.length,
      isStarred: repo.starredBy.some(
        (id: any) => id.toString() === req.userId
      ),
    }));

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
};

// ----------------------------
// Get Repository By ID
// ----------------------------

export const getRepositoryById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.findOne({
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
      data: {
        ...repository.toObject(),
        stars: repository.starredBy.length,
        isStarred: repository.starredBy.some(
          (id: any) => id.toString() === req.userId
        ),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch repository",
    });
  }
};

// ----------------------------
// Update Repository
// ----------------------------

export const updateRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.findOneAndUpdate(
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
        message: "Repository not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...repository.toObject(),
        stars: repository.starredBy.length,
        isStarred: repository.starredBy.some(
          (id: any) => id.toString() === req.userId
        ),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update repository",
    });
  }
};

// ----------------------------
// Delete Repository
// ----------------------------

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
        message: "Repository not found",
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

// ----------------------------
// Toggle Star
// ----------------------------

export const toggleStarRepository = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.findOne({
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

    const alreadyStarred = repository.starredBy.some(
      (id: any) => id.toString() === req.userId
    );

    if (alreadyStarred) {
      repository.starredBy = repository.starredBy.filter(
        (id: any) => id.toString() !== req.userId
      );
    } else {
      repository.starredBy.push(req.userId);
    }

    await repository.save();

    res.json({
      success: true,
      data: {
        ...repository.toObject(),
        stars: repository.starredBy.length,
        isStarred: !alreadyStarred,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update star",
    });
  }
};

// ----------------------------
// Update README
// ----------------------------

export const updateReadme = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const repository: any = await Repository.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.userId,
      },
      {
        readme: req.body.readme,
      },
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
      data: {
        ...repository.toObject(),
        stars: repository.starredBy.length,
        isStarred: repository.starredBy.some(
          (id: any) => id.toString() === req.userId
        ),
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update README",
    });
  }
};