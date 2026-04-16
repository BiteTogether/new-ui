import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";
import { Feather } from "@expo/vector-icons";
import MessageInput from "../../components/MessageInput";
import TopBar from "../../components/TopBar";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  userSendMessage,
  userGetMessages,
  userDeleteMessage,
  userUpdateMessage,
  userCreateConversation,
} from "../../store/chat/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { MessagesList, Message } from "../../types/chat";
import Toast from "react-native-toast-message";
import MessageItem from "./components/MessageItem";
import SelectModal, { Option } from "../../components/SelectModal";
import ConfirmModal from "../../components/ConfirmModal";

const ChatScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParamList, "Chat">>();
  const { id, username, fullName, avatar, conversationId, type, name } =
    route.params;
  const { messages, isConnected } = useWebSocket("SEND");
  const dispatch = useDispatch<AppDispatch>();
  const { state, conversations } = useSelector(
    (state: RootState) => state.chat,
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [messagesList, setMessagesList] = useState<MessagesList>({
    messages: messages,
    nextCursor: 0,
    hasMore: false,
    size: messages.length,
  });
  const { loading } = useSelector((state: RootState) => state.chat);
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isUpdatingMode, setIsUpdatingMode] = useState<boolean>(false);
  const [updateContent, setUpdateContent] = useState<string>("");
  const [conId, setConId] = useState<string | null>(conversationId);

  const [behaviour, setBehaviour] = useState<"height" | undefined>("height");
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("height");
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const messageOptions: Option[] = [
    {
      label: t("edit_message"),
      onPress: () => {
        setShowSelectModal(false);
        if (selectedMessage) setUpdateContent(selectedMessage.content);
        setIsUpdatingMode(true);
      },
    },
    {
      label: t("delete_message"),
      onPress: () => {
        setShowSelectModal(false);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleOpenGroupDetail = () => {
    navigation.navigate("GroupDetail", { conversationId: conId! });
  };

  const handleSendMessage = async (text: string) => {
    try {
      if (isConnected && conId) {
        await dispatch(
          userSendMessage({
            conversationId: conId,
            action: "SEND",
            messageType: "TEXT",
            content: text,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    }
  };

  const handleLongPressMsg = (message: Message) => {
    setSelectedMessage(message);
    setShowSelectModal(true);
  };

  const handleDeleteMsg = async () => {
    setShowDeleteModal(false);
    if (selectedMessage) {
      try {
        await dispatch(
          userDeleteMessage({
            messageId: selectedMessage.id,
          }),
        ).unwrap();

        setMessagesList((prev) => ({
          ...prev,
          messages: prev.messages.filter(
            (msg) => msg.id !== selectedMessage.id,
          ),
        }));
      } catch (error) {
        console.error("Error deleting message:", error);
        Toast.show({
          type: "error",
          text1: t("delete_message_error"),
        });
      } finally {
        setSelectedMessage(null);
      }
    }
  };

  const handleUpdateMsg = async (newContent: string) => {
    if (selectedMessage) {
      try {
        await dispatch(
          userUpdateMessage({
            messageId: selectedMessage.id,
            content: newContent,
          }),
        ).unwrap();

        setMessagesList((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === selectedMessage.id
              ? { ...msg, content: newContent }
              : msg,
          ),
        }));
      } catch (error) {
        console.error("Error updating message:", error);
        Toast.show({
          type: "error",
          text1: t("edit_message_error"),
        });
      } finally {
        setSelectedMessage(null);
        setIsUpdatingMode(false);
        setUpdateContent("");
      }
    }
  };

  const handleChangeUpdateContent = (text: string) => {
    setUpdateContent(text);
  };

  const handleLoadMore = async () => {
    if (messagesList.hasMore && messagesList.nextCursor && !loading) {
      try {
        const res = await dispatch(
          userGetMessages({
            conversationId: conId!,
            cursor: messagesList.nextCursor,
          }),
        ).unwrap();

        if (messagesList.nextCursor !== res.nextCursor) {
          setMessagesList((prev) => ({
            ...res,
            messages: [
              ...(Array.isArray(prev.messages)
                ? prev.messages.filter(Boolean)
                : []),
              ...(Array.isArray(res.messages)
                ? res.messages.filter(Boolean)
                : []),
            ],
          }));
        }
      } catch (error) {
        console.error("Error loading more messages:", error);
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      }
    }
  };

  useEffect(() => {
    const handleCreateConversation = async () => {
      if (!conId && type === "DIRECT") {
        try {
          const res = await dispatch(
            userCreateConversation({
              type: "DIRECT",
              participantIds: [userInfo!.id, id],
            }),
          ).unwrap();
          setConId(res.id);
        } catch (error) {
          console.error("Error creating conversation:", error);
          Toast.show({
            type: "error",
            text1: t("error_occurred"),
          });
        }
      }
    };
    handleCreateConversation();
  }, [conId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!conId) return;
        const res = await dispatch(
          userGetMessages({
            conversationId: conId,
          }),
        ).unwrap();

        setMessagesList((prev) => ({
          ...res,
          messages: [
            ...(Array.isArray(prev.messages)
              ? prev.messages.filter(Boolean)
              : []
            ).filter(
              (msg) =>
                msg &&
                Array.isArray(res.messages) &&
                res.messages.filter(Boolean).every((m) => m && m.id !== msg.id),
            ),
            ...(Array.isArray(res.messages)
              ? res.messages.filter(Boolean)
              : []),
          ],
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      }
    };
    fetchMessages();
  }, [conId]);

  useEffect(() => {
    setMessagesList((prev) => ({
      ...prev,
      messages: [
        ...(Array.isArray(messages) ? messages.filter(Boolean) : []).filter(
          (msg) =>
            msg &&
            Array.isArray(prev.messages) &&
            prev.messages.filter(Boolean).every((m) => m && m.id !== msg.id),
        ),
        ...(Array.isArray(prev.messages) ? prev.messages.filter(Boolean) : []),
      ],
    }));
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : behaviour}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 12 }}>
          {type === "DIRECT" && (
            <TopBar
              type={"chat-direct"}
              userInfo={{
                id,
                username,
                fullName,
                avatar,
                conversationId: conId,
              }}
            />
          )}

          {type === "GROUP" && (
            <TopBar
              type={"chat-group"}
              groupInfo={{ name, avatar }}
              onPressOption={handleOpenGroupDetail}
            />
          )}
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ flex: 1 }}
          />
        )}
        <FlatList
          data={messagesList.messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          inverted
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          renderItem={({ item }) => (
            <MessageItem messageItem={item} onLongPress={handleLongPressMsg} />
          )}
          ListEmptyComponent={
            <Text style={styles.no_result_text}>{t("no_messages")}</Text>
          }
        />

        {isUpdatingMode && (
          <View style={styles.update_container}>
            <Text style={{ fontWeight: "600", color: colors.text }}>
              {t("editing")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedMessage(null);
                setIsUpdatingMode(false);
                setUpdateContent("");
              }}
              style={styles.close_button}
            >
              <Feather name="x" size={12} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.message_input_container}>
          <TouchableOpacity>
            <Feather name="plus-circle" size={40} color={colors.secondary} />
          </TouchableOpacity>
          <MessageInput
            placeholder={t("send_messages")}
            type="chat"
            onSend={handleSendMessage}
            isEditing={isUpdatingMode}
            textEditing={updateContent}
            onChangeTextEditing={handleChangeUpdateContent}
            onEdit={handleUpdateMsg}
          />
        </View>
      </View>
      <ConfirmModal
        visible={showDeleteModal}
        title={t("delete_message")}
        message={t("delete_message_confirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDeleteMsg();
        }}
      />
      <SelectModal
        visible={showSelectModal}
        options={messageOptions}
        onClose={() => setShowSelectModal(false)}
        title={t("options")}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },

  message_input_container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 16,
  },

  update_container: {
    backgroundColor: colors.accent,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
  },

  close_button: {
    backgroundColor: colors.text,
    padding: 2,
    borderRadius: 50,
  },

  no_result_text: {
    color: colors.neutral,
    textAlign: "center",
    marginTop: 16,
  },
});
export default ChatScreen;
