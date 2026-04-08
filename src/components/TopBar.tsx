import React from "react";
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

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.topbar_container}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        {type === "chat" && <UserInfo userInfo={userInfo} />}
        {type === "myProfile" && (
          <Text style={styles.title}>{userInfo?.username}</Text>
        )}
        {type === "other" && <Text style={styles.title}>{title}</Text>}
      </View>

      {type === "otherProfile" && (
        <TouchableOpacity>
          <ChatIcon />
        </TouchableOpacity>
      )}
      {(type === "chat" || type === "otherProfile") && (
        <TouchableOpacity>
          <ThreeDotsIcon />
        </TouchableOpacity>
      )}
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
