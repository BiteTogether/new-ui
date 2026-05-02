import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { notificationService } from "../services/notificationService";
import {
  addNotification,
  fetchUnreadCount,
  incrementUnreadCount,
  resetNotifications,
} from "../store/notification/notificationSlice";
import { FCMDataPayload, NotificationItem } from "../types/notification";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

export function useNotifications(isAuthenticated: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetNotifications());
      return;
    }

    let isMounted = true;

    const setup = async () => {
      const hasPermission = await notificationService.requestPermission();
      if (!hasPermission || !isMounted) return;

      await notificationService.registerToken();
      notificationService.setupTokenRefreshListener();

      dispatch(fetchUnreadCount());

      notificationService.setupForegroundListener((remoteMessage) => {
        if (!isMounted) return;
        handleForegroundMessage(remoteMessage);
      });

      notificationService.setupNotificationOpenedListener((remoteMessage) => {
        if (!isMounted) return;
        handleNotificationOpened(remoteMessage);
      });

      const initialMessage = await notificationService.getInitialNotification();
      if (initialMessage && isMounted) {
        handleNotificationOpened(initialMessage);
      }
    };

    const handleForegroundMessage = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const data = notificationService.parseDataPayload(remoteMessage);

      if (data.type === "CHAT_MESSAGE") {
        dispatch(incrementUnreadCount());
      } else if (data.type === "IN_APP_NOTIFICATION") {
        const notification: NotificationItem = {
          id: data.eventId || Date.now().toString(),
          eventId: data.eventId || "",
          userId: Number(data.userId) || 0,
          title: data.title || remoteMessage.notification?.title || "",
          message: data.message || remoteMessage.notification?.body || "",
          type: "IN_APP_NOTIFICATION",
          sourceService: data.sourceService || "",
          status: "UNREAD",
          timestamp: data.timestamp || new Date().toISOString(),
        };
        dispatch(addNotification(notification));
      }
    };

    const handleNotificationOpened = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const data = notificationService.parseDataPayload(remoteMessage);
      navigateFromNotification(data);
    };

    setup();

    return () => {
      isMounted = false;
      notificationService.cleanup();
    };
  }, [isAuthenticated, dispatch]);
}

function navigateFromNotification(data: FCMDataPayload) {
  if (data.type === "CHAT_MESSAGE" && data.conversationId) {
    // TODO: Navigate to chat conversation screen using navigation ref
    console.log("Navigate to chat:", data.conversationId);
  } else if (data.type === "IN_APP_NOTIFICATION") {
    // TODO: Navigate to relevant screen based on sourceService
    console.log("Navigate to notification:", data.sourceService);
  }
}
