import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Conversation } from "../../../types/chat";
import { colors, fonts } from "../../../utils/constants";
import Avatar from "../../../components/Avatar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { formatDate } from "../../../utils/helpers";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../types/navigations";
import { truncateText } from "../../../utils/helpers";
import { setMembers } from "../../../store/chat/chatSlice";

interface ConversationItemProps {
  conversationItem: Conversation;
  onLongPress: (conversationId: string) => void;
}

const ConversationItem = ({
  conversationItem,
  onLongPress,
}: ConversationItemProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const conversationName = () => {
    if (conversationItem.type === "GROUP") {
      return truncateText(conversationItem.name, 20);
    } else if (conversationItem.type === "DIRECT") {
      const otherUser = conversationItem.participants.find(
        (p) => p.chatUserSnapshot.userId !== userInfo?.id,
      );
      return truncateText(otherUser?.chatUserSnapshot.fullName || "", 20);
    }
    return "";
  };

  const avatarUrl = () => {
    if (conversationItem.type === "GROUP") {
      return conversationItem.avatarUrl;
    } else if (conversationItem.type === "DIRECT") {
      const otherUser = conversationItem.participants.find(
        (p) => p.chatUserSnapshot.userId !== userInfo?.id,
      );
      return otherUser?.chatUserSnapshot.avatar || "";
    }
    return "";
  };

  const handleOpenChat = () => {
    dispatch(setMembers(conversationItem.participants));
    if (conversationItem.type === "DIRECT") {
      const otherUser = conversationItem.participants.find(
        (p) => p.chatUserSnapshot.userId !== userInfo?.id,
      );
      if (!otherUser) return;
      navigation.navigate("Chat", {
        id: otherUser.chatUserSnapshot.userId,
        username: otherUser.chatUserSnapshot.username,
        fullName: otherUser.chatUserSnapshot.fullName,
        avatar: otherUser.chatUserSnapshot.avatar,
        conversationId: conversationItem.id,
        type: "DIRECT",
      });
    } else if (conversationItem.type === "GROUP") {
      navigation.navigate("Chat", {
        avatar: conversationItem.avatarUrl,
        name: conversationItem.name,
        conversationId: conversationItem.id,
        type: "GROUP",
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleOpenChat()}
      onLongPress={() => onLongPress(conversationItem.id)}
    >
      <Avatar uri={avatarUrl()} />
      <View style={styles.info_container}>
        <Text style={styles.username_text}>{conversationName()}</Text>
        <View style={styles.message_container}>
          <Text style={styles.message_text}>
            {conversationItem.latestMessage?.content
              ? truncateText(conversationItem.latestMessage?.content || "", 30)
              : t("start_the_conversation")}
          </Text>
          <Text style={styles.message_text}>
            {conversationItem.latestMessage?.createdAt
              ? formatDate(conversationItem.latestMessage?.createdAt, t)
              : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  message_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username_text: {
    fontSize: fonts.size.medium,
    color: colors.text,
  },
  message_text: {
    fontSize: fonts.size.medium,
    color: colors.secondary,
  },
  info_container: {
    gap: 6,
    flex: 1,
  },
});
export default ConversationItem;
