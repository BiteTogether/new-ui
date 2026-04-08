import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../utils/constants";
import ChatIcon from "../../../../assets/icons/ChatIcon";
import Avatar from "../../../components/Avatar";
import CameraIcon from "../../../../assets/icons/CameraIcon";

interface BottomTabProps {
  onOpenSearch: () => void;
  onOpenFriends: () => void;
  // onOpenCamera: () => void;
  onOpenChatList: () => void;
  // onOpenProfile: () => void;
}

const BottomTab = ({
  onOpenSearch,
  onOpenFriends,
  // onOpenCamera,
  onOpenChatList,
  // onOpenProfile,
}: BottomTabProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onOpenSearch}>
        <Feather name="search" size={28} color={colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenFriends}>
        <Feather name="users" size={28} color={colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.camera_button}>
        <CameraIcon size={28} color={colors.background} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenChatList}>
        <ChatIcon size={28} color={colors.secondary} />
      </TouchableOpacity>

      <Avatar size={28} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 16,
    gap: 30,
    width: "80%",
    height: 60,
    bottom: "5%",
    left: "10%",
    right: "10%",
  },

  camera_button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default BottomTab;
