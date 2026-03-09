import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Avatar from "./Avatar";
import { colors, fonts } from "../utils/constants";

interface UserInfoProps {
  onPress?: () => void;
}

const UserInfo = ({ onPress }: UserInfoProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Avatar size={40} />
      <Text style={styles.username_text}>ngocanh</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  username_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.text,
  },
});
export default UserInfo;
