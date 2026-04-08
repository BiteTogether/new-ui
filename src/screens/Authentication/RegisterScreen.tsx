import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
import InfoInput from "../../components/InfoInput";
import { isValidUsername } from "../../utils/validation";

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
          userRegister({
            idToken,
            username: cleanUsername,
            fullName: cleanFullName,
          }),
        ).unwrap();
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
      <View style={{ width: "100%", padding: 24 }}>
        <InfoInput
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
        />
      </View>
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
});
export default RegisterScreen;
