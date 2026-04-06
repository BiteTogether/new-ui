import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import { ValidateRequest, ValidateResponse } from "../../types/user";

export const validateInfo = (data: ValidateRequest) => {
  return apiService.post<ValidateResponse>(API_ENDPOINTS.USER.VALIDATE, data);
};
