import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";
import Toast from "react-native-toast-message";
import { validateInfo } from "../../services/api/userApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { userRegister } from "../../store/auth/authActions";
import Loading from "../../components/Loading";

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, "Register">>();
  const { idToken } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = async () => {
    // Username validation: 6-20 chars, letters, numbers, _ and . only
    const usernameRegex = /^[a-zA-Z0-9_.]{6,20}$/;
    if (!usernameRegex.test(username)) {
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
          userRegister({
            idToken,
            username: cleanUsername,
            fullName: cleanFullName,
          }),
        );
      } else if (res.status === 200 && !res.data?.valid) {
        Toast.show({
          type: "error",
          text1: t("username_taken"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("register_failed"),
      });
      console.error("Error registering user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <NavigationButton
        onGoBack={handleGoBack}
        onGoNext={handleGoNext}
        isDisabledNext={!username || !fullName}
      />
      <Text style={styles.title}>{t("enter_info")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        placeholderTextColor={colors.secondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.subtitle}>{t("username_helper_text")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("full_name")}
        placeholderTextColor={colors.secondary}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  title: {
    fontSize: fonts.size.large,
    color: colors.text,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: fonts.size.medium,
    color: colors.secondary,
  },

  input: {
    width: "80%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 16,
    margin: 24,
    color: colors.text,
    fontSize: fonts.size.medium,
    fontWeight: "600",
  },
});
export default RegisterScreen;
