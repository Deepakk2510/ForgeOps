import api from "@/api/api";
import type { Branch, Commit } from "@/types/version-control";
export const versionControlService = {
  branches: async (repositoryId: string) => (await api.get<{ data: Branch[] }>(`/version-control/branches/repository/${repositoryId}`)).data,
  createBranch: async (repository: string, name: string) => (await api.post("/version-control/branches", { repository, name })).data,
  switchBranch: async (id: string) => (await api.post(`/version-control/branches/${id}/switch`)).data,
  deleteBranch: async (id: string) => (await api.delete(`/version-control/branches/${id}`)).data,
  commits: async (repositoryId: string, branchId?: string) => (await api.get<{ data: Commit[] }>(`/version-control/commits/repository/${repositoryId}`, { params: branchId ? { branchId } : {} })).data,
  createCommit: async (branch: string, message: string, changedFiles: string[]) => (await api.post("/version-control/commits", { branch, message, changedFiles })).data,
};
