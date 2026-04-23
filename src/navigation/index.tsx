import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Auth Screens
import LoginScreen from "../screens/Authentication/LoginScreen";
import InputScreen from "../screens/Authentication/InputScreen";
import OTPScreen from "../screens/Authentication/OTPScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
// Main Screens
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

import { useSelector, useDispatch } from "react-redux";
import { loadToken } from "../store/auth/authSlice";
import { userGetInfo } from "../store/user/userActions";
import { AppDispatch, RootState } from "../store";
import Loading from "../components/Loading";
import { ApiService } from "../services";
import { userLogout } from "../store/auth/authActions";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import NetInfo from "@react-native-community/netinfo";
import websocketService from "../services/webSocketService";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isSignedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { loadingToken, token } = useSelector((state: RootState) => state.auth);
  const { t, i18n } = useTranslation();
  const handleGetInfo = async () => {
    const resultAction = await dispatch(userGetInfo());
    if (userGetInfo.rejected.match(resultAction)) {
      console.error("Failed to get user info:", resultAction.payload);
      Toast.show({
        type: "error",
        text1: t("network_error"),
      });
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("appLanguage").then((lang) => {
      if (lang) i18n.changeLanguage(lang);
    });
  }, []);

  useEffect(() => {
    dispatch(loadToken());
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      handleGetInfo();
    }
  }, [isSignedIn]);

  useEffect(() => {
    ApiService.setLogoutHandler(() => {
      dispatch(userLogout());
    });
  }, []);

  useEffect(() => {
    if (token) {
      // Monitor network connectivity
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          websocketService.connect(token);
        } else {
          websocketService.disconnect();
        }
      });

      // Monitor app state
      const appStateSubscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            websocketService.connect(token);
          } else if (nextAppState === "background") {
            websocketService.disconnect();
          }
        },
      );

      // Clean up listeners
      return () => {
        unsubscribe();
        appStateSubscription.remove();
        websocketService.disconnect();
      };
    }
  }, [token]);

  if (loadingToken) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
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
