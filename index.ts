import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";

import App from "./App";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background message received:", remoteMessage.data);
});

registerRootComponent(App);
