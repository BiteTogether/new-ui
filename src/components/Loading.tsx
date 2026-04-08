import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { colors } from "../utils/constants";

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    zIndex: 999,
  },
});

export default Loading;
