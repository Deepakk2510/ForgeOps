import api from "@/api/api";

export interface Webhook {
  _id: string;
  repository: string;
  payloadUrl: string;
  secret?: string;
  events: string[];
  isActive: boolean;
}

export const webhookService = {
  getWebhooks: async (repositoryId: string) => {
    const response = await api.get<{ success: boolean; data: Webhook[] }>(
      `/repositories/${repositoryId}/webhooks`
    );
    return response.data.data;
  },

  createWebhook: async (
    repositoryId: string,
    data: { payloadUrl: string; secret?: string; events: string[]; isActive: boolean }
  ) => {
    const response = await api.post<{ success: boolean; data: Webhook }>(
      `/repositories/${repositoryId}/webhooks`,
      data
    );
    return response.data.data;
  },

  updateWebhook: async (
    repositoryId: string,
    webhookId: string,
    data: { payloadUrl: string; secret?: string; events: string[]; isActive: boolean }
  ) => {
    const response = await api.put<{ success: boolean; data: Webhook }>(
      `/repositories/${repositoryId}/webhooks/${webhookId}`,
      data
    );
    return response.data.data;
  },

  deleteWebhook: async (repositoryId: string, webhookId: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/repositories/${repositoryId}/webhooks/${webhookId}`
    );
    return response.data;
  },
};
