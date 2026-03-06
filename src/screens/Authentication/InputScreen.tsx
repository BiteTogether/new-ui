import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";

const InputScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = () => {
    navigation.navigate("OTP");
  };
  return (
    <View style={styles.container}>
      <NavigationButton onGoBack={handleGoBack} onGoNext={handleGoNext} />
      <Text style={styles.title}>{t("enter_phone")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("phone_number")}
        placeholderTextColor={colors.secondary}
        keyboardType="phone-pad"
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
export default InputScreen;
