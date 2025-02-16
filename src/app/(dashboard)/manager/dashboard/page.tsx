"use client";

import { useEffect } from "react";
import { useManagerDashboardStore } from "@/store/manager-dashboard.store";
import { DashboardContent } from "@/components/dashboard/manager/dsahboard-content";
import ErrorFallback from "@/components/common/error-fallback";
import { APIError } from "@/lib/utils/api.utils";

export default function ManagerDashboard() {
  const { stats, isLoading, error, fetchStats } = useManagerDashboardStore();

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <ErrorFallback
        message={
          error instanceof APIError ? error.message : "Failed to load dashboard"
        }
        onRetry={fetchStats}
      />
    );
  }

  if (!stats) {
    return <ErrorFallback message="No data available" onRetry={fetchStats} />;
  }

  return <DashboardContent />;
}
