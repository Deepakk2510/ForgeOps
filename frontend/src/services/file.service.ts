import api from "@/api/api";

export interface RepositoryFile {
  _id: string;
  repository: string;
  branch?: string;
  parentPath: string;
  name: string;
  type: "file" | "folder";
  content: string;
  size: number;
  commitMessage: string;
  commitDate: string;
}

export const fileService = {
  getFiles: async (repositoryId: string, branchId?: string, path: string = "/") => {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", branchId);
    params.append("path", path);

    const response = await api.get<{ success: boolean; data: RepositoryFile[] }>(
      `/repositories/${repositoryId}/files?${params.toString()}`
    );
    return response.data.data;
  },

  getFileContent: async (repositoryId: string, fileId: string) => {
    const response = await api.get<{ success: boolean; data: RepositoryFile }>(
      `/repositories/${repositoryId}/files/${fileId}/content`
    );
    return response.data.data;
  },

  seedFiles: async (repositoryId: string) => {
    const response = await api.post<{ success: boolean; message: string }>(
      `/repositories/${repositoryId}/files/seed`
    );
    return response.data;
  }
};
