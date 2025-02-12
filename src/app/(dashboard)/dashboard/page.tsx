"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  CalendarClock,
  AlertCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";

export function EmployeeDashboard() {
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
          value="164.5"
          description="8.5 hours overtime"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Last Paycheck"
          value="$2,845.50"
          description="March 1-15, 2024"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Timesheet Status"
          value="Submitted"
          description="Due: March 15, 2024"
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Available PTO"
          value="12 days"
          description="2 scheduled"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
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
              <div className="flex items-center justify-between">
                <span>March 1-15, 2024</span>
                <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm">
                  Submitted
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Regular Hours</span>
                  <span>75.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime Hours</span>
                  <span>4.5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span>79.5</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity & Reminders */}
        <Card className="col-span-3">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Reminders</h3>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Upcoming Payday</p>
                  <p className="text-sm text-muted-foreground">
                    Your next paycheck will be issued on March 20
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Timesheet Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t forget to submit your timesheet by March 15
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  /**
   * TODO: Connect API
   */
  // return <EmployeeDashboardContent />;
}
