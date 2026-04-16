import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import Toast from "react-native-toast-message";
import Avatar from "../../components/Avatar";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { Conversation } from "../../types/chat";
import {
  userGetConversationById,
  userUpdateConversation,
  userRemoveMemberFromConversation,
  userUpdateRoleInConversation,
} from "../../store/chat/chatActions";
import { userGetUsersByIds } from "../../store/user/userActions";
import { UserInfo as UserInfoType } from "../../types/user";
import UserInfo from "../../components/UserInfo";
import { Feather } from "@expo/vector-icons";
import { truncateText } from "../../utils/helpers";
import ConfirmModal from "../../components/ConfirmModal";
import SelectModal, { Option } from "../../components/SelectModal";

const GroupDetailScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const route = useRoute<RouteProp<MainStackParamList, "GroupDetail">>();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { conversationId } = route.params;
  const [groupInfo, setGroupInfo] = useState<Conversation>();
  const [groupMembers, setGroupMembers] = useState<UserInfoType[]>([]);
  const [showSelectMemberModal, setShowSelectMemberModal] =
    useState<boolean>(false);
  const [showSelectGroupModal, setShowSelectGroupModal] =
    useState<boolean>(false);
  const [showRenameGroupModal, setShowRenameGroupModal] =
    useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showChangeRoleModal, setShowChangeRoleModal] =
    useState<boolean>(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedMemberRole, setSelectedMemberRole] = useState<
    "ADMIN" | "MEMBER" | null
  >(null);
  const [newGroupName, setNewGroupName] = useState<string>("");

  const memberOptions: Option[] = [
    {
      label: t("change_role"),
      onPress: () => {
        setShowSelectMemberModal(false);
        setShowChangeRoleModal(true);
      },
    },
    {
      label: t("remove_member"),
      onPress: () => {
        setShowSelectMemberModal(false);
        setShowRemoveModal(true);
      },
    },
  ];

  const groupOptions: Option[] = [
    {
      label: t("change_group_avatar"),
      onPress: () => {
        setShowSelectGroupModal(false);
      },
    },
    {
      label: t("change_group_name"),
      onPress: () => {
        setShowSelectGroupModal(false);
        setShowRenameGroupModal(true);
      },
    },
    {
      label: t("add_member"),
      onPress: () => {
        setShowSelectGroupModal(false);
        navigation.navigate("AddMember", {
          ids: groupMembers.map((m) => m.id),
        });
      },
    },
  ];

  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    // Get role of selected member to show in change role modal
    const member = groupInfo?.participants.find(
      (m) => m.chatUserSnapshot.userId === memberId,
    );

    setSelectedMemberRole(member?.role || null);
    setShowSelectMemberModal(true);
  };

  const handleChangeRole = async (role: "ADMIN" | "MEMBER") => {
    if (!selectedMemberId || !groupInfo) return;
    setShowChangeRoleModal(false);
    try {
      await dispatch(
        userUpdateRoleInConversation({
          conversationId: groupInfo.id,
          userId: selectedMemberId,
          role: role,
        }),
      ).unwrap();

      setGroupInfo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map((m) =>
            m.chatUserSnapshot.userId === selectedMemberId ? { ...m, role } : m,
          ),
        };
      });
      Toast.show({
        type: "success",
        text1: t("change_role_success"),
      });
    } catch (error) {
      console.error("Error changing role: ", error);
      Toast.show({
        type: "error",
        text1: t("change_role_error"),
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMemberId || !groupInfo) return;
    setShowRemoveModal(false);
    try {
      await dispatch(
        userRemoveMemberFromConversation({
          conversationId: groupInfo.id,
          userId: selectedMemberId,
        }),
      ).unwrap();
      setGroupMembers((prev) =>
        prev.filter((member) => member.id !== selectedMemberId),
      );
      Toast.show({
        type: "success",
        text1: t("remove_member_success"),
      });
    } catch (error) {
      console.error("Error removing member: ", error);
      Toast.show({
        type: "error",
        text1: t("remove_member_error"),
      });
    } finally {
      setSelectedMemberId(null);
    }
  };

  const handlePressOption = () => {
    setShowSelectGroupModal(true);
  };

  const handleSaveGroupName = async () => {
    const trimmedName = newGroupName.trim();
    if (trimmedName === groupInfo?.name || trimmedName.length === 0) {
      Toast.show({
        type: "error",
        text1: t("new_group_name_required"),
      });
      return;
    }
    setShowRenameGroupModal(false);
    try {
      await dispatch(
        userUpdateConversation({
          conversationId: groupInfo!.id,
          name: trimmedName,
          avatarUrl: groupInfo?.avatarUrl,
        }),
      ).unwrap();
      setGroupInfo((prev) => (prev ? { ...prev, name: trimmedName } : prev));
      Toast.show({
        type: "success",
        text1: t("change_group_name_success"),
      });
    } catch (error) {
      console.error("Error changing group name: ", error);
      Toast.show({
        type: "error",
        text1: t("change_group_name_error"),
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchConversation = async () => {
        try {
          const res = await dispatch(
            userGetConversationById(conversationId),
          ).unwrap();
          setGroupInfo(res);
          const membersIds =
            res?.participants.map((member) => member.chatUserSnapshot.userId) ||
            [];

          try {
            const members = await dispatch(
              userGetUsersByIds(membersIds),
            ).unwrap();
            setGroupMembers(members.users);
          } catch (error) {
            console.error("Error fetching group members: ", error);
          }
        } catch (error) {
          console.error("Error fetching conversation: ", error);
          Toast.show({
            type: "error",
            text1: t("error_occurred"),
          });
        }
      };

      fetchConversation();
    }, [conversationId]),
  );

  useEffect(() => {
    if (groupInfo) {
      setNewGroupName(groupInfo.name);
    }
  }, [groupInfo]);

  return (
    <View style={styles.container}>
      <TopBar
        type="other"
        title={t("group_detail")}
        onPressOption={handlePressOption}
      />
      <View style={styles.avatar_container}>
        <Avatar size={100} />
        <View
          style={{
            marginVertical: 16,
          }}
        >
          <Text style={styles.title}>
            {truncateText(groupInfo?.name || "", 20)}
          </Text>
        </View>
      </View>

      <FlatList
        data={groupMembers}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.title}>
              {t("group_members")} ({groupMembers.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          // Check if current user is admin to show options for each member
          const isAdmin = groupInfo?.participants.some(
            (member) =>
              member.role === "ADMIN" &&
              member.chatUserSnapshot.userId === userInfo?.id,
          );
          return (
            <View style={styles.member_container}>
              <UserInfo userInfo={item} isDisabled={true} />
              {isAdmin && (
                <TouchableOpacity onPress={() => handleSelectMember(item.id)}>
                  <Feather
                    name="more-horizontal"
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
      <SelectModal
        visible={showSelectMemberModal}
        options={memberOptions}
        onClose={() => setShowSelectMemberModal(false)}
        title={t("options")}
      />

      <SelectModal
        visible={showSelectGroupModal}
        options={groupOptions}
        onClose={() => setShowSelectGroupModal(false)}
        title={t("options")}
      />

      <ConfirmModal
        visible={showRemoveModal}
        title={t("remove_member")}
        message={t("remove_member_confirm")}
        confirmText={t("remove")}
        cancelText={t("cancel")}
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={() => {
          handleRemoveMember();
        }}
      />

      {/* Modal select role */}
      <ConfirmModal
        visible={showChangeRoleModal}
        title={t("change_role")}
        confirmText={t("save")}
        cancelText={t("cancel")}
        onCancel={() => setShowChangeRoleModal(false)}
        onConfirm={() => {
          if (selectedMemberRole) handleChangeRole(selectedMemberRole);
        }}
        hasInput={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor:
                selectedMemberRole === "ADMIN"
                  ? colors.cancel
                  : colors.secondary,
              borderRadius: 8,
            }}
            onPress={() => setSelectedMemberRole("ADMIN")}
          >
            <Text
              style={{
                color:
                  selectedMemberRole === "ADMIN" ? colors.text : colors.text,
                fontWeight: "bold",
              }}
            >
              {t("admin")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor:
                selectedMemberRole === "MEMBER"
                  ? colors.cancel
                  : colors.secondary,
              borderRadius: 8,
            }}
            onPress={() => setSelectedMemberRole("MEMBER")}
          >
            <Text
              style={{
                color:
                  selectedMemberRole === "MEMBER" ? colors.text : colors.text,
                fontWeight: "bold",
              }}
            >
              {t("member")}
            </Text>
          </TouchableOpacity>
        </View>
      </ConfirmModal>

      <ConfirmModal
        visible={showRenameGroupModal}
        title={t("change_group_name")}
        hasInput={true}
        confirmText={t("save")}
        cancelText={t("cancel")}
        onCancel={() => setShowRenameGroupModal(false)}
        inputValue={newGroupName}
        setInputValue={setNewGroupName}
        onConfirm={() => {
          handleSaveGroupName();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },

  avatar_container: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: Platform.OS === "android" ? 32 : 0,
  },

  title: {
    fontSize: fonts.size.large,
    color: colors.text,
    fontWeight: "600",
  },
  member_container: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default GroupDetailScreen;
