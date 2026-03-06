import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" as never }],
    });
  };
  return (
    <View style={styles.container}>
      <NavigationButton onGoBack={handleGoBack} onGoNext={handleGoNext} />
      <Text style={styles.title}>{t("enter_username")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        placeholderTextColor={colors.secondary}
      />
      <Text style={styles.subtitle}>{t("username_helper_text")}</Text>
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
