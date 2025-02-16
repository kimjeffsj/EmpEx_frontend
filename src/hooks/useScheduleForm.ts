import { useState } from "react";
import { z } from "zod";
import { CreateBulkScheduleDto } from "@/types/schedule.types";
import { EmployeeSelection } from "@/components/schedule/shared/EmployeeSelect";
import { APIError } from "@/lib/utils/api.utils";

const scheduleSchema = z.object({
  employeeIds: z
    .array(z.number())
    .min(1, "At least one employee must be selected"),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export interface FormState {
  selectedEmployees: EmployeeSelection[];
  startDate: Date;
  endDate: Date;
  location: string;
  notes?: string;
}

const initialFormState: FormState = {
  selectedEmployees: [],
  startDate: new Date(),
  endDate: new Date(),
  location: "",
  notes: "",
};

export function useScheduleForm(
  onSubmit: (data: CreateBulkScheduleDto) => Promise<void>
) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    try {
      const { selectedEmployees, startDate, endDate } = formState;

      scheduleSchema.parse({
        employeeIds: selectedEmployees.map((emp) => emp.id),
        startTime: startDate,
        endTime: endDate,
        location: formState.location,
        notes: formState.notes,
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
    setValidationError(null);

    try {
      await onSubmit({
        employeeIds: formState.selectedEmployees.map((emp) => emp.id),
        startTime: formState.startDate,
        endTime: formState.endDate,
        location: formState.location || undefined,
        notes: formState.notes,
      });
    } catch (error) {
      setValidationError(
        error instanceof APIError ? error.message : "Failed to create schedule"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setValidationError(null);
  };

  return {
    formState,
    isSubmitting,
    validationError,
    setFormState,
    handleSubmit,
    resetForm,
  };
}
