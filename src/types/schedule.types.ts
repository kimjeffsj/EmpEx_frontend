export enum ScheduleStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// DTO for creating single Schedule
export interface CreateScheduleDto {
  employeeId: number;
  startTime: Date;
  endTime: Date;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: number;
}

// DTO for creating multiple Schedules
export interface CreateBulkScheduleDto {
  employeeIds: number[];
  startTime: Date;
  endTime: Date;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  payPeriodId?: number;
}

// DTO for updating Schedule
export interface UpdateScheduleDto {
  startTime?: Date;
  endTime?: Date;
  location?: string;
  isHoliday?: boolean;
  holidayName?: string;
  status?: ScheduleStatus;
  reviewComment?: string;
}

export interface SingleScheduleResponse {
  data: Schedule;
}

export interface ScheduleResponse {
  data: Schedule[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Response type for Schedule
export interface Schedule {
  id: number;
  employeeId: number;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
  startTime: Date;
  endTime: Date;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  totalPay: number;
  status: ScheduleStatus;
  location?: string;
  isHoliday: boolean;
  holidayName?: string;
  reviewComment?: string;
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  lastReviewedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Filter options for Schedule list
export interface ScheduleFilters {
  employeeId?: number;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
}

// Paginated Schedule list response
export interface PaginatedScheduleResponse {
  data: ScheduleResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface ScheduleViewFilters {
  location?: string;
  employeeId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: ScheduleStatus;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  status: ScheduleStatus;
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  reviewReason?: string;
  reviewComment?: string;
}

export interface ReviewRequestDto {
  reviewReason: string;
  startTime: Date;
  endTime: Date;
}

export interface ReviewResponseDto {
  reviewComment: string;
  status: ScheduleStatus;
}

export interface LocationResponse {
  data: string[];
}

export interface ScheduleStore {
  // 상태
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  locations: string[];
  filters: ScheduleViewFilters;

  // 액션
  fetchSchedules: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  setFilter: (filter: Partial<ScheduleViewFilters>) => void;
  requestReview: (id: number, data: ReviewRequestDto) => Promise<void>;
  processReview: (id: number, data: ReviewResponseDto) => Promise<void>;
}
