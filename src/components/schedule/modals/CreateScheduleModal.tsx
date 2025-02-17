import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useScheduleForm } from "@/hooks/useScheduleForm";
import { ScheduleFormFields } from "../components/ScheduleForm";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { CreateBulkScheduleDto } from "@/types/features/schedule.types";
import { useEmployeeStore } from "@/store/employee.store";
import { useEffect } from "react";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBulkScheduleDto) => Promise<void>;
  locations: string[];
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  locations,
}: CreateScheduleModalProps) {
  const {
    formState,
    isSubmitting,
    validationError,
    setFormState,
    handleSubmit,
    resetForm,
  } = useScheduleForm(onSubmit);

  const {
    employees,
    fetchEmployees,
    isLoading: isLoadingEmployees,
  } = useEmployeeStore();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, fetchEmployees]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
          </DialogHeader>

          {isLoadingEmployees ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner text="Loading employees..." />
            </div>
          ) : (
            <ScheduleFormFields
              formState={formState}
              onFieldChange={(field, value) =>
                setFormState((prev) => ({ ...prev, [field]: value }))
              }
              employees={employees.map((emp) => ({
                id: emp.id,
                firstName: emp.firstName,
                lastName: emp.lastName,
                email: emp.email,
              }))}
              locations={locations}
              validationError={validationError}
              isSubmitting={isSubmitting}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoadingEmployees}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingEmployees}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating...
                </div>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
