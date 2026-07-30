import { Request, Response } from "express";
import { Repository } from "../models/Repository.js";
import { User } from "../models/User.js";
import { Collaborator } from "../models/Collaborator.js";
import { Notification } from "../models/Notification.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

// Ensure the requester has Admin or Owner rights
const checkPermissions = async (repoId: string, userId: string) => {
  const repo = await Repository.findById(repoId);
  if (!repo) return { error: "Repository not found" };

  if (repo.owner.toString() === userId) return { repo, isAuthorized: true };

  const collab = await Collaborator.findOne({
    repository: repoId,
    user: userId,
    status: "Accepted",
    role: "Admin",
  });

  if (collab) return { repo, isAuthorized: true };

  return { error: "Not authorized to manage collaborators" };
};

export const addCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const { email, role } = req.body;
    const userId = req.userId!;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: error || "Not authorized" });
    }

    const invitee = await User.findOne({ email: email.toLowerCase() });
    if (!invitee) {
      return res.status(404).json({ success: false, message: "User with this email not found" });
    }

    const repo = await Repository.findById(repositoryId);
    if (repo?.owner.toString() === invitee._id.toString()) {
      return res.status(400).json({ success: false, message: "Owner cannot be added as a collaborator" });
    }

    const existing = await Collaborator.findOne({ repository: repositoryId, user: invitee._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "User is already a collaborator or has a pending invite" });
    }

    const collaborator = await Collaborator.create({
      repository: repositoryId,
      user: invitee._id,
      role: role || "Read",
      status: "Pending",
    });

    const notification = new Notification({
      user: invitee._id,
      type: "INVITATION",
      title: "Repository Invitation",
      message: `You have been invited to collaborate on ${repo?.name}`,
      link: "/invitations",
    });
    
    await notification.save();

    // Populate user info for frontend immediate response
    await collaborator.populate("user", "name email");

    res.status(201).json({ success: true, data: collaborator });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCollaborators = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const collaborators = await Collaborator.find({ repository: repositoryId })
      .populate("user", "name email");
    res.json({ success: true, data: collaborators });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCollaboratorRole = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const collaboratorId = req.params.collaboratorId as string;
    const { role } = req.body;
    const userId = req.userId!;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: error || "Not authorized" });
    }

    const collab = await Collaborator.findOne({ _id: collaboratorId, repository: repositoryId });
    if (!collab) {
      return res.status(404).json({ success: false, message: "Collaborator not found" });
    }

    collab.role = role;
    await collab.save();

    res.json({ success: true, data: collab });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCollaborator = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const collaboratorId = req.params.collaboratorId as string;
    const userId = req.userId!;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    
    // Allow users to remove themselves
    const collab = await Collaborator.findOne({ _id: collaboratorId, repository: repositoryId });
    if (!collab) {
      return res.status(404).json({ success: false, message: "Collaborator not found" });
    }

    if (!isAuthorized && collab.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await collab.deleteOne();

    res.json({ success: true, message: "Collaborator removed" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const invitations = await Collaborator.find({ user: userId, status: "Pending" })
      .populate({ path: "repository", populate: { path: "owner", select: "name" }});
      
    res.json({ success: true, data: invitations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const inviteId = req.params.inviteId as string;
    const userId = req.userId!;

    const invite = await Collaborator.findOne({ _id: inviteId, user: userId, status: "Pending" });
    if (!invite) {
      return res.status(404).json({ success: false, message: "Invitation not found or already accepted" });
    }

    invite.status = "Accepted";
    await invite.save();

    res.json({ success: true, data: invite });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const declineInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const inviteId = req.params.inviteId as string;
    const userId = req.userId!;

    const invite = await Collaborator.findOne({ _id: inviteId, user: userId, status: "Pending" });
    if (!invite) {
      return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    await invite.deleteOne();

    res.json({ success: true, message: "Invitation declined" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
