import { api } from "./client.api";

export async function getDashboardStats() {
  const response = await api.get("/manager/dashboard/stats");
  return response.data;
}
