"use client";

import { Suspense } from "react";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserNav } from "@/components/dashboard/user-nav";

import {
  LayoutDashboard,
  Clock,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const employeeNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Timesheets",
    href: "/dashboard/timesheets",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Payslips",
    href: "/dashboard/payslips",
    icon: <DollarSign className="h-4 w-4" />,
  },
];

const managerNavItems = [
  {
    title: "Overview",
    href: "/manager/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Employees",
    href: "/manager/employees",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Payroll",
    href: "/manager/payroll",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Reports",
    href: "/manager/reports",
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const navItems =
    user?.role === "MANAGER" ? managerNavItems : employeeNavItems;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-bold text-xl">EmpEx</div>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 border-r min-h-[calc(100vh-4rem)] p-4">
          <SidebarNav items={navItems} />
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
