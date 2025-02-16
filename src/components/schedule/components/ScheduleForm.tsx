import { EmployeeSelect, EmployeeSelection } from "../shared/EmployeeSelect";
import { TimeRangePicker } from "../shared/TimeRangePicker";
import { LocationSelect } from "../shared/LocationSelect";
import { FormState } from "@/hooks/useScheduleForm";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScheduleFormFieldsProps {
  formState: FormState;
  onFieldChange: (field: keyof FormState, value: any) => void;
  employees: EmployeeSelection[];
  locations: string[];
  validationError?: string | null;
  isSubmitting?: boolean;
}

export function ScheduleFormFields({
  formState,
  onFieldChange,
  employees,
  locations,
  validationError,
  isSubmitting,
}: ScheduleFormFieldsProps) {
  return (
    <div className="grid gap-6 py-4">
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Employees</Label>
        <EmployeeSelect
          employees={employees}
          selectedEmployees={formState.selectedEmployees}
          onSelect={(employee) =>
            onFieldChange("selectedEmployees", [
              ...formState.selectedEmployees,
              employee,
            ])
          }
          onRemove={(employeeId) =>
            onFieldChange(
              "selectedEmployees",
              formState.selectedEmployees.filter((emp) => emp.id !== employeeId)
            )
          }
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Schedule Time</Label>
        <TimeRangePicker
          startDate={formState.startDate}
          endDate={formState.endDate}
          onStartDateChange={(date) => onFieldChange("startDate", date)}
          onEndDateChange={(date) => onFieldChange("endDate", date)}
          disabled={isSubmitting}
          minDate={new Date()} // Prevent past dates
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <LocationSelect
          locations={locations}
          value={formState.location}
          onChange={(location) => onFieldChange("location", location)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <textarea
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Add any additional notes..."
          value={formState.notes || ""}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}
