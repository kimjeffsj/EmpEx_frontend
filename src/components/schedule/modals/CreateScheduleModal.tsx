import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeSelect } from "@/components/schedule/shared/EmployeeSelect";
import { TimeRangePicker } from "@/components/schedule/shared/TimeRangePicker";
import { LocationSelect } from "@/components/schedule/shared/LocationSelect";
import { useScheduleStore } from "@/store/schedule.store";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: string[];
  employees: Employee[];
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  locations,
  employees,
}: CreateScheduleModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { createBulkSchedules } = useScheduleStore();
  const toastHandler = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      toastHandler.error("Error", "Please select at least one employee");
      return;
    }

    if (startDate >= endDate) {
      toastHandler.error("Error", "End time must be after start time");
      return;
    }

    try {
      setIsLoading(true);
      await createBulkSchedules({
        employeeIds: selectedEmployees.map((emp) => emp.id),
        startTime: startDate,
        endTime: endDate,
        location,
      });

      toastHandler.success("Success", "Schedule created successfully");
      handleClose();
    } catch (error) {
      toastHandler.error("Error", "Failed to create schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployees([]);
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation("");
    setNotes("");
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
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label>Employees</Label>
              <EmployeeSelect
                employees={employees}
                selectedEmployees={selectedEmployees}
                onSelect={(employee) =>
                  setSelectedEmployees([...selectedEmployees, employee])
                }
                onRemove={(employeeId) =>
                  setSelectedEmployees(
                    selectedEmployees.filter((emp) => emp.id !== employeeId)
                  )
                }
              />
            </div>

            {/* Time Range Selection */}
            <div className="space-y-2">
              <Label>Schedule Time</Label>
              <TimeRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>

            {/* Location Selection */}
            <div className="space-y-2">
              <Label>Location</Label>
              <LocationSelect
                locations={locations}
                value={location}
                onChange={setLocation}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
