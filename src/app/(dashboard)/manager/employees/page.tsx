"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Column, DataTable } from "@/components/common/data-table";
import { Employee } from "@/types/manager-employeeList.types";
import { useEmployeeStore } from "@/store/employee.store";

import ErrorFallback from "@/components/common/error-fallback";
import LoadingSpinner from "@/components/common/loading-spinner";
import { formatDate } from "@/lib/utils/date.utils";

const columns: Column<Employee>[] = [
  {
    key: "id",
    title: "ID",
    sortable: true,
    width: "w-[80px]",
  },
  {
    key: "firstName",
    title: "First Name",
    sortable: true,
  },
  {
    key: "lastName",
    title: "Last Name",
    sortable: true,
  },
  {
    key: "email",
    title: "Email",
    sortable: true,
  },
  {
    key: "startDate",
    title: "Start Date",
    sortable: true,
    render: (value) => formatDate(value?.toString(), "MMM d, yyyy"),
  },
  {
    key: "payRate",
    title: "Pay Rate",
    sortable: true,
    render: (value) => (value ? `$${Number(value).toFixed(2)}/hr` : ""),
  },
] as const;

export default function EmployeesPage() {
  const router = useRouter();
  const {
    employees,
    isLoading,
    error,
    page,
    limit,
    total,
    totalPages,
    filters,
    fetchEmployees,
    setFilters,
  } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleRowClick = useCallback(
    (employee: Employee) => {
      router.push(`/manager/employees/${employee.id}`);
    },
    [router]
  );

  const handleCreateNew = useCallback(() => {
    router.push("/manager/employees/new");
  }, [router]);

  const handleSearch = useCallback(
    (value: string) => {
      setFilters({ search: value, page: 1 });
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters({ page: newPage });
    },
    [setFilters]
  );

  if (error) {
    return <ErrorFallback message={error} onRetry={fetchEmployees} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your employee information and records
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Content */}
      <Card>
        <DataTable<Employee>
          columns={columns}
          data={employees}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          pagination={{
            currentPage: page,
            totalPages,
            onPageChange: handlePageChange,
          }}
          search={{
            value: filters.search || "",
            onChange: handleSearch,
            placeholder: "Search employees...",
          }}
        />
      </Card>
    </div>
  );
}
