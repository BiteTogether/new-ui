import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
// import { store } from "./src/store";
import Navigation from "./src/navigation";
import "./src/utils/i18n";
// import colors from "./src/utils/constants";

export default function App() {
  return (
    // <Provider store={store}>
    <>
      <Navigation />
      {/* <StatusBar style="light" backgroundColor={colors.background} /> */}
    </>
    // </Provider>
  );
}
