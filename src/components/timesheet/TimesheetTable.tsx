import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Employee } from "@/types/manager-employeeList.types";

interface TimesheetTableProps {
  employees: Employee[];
  periodStart: Date;
  periodEnd: Date;
  onEditTime: (employeeId: number) => void;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({
  employees,
  periodStart,
  periodEnd,
  onEditTime,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead>Work Period</TableHead>
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
              <TableCell>
                {format(periodStart, "yyyy-MM-dd")} ~{" "}
                {format(periodEnd, "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="text-right">40.0</TableCell>
              <TableCell className="text-right">2.5</TableCell>
              <TableCell className="text-right">42.5</TableCell>
              <TableCell className="text-right">
                ${employee.payRate?.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">$680.00</TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                  Completed
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
