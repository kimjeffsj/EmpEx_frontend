import { format, parseISO, isValid } from "date-fns";
import { ISODateString, TimeRange, WorkHours } from "@/types/date.types";

// ISO 문자열을 Date 객체로 안전하게 변환
export const safeParseISO = (
  dateString: ISODateString | null | undefined
): Date | null => {
  if (!dateString) return null;
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : null;
};

// Date 객체를 ISO 문자열로 변환
export const formatISO = (
  date: Date | null | undefined
): ISODateString | null => {
  if (!date || !isValid(date)) return null;
  return date.toISOString();
};

// 날짜 표시 포맷
export const formatDate = (
  date: ISODateString | Date | null | undefined,
  formatStr: string = "PPP"
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatStr) : "";
};

// 근무 시간 계산
export const calculateWorkHours = ({
  startTime,
  endTime,
}: TimeRange): WorkHours => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  if (!isValid(start) || !isValid(end)) {
    throw new Error("Invalid date format");
  }

  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const regularHours = Math.min(diffHours, 8);
  const overtimeHours = Math.max(0, diffHours - 8);

  return {
    regularHours,
    overtimeHours,
    totalHours: diffHours,
  };
};

// 날짜가 유효한 범위 내에 있는지 확인
export const isDateInRange = (
  date: ISODateString,
  range: { startDate: ISODateString; endDate: ISODateString }
): boolean => {
  const checkDate = parseISO(date);
  const startDate = parseISO(range.startDate);
  const endDate = parseISO(range.endDate);

  return (
    isValid(checkDate) &&
    isValid(startDate) &&
    isValid(endDate) &&
    checkDate >= startDate &&
    checkDate <= endDate
  );
};
