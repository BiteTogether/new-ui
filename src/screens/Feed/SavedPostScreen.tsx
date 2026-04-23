import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";

export const useSavedPostsScreen = () => {
  const { t } = useTranslation();

  const numColumns = 3;
  const imageMargin = 2;
  const imageSize =
    (Dimensions.get("window").width - 52 - imageMargin * (numColumns - 1)) /
    numColumns;

  const HeaderComponent = (
    <View style={savedPostsScreenStyles.container}>
      <Text style={savedPostsScreenStyles.title}>{t("saved_posts")}</Text>
    </View>
  );

  return {
    numColumns,
    imageMargin,
    imageSize,
    HeaderComponent,
  };
};

export const savedPostsScreenStyles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: fonts.size.xlarge,
    color: colors.text,
    fontWeight: "bold",
  },

  no_result_text: {
    color: colors.neutral,
    textAlign: "center",
    marginTop: "50%",
  },
});
