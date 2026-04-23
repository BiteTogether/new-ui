import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import SearchBar from "../../components/SearchBar";
import { useTranslation } from "react-i18next";
import { FriendsListResponse } from "../../types/friends";
import { getFriendsList } from "../../services/api/friendsApi";
import Avatar from "../../components/Avatar";
import { Feather } from "@expo/vector-icons";
import { truncateText } from "../../utils/helpers";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { userAddMembersToConversation } from "../../store/chat/chatActions";

import Toast from "react-native-toast-message";

const AddMemberScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [friendsList, setFriendsList] = useState<FriendsListResponse>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.chat);
  const route = useRoute<RouteProp<MainStackParamList, "AddMember">>();
  const { conversationId, ids } = route.params;

  const handleLoadMore = async () => {
    // Implement pagination if needed
  };

  const handleSelectMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAddMember = async () => {
    if (selectedMembers.length === 0) {
      Toast.show({
        type: "error",
        text1: t("member_required"),
      });
      return;
    }
    try {
      await dispatch(
        userAddMembersToConversation({
          conversationId: conversationId,
          userIds: selectedMembers,
        }),
      ).unwrap();
      Toast.show({
        type: "success",
        text1: t("add_member_success"),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding member:", error);
      Toast.show({
        type: "error",
        text1: t("add_member_error"),
      });
      return;
    }
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

  return (
    <View style={styles.container}>
      <TopBar title={t("add_member")} type="other" />

      <SearchBar
        placeholder={t("search_by_name_or_username")}
        setSearchResult={setSearchText}
      />

      <View>
        <FlatList
          data={
            selectedMembers.length > 0
              ? friendsList.filter((friend) =>
                  selectedMembers.includes(friend.id),
                )
              : []
          }
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => (
            <Pressable
              style={[styles.select_container, { padding: 8 }]}
              onPress={() => handleSelectMember(item.id)}
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
                <View style={styles.x_button}>
                  <Feather name="x" size={12} color={colors.text} />
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={friendsList
          .filter((friend) => !ids.includes(friend.id))
          .filter(
            (friend) =>
              friend.fullName
                ?.toLowerCase()
                .includes(searchText.toLowerCase().trim()) ||
              friend.username
                ?.toLowerCase()
                .includes(searchText.toLowerCase().trim()),
          )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <Text style={styles.title}>
            {t("select_members")} ({selectedMembers.length})
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.select_container}
            onPress={() => handleSelectMember(item.id)}
          >
            <View style={styles.user_container}>
              <Avatar uri={item.avatar} />
              <View style={styles.username_container}>
                <Text style={styles.fullName_text}>
                  {truncateText(item.fullName, 20)}
                </Text>
                <Text style={styles.username_text}>{item.username}</Text>
              </View>
            </View>

            <View
              style={[
                styles.circle_button,
                {
                  backgroundColor: selectedMembers.includes(item.id)
                    ? colors.primary
                    : colors.background,
                  borderWidth: selectedMembers.includes(item.id) ? 0 : 1,
                },
              ]}
            >
              {selectedMembers.includes(item.id) && (
                <Feather name="check" size={16} />
              )}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.no_result_text}>{t("no_friends")}</Text>
        }
      />

      <TouchableOpacity
        style={[
          styles.button_container,
          {
            opacity: loading ? 0.6 : 1,
          },
        ]}
        onPress={handleAddMember}
        disabled={loading}
      >
        <Text style={styles.button_text}>{t("add")}</Text>
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
  button_container: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  button_text: {
    fontSize: fonts.size.medium,
    fontWeight: "bold",
  },
  no_result_text: {
    color: colors.neutral,
    textAlign: "center",
    marginTop: 16,
  },
  user_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  fullName_text: {
    fontSize: fonts.size.medium,
    color: colors.text,
    fontWeight: "600",
  },
  username_text: {
    fontSize: fonts.size.medium,
    color: colors.secondary,
  },
  username_container: {
    gap: 6,
  },
  title: {
    fontSize: fonts.size.medium,
    color: colors.text,
    fontWeight: "bold",
    marginVertical: 12,
  },
  circle_button: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  select_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  x_button: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderWidth: 1,
    borderColor: colors.text,
  },
});
export default AddMemberScreen;
