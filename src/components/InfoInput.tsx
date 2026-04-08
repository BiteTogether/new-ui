import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { colors, fonts } from "../utils/constants";
import { useTranslation } from "react-i18next";

interface InfoInputProps {
  username: string;
  setUsername: (username: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
}

const InfoInput = ({
  username,
  setUsername,
  fullName,
  setFullName,
}: InfoInputProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={styles.subtitle}>{t("username")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("username")}
        placeholderTextColor={colors.secondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.helperText}>{t("username_helper_text")}</Text>
      <Text style={[styles.subtitle, { marginTop: 32 }]}>{t("full_name")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("full_name")}
        placeholderTextColor={colors.secondary}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="none"
      />
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: fonts.size.medium,
    color: colors.secondary,
    fontWeight: "600",
  },

  helperText: {
    color: colors.secondary,
    marginTop: 4,
  },

  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 16,
    marginVertical: 8,
    color: colors.text,
    fontSize: fonts.size.medium,
    fontWeight: "600",
  },
});
export default InfoInput;
