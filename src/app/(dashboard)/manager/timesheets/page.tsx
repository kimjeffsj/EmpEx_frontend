"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileDown, Plus } from "lucide-react";
import PayPeriodSelector from "@/components/timesheet/PayPeriodSelector";

export default function ManagerTimesheetsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [period, setPeriod] = useState<"first" | "second">("first");

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
          <Button variant="outline" className="gap-2">
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
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Work Hours
          </div>
          <div className="text-2xl font-bold">523.5h</div>
          <div className="text-xs text-muted-foreground mt-1">
            Overtime: 23.5h
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Payroll
          </div>
          <div className="text-2xl font-bold">$12,450</div>
          <div className="text-xs text-muted-foreground mt-1">
            Overtime Pay: $580
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Missing Entries
          </div>
          <div className="text-2xl font-bold">3 employees</div>
          <div className="text-xs text-muted-foreground mt-1">
            Total: 15 employees
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Status
          </div>
          <div className="text-2xl font-bold">In Progress</div>
          <div className="text-xs text-muted-foreground mt-1">
            Due in: 3 days
          </div>
        </Card>
      </div>

      {/* Content will be added */}
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Employee timesheet table will be displayed here.
        </div>
      </Card>
    </div>
  );
}
