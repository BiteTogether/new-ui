import React from "react";
import { Provider } from "react-redux";
import { store, RootState } from "./src/store";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "./src/utils/i18n";
import { useNotifications } from "./src/hooks/useNotifications";

function NotificationInitializer() {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  useNotifications(isSignedIn);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NotificationInitializer />
          <Navigation />
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  );
}
