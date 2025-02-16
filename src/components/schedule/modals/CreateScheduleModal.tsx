import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  EmployeeSelect,
  EmployeeSelection,
} from "@/components/schedule/shared/EmployeeSelect";
import { TimeRangePicker } from "@/components/schedule/shared/TimeRangePicker";
import { LocationSelect } from "@/components/schedule/shared/LocationSelect";
import { Label } from "@/components/ui/label";
import { CreateBulkScheduleDto } from "@/types/schedule.types";
import { z } from "zod";

const scheduleSchema = z.object({
  employeeIds: z
    .array(z.number())
    .min(1, "At least one employee must be selected"),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBulkScheduleDto) => void;
  employees: EmployeeSelection[];
  locations: string[];
}

interface FormState {
  selectedEmployees: EmployeeSelection[];
  startDate: Date;
  endDate: Date;
  location: string;
}

const initialFormState: FormState = {
  selectedEmployees: [],
  startDate: new Date(),
  endDate: new Date(),
  location: "",
};

export function CreateScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
  locations,
}: CreateScheduleModalProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleEmployeeChange = (employees: EmployeeSelection[]) => {
    setFormState((prev) => ({ ...prev, selectedEmployees: employees }));
    setValidationError(null);
  };

  const handleTimeChange = (type: "start" | "end", date: Date) => {
    setFormState((prev) => ({
      ...prev,
      [type === "start" ? "startDate" : "endDate"]: date,
    }));
    setValidationError(null);
  };

  const handleLocationChange = (location: string) => {
    setFormState((prev) => ({ ...prev, location }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, notes: e.target.value }));
  };

  const validateForm = (): boolean => {
    try {
      const { selectedEmployees, startDate, endDate } = formState;

      scheduleSchema.parse({
        employeeIds: selectedEmployees.map((emp) => emp.id),
        startTime: startDate,
        endTime: endDate,
        location: formState.location,
      });

      if (startDate >= endDate) {
        throw new Error("End time must be after start time");
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else if (error instanceof Error) {
        setValidationError(error.message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        employeeIds: formState.selectedEmployees.map((emp) => emp.id),
        startTime: formState.startDate,
        endTime: formState.endDate,
        location: formState.location || undefined,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormState(initialFormState);
    setValidationError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {validationError && (
              <div className="text-sm text-destructive">{validationError}</div>
            )}

            <div className="space-y-2">
              <Label>Employees</Label>
              <EmployeeSelect
                employees={employees}
                selectedEmployees={formState.selectedEmployees}
                onSelect={(employee) =>
                  handleEmployeeChange([
                    ...formState.selectedEmployees,
                    employee,
                  ])
                }
                onRemove={(employeeId) =>
                  handleEmployeeChange(
                    formState.selectedEmployees.filter(
                      (emp) => emp.id !== employeeId
                    )
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Schedule Time</Label>
              <TimeRangePicker
                startDate={formState.startDate}
                endDate={formState.endDate}
                onStartDateChange={(date) => handleTimeChange("start", date)}
                onEndDateChange={(date) => handleTimeChange("end", date)}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <LocationSelect
                locations={locations}
                value={formState.location}
                onChange={handleLocationChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                onChange={handleNotesChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
