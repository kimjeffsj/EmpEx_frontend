"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import {
  Calendar,
  Users,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateScheduleModal } from "@/components/schedule/modals/CreateScheduleModal";
import { Badge } from "@/components/ui/badge";
import { useScheduleStore } from "@/store/schedule.store";
import LoadingSpinner from "@/components/common/loading-spinner";
import ErrorFallback from "@/components/common/error-fallback";
import { Timesheet } from "@/types/features/timesheet.types";

export default function SchedulesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    schedules,
    locations,
    isLoading,
    error,
    fetchSchedules,
    fetchLocations,
    createBulkSchedules,
  } = useScheduleStore();

  // 월 변경시 데이터 다시 불러오기
  useEffect(() => {
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);

    fetchSchedules({
      startDate: startOfMonthDate,
      endDate: endOfMonthDate,
      limit: 1000, // limit 1000 설정, 1000개의 스케줄까지 한 달력에 표시 가능
    });
    fetchLocations();
  }, [currentDate, fetchSchedules, fetchLocations]);

  // 달력에 표시할 날짜들 계산
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  // 스케줄 생성 후 처리
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScheduleCreate = async (data: any) => {
    await createBulkSchedules(data);
    setIsCreateModalOpen(false);
  };

  // 날짜별 스케줄 그룹화
  const getSchedulesForDate = (date: Date): Timesheet[] => {
    if (!schedules?.length) {
      return [];
    }

    const matchingSchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.startTime);
      const isSameDay =
        scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear();

      return isSameDay;
    });

    return matchingSchedules;
  };

  if (error) {
    return <ErrorFallback message={error} />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Schedule Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize employee schedules
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold ml-2">
                {format(currentDate, "MMMM yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View by Employee
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setCurrentDate(new Date())}
            >
              <Calendar className="h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[500px] flex items-center justify-center">
            <LoadingSpinner text="Loading schedules..." />
          </div>
        ) : (
          /* Calendar Grid */
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {/* Calendar Header */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-card p-2 text-center text-sm font-medium"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map((date) => {
              const daySchedules = getSchedulesForDate(date);
              const isToday =
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={date.toISOString()}
                  className={`bg-card min-h-[120px] p-2 hover:bg-accent/50 transition-colors ${
                    isToday ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isToday
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="text-xs p-1 rounded bg-primary/10 cursor-pointer hover:bg-primary/20"
                      >
                        <div className="font-medium">
                          {format(new Date(schedule.startTime), "HH:mm")} -
                          {format(new Date(schedule.endTime), "HH:mm")}
                        </div>
                        <div className="truncate">
                          {schedule.employee.firstName}{" "}
                          {schedule.employee.lastName}
                        </div>
                        {schedule.location && (
                          <Badge variant="outline" className="mt-1">
                            {schedule.location}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleScheduleCreate}
        locations={locations}
      />
    </div>
  );
}
