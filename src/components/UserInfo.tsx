import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Avatar from "./Avatar";
import { colors, fonts } from "../utils/constants";
import { UserInfo as UserInfoType } from "../types/user";

interface UserInfoProps {
  onPress?: () => void;
  isDisabled?: boolean;
  userInfo?: UserInfoType | null;
}

const UserInfo = ({ onPress, isDisabled, userInfo }: UserInfoProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isDisabled}
    >
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
