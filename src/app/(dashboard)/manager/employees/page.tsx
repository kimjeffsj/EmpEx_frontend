"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Column, DataTable } from "@/components/common/data-table";

import { useEmployeeStore } from "@/store/employee.store";
import ErrorFallback from "@/components/common/error-fallback";
import { formatDate } from "@/lib/utils/date.utils";
import { Employee } from "@/types/features/employee.types";
import CreateEmployeeModal from "@/components/employees/modals/addEmployeesModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    employees,
    isLoading,
    meta,
    error,
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

  const handleSuccess = () => {
    // Refresh employee list
    fetchEmployees();
  };

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
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Content */}
      <Card>
        <DataTable<Employee>
          columns={columns}
          data={employees || []}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          pagination={{
            currentPage: meta.page,
            totalPages: meta.totalPages,
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
