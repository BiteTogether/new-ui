import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors, fonts } from "../../utils/constants";
import SearchBar from "../../components/SearchBar";
import { SearchFriendResponse } from "../../types/user";
import {
  FriendsListResponse,
  FriendRequestsResponse,
  FriendItem,
} from "../../types/friends";
import UserInfo from "../../components/UserInfo";
import {
  getFriendsList,
  getFriendRequests,
  sendFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
} from "../../services/api/friendsApi";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const FriendsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [searchResult, setSearchResult] = useState<SearchFriendResponse | null>(
    null,
  );
  const [friendsList, setFriendsList] = useState<FriendsListResponse>([]);
  const [friendsListCount, setFriendsListCount] = useState<number>(0);
  const [friendRequests, setFriendRequests] = useState<FriendRequestsResponse>(
    [],
  );
  const [friendRequestsCount, setFriendRequestsCount] = useState<number>(0);
  const [friendsLoading, setFriendsLoading] = useState<boolean>(false);
  const [requestsLoading, setRequestsLoading] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(
    null,
  );
  const [addedId, setAddedId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendFriendRequest = async () => {
    setIsSending(true);
    try {
      const res = await sendFriendRequest(searchResult!.id);

      if (res.status === 200) {
        setSearchResult((prev) =>
          prev ? { ...prev, hasFriendRequestSent: true } : prev,
        );
        setAddedId(res.data as number);
      } else {
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRejectFriendRequest = async (id: number) => {
    setShowRejectModal(false);
    setIsSending(true);
    try {
      const res = await rejectFriendRequest(id);

      if (res.status === 200) {
        if (addedId === id && searchResult?.hasFriendRequestSent) {
          setSearchResult((prev) =>
            prev ? { ...prev, hasFriendRequestSent: false } : prev,
          );
          setAddedId(null);
        }
        if (
          searchResult?.friendRequestId === id &&
          searchResult?.hasFriendRequestSent
        ) {
          setSearchResult((prev) =>
            prev ? { ...prev, hasFriendRequestSent: false } : prev,
          );
        }
        if (
          searchResult?.friendRequestId === id &&
          searchResult?.hasFriendRequestReceived
        ) {
          setSearchResult((prev) =>
            prev ? { ...prev, hasFriendRequestReceived: false } : prev,
          );
        }
        if (friendRequests.some((req) => req.id === id)) {
          setFriendRequests((prev) => prev.filter((item) => item.id !== id));
          setFriendRequestsCount((prev) => Math.max(prev - 1, 0));
          try {
            const friendRequests = await getFriendRequests();
            if (friendRequests.status === 200 && friendRequests.data) {
              setFriendRequests(friendRequests.data);
              setFriendRequestsCount(friendRequests.totalElements || 0);
            }
          } catch (error) {
            console.error("Error refetching friend requests:", error);
          }
        }
      } else {
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      }
    } catch (error) {
      console.error("Error removing friend request:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptFriendRequest = async (id: number) => {
    setIsSending(true);
    try {
      const res = await acceptFriendRequest(id);

      if (res.status === 200 && res.data) {
        if (searchResult?.friendRequestId === id && !searchResult?.isFriend) {
          setSearchResult((prev) =>
            prev ? { ...prev, isFriend: true } : prev,
          );
        }
        // Update local state
        setFriendRequests((prev) => prev.filter((item) => item.id !== id));
        setFriendRequestsCount((prev) => Math.max(prev - 1, 0));
        // Add to friendsList if API returns the new friend
        setFriendsList((prev) => [...prev, res.data as FriendItem]);
        setFriendsListCount((prev) => prev + 1);

        // Refetch lists to ensure consistency
        try {
          const friendsList = await getFriendsList();
          if (friendsList.status === 200 && friendsList.data) {
            setFriendsList(friendsList.data);
            setFriendsListCount(friendsList.totalElements || 0);
          }
          const friendRequests = await getFriendRequests();
          if (friendRequests.status === 200 && friendRequests.data) {
            setFriendRequests(friendRequests.data);
            setFriendRequestsCount(friendRequests.totalElements || 0);
          }
        } catch (error) {
          console.error("Error refetching friends data:", error);
        }
      } else {
        Toast.show({
          type: "error",
          text1: t("error_occurred"),
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChat = (
    id: number,
    username: string,
    fullName: string,
    avatar: string | null,
  ) => {
    navigation.navigate("Chat", { id, username, fullName, avatar });
  };

  const handleOpenProfile = (id: number) => {
    navigation.navigate("Profile", { id });
  };

  useEffect(() => {
    const getList = async () => {
      setFriendsLoading(true);
      setRequestsLoading(true);
      try {
        const friendsList = await getFriendsList();
        if (friendsList.status === 200 && friendsList.data) {
          setFriendsList(friendsList.data);
          setFriendsListCount(friendsList.totalElements || 0);
        }
        const friendRequests = await getFriendRequests();
        if (friendRequests.status === 200 && friendRequests.data) {
          setFriendRequests(friendRequests.data);
          setFriendRequestsCount(friendRequests.totalElements || 0);
        }
      } catch (error) {
        console.error("Error fetching friends data:", error);
      } finally {
        setFriendsLoading(false);
        setRequestsLoading(false);
      }
    };
    getList();
  }, []);

  if (friendsLoading || requestsLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("friends")}</Text>
      <SearchBar
        placeholder={t("search_by_username")}
        type="search_friends"
        setSearchResult={setSearchResult}
      />

      {searchResult && (
        <View style={styles.user_container}>
          <UserInfo
            userInfo={searchResult}
            isDisabled={!searchResult.isFriend}
            onPress={() => handleOpenProfile(searchResult.id)}
          />

          {/* User has received friend request */}
          {!searchResult.isFriend && searchResult.hasFriendRequestReceived && (
            <View style={styles.button_group}>
              <TouchableOpacity
                style={styles.add_button}
                onPress={() =>
                  handleAcceptFriendRequest(searchResult.friendRequestId)
                }
                disabled={isSending}
              >
                <Text style={styles.add_text}>{t("accept")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setRejectingRequestId(searchResult.friendRequestId);
                  setShowRejectModal(true);
                }}
                disabled={isSending}
              >
                <Feather name="x" size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* User has sent friend request */}
          {!searchResult.isFriend && searchResult.hasFriendRequestSent && (
            <TouchableOpacity
              style={styles.add_button}
              onPress={() => {
                setRejectingRequestId(addedId ?? searchResult.friendRequestId);
                setShowRejectModal(true);
              }}
              disabled={isSending}
            >
              <Text style={styles.add_text}>{t("remove_request")}</Text>
            </TouchableOpacity>
          )}

          {/* User can send friend request */}
          {!searchResult.isFriend &&
            !searchResult.hasFriendRequestSent &&
            !searchResult.hasFriendRequestReceived && (
              <TouchableOpacity
                style={styles.add_button}
                onPress={handleSendFriendRequest}
                disabled={isSending}
              >
                <Text style={styles.add_text}>{t("add")}</Text>
              </TouchableOpacity>
            )}

          {searchResult.isFriend && (
            <TouchableOpacity
              style={styles.add_button}
              onPress={() =>
                handleOpenChat(
                  searchResult.id,
                  searchResult.username,
                  searchResult.fullName,
                  searchResult.avatar,
                )
              }
            >
              <Text style={styles.add_text}>{t("message")}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.section}>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListHeaderComponent={
            <Text style={styles.subtitle}>
              {t("friend_requests")} ({friendRequestsCount})
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.user_container}>
              <UserInfo userInfo={item.user} isDisabled={true} />
              <View style={styles.button_group}>
                <TouchableOpacity
                  style={styles.add_button}
                  onPress={() => handleAcceptFriendRequest(item.id)}
                  disabled={isSending}
                >
                  <Text style={styles.add_text}>{t("accept")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRejectingRequestId(item.id);
                    setShowRejectModal(true);
                  }}
                  disabled={isSending}
                >
                  <Feather name="x" size={24} color={colors.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.no_result_text}>{t("no_friend_requests")}</Text>
          }
        />
      </View>

      <View style={styles.section}>
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListHeaderComponent={
            <Text style={styles.subtitle}>
              {t("friends_list")} ({friendsListCount})
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.user_container}>
              <UserInfo
                userInfo={item}
                onPress={() => handleOpenProfile(item.id)}
              />
              <TouchableOpacity
                style={styles.add_button}
                onPress={() =>
                  handleOpenChat(
                    item.id,
                    item.username,
                    item.fullName,
                    item.avatar,
                  )
                }
              >
                <Text style={styles.add_text}>{t("message")}</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.no_result_text}>{t("no_friends")}</Text>
          }
        />
      </View>

      <ConfirmModal
        visible={showRejectModal}
        title={t("remove_request")}
        message={t("remove_request_confirm")}
        confirmText={t("remove")}
        cancelText={t("cancel")}
        onCancel={() => setShowRejectModal(false)}
        onConfirm={() => {
          if (rejectingRequestId != null) {
            handleRejectFriendRequest(rejectingRequestId);
          }
        }}
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

  subtitle: {
    fontSize: fonts.size.medium,
    color: colors.secondary,
    fontWeight: "600",
    marginBottom: 8,
  },

  username_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.text,
  },

  user_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  add_button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 8,
    height: 32,
  },

  add_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
  },

  no_result_text: {
    color: colors.accent,
    textAlign: "center",
    marginTop: 16,
  },

  section: {
    marginVertical: 16,
  },

  button_group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
export default FriendsScreen;
