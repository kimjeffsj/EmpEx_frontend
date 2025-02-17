import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { scheduleApi } from "@/lib/api/schedule.api";
import { employeeApi } from "@/lib/api/employee.api";

import { APIError } from "@/lib/utils/api.utils";

export function useSchedules({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  // 스케줄 쿼리
  const {
    data: scheduleResponse,
    isLoading: isSchedulesLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ["schedules", startDate, endDate],
    queryFn: () =>
      scheduleApi.getSchedules({
        startDate,
        endDate,
      }),
  });

  // 직원 목록 쿼리
  const { data: employeeResponse, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      employeeApi.getEmployees({
        page: 1,
        limit: 100,
        isResigned: false,
      }),
  });

  // 근무 장소 목록 쿼리
  const { data: locationResponse, isLoading: isLocationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => scheduleApi.getLocations(),
  });

  // 스케줄 생성 뮤테이션
  const { mutateAsync: createSchedule } = useMutation({
    mutationFn: scheduleApi.createBulkSchedules,
    onSuccess: () => {
      toast.success("Schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: unknown) => {
      toast.error(
        "Failed to create schedule",
        error instanceof APIError ? error.message : "Please try again"
      );
    },
  });

  return {
    schedules: scheduleResponse?.data?.data || [],
    employees: employeeResponse?.data?.data || [],
    locations: locationResponse?.data || [],
    isLoading: isSchedulesLoading || isEmployeesLoading || isLocationsLoading,
    error:
      scheduleError instanceof APIError
        ? scheduleError.message
        : scheduleError?.toString(),
    createSchedule,
  };
}
