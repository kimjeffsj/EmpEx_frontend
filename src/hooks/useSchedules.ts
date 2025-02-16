import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { scheduleApi } from "@/lib/api/schedule.api";
import { employeeApi } from "@/lib/api/employee.api";

export function useSchedules(currentDate: Date) {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Schedules query
  const { data: schedules, isLoading: isSchedulesLoading } = useQuery({
    queryKey: ["schedules", currentDate],
    queryFn: () =>
      scheduleApi.getSchedules({
        startDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ),
        endDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ),
      }),
  });

  // Employees list query
  const { data: employees, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      employeeApi.getEmployees({
        page: 1,
        limit: 100,
        isResigned: false,
      }),
  });

  // Locations list query
  const { data: locations, isLoading: isLocationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => scheduleApi.getLocations(),
  });

  // Create schedule mutation
  const { mutate: createSchedule } = useMutation({
    mutationFn: scheduleApi.createBulkSchedules,
    onSuccess: () => {
      toast.success("Schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: any) => {
      toast.error(
        "Failed to create schedule",
        error?.error?.message || "Please try again"
      );
    },
  });

  return {
    schedules: schedules?.data?.data || [],
    employees: employees?.data?.data || [],
    locations: locations?.data || [],
    isLoading: isSchedulesLoading || isEmployeesLoading || isLocationsLoading,
    createSchedule,
  };
}
