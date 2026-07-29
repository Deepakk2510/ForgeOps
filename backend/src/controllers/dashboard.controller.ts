import { Response } from "express";
import { Repository } from "../models/Repository.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const repositories = await Repository.find({
      owner: req.userId,
    }).sort({
      createdAt: -1,
    });

    const languageCount: Record<string, number> = {};

    let stars = 0;
    let publicRepositories = 0;
    let privateRepositories = 0;

    repositories.forEach((repo) => {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;

      stars += repo.starredBy.length;

      if (repo.visibility === "Public")
        publicRepositories++;
      else
        privateRepositories++;
    });

    res.json({
      stats: {
        repositories: repositories.length,
        publicRepositories,
        privateRepositories,
        stars,
      },

      languages: languageCount,

      recentRepositories: repositories.slice(0, 5),

      latestRepository:
        repositories.length > 0
          ? repositories[0]
          : null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};