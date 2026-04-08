import apiService from "../index";
import { API_ENDPOINTS } from "../endpoints";
import { ValidateRequest, ValidateResponse, UserInfo } from "../../types/user";

export const validateInfo = (data: ValidateRequest) => {
  return apiService.post<ValidateResponse>(API_ENDPOINTS.USER.VALIDATE, data);
};

export const getMyInfo = () => {
  return apiService.get<UserInfo>(API_ENDPOINTS.USER.MY_INFO.GET);
};

export const updateMyInfo = (
  id: number,
  username: string,
  fullName: string,
) => {
  const endpoint = API_ENDPOINTS.USER.MY_INFO.UPDATE.replace(
    "{id}",
    id.toString(),
  );
  return apiService.put<Partial<UserInfo>>(endpoint, { username, fullName });
};

export const deleteMyInfo = (id: number) => {
  const endpoint = API_ENDPOINTS.USER.MY_INFO.DELETE.replace(
    "{id}",
    id.toString(),
  );
  return apiService.delete(endpoint);
};

// export const uploadAvatar = (id: number, avatarFile: File) => {
//   const endpoint = API_ENDPOINTS.USER.MY_INFO.UPLOAD_AVATAR.replace(
//     "{id}",
//     id.toString(),
//   );
//   const formData = new FormData();
//   formData.append("avatar", avatarFile);
//   return apiService.post(endpoint, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };

// export const deleteAvatar = (id: number) => {
//   const endpoint = API_ENDPOINTS.USER.MY_INFO.DELETE_AVATAR.replace(
//     "{id}",
//     id.toString(),
//   );
//   return apiService.delete(endpoint);
// };

// export const searchUsers = (query: string) => {
//   const endpoint =
//     API_ENDPOINTS.USER.MY_INFO.SEARCH +
//     `    ?query=${encodeURIComponent(query)}`;
//   return apiService.get<UserInfo[]>(endpoint);
// };
