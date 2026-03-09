import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
// import { store } from "./src/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Navigation from "./src/navigation";
import "./src/utils/i18n";
// import colors from "./src/utils/constants";

export default function App() {
  return (
    // <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
      {/* <StatusBar style="light" backgroundColor={colors.background} /> */}
    </GestureHandlerRootView>
    // </Provider>
  );
}
