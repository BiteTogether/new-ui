import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "./src/utils/i18n";
import { useNotification } from "./src/hooks/useNotification";

export default function App() {
  useNotification();
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Navigation />
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  );
}
