import api from "@/api/api";
import type { CreatePullRequestPayload, PullRequest, ReviewStatus } from "@/types/pull-request";

interface PullRequestResponse {
  success: boolean;
  data: PullRequest;
}

interface PullRequestsResponse {
  success: boolean;
  count: number;
  data: PullRequest[];
}

export const pullRequestService = {
  getRepositoryPullRequests: async (repositoryId: string): Promise<PullRequestsResponse> => {
    const response = await api.get<PullRequestsResponse>(`/pull-requests/repository/${repositoryId}`);
    return response.data;
  },
  create: async (payload: CreatePullRequestPayload): Promise<PullRequestResponse> => {
    const response = await api.post<PullRequestResponse>("/pull-requests", payload);
    return response.data;
  },
  review: async (id: string, status: ReviewStatus, comment: string): Promise<PullRequestResponse> => {
    const response = await api.post<PullRequestResponse>(`/pull-requests/${id}/reviews`, { status, comment });
    return response.data;
  },
  merge: async (id: string): Promise<PullRequestResponse> => {
    const response = await api.post<PullRequestResponse>(`/pull-requests/${id}/merge`);
    return response.data;
  },
  close: async (id: string): Promise<PullRequestResponse> => {
    const response = await api.post<PullRequestResponse>(`/pull-requests/${id}/close`);
    return response.data;
  },
  reopen: async (id: string): Promise<PullRequestResponse> => {
    const response = await api.post<PullRequestResponse>(`/pull-requests/${id}/reopen`);
    return response.data;
  },
  update: async (id: string, payload: Partial<CreatePullRequestPayload>): Promise<PullRequestResponse> => {
    const response = await api.put<PullRequestResponse>(`/pull-requests/${id}`, payload);
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/pull-requests/${id}`);
    return response.data;
  },
};
