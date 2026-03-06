import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

type AvatarProps = {
  size?: number;
};

const Avatar = ({ size = 50 }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}></View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: "gray",
  },
});
export default Avatar;
