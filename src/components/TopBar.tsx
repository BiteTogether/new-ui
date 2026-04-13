import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../types/navigations";
import UserInfo from "./UserInfo";
import ThreeDotsIcon from "../../assets/icons/ThreeDotsIcon";
import ChatIcon from "../../assets/icons/ChatIcon";
import { colors, fonts } from "../utils/constants";
import { UserInfo as UserInfoType } from "../types/user";
import SelectModal, { Option } from "./SelectModal";
import ConfirmModal from "./ConfirmModal";
import { useTranslation } from "react-i18next";
import { removeFriend } from "../services/api/friendsApi";
import Toast from "react-native-toast-message";

interface TopBarProps {
  type: "chat" | "myProfile" | "otherProfile" | "other";
  userInfo?: UserInfoType | null;
  title?: string;
  onSave?: () => void;
  saveLoading?: boolean;
  isChanged?: boolean;
}

const TopBar = ({
  type,
  userInfo,
  title,
  onSave,
  saveLoading,
  isChanged,
}: TopBarProps) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const { t } = useTranslation();

  const options: Option[] = [
    {
      label: t("remove_friend"),
      onPress: () => {
        setShowSelectModal(false);
        setShowRemoveModal(true);
      },
    },
  ];

  const handleRemoveFriend = async () => {
    setShowRemoveModal(false);

    try {
      const res = await removeFriend(userInfo!.id);
      if (res.status === 200) {
        Toast.show({
          type: "success",
          text1: t("remove_friend_success"),
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: t("remove_friend_error"),
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenChat = () => {
    if (userInfo) {
      navigation.navigate("Chat", {
        id: userInfo.id,
        username: userInfo.username,
        fullName: userInfo.fullName,
        avatar: userInfo.avatar,
      });
    }
  };

  return (
    <SafeAreaView style={styles.topbar_container}>
      <View style={[styles.container, { flex: 1 }]}>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {type === "chat" && <UserInfo userInfo={userInfo!} />}
        {(type === "myProfile" || type === "otherProfile") && (
          <Text style={styles.title}>{userInfo?.username}</Text>
        )}
        {type === "other" && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.container}>
        {type === "otherProfile" && (
          <TouchableOpacity onPress={handleOpenChat}>
            <ChatIcon />
          </TouchableOpacity>
        )}
        {(type === "chat" || type === "otherProfile") && (
          <TouchableOpacity onPress={() => setShowSelectModal(true)}>
            <ThreeDotsIcon />
          </TouchableOpacity>
        )}

        <SelectModal
          visible={showSelectModal}
          options={options}
          onClose={() => setShowSelectModal(false)}
          title={t("options")}
        />
      </View>

      {type === "myProfile" && (
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {onSave &&
        isChanged &&
        (saveLoading ? (
          <ActivityIndicator color={colors.secondary} />
        ) : (
          <TouchableOpacity onPress={onSave}>
            <Feather name="check" size={24} color={colors.text} />
          </TouchableOpacity>
        ))}
      <ConfirmModal
        visible={showRemoveModal}
        title={t("remove_friend")}
        message={t("remove_friend_confirm")}
        confirmText={t("remove")}
        cancelText={t("cancel")}
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={() => {
          handleRemoveFriend();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topbar_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  title: {
    fontSize: fonts.size.large,
    fontWeight: 600,
    color: colors.text,
  },
});
export default TopBar;
