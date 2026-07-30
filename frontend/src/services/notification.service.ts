import api from "@/api/api";

export interface Notification {
  _id: string;
  user: string;
  type: "INVITATION" | "ISSUE" | "PR" | "SYSTEM";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get<{ success: boolean; data: Notification[] }>("/notifications");
    return response.data.data;
  },

  getUnreadCount: async () => {
    const response = await api.get<{ success: boolean; data: { count: number } }>("/notifications/unread-count");
    return response.data.data.count;
  },

  markAsRead: async (id: string) => {
    const response = await api.put<{ success: boolean; data: Notification }>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.put<{ success: boolean; message: string }>("/notifications/mark-all-read");
    return response.data;
  },
};
