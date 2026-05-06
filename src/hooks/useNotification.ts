import { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { saveFcmToken } from "../utils/secureStore";
import { updatePushEnabled } from "../services/api/notiApi";

const requestUserPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log("Notification permission granted");
    await updatePushEnabled(true);
  } else {
    console.log("Notification permission denied");
    await updatePushEnabled(false);
  }
};

const getFcmToken = async () => {
  try {
    const messagingInstance = getMessaging(getApp());
    const token = await getToken(messagingInstance);

    console.log("FCM Token:", token);
    await saveFcmToken(token);
  } catch (error) {
    console.error("Failed to get FCM token:", error);
  }
};

export const useNotification = () => {
  useEffect(() => {
    requestUserPermission();
    getFcmToken();
  }, []);
};
