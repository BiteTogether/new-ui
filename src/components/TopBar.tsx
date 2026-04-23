import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../types/navigations";
import UserInfo from "./UserInfo";
import ChatIcon from "../../assets/icons/ChatIcon";
import { colors, fonts } from "../utils/constants";
import { UserInfo as UserInfoType } from "../types/user";
import { truncateText } from "../utils/helpers";

interface TopBarProps {
  type: "chat-direct" | "chat-group" | "myProfile" | "otherProfile" | "other";
  userInfo?: UserInfoType | null;
  groupInfo?: {
    name: string;
    avatar: string | null;
  };
  title?: string;
  onSave?: () => void;
  saveLoading?: boolean;
  isChanged?: boolean;
  onPressOption?: () => void;
}

const TopBar = ({
  type,
  userInfo,
  groupInfo,
  title,
  onSave,
  saveLoading,
  isChanged,
  onPressOption,
}: TopBarProps) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

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
        conversationId: userInfo.conversationId,
        type: "DIRECT",
      });
    }
  };

  return (
    <SafeAreaView style={styles.topbar_container}>
      <View style={[styles.container, { flex: 1 }]}>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {type === "chat-direct" && (
          <UserInfo
            userInfo={userInfo!}
            onPress={() => navigation.navigate("Profile", { id: userInfo!.id })}
          />
        )}
        {type === "chat-group" && (
          <Text style={styles.title}>
            {truncateText(groupInfo?.name || "", 20)}
          </Text>
        )}
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
        {onPressOption && type !== "myProfile" && (
          <TouchableOpacity onPress={onPressOption}>
            <Feather name="more-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topbar_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Platform.OS === "ios" ? 0 : 12,
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
