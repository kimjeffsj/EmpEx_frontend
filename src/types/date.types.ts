// ISO 날짜 문자열 타입
export type ISODateString = string;

// 날짜 범위 인터페이스
export interface DateRange {
  startDate: ISODateString;
  endDate: ISODateString;
}

// 기간 타입 (payroll 등에서 사용)
export type PeriodType = "FIRST_HALF" | "SECOND_HALF";

// 날짜 필터 인터페이스
export interface DateFilter {
  startDate?: ISODateString;
  endDate?: ISODateString;
}

// 기간 정보 인터페이스
export interface Period extends DateRange {
  type: PeriodType;
}

// 달력 이벤트 기본 인터페이스
export interface CalendarEvent {
  id: number;
  title: string;
  start: ISODateString;
  end: ISODateString;
  allDay?: boolean;
}

// 시간 범위 인터페이스
export interface TimeRange {
  startTime: ISODateString;
  endTime: ISODateString;
}

// 근무 시간 계산 결과 인터페이스
export interface WorkHours {
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
}
