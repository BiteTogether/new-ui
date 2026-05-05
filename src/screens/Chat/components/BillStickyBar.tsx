import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../../../utils/constants";
import { BillList } from "../../../types/chat";
import { useTranslation } from "react-i18next";

interface BillStickyBarProps {
  billSessions: BillList;
  onSelectBill: (billId: string) => void;
}

const BillStickyBar = ({ billSessions, onSelectBill }: BillStickyBarProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!billSessions || billSessions.length === 0) return null;

  return (
    <View style={styles.stickyBar}>
      <TouchableOpacity
        style={styles.bar}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <Feather name="file-text" size={20} color={colors.text} />
        <Text style={styles.barText}>
          {billSessions.length} {t("bill_in_progress")}
        </Text>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.text}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.dropdown}>
          <FlatList
            data={billSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.billCard}>
                <TouchableOpacity
                  style={styles.billHeader}
                  onPress={() => {
                    onSelectBill(item.id);
                    setExpanded(false);
                  }}
                >
                  <Text style={styles.billTitle}>
                    {item.totalAmount} {item.currency}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stickyBar: {
    marginHorizontal: -12,
  },
  bar: {
    backgroundColor: colors.accent,
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
  billCard: {
    marginVertical: 4,
    backgroundColor: colors.neutral,
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  billTitle: {
    fontWeight: "600",
    fontSize: fonts.size.medium,
  },
  billStatus: {
    fontSize: 12,
    color: colors.secondary,
  },
});

export default BillStickyBar;
