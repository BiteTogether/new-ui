import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";
import SearchBar from "../../components/SearchBar";
import { StyleSheet, Text, View } from "react-native";

export const useSearchScreen = () => {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // Header and search bar to render above FlatList
  const HeaderComponent = (
    <View style={searchScreenStyles.container}>
      <Text style={searchScreenStyles.title}>{t("search")}</Text>
      <SearchBar
        placeholder={t("search_restaurant")}
        type="search_map"
        setSearchResult={setRestaurants}
      />
    </View>
  );

  return {
    restaurants,
    setRestaurants,
    HeaderComponent,
  };
};

// Styles for use in HomeScreen
export const searchScreenStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fonts.size.xlarge,
    color: colors.text,
    fontWeight: "bold",
  },
  itemBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  address_text: {
    color: colors.secondary,
  },
});
