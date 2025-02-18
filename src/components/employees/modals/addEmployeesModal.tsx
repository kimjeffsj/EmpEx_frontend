import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { APIError } from "@/lib/utils/api.utils";
import { employeeApi } from "@/lib/api/employee.api";

// API 응답에 맞춘 Zod 스키마
const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),

  sinNumber: z
    .string()
    .length(9, "SIN number must be 9 digits")
    .regex(/^\d+$/, "SIN number must contain only numbers"),
  address: z.string().min(1, "Address is required").max(200),
  email: z.string().email("Invalid email address").max(100),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  payRate: z.number().min(17.5, "Minimum pay rate is $17.50"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      payRate: 17.5,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  const dateOfBirth = watch("dateOfBirth");
  const startDate = watch("startDate");

  const handleSubmitForm = async (data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);

      // API 요구사항에 맞게 데이터 포맷
      const formattedData = {
        ...data,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        startDate: format(data.startDate, "yyyy-MM-dd"),
      };

      await employeeApi.createEmployee(formattedData);

      toast.success("Employee created successfully");
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        "Failed to create employee",
        error instanceof APIError ? error.message : "Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  disabled={isSubmitting}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  disabled={isSubmitting}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* SIN Number */}
            <div className="space-y-2">
              <Label htmlFor="sinNumber">SIN Number</Label>
              <Input
                id="sinNumber"
                {...register("sinNumber")}
                maxLength={9}
                pattern="\d*"
                inputMode="numeric"
                disabled={isSubmitting}
                placeholder="Enter 9-digit SIN number"
              />
              {errors.sinNumber && (
                <p className="text-sm text-destructive">
                  {errors.sinNumber.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={isSubmitting}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                disabled={isSubmitting}
                placeholder="123 Main St, Vancouver, BC, V6A 1A1"
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => date && setValue("dateOfBirth", date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown"
                      showOutsideDays={false}
                      fixedWeeks
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setValue("startDate", date)}
                      disabled={(date) => date < new Date("2020-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pay Rate */}
            <div className="space-y-2">
              <Label htmlFor="payRate">Pay Rate ($/hr)</Label>
              <Input
                id="payRate"
                type="number"
                step="0.01"
                min="17.50"
                {...register("payRate", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.payRate && (
                <p className="text-sm text-destructive">
                  {errors.payRate.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
