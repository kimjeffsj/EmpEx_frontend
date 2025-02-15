"use client";

import { useManagerDashboardStore } from "@/store/manager-dashboard.store";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  AlertCircle,
  UserPlus,
  UserMinus,
  ArrowRight,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export function DashboardContent() {
  const { stats } = useManagerDashboardStore();

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your organization.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Reports</Button>
          <Button>Start Payroll</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="New Hires"
          value={stats.newHires}
          description="Last 30 days"
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Resignations"
          value={stats.resignations}
          description="Last 30 days"
          icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pending Payroll"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(stats.pendingPayroll)}
          description="Current pay period"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Payroll Status */}
        <Card className="col-span-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Current Pay Period</h3>
              <Button variant="ghost" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                View All Periods
              </Button>
            </div>
            {stats.currentPeriod ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>
                    {format(new Date(stats.currentPeriod.startDate), "MMM d")} -{" "}
                    {format(
                      new Date(stats.currentPeriod.endDate),
                      "MMM d, yyyy"
                    )}
                  </span>
                  <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded-full text-sm">
                    {stats.currentPeriod.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Timesheets Submitted
                    </span>
                    <span>
                      {stats.currentPeriod.submittedTimesheets}/
                      {stats.currentPeriod.totalEmployees}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{
                        width: `${
                          (stats.currentPeriod.submittedTimesheets /
                            stats.currentPeriod.totalEmployees) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Hours</span>
                    <span>{stats.currentPeriod.totalHours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Overtime Hours
                    </span>
                    <span>{stats.currentPeriod.overtimeHours}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No active pay period</p>
            )}
          </div>
        </Card>

        {/* Alerts & Tasks */}
        <Card className="col-span-3">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Tasks & Alerts</h3>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-4">
              {stats.currentPeriod &&
                stats.currentPeriod.totalEmployees -
                  stats.currentPeriod.submittedTimesheets >
                  0 && (
                  <div className="flex gap-4 items-start">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Timesheet Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.currentPeriod.totalEmployees -
                          stats.currentPeriod.submittedTimesheets}{" "}
                        employees haven&apos;t submitted timesheets
                      </p>
                    </div>
                  </div>
                )}
              {stats.newHires > 0 && (
                <div className="flex gap-4 items-start">
                  <UserPlus className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      New Employee Onboarding
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stats.newHires} new employees starting next week
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
