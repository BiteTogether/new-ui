import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";
import { Feather } from "@expo/vector-icons";
import UserInfo from "../../components/UserInfo";
import ThreeDotsIcon from "../../../assets/icons/ThreeDotsIcon";
import MessageInput from "../../components/MessageInput";

type ChatScreenProps = {};

const ChatScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar_container}>
        <View style={styles.user_container}>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <UserInfo />
        </View>

        <TouchableOpacity>
          <ThreeDotsIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.message_input_container}>
        <TouchableOpacity>
          <Feather name="plus-circle" size={40} color={colors.secondary} />
        </TouchableOpacity>
        <MessageInput placeholder={t("send_messages")} type="chat" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  user_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },

  topbar_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10%",
  },

  message_input_container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 12,
    marginHorizontal: 24,
  },
});
export default ChatScreen;
