import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addMinutes, setHours, setMinutes, isValid } from "date-fns";
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
import { useState } from "react";

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
  const [hasStartTime, setHasStartTime] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);

  // 시간 옵션 생성 (10 AM to 12 AM)
  const generateTimeOptions = () => {
    const options = [];
    const interval = 15; // 15분 간격

    // 시작 시간을 10시로 설정
    let currentTime = new Date();
    currentTime = setHours(currentTime, 10);
    currentTime = setMinutes(currentTime, 0);

    // 자정까지 15분 간격으로 시간 옵션 생성
    const endTime = setHours(new Date(), 24);

    while (currentTime <= endTime) {
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 && hour < 24 ? "PM" : "AM";

      const timeString = format(currentTime, "HH:mm");
      const displayString = `${formattedHour}:${minute
        .toString()
        .padStart(2, "0")} ${period}`;

      options.push({
        value: timeString,
        label: displayString,
      });

      currentTime = addMinutes(currentTime, interval);
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (
    timeStr: string,
    date: Date,
    onChange: (date: Date) => void,
    setHasTime: (has: boolean) => void
  ) => {
    if (timeStr === "select") return;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
    setHasTime(true);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getTimeString = (date: Date, hasTime: boolean) => {
    if (!hasTime) return "select";
    return format(date, "HH:mm");
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
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setHours(0, 0, 0, 0);
                    onStartDateChange(newDate);
                    setHasStartTime(false);
                  }
                }}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            disabled={disabled || !isValid(startDate)}
            value={getTimeString(startDate, hasStartTime)}
            onValueChange={(value) =>
              handleTimeSelect(
                value,
                startDate,
                onStartDateChange,
                setHasStartTime
              )
            }
          >
            <SelectTrigger className="w-full">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Start Time">
                {hasStartTime ? format(startDate, "hh:mm a") : "Start Time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="select">Start Time</SelectItem>
              {timeOptions.map((time) => (
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
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setHours(0, 0, 0, 0);
                    onEndDateChange(newDate);
                    setHasEndTime(false);
                  }
                }}
                disabled={(date) => isDateDisabled(date) || date < startDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            disabled={disabled || !isValid(endDate)}
            value={getTimeString(endDate, hasEndTime)}
            onValueChange={(value) =>
              handleTimeSelect(value, endDate, onEndDateChange, setHasEndTime)
            }
          >
            <SelectTrigger className="w-full">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="End Time">
                {hasEndTime ? format(endDate, "hh:mm a") : "End Time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="select">End Time</SelectItem>
              {timeOptions.map((time) => (
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
