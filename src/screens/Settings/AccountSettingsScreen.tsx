import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { userUpdateInfo } from "../../store/user/userActions";
import Toast from "react-native-toast-message";
import { validateInfo } from "../../services/api/userApi";
import InfoInput from "../../components/InfoInput";
import Avatar from "../../components/Avatar";
import { isValidUsername } from "../../utils/validation";

const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState<string>(userInfo?.username || "");
  const [fullName, setFullName] = useState<string>(userInfo?.fullName || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    setIsChanged(
      username !== userInfo?.username || fullName !== userInfo?.fullName,
    );
  }, [username, fullName, userInfo]);

  const handleSave = async () => {
    if (!isValidUsername(username)) {
      Toast.show({
        type: "error",
        text1: t("invalid_username"),
      });
      return;
    }
    try {
      setIsLoading(true);
      const cleanUsername = username.trim().toLowerCase();
      const cleanFullName = fullName.trim();
      const res = await validateInfo({
        criteriaType: "USERNAME",
        criteriaValue: cleanUsername,
      });
      if (res.status === 200 && res.data?.valid) {
        await dispatch(
          userUpdateInfo({
            id: userInfo!.id,
            username: cleanUsername,
            fullName: cleanFullName,
          }),
        ).unwrap();

        Toast.show({
          type: "success",
          text1: t("user_update_success"),
        });
      } else if (res.status === 200 && !res.data?.valid) {
        Toast.show({
          type: "error",
          text1: t("username_taken"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("user_update_failed"),
      });
      console.error("Error updating user info: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        type="other"
        title={t("account")}
        onSave={handleSave}
        saveLoading={isLoading}
        isChanged={isChanged}
      />
      <View style={styles.avatar_container}>
        <Avatar size={80} />
      </View>
      <InfoInput
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
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

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },

  buttonText: {
    fontSize: fonts.size.medium,
    fontWeight: "bold",
  },

  button_container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },

  avatar_container: {
    alignItems: "center",
    marginBottom: 32,
  },
});

export default AccountSettingsScreen;
