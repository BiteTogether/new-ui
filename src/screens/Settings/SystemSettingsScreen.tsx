import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SystemSettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleChangeLanguage = async () => {
    const newLang = currentLang === "en" ? "vi" : "en";
    await i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    await AsyncStorage.setItem("appLanguage", newLang);
    Toast.show({
      type: "success",
      text1: t("language_change_success"),
    });
  };

  return (
    <View style={styles.container}>
      <TopBar type="other" title={t("system_settings")} />

      <View style={styles.func_list}>
        <TouchableOpacity
          style={[styles.func_container, { justifyContent: "space-between" }]}
          onPress={handleChangeLanguage}
        >
          <View style={styles.func_container}>
            <Feather name="globe" size={24} color={colors.text} />
            <Text style={styles.func_text}>{t("language")}</Text>
          </View>
          <View>
            <Text style={[styles.func_text, { color: colors.secondary }]}>
              {currentLang === "en" ? t("english") : t("vietnamese")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
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

export default SystemSettingsScreen;
