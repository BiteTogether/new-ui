import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fonts } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import LogoIcon from "../../../assets/icons/LogoIcon";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const handleLogin = () => {
    navigation.navigate("Input");
  };

  return (
    <View style={styles.container}>
      <View style={styles.text_container}>
        <Text style={[styles.title, { color: colors.text }]}>{t("bite")}</Text>
        <Text style={[styles.title, { color: colors.primary }]}>
          {t("together")}
        </Text>
      </View>

      <LogoIcon size={220} />

      <Text style={styles.subtitle}>{t("welcome")}</Text>
      <View style={styles.text_container}>
        <Text style={styles.subsubtitle}>{t("slogan")} </Text>
        <Text style={[styles.subsubtitle, { color: colors.primary }]}>
          {t("through_food")}
        </Text>
      </View>

      <SafeAreaView style={styles.privacy_container}>
        <Text style={styles.subsubtitle}>{t("tapping_get_started")}</Text>
        <Text style={styles.subsubtitle}>{t("privacy_policy")}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t("get_started")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  text_container: {
    flexDirection: "row",
  },

  title: {
    fontSize: fonts.size.xxlarge,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: fonts.size.large,
    color: colors.text,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subsubtitle: {
    fontSize: fonts.size.small,
    color: colors.text,
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

  privacy_container: {
    position: "absolute",
    bottom: "5%",
    alignItems: "center",
    width: "100%",
  },
});

export default LoginScreen;
