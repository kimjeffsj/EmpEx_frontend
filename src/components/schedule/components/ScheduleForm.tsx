import { EmployeeSelect, EmployeeSelection } from "../shared/EmployeeSelect";
import { TimeRangePicker } from "../shared/TimeRangePicker";
import { LocationSelect } from "../shared/LocationSelect";
import { FormState } from "@/hooks/useScheduleForm";
import { Label } from "@/components/ui/label";

interface ScheduleFormFieldsProps {
  formState: FormState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFieldChange: (field: keyof FormState, value: any) => void;
  employees: EmployeeSelection[];
  locations: string[];
  validationError?: string | null;
}

export function ScheduleFormFields({
  formState,
  onFieldChange,
  employees,
  locations,
  validationError,
}: ScheduleFormFieldsProps) {
  return (
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
        />
      </div>

      <div className="space-y-2">
        <Label>Schedule Time</Label>
        <TimeRangePicker
          startDate={formState.startDate}
          endDate={formState.endDate}
          onStartDateChange={(date) => onFieldChange("startDate", date)}
          onEndDateChange={(date) => onFieldChange("endDate", date)}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <LocationSelect
          locations={locations}
          value={formState.location}
          onChange={(location) => onFieldChange("location", location)}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <textarea
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Add any additional notes..."
        />
      </div>
    </div>
  );
}
