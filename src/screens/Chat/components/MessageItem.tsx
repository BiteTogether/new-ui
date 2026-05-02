import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Message } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { colors, fonts } from "../../../utils/constants";
import Avatar from "../../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../../types/navigations";

interface MessageItemProps {
  messageItem: Message;
  onLongPress: (message: Message) => void;
}

const MessageItem = ({ messageItem, onLongPress }: MessageItemProps) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { members } = useSelector((state: RootState) => state.chat);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const sender = members.find(
    (m) => m.chatUserSnapshot?.userId === messageItem.senderId,
  );

  return (
    <View
      style={
        messageItem.senderId !== userInfo?.id
          ? { flexDirection: "row", alignItems: "center", gap: 8 }
          : { alignSelf: "flex-end" }
      }
    >
      {messageItem.senderId !== userInfo?.id && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { id: messageItem.senderId })
          }
          style={{
            alignSelf:
              messageItem.photoUrl && messageItem.postId
                ? "flex-end"
                : undefined,
            marginBottom:
              messageItem.photoUrl && messageItem.postId ? 4 : undefined,
          }}
        >
          <Avatar uri={sender?.chatUserSnapshot?.avatar} size={40} />
        </TouchableOpacity>
      )}
      <View
        style={{
          width: "100%",
          alignItems:
            messageItem.senderId === userInfo?.id ? "flex-end" : "flex-start",
        }}
      >
        {messageItem.photoUrl && messageItem.postId && (
          <TouchableOpacity
            style={{ borderRadius: 25, overflow: "hidden" }}
            onPress={() =>
              navigation.navigate("Home", { postId: messageItem.postId! })
            }
          >
            <Image
              source={{ uri: messageItem.photoUrl }}
              style={{ width: 250, aspectRatio: 1, borderRadius: 25 }}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.accent,
                }}
              >
                <ActivityIndicator size="large" color={colors.text} />
              </View>
            )}
          </TouchableOpacity>
        )}
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
