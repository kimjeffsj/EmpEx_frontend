// src/app/(dashboard)/manager/schedules/page.tsx
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
import { useScheduleStore } from "@/store/schedule.store";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { Employee } from "@/types/manager-employeeList.types";
import { employeeApi } from "@/lib/api/employee.api";
import { scheduleApi } from "@/lib/api/schedule.api";

export default function SchedulesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchSchedules, schedules } = useScheduleStore();
  const toast = useToast();

  // 직원 목록 불러오기
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await employeeApi.getEmployees({
          page: 1,
          limit: 100, // 충분히 큰 수로 설정
          isResigned: false, // 퇴사하지 않은 직원만
        });
        if (!response.data) {
          return new Error("Fetching Employees failed");
        }
        setEmployees(response.data.data);
      } catch (error) {
        toast.error("Error", "Failed to load employees");
      }
    };

    loadEmployees();
  }, [toast]);

  // 위치 목록 불러오기
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await scheduleApi.getLocations();
        if (response.data) {
          setLocations(response.data);
        }
      } catch (error) {
        toast.error("Error", "Failed to load Locations");
      }
    };

    loadLocations();
  }, [toast]);

  // 현재 월의 스케줄 불러오기
  useEffect(() => {
    const loadSchedules = async () => {
      setIsLoading(true);
      try {
        await fetchSchedules();
      } catch (error) {
        toast.error("Failed to load schedules");
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [currentDate, toast]);

  // 달력에 표시할 날짜들 계산
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // 이전/다음 달로 이동
  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

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
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
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
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Month
              </Button>
              <Button variant="ghost" size="sm">
                Week
              </Button>
              <Button variant="ghost" size="sm">
                Day
              </Button>
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

        {/* Calendar Grid */}
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
            const daySchedules = schedules.filter(
              (schedule) =>
                format(new Date(schedule.startTime), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
            );

            return (
              <div
                key={date.toISOString()}
                className="bg-card min-h-[120px] p-2 hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm text-muted-foreground">
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
      </Card>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        employees={employees}
        locations={locations}
      />
    </div>
  );
}
