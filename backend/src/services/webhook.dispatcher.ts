// No external fetch library needed in Node 18+
import { Webhook } from "../models/Webhook.js";

export const triggerWebhooks = async (repositoryId: string, event: string, payload: any) => {
  try {
    // Find all active webhooks for this repository that are subscribed to this event
    const webhooks = await Webhook.find({
      repository: repositoryId,
      isActive: true,
      events: event,
    });

    if (webhooks.length === 0) return;

    const payloadData = {
      event,
      timestamp: new Date().toISOString(),
      payload,
    };

    // Fire and forget for each webhook
    webhooks.forEach((webhook) => {
      fetch(webhook.payloadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ForgeOps-Event": event,
        },
        body: JSON.stringify(payloadData),
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error(`Webhook ${webhook._id} failed with status ${response.status}`);
          }
        })
        .catch((err: any) => {
          console.error(`Failed to trigger webhook ${webhook._id} at ${webhook.payloadUrl}:`, err.message);
        });
    });
  } catch (error) {
    console.error("Error in webhook dispatcher:", error);
  }
};
