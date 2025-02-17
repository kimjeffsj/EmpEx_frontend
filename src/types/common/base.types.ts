export type ID = number;

export interface BaseFilter {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
