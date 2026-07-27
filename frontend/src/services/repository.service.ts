import api from "@/api/api";

export const repositoryService = {
  getAll: async () => {
    const response = await api.get("/repositories");
    return response.data;
  },

  create: async (data: unknown) => {
    const response = await api.post("/repositories", data);
    return response.data;
  },

  update: async (id: string, data: unknown) => {
    const response = await api.put(`/repositories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/repositories/${id}`);
    return response.data;
  },
};