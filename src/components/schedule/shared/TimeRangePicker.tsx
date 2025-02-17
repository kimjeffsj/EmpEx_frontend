"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
}

export function TimeRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled,
  className,
}: TimeRangePickerProps) {
  const formatTimeForInput = (date: Date) => {
    return format(date, "hh:mm a"); // 12시간 형식으로 변경 (AM/PM 포함)
  };

  const timeOptions = () => {
    const options = [];
    // 10 AM부터 12 AM(자정)까지
    for (let hour = 10; hour <= 24; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour; // 12시간 형식으로 변환
      const period = hour >= 12 && hour < 24 ? "PM" : "AM";

      for (let minute = 0; minute < 60; minute += 15) {
        // 24시(12 AM)인 경우 00:00만 추가
        if (hour === 24 && minute > 0) continue;

        const timeString = `${displayHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
        options.push({
          label: timeString,
          value: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
        });
      }
    }
    return options;
  };

  const handleTimeSelect = (
    timeStr: string,
    date: Date,
    onChange: (date: Date) => void
  ) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className={cn("grid gap-4", className)}>
      {/* Start Date Time */}
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={disabled}
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onStartDateChange(date)}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            disabled={disabled}
            defaultValue="select"
            value={formatTimeForInput(startDate) ?? "select"}
            onValueChange={(value) =>
              handleTimeSelect(value, startDate, onStartDateChange)
            }
          >
            <SelectTrigger className="w-full">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue defaultValue="select">Select Time</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select" disabled>
                Select time
              </SelectItem>
              {timeOptions().map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Date Time */}
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={disabled}
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && onEndDateChange(date)}
                disabled={(date) => isDateDisabled(date) || date < startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            disabled={disabled}
            defaultValue="select"
            value={formatTimeForInput(endDate) ?? "select"}
            onValueChange={(value) =>
              handleTimeSelect(value, endDate, onEndDateChange)
            }
          >
            <SelectTrigger className="w-full">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue defaultValue="select">
                <SelectValue defaultValue="select">Select Time</SelectValue>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select" disabled>
                Select time
              </SelectItem>
              {timeOptions().map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
