"use client";

import { useEffect } from "react";
import { useManagerDashboardStore } from "@/store/manager-dashboard.store";
import { DashboardContent } from "@/components/dashboard/manager/dsahboard-content";

export default function ManagerDashboard() {
  const { stats, isLoading, error, fetchStats } = useManagerDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stats) {
    return null;
  }

  return <DashboardContent />;
}
