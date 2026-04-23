import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Avatar from "../../components/Avatar";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import Loading from "../../components/Loading";
import { getUserInfo } from "../../services/api/userApi";
import { removeFriend } from "../../services/api/friendsApi";
import ConfirmModal from "../../components/ConfirmModal";
import SelectModal, { Option } from "../../components/SelectModal";
import Toast from "react-native-toast-message";
import { truncateText } from "../../utils/helpers";

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, "Profile">>();
  const { id } = route.params;
  const [user, setUser] = useState(userInfo);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);

  const options: Option[] = [
    {
      label: t("remove_friend"),
      onPress: () => {
        setShowSelectModal(false);
        setShowRemoveModal(true);
      },
    },
  ];

  const handleOpenSelectModal = () => {
    setShowSelectModal(true);
  };

  const handleRemoveFriend = async () => {
    setShowRemoveModal(false);

    try {
      const res = await removeFriend(userInfo!.id);
      if (res.status === 200) {
        Toast.show({
          type: "success",
          text1: t("remove_friend_success"),
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: t("remove_friend_error"),
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async (id: number) => {
      setIsLoading(true);
      try {
        const response = await getUserInfo(id);
        if (response.status === 200 && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id && userInfo?.id !== id) {
      fetchUserInfo(id);
    }
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <TopBar
            type={user?.id === userInfo?.id ? "myProfile" : "otherProfile"}
            userInfo={user}
            onPressOption={handleOpenSelectModal}
          />
          <View style={styles.info_container}>
            <Avatar size={80} />
            <Text style={styles.title}>{truncateText(user?.fullName, 15)}</Text>
          </View>
        </>
      ) : (
        <View style={styles.error_container}>
          <Text style={styles.error_text}>{t("error_occurred")}</Text>
          <TouchableOpacity
            style={styles.goback_button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goback_text}>{t("go_back")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <SelectModal
        visible={showSelectModal}
        options={options}
        onClose={() => setShowSelectModal(false)}
        title={t("options")}
      />

      <ConfirmModal
        visible={showRemoveModal}
        title={t("remove_friend")}
        message={t("remove_friend_confirm")}
        confirmText={t("remove")}
        cancelText={t("cancel")}
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={() => {
          handleRemoveFriend();
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
  title: {
    fontSize: fonts.size.xlarge,
    fontWeight: 600,
    color: colors.text,
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  goback_button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  goback_text: {
    fontSize: fonts.size.medium,
    fontWeight: "bold",
  },
  error_text: {
    fontSize: fonts.size.medium,
    color: colors.error,
    fontWeight: "600",
  },
  error_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
export default ProfileScreen;
