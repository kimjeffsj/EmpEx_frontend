"use client";

import { useEmployeeDashboardStore } from "@/store/employee-dashboard.store";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  CalendarClock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export function EmployeeDashboardContent() {
  const { stats } = useEmployeeDashboardStore();

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your work status.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Hours This Month"
          value={`${stats.timesheet.monthlyHours.totalHours}`}
          description={`${stats.timesheet.monthlyHours.overtimeHours} hours overtime`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Current Pay Period"
          value={`$${stats.timesheet.currentPeriod.totalPay.toFixed(2)}`}
          description={format(
            new Date(stats.timesheet.currentPeriod.startDate),
            "MMM d"
          )}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Timesheet Status"
          value={stats.timesheet.currentPeriod.status}
          description={`Due: ${format(
            new Date(stats.timesheet.currentPeriod.endDate),
            "MMM d, yyyy"
          )}`}
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Last Paycheck"
          value={
            stats.payroll.lastPaystub
              ? `$${Number(stats.payroll.lastPaystub.grossPay).toFixed(2)}`
              : "N/A"
          }
          description={
            stats.payroll.lastPaystub
              ? format(
                  new Date(stats.payroll.lastPaystub.endDate),
                  "MMM d, yyyy"
                )
              : "No previous paycheck"
          }
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Timesheet Overview */}
        <Card className="col-span-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Current Pay Period</h3>
              <Button variant="outline" size="sm">
                Submit Timesheet
              </Button>
            </div>
            <div className="space-y-4">
              {/* Period Date Range */}
              <div className="flex items-center justify-between">
                <span>
                  {format(
                    new Date(stats.timesheet.currentPeriod.startDate),
                    "MMM d"
                  )}{" "}
                  -{" "}
                  {format(
                    new Date(stats.timesheet.currentPeriod.endDate),
                    "MMM d, yyyy"
                  )}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    stats.timesheet.currentPeriod.status === "COMPLETED"
                      ? "text-green-500 bg-green-50"
                      : "text-orange-500 bg-orange-50"
                  }`}
                >
                  {stats.timesheet.currentPeriod.status}
                </span>
              </div>

              {/* Hours Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Regular Hours</span>
                  <span>{stats.timesheet.currentPeriod.regularHours}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime Hours</span>
                  <span>{stats.timesheet.currentPeriod.overtimeHours}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span>{stats.timesheet.currentPeriod.totalHours}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Expected Pay</span>
                  <span>
                    ${stats.timesheet.currentPeriod.totalPay.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="col-span-3">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-4">
              {stats.timesheet.currentPeriod.status !== "COMPLETED" && (
                <div className="flex gap-4 items-start">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Timesheet Due Soon</p>
                    <p className="text-sm text-muted-foreground">
                      Submit your timesheet by{" "}
                      {format(
                        new Date(stats.timesheet.currentPeriod.endDate),
                        "MMM d"
                      )}
                    </p>
                  </div>
                </div>
              )}
              {stats.payroll.lastPaystub && (
                <div className="flex gap-4 items-start">
                  <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Last Paycheck Processed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your paycheck for the period ending{" "}
                      {format(
                        new Date(stats.payroll.lastPaystub.endDate),
                        "MMM d"
                      )}{" "}
                      has been processed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
