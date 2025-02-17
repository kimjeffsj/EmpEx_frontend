"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileDown,
  Plus,
  Users,
  Clock,
  DollarSign,
  CalendarClock,
} from "lucide-react";
import PayPeriodSelector from "@/components/timesheet/PayPeriodSelector";
import TimesheetTable from "@/components/timesheet/TimesheetTable";
import { usePayrollStore } from "@/store/payroll.store";
import { StatCard } from "@/components/dashboard/stat-card";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import ErrorFallback from "@/components/common/error-fallback";

export const TimesheetsContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [period, setPeriod] = useState<"first" | "second">("first");

  const { periods, isLoading, error, fetchPayPeriods, exportToExcel } =
    usePayrollStore();

  useEffect(() => {
    fetchPayPeriods();
  }, [fetchPayPeriods]);

  // 현재 선택된 기간의 시작일과 종료일 계산
  const getSelectedPeriodDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDay = period === "first" ? 1 : 16;
    const endDay =
      period === "first" ? 15 : new Date(year, month + 1, 0).getDate();

    return {
      startDate: new Date(year, month, startDay),
      endDate: new Date(year, month, endDay),
      periodType: period === "first" ? "FIRST_HALF" : "SECOND_HALF",
    };
  };

  // 선택된 급여 기간 찾기
  const selectedPeriodDates = getSelectedPeriodDates();
  const selectedPeriod = periods?.find((p) => {
    const periodDate = new Date(p.startDate);
    return (
      periodDate.getMonth() === currentDate.getMonth() &&
      periodDate.getFullYear() === currentDate.getFullYear() &&
      p.periodType === (period === "first" ? "FIRST_HALF" : "SECOND_HALF")
    );
  });

  // 통계 계산 (데이터가 없는 경우에도 기본 구조 제공)
  const stats = {
    totalEmployees: selectedPeriod?.payrolls.length ?? 0,
    totalHours:
      selectedPeriod?.payrolls.reduce(
        (sum, p) => sum + Number(p.totalHours),
        0
      ) ?? 0,
    overtimeHours:
      selectedPeriod?.payrolls.reduce(
        (sum, p) => sum + Number(p.totalOvertimeHours),
        0
      ) ?? 0,
    totalPayroll:
      selectedPeriod?.payrolls.reduce((sum, p) => sum + p.grossPay, 0) ?? 0,
    status: selectedPeriod?.status ?? "PROCESSING",
    // 데이터 유무 확인을 위한 플래그
    hasData: !!selectedPeriod,
  };

  const handleExportExcel = async () => {
    if (selectedPeriod) {
      await exportToExcel(selectedPeriod.id);
    }
  };

  if (isLoading) {
    return <LoadingDialog open={true} title="Loading payroll data..." />;
  }

  if (error) {
    return <ErrorFallback message={error} onRetry={fetchPayPeriods} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Time & Payroll Management
          </h1>
          <p className="text-muted-foreground">
            Manage employee work hours and calculate payroll.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExportExcel}
            disabled={!selectedPeriod}
          >
            <FileDown className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Time Entry
          </Button>
        </div>
      </div>

      {/* PayPeriod Selector */}
      <PayPeriodSelector
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees.toString()}
          description={!stats.hasData ? "No data available" : undefined}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Work Hours"
          value={stats.totalHours.toFixed(1)}
          description={
            !stats.hasData
              ? "No data available"
              : `${stats.overtimeHours.toFixed(1)}h overtime`
          }
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Payroll"
          value={
            !stats.hasData ? "$0" : `${stats.totalPayroll.toLocaleString()}`
          }
          description={!stats.hasData ? "No data available" : undefined}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Status"
          value={stats.status}
          description={!stats.hasData ? "Future pay period" : undefined}
          className={
            !stats.hasData
              ? "bg-gray-50 dark:bg-gray-900/20"
              : stats.status === "COMPLETED"
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-yellow-50 dark:bg-yellow-900/20"
          }
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Timesheet Table */}
      <Card className="p-6">
        <TimesheetTable
          employees={
            selectedPeriod?.payrolls.map((p) => ({
              ...p.employee,
              payroll: {
                regularHours: Number(p.totalRegularHours),
                overtimeHours: Number(p.totalOvertimeHours),
                totalHours: Number(p.totalHours),
                grossPay: p.grossPay,
                status: p.status,
              },
            })) ?? []
          }
          periodStart={new Date(selectedPeriodDates.startDate)}
          periodEnd={new Date(selectedPeriodDates.endDate)}
          onEditTime={(employeeId) => {
            console.log("Edit time for employee:", employeeId);
          }}
        />
      </Card>
    </div>
  );
};
