"use client";

import { useEffect } from "react";
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
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api/client.api";

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
    title: "Paystubs",
    href: "/dashboard/paystubs",
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
  const router = useRouter();
  const { user, isLoading, isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (!isAuthenticated && token) {
          await initializeAuth();
        } else if (!isAuthenticated && !token) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [isAuthenticated, initializeAuth, router]);

  if (isLoading) {
    return <LoadingDialog open={true} title="Loading..." />;
  }

  const navItems =
    user!.role === "MANAGER" ? managerNavItems : employeeNavItems;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="font-bold text-xl">EmpEx</div>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
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
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
