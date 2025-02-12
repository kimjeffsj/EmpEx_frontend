// import { DashboardContent } from "@/components/dashboard/manager/dsahboard-content";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  DollarSign,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense } from "react";

export default function ManagerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your organization.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<div>Loading...</div>}>
          <StatCard
            title="Total Employees"
            value="123"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="New Hires"
            value="5"
            description="Last 30 days"
            icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Resignations"
            value="2"
            description="Last 30 days"
            icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Pending Payroll"
            value="$45,231.89"
            description="Current pay period"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Payroll Status */}
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Current Pay Period</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span>March 1-15, 2024</span>
                <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded-full text-sm">
                  In Progress
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Timesheets Submitted
                  </span>
                  <span>108/123</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span>1,842</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overtime Hours</span>
                  <span>156</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-xl font-semibold">Alerts</h3>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4 items-start">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Timesheet Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    15 employees haven&apos;t submitted timesheets for this
                    period
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New Employee Onboarding</p>
                  <p className="text-sm text-muted-foreground">
                    2 new employees starting next week
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
   * TODO: Connect with API, currently api does not have designated
   * stat endpoint.
   */
  // return <DashboardContent />;
}
