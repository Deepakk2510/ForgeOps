import api from "@/api/api";

export const aiService = {
  chat: async (message: string, history: { role: string; content: string }[]) => {
    const res = await api.post(`/ai/chat`, { message, history });
    return res.data;
  },
  generatePRDescription: async (repositoryId: string, branchName: string) => {
    const res = await api.post(`/repositories/${repositoryId}/branches/${encodeURIComponent(branchName)}/ai-pr-description`);
    return res.data;
  },
  generatePRReview: async (repositoryId: string, pullRequestId: string) => {
    const res = await api.post(`/repositories/${repositoryId}/pull-requests/${pullRequestId}/ai-review`);
    return res.data;
  },
  generateCommitMessage: async (repositoryId: string, branchName: string) => {
    const res = await api.post(`/repositories/${repositoryId}/branches/${encodeURIComponent(branchName)}/ai-commit-message`);
    return res.data;
  }
};
