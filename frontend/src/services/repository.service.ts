import api from "@/api/api";
import type { Repository } from "@/types/repository";

interface RepositoryResponse {
  success: boolean;
  data: Repository[];
}

interface SingleRepositoryResponse {
  success: boolean;
  data: Repository;
}

export interface RepositoryPayload {
  name: string;
  description: string;
  language: string;
  visibility: "Public" | "Private";
  status: "Active" | "Building" | "Archived";

  topics: string[];
  license: string;
  website: string;
}

export const repositoryService = {
  getAll: async (): Promise<RepositoryResponse> => {
    const response = await api.get<RepositoryResponse>("/repositories");
    return response.data;
  },

  getById: async (
    id: string
  ): Promise<SingleRepositoryResponse> => {
    const response = await api.get<SingleRepositoryResponse>(
      `/repositories/${id}`
    );

    return response.data;
  },

  create: async (
    data: RepositoryPayload
  ): Promise<SingleRepositoryResponse> => {
    const response = await api.post<SingleRepositoryResponse>(
      "/repositories",
      data
    );

    return response.data;
  },

  update: async (
    id: string,
    data: Partial<RepositoryPayload>
  ): Promise<SingleRepositoryResponse> => {
    const response = await api.put<SingleRepositoryResponse>(
      `/repositories/${id}`,
      data
    );

    return response.data;
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/repositories/${id}`);

    return response.data;
  },

  toggleStar: async (
    id: string
  ): Promise<SingleRepositoryResponse> => {
    const response = await api.patch<SingleRepositoryResponse>(
      `/repositories/${id}/star`
    );

    return response.data;
  },

  updateReadme: async (
    id: string,
    readme: string
  ): Promise<SingleRepositoryResponse> => {
    const response = await api.patch<SingleRepositoryResponse>(
      `/repositories/${id}/readme`,
      {
        readme,
      }
    );

    return response.data;
  },
};