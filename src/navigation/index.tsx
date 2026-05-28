import React, { useEffect, useRef } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";

// Screens
import LoginScreen from "../screens/Authentication/LoginScreen";
import InputScreen from "../screens/Authentication/InputScreen";
import OTPScreen from "../screens/Authentication/OTPScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";

import HomeScreen from "../screens/Feed/HomeScreen";
import ChatScreen from "../screens/Chat/ChatScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import AccountSettingsScreen from "../screens/Settings/AccountSettingsScreen";
import SystemSettingsScreen from "../screens/Settings/SystemSettingsScreen";
import CreateGroupChatScreen from "../screens/Chat/CreateGroupChatScreen";
import GroupDetailScreen from "../screens/Chat/GroupDetailScreen";
import AddMemberScreen from "../screens/Chat/AddMemberScreen";
import CreatePostScreen from "../screens/Feed/CreatePostScreen";
import VoteResultsScreen from "../screens/Chat/VoteResultsScreen";
import BillResultsScreen from "../screens/Chat/BillResultsScreen";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { loadToken } from "../store/auth/authSlice";
import { userGetInfo } from "../store/user/userActions";
import { AppDispatch, RootState } from "../store";

// Services
import { ApiService } from "../services";
import websocketService from "../services/webSocketService";
import { updateUserState } from "../services/api/notiApi";
import { userLogout } from "../store/auth/authActions";

// Utils
import Loading from "../components/Loading";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase
import { getApp } from "@react-native-firebase/app";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import {
  getCrashlytics,
  log,
  recordError,
  setUserId,
} from "@react-native-firebase/crashlytics";

const app = getApp();
const analyticsInstance = getAnalytics(app);
const crashlyticsInstance = getCrashlytics(app);

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { isSignedIn, loadingToken, token } = useSelector(
    (state: RootState) => state.auth,
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { t, i18n } = useTranslation();

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>();

  const appStateRef = useRef(AppState.currentState);
  const isConnectedRef = useRef(true);
  const currentStateRef = useRef<
    "FOREGROUND" | "BACKGROUND" | "OFFLINE" | null
  >(null);

  // Language
  useEffect(() => {
    AsyncStorage.getItem("appLanguage").then((lang) => {
      if (lang) i18n.changeLanguage(lang);
    });
  }, []);

  // Token
  useEffect(() => {
    dispatch(loadToken());
  }, []);

  // User info
  useEffect(() => {
    if (isSignedIn) {
      dispatch(userGetInfo()).then((res) => {
        if (userGetInfo.rejected.match(res)) {
          Toast.show({
            type: "error",
            text1: t("network_error"),
          });
        }
      });
    }
  }, [isSignedIn]);

  // Logout handler
  useEffect(() => {
    ApiService.setLogoutHandler(() => {
      dispatch(userLogout());
    });
  }, []);

  // Presence update
  const safeUpdateUserState = async (
    newState: "FOREGROUND" | "BACKGROUND" | "OFFLINE",
  ) => {
    if (currentStateRef.current === newState) return;

    currentStateRef.current = newState;

    try {
      await updateUserState(newState);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      recordError(crashlyticsInstance, error);
    }
  };

  const updatePresence = () => {
    if (!isConnectedRef.current) {
      safeUpdateUserState("OFFLINE");
    } else if (appStateRef.current === "active") {
      safeUpdateUserState("FOREGROUND");
    } else {
      safeUpdateUserState("BACKGROUND");
    }
  };

  // WebSocket + presence
  useEffect(() => {
    if (!token) return;

    websocketService.connect(token);
    currentStateRef.current = null;
    safeUpdateUserState("FOREGROUND");

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isConnected = !!state.isConnected;

      if (isConnected && !isConnectedRef.current) {
        websocketService.connect(token);
      }

      if (!isConnected && isConnectedRef.current) {
        websocketService.disconnect();
        log(crashlyticsInstance, "Network disconnected");
      }

      isConnectedRef.current = isConnected;
      updatePresence();
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        appStateRef.current = nextAppState;

        if (nextAppState === "active") {
          websocketService.connect(token);
          log(crashlyticsInstance, "App foreground");
        } else {
          websocketService.disconnect();
          log(crashlyticsInstance, "App background");
        }

        updatePresence();
      },
    );

    return () => {
      unsubscribeNetInfo();
      appStateSubscription.remove();
      websocketService.disconnect();

      log(crashlyticsInstance, "Navigation cleanup");
      safeUpdateUserState("OFFLINE");
    };
  }, [token]);

  // Crashlytics user
  useEffect(() => {
    if (isSignedIn && userInfo?.id) {
      setUserId(crashlyticsInstance, String(userInfo.id));
      log(crashlyticsInstance, "App started");
    }
  }, [isSignedIn]);

  // Loading
  if (loadingToken) return <Loading />;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const route = navigationRef.getCurrentRoute();

        if (route) {
          routeNameRef.current = route.name;

          logEvent(analyticsInstance, "screen_view", {
            screen_name: route.name,
            screen_class: route.name,
          });
        }
      }}
      onStateChange={() => {
        const route = navigationRef.getCurrentRoute();
        const name = route?.name;

        if (!name || routeNameRef.current === name) return;

        routeNameRef.current = name;

        logEvent(analyticsInstance, "screen_view", {
          screen_name: name,
          screen_class: name,
        });
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
            />
            <Stack.Screen
              name="SystemSettings"
              component={SystemSettingsScreen}
            />
            <Stack.Screen
              name="CreateGroupChat"
              component={CreateGroupChatScreen}
            />
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <Stack.Screen name="AddMember" component={AddMemberScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="VoteResults" component={VoteResultsScreen} />
            <Stack.Screen name="BillResults" component={BillResultsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Input" component={InputScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
