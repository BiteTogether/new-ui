// API Response types
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
}

export interface GetListParams {
  page: number;
  size?: number;
}
