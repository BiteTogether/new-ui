import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../utils/constants";
import { useTranslation } from "react-i18next";

interface BillSessionCardProps {
  totalAmount: number;
  currency: string;
  splitType: "EQUAL" | "CUSTOM";
  status: "DRAFT" | "FINALIZED" | "SETTLED";
  onFinalize: () => void;
  isOwner: boolean;
}

const BillSessionCard = ({
  totalAmount,
  currency,
  splitType,
  onFinalize,
  isOwner,
  status,
}: BillSessionCardProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>
        {totalAmount.toLocaleString()} {currency}
      </Text>
      <Text style={styles.splitType}>
        {splitType === "EQUAL" ? t("equal_split") : t("custom_split")}
      </Text>
      <Text
        style={[
          styles.status,
          status === "DRAFT"
            ? styles.created
            : status === "FINALIZED"
              ? styles.finalized
              : styles.settled,
        ]}
      >
        {status === "DRAFT"
          ? t("draft")
          : status === "FINALIZED"
            ? t("finalized")
            : t("settled")}
      </Text>
      {isOwner && status === "DRAFT" && (
        <TouchableOpacity style={styles.finalizeBtn} onPress={onFinalize}>
          <Text style={styles.finalizeBtnText}>{t("finalize_bill")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.text,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 4 },
  amount: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.orange,
    marginBottom: 4,
  },
  splitType: { fontSize: 14, color: colors.secondary, marginBottom: 4 },
  status: { fontWeight: "bold", fontSize: 14, marginBottom: 8 },
  created: { color: colors.cancel },
  finalized: { color: colors.orange },
  settled: { color: colors.green },
  finalizeBtn: {
    backgroundColor: colors.orange,
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  finalizeBtnText: { color: colors.text, fontWeight: "bold" },
});

export default BillSessionCard;
