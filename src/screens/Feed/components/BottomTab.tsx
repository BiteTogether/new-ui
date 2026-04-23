import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../utils/constants";
import ChatIcon from "../../../../assets/icons/ChatIcon";
import Avatar from "../../../components/Avatar";
import CameraIcon from "../../../../assets/icons/CameraIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface BottomTabProps {
  onOpenSearch: () => void;
  onOpenFriends: () => void;
  onOpenCamera: () => void;
  onOpenChatList: () => void;
  onOpenProfile: () => void;
}

const BottomTab = ({
  onOpenSearch,
  onOpenFriends,
  onOpenCamera,
  onOpenChatList,
  onOpenProfile,
}: BottomTabProps) => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onOpenSearch}>
        <Feather name="search" size={24} color={colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenFriends}>
        <Feather name="users" size={24} color={colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.camera_button} onPress={onOpenCamera}>
        <CameraIcon size={24} color={colors.background} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenChatList}>
        <ChatIcon size={24} color={colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenProfile}>
        <Avatar size={24} uri={userInfo?.avatar ?? null} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    gap: 32,
    height: 64,
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: "7%",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  camera_button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default BottomTab;
