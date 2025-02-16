"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    return format(date, "HH:mm");
  };

  const handleTimeChange = (
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

          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              disabled={disabled}
              value={formatTimeForInput(startDate)}
              onChange={(e) =>
                handleTimeChange(e.target.value, startDate, onStartDateChange)
              }
              className="pl-9"
            />
          </div>
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

          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              disabled={disabled}
              value={formatTimeForInput(endDate)}
              onChange={(e) =>
                handleTimeChange(e.target.value, endDate, onEndDateChange)
              }
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
