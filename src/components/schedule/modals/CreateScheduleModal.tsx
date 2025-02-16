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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
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
              {isSubmitting ? "Creating..." : "Create Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
