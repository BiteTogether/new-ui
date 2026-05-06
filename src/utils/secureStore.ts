import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const FCM_TOKEN_KEY = "fcmToken";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveRefreshToken(refreshToken: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveFcmToken(fcmToken: string) {
  await SecureStore.setItemAsync(FCM_TOKEN_KEY, fcmToken);
}

export async function getFcmToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
}

export async function deleteFcmToken() {
  await SecureStore.deleteItemAsync(FCM_TOKEN_KEY);
}
