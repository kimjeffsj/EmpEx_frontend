"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface EmployeeSelection {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface EmployeeSelectProps {
  employees: EmployeeSelection[];
  selectedEmployees: EmployeeSelection[];
  onSelect: (employee: EmployeeSelection) => void;
  onRemove: (employeeId: number) => void;
  className?: string;
}

export function EmployeeSelect({
  employees,
  selectedEmployees,
  onSelect,
  onRemove,
  className,
}: EmployeeSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between hover:bg-background"
          >
            <span className="truncate">
              {selectedEmployees.length > 0
                ? `${selectedEmployees.length} employee(s) selected`
                : "Select employees..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search employees..." />
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => {
                const isSelected = selectedEmployees.some(
                  (selected) => selected.id === employee.id
                );

                return (
                  <CommandItem
                    key={employee.id}
                    onSelect={() => {
                      if (!isSelected) {
                        onSelect(employee);
                      }
                    }}
                    value={`${employee.firstName} ${employee.lastName}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>
                        {employee.firstName} {employee.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {employee.email}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Employees Badges */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((employee) => (
            <Badge
              key={employee.id}
              variant="secondary"
              className="gap-1 px-3 py-2"
            >
              <span>
                {employee.firstName} {employee.lastName}
              </span>
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRemove(employee.id);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => onRemove(employee.id)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
