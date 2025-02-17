import { useState } from "react";
import { z } from "zod";
import { CreateBulkScheduleDto } from "@/types/features/schedule.types";
import { EmployeeSelection } from "@/components/schedule/shared/EmployeeSelect";
import { APIError } from "@/lib/utils/api.utils";
import { usePayrollStore } from "@/store/payroll.store";

const scheduleSchema = z.object({
  employeeIds: z
    .array(z.number())
    .min(1, "At least one employee must be selected"),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
  notes: z.string().optional(),
  payPeriodId: z.number(),
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
  const { periods } = usePayrollStore();

  const validateForm = (): { isValid: boolean; payPeriodId?: number } => {
    try {
      const { selectedEmployees, startDate, endDate } = formState;

      // 시작 시간이 종료 시간보다 이후인지 확인
      if (startDate >= endDate) {
        throw new Error("End time must be after start time");
      }

      // 현재 급여 기간 찾기
      const currentPayPeriod = periods.find((period) => {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        return startDate >= periodStart && startDate <= periodEnd;
      });

      if (!currentPayPeriod) {
        throw new Error("Selected date is not within any active pay period");
      }

      // Zod 스키마 검증
      scheduleSchema.parse({
        employeeIds: selectedEmployees.map((emp) => emp.id),
        startTime: startDate,
        endTime: endDate,
        location: formState.location,
        notes: formState.notes,
        payPeriodId: currentPayPeriod.id,
      });

      return { isValid: true, payPeriodId: currentPayPeriod.id };
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError("An unknown error occurred");
      }
      return { isValid: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid || !validation.payPeriodId) return;

    setIsSubmitting(true);
    setValidationError(null);

    try {
      await onSubmit({
        employeeIds: formState.selectedEmployees.map((emp) => emp.id),
        startTime: formState.startDate,
        endTime: formState.endDate,
        location: formState.location || undefined,

        payPeriodId: validation.payPeriodId,
      });
    } catch (error) {
      if (error instanceof APIError) {
        setValidationError(error.message);
      } else if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError("Failed to create schedule");
      }
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
