import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";

export const updateUserState = (
  state: "FOREGROUND" | "BACKGROUND" | "OFFLINE",
) => {
  return apiService.put(API_ENDPOINTS.NOTI.USER_STATE, {
    state,
  });
};

export const updateDeviceToken = (deviceToken: string) => {
  return apiService.put(API_ENDPOINTS.NOTI.DEVICE_TOKEN, {
    deviceToken,
  });
};

export const getPushEnabled = () => {
  return apiService.get(API_ENDPOINTS.NOTI.GET_PUSH_ENABLED);
};

export const updatePushEnabled = (pushNotificationEnabled: boolean) => {
  return apiService.put(API_ENDPOINTS.NOTI.UPDATE_PUSH_ENABLED, {
    pushNotificationEnabled,
  });
};
