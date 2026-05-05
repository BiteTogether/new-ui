import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";

export const updateUserState = (
  state: "FOREGROUND" | "BACKGROUND" | "OFFLINE",
) => {
  return apiService.post(API_ENDPOINTS.NOTI.USER_STATE, {
    state,
  });
};
