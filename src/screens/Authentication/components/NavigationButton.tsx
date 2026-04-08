import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";

interface NavigationButtonProps {
  onGoBack?: () => void;
  onGoNext?: () => void;
  isDisabledNext?: boolean;
}

const NavigationButton = ({
  onGoBack,
  onGoNext,
  isDisabledNext,
}: NavigationButtonProps) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onGoBack}>
        <Feather name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>
      {!isDisabledNext && (
        <TouchableOpacity style={styles.button} onPress={onGoNext}>
          <Text style={styles.buttonText}>{t("next")}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: "20%",
    paddingHorizontal: 24,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: fonts.size.medium,
  },
});
export default NavigationButton;
