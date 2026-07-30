import api from "@/api/api";

export interface Collaborator {
  _id: string;
  repository: string | any;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: "Admin" | "Write" | "Read";
  status: "Pending" | "Accepted";
  createdAt: string;
}

export const collaboratorService = {
  addCollaborator: async (repositoryId: string, email: string, role: string) => {
    return api.post(`/repositories/${repositoryId}/collaborators`, { email, role });
  },

  getCollaborators: async (repositoryId: string) => {
    const response = await api.get<{ success: boolean; data: Collaborator[] }>(
      `/repositories/${repositoryId}/collaborators`
    );
    return response.data.data;
  },

  updateRole: async (repositoryId: string, collaboratorId: string, role: string) => {
    return api.patch(`/repositories/${repositoryId}/collaborators/${collaboratorId}`, { role });
  },

  removeCollaborator: async (repositoryId: string, collaboratorId: string) => {
    return api.delete(`/repositories/${repositoryId}/collaborators/${collaboratorId}`);
  },

  getUserInvitations: async () => {
    const response = await api.get<{ success: boolean; data: Collaborator[] }>("/invitations");
    return response.data.data;
  },

  acceptInvitation: async (inviteId: string) => {
    return api.post(`/invitations/${inviteId}/accept`);
  },

  declineInvitation: async (inviteId: string) => {
    return api.post(`/invitations/${inviteId}/decline`);
  },
};
