import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../utils/constants";

interface AvatarProps {
  size?: number;
  uri: string | null;
}

const Avatar = ({ size = 50, uri }: AvatarProps) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.container, { width: size, height: size }]}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Feather name="user" size={size * 0.6} color={colors.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: colors.secondary,
  },
});
export default Avatar;
