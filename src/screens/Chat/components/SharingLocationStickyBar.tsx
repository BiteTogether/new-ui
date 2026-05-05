import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../../../utils/constants";
import { useTranslation } from "react-i18next";

interface SharingLocationStickyBarProps {
  isSharing: boolean;
  onPress: () => void;
}

const SharingLocationStickyBar = ({
  isSharing,
  onPress,
}: SharingLocationStickyBarProps) => {
  const { t } = useTranslation();

  if (!isSharing) return null;

  return (
    <View style={styles.stickyBar}>
      <TouchableOpacity
        style={styles.bar}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Feather name="map-pin" size={20} color={colors.text} />
        <Text style={styles.barText}>{t("sharing_location")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyBar: {
    marginHorizontal: -12,
  },
  bar: {
    backgroundColor: colors.green,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 4,
  },
  barText: {
    color: colors.text,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  dropdown: {
    backgroundColor: colors.text,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 8,
    elevation: 2,
  },
  voteCard: {
    marginVertical: 4,
    backgroundColor: colors.neutral,
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  pollHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  voteTitle: {
    fontWeight: "600",
    fontSize: fonts.size.medium,
  },
});

export default SharingLocationStickyBar;
