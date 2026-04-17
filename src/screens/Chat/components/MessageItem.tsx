import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Message } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { colors, fonts } from "../../../utils/constants";
import Avatar from "../../../components/Avatar";

interface MessageItemProps {
  messageItem: Message;
  onLongPress: (message: Message) => void;
}

const MessageItem = ({ messageItem, onLongPress }: MessageItemProps) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  return (
    <View
      style={
        messageItem.senderId !== userInfo?.id
          ? { flexDirection: "row", alignItems: "center", gap: 8 }
          : { alignSelf: "flex-end" }
      }
    >
      {messageItem.senderId !== userInfo?.id && <Avatar size={40} />}
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              messageItem.senderId === userInfo?.id
                ? colors.cancel
                : colors.neutral,
          },
        ]}
        onLongPress={() =>
          messageItem.senderId === userInfo?.id && onLongPress(messageItem)
        }
      >
        <Text
          style={{
            color:
              messageItem.senderId === userInfo?.id ? colors.text : undefined,
            fontSize: fonts.size.medium,
          }}
        >
          {messageItem.content}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    marginVertical: 8,
    maxWidth: "80%",
  },
});
export default MessageItem;
