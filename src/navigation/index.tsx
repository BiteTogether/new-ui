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

import { useSelector, useDispatch } from "react-redux";
import { loadToken } from "../store/auth/authSlice";
import { AppDispatch, RootState } from "../store";
import Loading from "../components/Loading";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isSignedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { loadingToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, []);

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
