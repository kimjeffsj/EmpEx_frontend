"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Column, DataTable } from "@/components/common/data-table";
import { Employee } from "@/types/manager-employeeList.types";
import { employeeApi } from "@/lib/api/employee.api";

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
    render: (value: string | number | null) =>
      value ? format(new Date(value.toString()), "MMM d, yyyy") : "",
  },
  {
    key: "payRate",
    title: "Pay Rate",
    sortable: true,
    render: (value: string | number | null) =>
      value ? `$${Number(value).toFixed(2)}/hr` : "",
  },
] as const;

export default function EmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["employees", { page, limit, search: searchTerm }],
    queryFn: () =>
      employeeApi.getEmployees({
        page,
        limit,
        search: searchTerm || undefined,
      }),
  });

  const handleRowClick = useCallback(
    (employee: Employee) => {
      router.push(`/manager/employees/${employee.id}`);
    },
    [router]
  );

  const handleCreateNew = useCallback(() => {
    router.push("/manager/employees/new");
  }, [router]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

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
          data={data?.data ?? []}
          isLoading={isLoading}
          error={error?.message}
          onRowClick={handleRowClick}
          pagination={{
            currentPage: page,
            totalPages: data?.data?.meta?.totalPages ?? 1,
            onPageChange: setPage,
          }}
          search={{
            value: searchTerm,
            onChange: handleSearch,
            placeholder: "Search employees...",
          }}
        />
      </Card>
    </div>
  );
}
