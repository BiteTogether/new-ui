export default ({ config }) => ({
  ...config,

  name: "BiteTogether",
  slug: "BiteTogether",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",

  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#262626",
  },

  ios: {
    supportsTablet: true,
    googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST || "./GoogleService-Info.plist",
    bundleIdentifier: "com.bitetogether",
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#fff",
    },
    predictiveBackGestureEnabled: false,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    package: "com.bitetogether",
  },

  web: {
    favicon: "./assets/favicon.png",
  },

  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",

    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          forceStaticLinking: ["RNFBApp", "RNFBAuth", "RNFBFirestore"],
        },
      },
    ],

    "expo-secure-store",
    "expo-font",

    [
      "./plugins/withAndroidDesugaring",
      {
        desugarVersion: "2.1.3",
      },
    ],

    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY,
        iosGoogleMapsApiKey: process.env.IOS_GOOGLE_MAPS_API_KEY,
      },
    ],

    [
      "expo-image-picker",
      {
        microphonePermission: false,
      },
    ],
  ],

  extra: {
    eas: {
      projectId: "17033bd2-7e48-4152-a3cb-b12619fb3555",
    },
  },
});
