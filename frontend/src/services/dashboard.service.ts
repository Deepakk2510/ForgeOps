import api from "@/api/api";
import type { DashboardResponse } from "@/types/dashboard";

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};