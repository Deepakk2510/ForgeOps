import api from "@/api/api";

export const aiService = {
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
