import api from "@/api/api";

import type {
  Issue,
  CreateIssuePayload,
} from "@/types/issue";

interface IssueResponse {
  success: boolean;
  data: Issue;
}

interface IssuesResponse {
  success: boolean;
  count: number;
  data: Issue[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const issueService = {
  // Get all issues of a repository
  getRepositoryIssues: async (
    repositoryId: string
  ): Promise<IssuesResponse> => {
    const response = await api.get<IssuesResponse>(
      `/issues/repository/${repositoryId}`
    );

    return response.data;
  },

  // Create issue
  create: async (
    payload: CreateIssuePayload
  ): Promise<IssueResponse> => {
    const response = await api.post<IssueResponse>(
      "/issues",
      payload
    );

    return response.data;
  },

  // Update issue
  update: async (
    issueId: string,
    payload: Partial<Issue>
  ): Promise<IssueResponse> => {
    const response = await api.put<IssueResponse>(
      `/issues/${issueId}`,
      payload
    );

    return response.data;
  },

  // Delete issue
  delete: async (
    issueId: string
  ): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(
      `/issues/${issueId}`
    );

    return response.data;
  },

  // Close issue
  close: async (
    issueId: string
  ): Promise<IssueResponse> => {
    const response = await api.put<IssueResponse>(
      `/issues/${issueId}`,
      {
        status: "Closed",
      }
    );

    return response.data;
  },

  // Reopen issue
  reopen: async (
    issueId: string
  ): Promise<IssueResponse> => {
    const response = await api.put<IssueResponse>(
      `/issues/${issueId}`,
      {
        status: "Open",
      }
    );

    return response.data;
  },
};