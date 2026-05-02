import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { registerDeviceToken } from "./api/notificationApi";
import { FCMDataPayload } from "../types/notification";

export type NotificationHandler = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => void;

class NotificationService {
  private foregroundUnsubscribe: (() => void) | null = null;
  private notificationOpenedUnsubscribe: (() => void) | null = null;
  private tokenRefreshUnsubscribe: (() => void) | null = null;

  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled && Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
    }

    return enabled;
  }

  async registerToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      if (token) {
        await registerDeviceToken({ deviceToken: token });
      }
      return token;
    } catch (error) {
      console.error("Failed to register FCM token:", error);
      return null;
    }
  }

  setupTokenRefreshListener(): void {
    this.tokenRefreshUnsubscribe = messaging().onTokenRefresh(
      async (newToken) => {
        try {
          await registerDeviceToken({ deviceToken: newToken });
        } catch (error) {
          console.error("Failed to register refreshed FCM token:", error);
        }
      },
    );
  }

  setupForegroundListener(handler: NotificationHandler): void {
    this.foregroundUnsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        handler(remoteMessage);
      },
    );
  }

  setupNotificationOpenedListener(handler: NotificationHandler): void {
    this.notificationOpenedUnsubscribe = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        handler(remoteMessage);
      },
    );
  }

  async getInitialNotification(): Promise<FirebaseMessagingTypes.RemoteMessage | null> {
    return messaging().getInitialNotification();
  }

  parseDataPayload(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): FCMDataPayload {
    return (remoteMessage.data as FCMDataPayload) || {};
  }

  cleanup(): void {
    this.foregroundUnsubscribe?.();
    this.foregroundUnsubscribe = null;

    this.notificationOpenedUnsubscribe?.();
    this.notificationOpenedUnsubscribe = null;

    this.tokenRefreshUnsubscribe?.();
    this.tokenRefreshUnsubscribe = null;
  }
}

export const notificationService = new NotificationService();
