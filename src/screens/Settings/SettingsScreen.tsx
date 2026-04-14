import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { userLogout } from "../../store/auth/authActions";
import { userDeleteInfo } from "../../store/user/userActions";
import Loading from "../../components/Loading";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "react-native-toast-message";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const { userInfo, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    dispatch(userLogout());
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    try {
      await dispatch(userDeleteInfo(userInfo!.id)).unwrap();
      Toast.show({
        type: "success",
        text1: t("delete_account_success"),
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("delete_account_failed"),
      });
      console.error("Error deleting account:", error);
    }
  };

  if (authLoading || userLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <TopBar type="other" title={t("settings")} />

      <View style={styles.func_list}>
        <TouchableOpacity
          style={styles.func_container}
          onPress={() => navigation.navigate("AccountSettings")}
        >
          <Feather name="user" size={24} color={colors.text} />
          <Text style={styles.func_text}>{t("account")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.func_container}
          onPress={() => navigation.navigate("SystemSettings")}
        >
          <Feather name="settings" size={24} color={colors.text} />
          <Text style={styles.func_text}>{t("system_settings")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.func_container}
          onPress={() => setShowDeleteModal(true)}
        >
          <Feather name="trash" size={24} color={colors.error} />
          <Text style={[styles.func_text, { color: colors.error }]}>
            {t("delete_account")}
          </Text>
        </TouchableOpacity>

        <ConfirmModal
          visible={showDeleteModal}
          title={t("delete_account")}
          message={t("delete_account_confirm")}
          confirmText={t("delete")}
          cancelText={t("cancel")}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDeleteAccount();
          }}
        />
      </View>

      <View style={styles.button_logout_container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.buttonText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={showLogoutModal}
        title={t("logout")}
        message={t("logout_confirm")}
        confirmText={t("logout")}
        cancelText={t("cancel")}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          handleLogout();
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

  button_logout_container: {
    position: "absolute",
    bottom: "5%",
    alignItems: "center",
    left: 0,
    right: 0,
  },

  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 16,
    width: "80%",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: fonts.size.large,
  },

  func_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.text,
  },

  func_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  func_list: {
    gap: 24,
    marginTop: 32,
  },
});

export default SettingsScreen;
