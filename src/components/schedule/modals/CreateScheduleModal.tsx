import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateBulkScheduleDto } from "@/types/schedule.types";
import { Employee } from "@/types/manager-employeeList.types";
import { useScheduleForm } from "@/hooks/useScheduleForm";
import { ScheduleFormFields } from "../components/ScheduleForm";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBulkScheduleDto) => Promise<void>;
  employees: Employee[];
  locations: string[];
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
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

          <ScheduleFormFields
            formState={formState}
            onFieldChange={(field, value) =>
              setFormState((prev) => ({ ...prev, [field]: value }))
            }
            employees={employees}
            locations={locations}
            validationError={validationError}
            isSubmitting={isSubmitting}
          />

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
