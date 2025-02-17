import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarSearch, Edit2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/types/features/employee.types";
import { PayrollStatus } from "@/types/features/payroll.types";

interface EmployeeWithPayroll extends Employee {
  payroll: {
    regularHours: number;
    overtimeHours: number;
    totalHours: number;
    grossPay: number;
    status: PayrollStatus;
  };
}

interface TimesheetTableProps {
  employees: EmployeeWithPayroll[];
  periodStart: Date;
  periodEnd: Date;
  onEditTime: (employeeId: number) => void;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({
  employees,
  onEditTime,
}) => {
  useEffect(() => {
    console.log(employees);
  }, [employees]);

  if (!employees.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <CalendarSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Payroll Data Available</h3>
        <p className="text-muted-foreground">
          No payroll records found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead className="text-right">Regular Hours</TableHead>
            <TableHead className="text-right">Overtime Hours</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Hourly Rate</TableHead>
            <TableHead className="text-right">Total Pay</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.firstName} {employee.lastName}
              </TableCell>
              <TableCell className="text-right">
                {employee.payroll.regularHours.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {employee.payroll.overtimeHours.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {employee.payroll.totalHours.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                ${Number(employee.payRate).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${employee.payroll.grossPay.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    employee.payroll.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {employee.payroll.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTime(employee.id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Time
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimesheetTable;
