import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors, fonts } from "../../utils/constants";
import SearchBar from "../../components/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  userGetConversations,
  userDeleteConversation,
} from "../../store/chat/chatActions";
import Toast from "react-native-toast-message";
import ConversationItem from "./components/ConversationItem";
import { Feather } from "@expo/vector-icons";
import { getFriendsList } from "../../services/api/friendsApi";
import { FriendsListResponse } from "../../types/friends";
import Avatar from "../../components/Avatar";
import { truncateText } from "../../utils/helpers";
import SelectModal, { Option } from "../../components/SelectModal";
import ConfirmModal from "../../components/ConfirmModal";

const ChatListScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading } = useSelector(
    (state: RootState) => state.chat,
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [friendsList, setFriendsList] = useState<FriendsListResponse>([]);
  const [conversationsList, setConversationsList] = useState(conversations);
  const [searchText, setSearchText] = useState<string>("");
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const options: Option[] = [
    {
      label: t("delete_conversation"),
      onPress: () => {
        setShowSelectModal(false);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleDeleteConversation = async () => {
    setShowDeleteModal(false);
    if (!selectedConversationId) return;
    try {
      await dispatch(userDeleteConversation(selectedConversationId)).unwrap();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    } finally {
      setSelectedConversationId(null);
    }
  };

  const handleLongPress = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowSelectModal(true);
  };

  const handleOpenChat = (
    id: number,
    username: string,
    fullName: string,
    avatar: string | null,
    conversationId: string | null,
  ) => {
    navigation.navigate("Chat", {
      id,
      username,
      fullName,
      avatar,
      conversationId,
      type: "DIRECT",
    });
  };

  const handleLoadMore = async () => {
    if (
      conversationsList?.hasMore &&
      conversationsList.nextCursor &&
      !loading
    ) {
      setIsLoading(true);
      try {
        const res = await dispatch(
          userGetConversations({ cursor: conversationsList.nextCursor }),
        ).unwrap();

        if (conversationsList.nextCursor !== res.nextCursor) {
          setConversationsList((prev) => ({
            ...res,
            conversations: [
              ...(Array.isArray(prev?.conversations)
                ? prev.conversations.filter(Boolean)
                : []),
              ...(Array.isArray(res.conversations)
                ? res.conversations.filter(Boolean)
                : []),
            ],
          }));
        }
      } catch (error) {
        console.error("Error loading more conversations:", error);
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenCreateGroupChat = () => {
    navigation.navigate("CreateGroupChat");
  };

  useEffect(() => {
    const getList = async () => {
      try {
        const friendsList = await getFriendsList();
        if (friendsList.status === 200 && friendsList.data) {
          setFriendsList(friendsList.data);
        }
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };
    getList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchConversations = async () => {
        setIsFetching(true);
        try {
          const res = await dispatch(userGetConversations({})).unwrap();
          setConversationsList(res);
        } catch (error) {
          console.error("Error fetching conversations:", error);
          Toast.show({
            type: "error",
            text1: t("error_occurred"),
          });
        } finally {
          setIsFetching(false);
        }
      };
      fetchConversations();
    }, []),
  );

  useEffect(() => {
    setConversationsList(conversations);
  }, [conversations]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("chat")}</Text>
      <SearchBar
        placeholder={t("search_by_name_or_username")}
        setSearchResult={setSearchText}
      />

      <View>
        <FlatList
          data={friendsList.filter(
            (friend) =>
              friend.fullName
                ?.toLowerCase()
                .includes(searchText.toLowerCase().trim()) ||
              friend.username
                ?.toLowerCase()
                .includes(searchText.toLowerCase().trim()),
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.select_container, { padding: 8 }]}
              onPress={() =>
                handleOpenChat(
                  item.id,
                  item.username,
                  item.fullName,
                  item.avatar,
                  item.conversationId,
                )
              }
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Avatar uri={item.avatar} />
                <View style={styles.username_container}>
                  <Text style={styles.fullName_text}>
                    {truncateText(item.fullName, 8)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {isFetching && !conversations ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          <View style={styles.edit_container}>
            <TouchableOpacity onPress={handleOpenCreateGroupChat}>
              <Feather name="edit" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={conversationsList ? conversationsList.conversations : []}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            // scrollEnabled={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => (
              <ConversationItem
                conversationItem={item}
                onLongPress={handleLongPress}
              />
            )}
            ListEmptyComponent={
              <View
                style={{
                  marginTop: "50%",
                }}
              >
                <Text style={styles.no_result_text}>{t("no_messages")}</Text>
              </View>
            }
          />
        </>
      )}

      {isLoading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ flex: 1 }}
        />
      )}

      <ConfirmModal
        visible={showDeleteModal}
        title={t("delete_conversation")}
        message={t("delete_conversation_confirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDeleteConversation();
        }}
      />
      <SelectModal
        visible={showSelectModal}
        options={options}
        onClose={() => setShowSelectModal(false)}
        title={t("options")}
      />
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
    fontSize: fonts.size.xlarge,
    color: colors.text,
    fontWeight: "bold",
  },

  no_result_text: {
    color: colors.neutral,
    textAlign: "center",
    marginTop: 16,
  },

  edit_container: { alignSelf: "flex-end", marginVertical: 12 },

  select_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fullName_text: {
    fontSize: fonts.size.medium,
    color: colors.text,
    fontWeight: "600",
  },

  username_container: {
    gap: 6,
  },
});
export default ChatListScreen;
