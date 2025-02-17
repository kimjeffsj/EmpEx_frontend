"use client";

import ErrorFallback from "@/components/common/error-fallback";
import { EmployeeDashboardContent } from "@/components/dashboard/employee/dashboard-content";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { APIError } from "@/lib/utils/api.utils";
import { useEmployeeDashboardStore } from "@/store/employee-dashboard.store";
import { useEffect } from "react";

export default function EmployeeDashboard() {
  const { stats, isLoading, error, fetchStats } = useEmployeeDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return <LoadingDialog open={true} title="Loading dashboard data..." />;
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

  return <EmployeeDashboardContent />;
}
