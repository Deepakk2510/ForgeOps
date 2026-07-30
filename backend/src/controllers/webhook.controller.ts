import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { Webhook } from "../models/Webhook.js";
import { Repository } from "../models/Repository.js";
import { Collaborator } from "../models/Collaborator.js";

async function checkPermissions(repositoryId: string, userId: string) {
  try {
    const repository = await Repository.findById(repositoryId);
    if (!repository) return { error: true, isAuthorized: false };
    if (repository.owner.toString() === userId.toString()) return { error: false, isAuthorized: true };

    const collaborator = await Collaborator.findOne({ repository: repositoryId, user: userId });
    if (collaborator && (collaborator.role === "Admin" || collaborator.role === "Write")) {
      return { error: false, isAuthorized: true };
    }
    return { error: false, isAuthorized: false };
  } catch (error) {
    return { error: true, isAuthorized: false };
  }
}

export const getWebhooks = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const userId = req.userId!;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to view webhooks" });
    }

    const webhooks = await Webhook.find({ repository: repositoryId });
    res.json({ success: true, data: webhooks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch webhooks" });
  }
};

export const createWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const userId = req.userId!;
    const { payloadUrl, secret, events, isActive } = req.body;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to create webhooks" });
    }

    const webhook = new Webhook({
      repository: repositoryId,
      payloadUrl,
      secret,
      events,
      isActive,
    });

    await webhook.save();
    res.status(201).json({ success: true, data: webhook });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create webhook" });
  }
};

export const updateWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const webhookId = req.params.webhookId as string;
    const userId = req.userId!;
    const { payloadUrl, secret, events, isActive } = req.body;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to update webhooks" });
    }

    const webhook = await Webhook.findOneAndUpdate(
      { _id: webhookId, repository: repositoryId },
      { payloadUrl, secret, events, isActive },
      { new: true }
    );

    if (!webhook) {
      return res.status(404).json({ success: false, message: "Webhook not found" });
    }

    res.json({ success: true, data: webhook });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update webhook" });
  }
};

export const deleteWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const repositoryId = req.params.repositoryId as string;
    const webhookId = req.params.webhookId as string;
    const userId = req.userId!;

    const { error, isAuthorized } = await checkPermissions(repositoryId, userId);
    if (error || !isAuthorized) {
      return res.status(403).json({ success: false, message: "Not authorized to delete webhooks" });
    }

    const webhook = await Webhook.findOneAndDelete({ _id: webhookId, repository: repositoryId });

    if (!webhook) {
      return res.status(404).json({ success: false, message: "Webhook not found" });
    }

    res.json({ success: true, message: "Webhook deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete webhook" });
  }
};
