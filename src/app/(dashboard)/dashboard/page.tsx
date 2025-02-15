"use client";

import ErrorFallback from "@/components/common/error-fallback";
import { EmployeeDashboardContent } from "@/components/dashboard/employee/dashboard-content";
import { LoadingDialog } from "@/components/ui/loading-dialog";
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
    return <ErrorFallback message={error} onRetry={fetchStats} />;
  }

  if (!stats) {
    return <ErrorFallback message="No data available" onRetry={fetchStats} />;
  }

  return <EmployeeDashboardContent />;
}
