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
import { colors } from "../../utils/constants";
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
  userCreateVoteSession,
  userGetVoteSessions,
  userCreateBillSession,
  userConfirmBillPayment,
  userFinalizeBillSession,
  userGetBillSessions,
} from "../../store/chat/chatActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  MessagesList,
  Message,
  VoteList,
  CreateBillRequest,
  BillList,
} from "../../types/chat";
import Toast from "react-native-toast-message";
import MessageItem from "./components/MessageItem";
import SelectModal, { Option } from "../../components/SelectModal";
import ConfirmModal from "../../components/ConfirmModal";
import VoteOptionList from "./components/VoteOptionList";
import CreateVoteModal from "./components/CreateVoteModal";
import VoteStickyBar from "./components/VoteStickyBar";
import BillStickyBar from "./components/BillStickyBar";
import CreateBillModal from "./components/CreateBillModal";
import BillDetailModal from "./components/BillDetailModal";

const ChatScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParamList, "Chat">>();
  const { id, username, fullName, avatar, conversationId, type, name } =
    route.params;
  const { messages, isConnected } = useWebSocket("SEND") as {
    messages: Message[];
    isConnected: boolean;
  };
  const { votes } = useWebSocket("VOTE_UPDATE") as { votes: VoteList };
  const { bills } = useWebSocket("BILL_UPDATE") as { bills: BillList };
  const dispatch = useDispatch<AppDispatch>();
  const { conversations } = useSelector((state: RootState) => state.chat);
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
  const [showPlusModal, setShowPlusModal] = useState<boolean>(false);
  const [showCreateVoteModal, setShowCreateVoteModal] =
    useState<boolean>(false);
  const [showCreateBillModal, setShowCreateBillModal] =
    useState<boolean>(false);
  const [voteSessions, setVoteSessions] = useState<VoteList>(votes);
  const [billSessions, setBillSessions] = useState<BillList>(bills);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

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

  const plusOptions: Option[] = [
    {
      label: t("create_vote"),
      onPress: () => {
        setShowPlusModal(false);
        setShowCreateVoteModal(true);
      },
    },
    {
      label: t("create_bill"),
      onPress: () => {
        setShowPlusModal(false);
        setShowCreateBillModal(true);
      },
    },
    {
      label: t("view_vote_results"),
      onPress: () => {
        setShowPlusModal(false);
        navigation.navigate("VoteResults", { conversationId: conId! });
      },
    },
    {
      label: t("view_bills"),
      onPress: () => {
        setShowPlusModal(false);
        navigation.navigate("BillResults", { conversationId: conId! });
      },
    },
  ];

  const handleCreateBill = async (data: CreateBillRequest) => {
    setShowCreateBillModal(false);
    try {
      await dispatch(
        userCreateBillSession({
          conversationId: conId!,
          voteSessionId: data.voteSessionId,
          currency: data.currency,
          totalAmount: data.totalAmount,
          splitType: data.splitType,
          customSplits:
            data.splitType === "CUSTOM" && data.customSplits
              ? data.customSplits.map((s) => ({
                  userId: s.userId,
                  amount: s.amount,
                }))
              : undefined,
        }),
      ).unwrap();

      Toast.show({ type: "success", text1: t("create_bill_success") });
    } catch (error) {
      console.error("Error creating bill:", error);
      Toast.show({ type: "error", text1: t("create_bill_error") });
    }
  };

  const handleFinalizeBill = async () => {
    if (!selectedBillId) return;
    setShowCreateBillModal(false);
    try {
      await dispatch(userFinalizeBillSession(selectedBillId)).unwrap();

      Toast.show({ type: "success", text1: t("finalize_bill_success") });
    } catch (error) {
      console.error("Error finalizing bill:", error);
      Toast.show({ type: "error", text1: t("finalize_bill_error") });
    }
  };

  const handleSelectPoll = (pollId: string) => {
    setSelectedPollId(pollId);
  };

  const handleSelectBill = (billId: string) => {
    setSelectedBillId(billId);
  };

  const selectedBill = billSessions.find((bill) => bill.id === selectedBillId);

  const handleConfirmBillPayment = async (
    userId: number,
    billSessionId: string,
  ) => {
    try {
      await dispatch(
        userConfirmBillPayment({ userId, billSessionId }),
      ).unwrap();
      Toast.show({ type: "success", text1: t("bill_payment_success") });
    } catch (error) {
      console.error("Error confirming bill payment:", error);
      Toast.show({ type: "error", text1: t("bill_payment_error") });
    }
  };

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

  const handleCreateVote = async (
    name: string,
    options: { placeId: string; name: string; address: string }[],
  ) => {
    setShowCreateVoteModal(false);
    try {
      await dispatch(
        userCreateVoteSession({
          conversationId: conId!,
          name,
          options,
        }),
      ).unwrap();
      Toast.show({
        type: "success",
        text1: t("create_vote_success"),
      });
    } catch (error) {
      console.error("Error creating vote:", error);
      Toast.show({
        type: "error",
        text1: t("create_vote_error"),
      });
    }
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

    const fetchVoteSessions = async () => {
      if (!conId) return;
      try {
        const res = await dispatch(userGetVoteSessions(conId)).unwrap();
        setVoteSessions(res);
      } catch (error) {
        console.error("Error fetching vote sessions:", error);
      }
    };

    const fetchBillSessions = async () => {
      if (!conId) return;
      try {
        const res = await dispatch(userGetBillSessions(conId)).unwrap();
        setBillSessions(res);
      } catch (error) {
        console.error("Error fetching bill sessions:", error);
      }
    };

    fetchMessages();
    fetchVoteSessions();
    fetchBillSessions();
  }, [conId]);

  useEffect(() => {
    if (
      !Array.isArray(messages) ||
      !messages.every((msg) => msg && msg.conversationId === conId)
    )
      return;
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

  useEffect(() => {
    if (
      !Array.isArray(votes) ||
      !votes.every((v) => v && v.conversationId === conId)
    )
      return;
    setVoteSessions((prev) => {
      // Update or add votes by id
      const updated = [...prev];
      votes.forEach((vote) => {
        const idx = updated.findIndex((v) => v.id === vote.id);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...vote };
        } else {
          updated.push(vote);
        }
      });
      return updated;
    });
  }, [votes]);

  useEffect(() => {
    if (
      !Array.isArray(bills) ||
      !bills.every((b) => b && b.conversationId === conId)
    )
      return;
    setBillSessions((prev) => {
      // Update or add bills by id
      const updated = [...prev];
      bills.forEach((bill) => {
        const idx = updated.findIndex((b) => b.id === bill.id);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...bill };
        } else {
          updated.push(bill);
        }
      });
      return updated;
    });
  }, [bills]);

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
        <VoteStickyBar
          voteSessions={voteSessions.filter((v) => v.status !== "CLOSED")}
          onSelectPoll={handleSelectPoll}
        />
        <BillStickyBar
          billSessions={billSessions.filter(
            (bill) => bill.status !== "SETTLED",
          )}
          onSelectBill={handleSelectBill}
        />

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
          <TouchableOpacity
            onPress={() => {
              setShowPlusModal(true);
            }}
          >
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
      <SelectModal
        visible={showPlusModal}
        options={plusOptions}
        onClose={() => setShowPlusModal(false)}
        title={t("options")}
      />
      <CreateVoteModal
        visible={showCreateVoteModal}
        onClose={() => setShowCreateVoteModal(false)}
        onSubmit={handleCreateVote}
      />

      <CreateBillModal
        visible={showCreateBillModal}
        onClose={() => setShowCreateBillModal(false)}
        onSubmit={handleCreateBill}
        voteSessions={voteSessions}
        members={(
          conversations?.conversations?.find((c) => c.id === conId)
            ?.participants || []
        ).map((p) => p.chatUserSnapshot)}
        conversationId={conId!}
      />

      {selectedPollId && (
        <VoteOptionList
          voteSession={voteSessions.find((v) => v.id === selectedPollId)!}
          visible={true}
          onCancel={() => setSelectedPollId(null)}
        />
      )}

      {selectedBill && (
        <BillDetailModal
          visible={!!selectedBill}
          billSession={selectedBill ?? null}
          members={(
            conversations?.conversations?.find((c) => c.id === conId)
              ?.participants || []
          ).map((p) => p.chatUserSnapshot)}
          isOwner={selectedBill?.createdBy === userInfo?.id}
          myUserId={String(userInfo?.id ?? "")}
          onClose={() => setSelectedBillId(null)}
          onConfirmPayment={handleConfirmBillPayment}
          onFinalize={handleFinalizeBill}
        />
      )}
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
