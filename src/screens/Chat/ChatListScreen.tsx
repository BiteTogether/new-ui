import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors, fonts } from "../../utils/constants";
import SearchBar from "../../components/SearchBar";
import Avatar from "../../components/Avatar";

const ChatListScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const handleOpenChat = () => {
    navigation.navigate("Chat");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("chat")}</Text>
      <SearchBar placeholder={t("search_by_username")} />

      <TouchableOpacity style={styles.user_container} onPress={handleOpenChat}>
        <Avatar size={40} />

        <View style={styles.user_info_container}>
          <Text style={styles.username_text}>ngocanh</Text>
          <Text style={styles.message_text}>hello</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: fonts.size.large,
    color: colors.text,
    fontWeight: "bold",
  },

  username_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.text,
  },

  message_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.secondary,
  },

  user_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  user_info_container: {
    flexDirection: "column",
    gap: 4,
  },
});
export default ChatListScreen;
