import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { colors } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import { truncateText } from "../../../utils/helpers";

interface Member {
  userId: string;
  name: string;
  avatar: string;
  amount: number;
  confirmed: boolean;
}

interface BillMemberListProps {
  members: Member[];
  onConfirm: (userId: number, billSessionId: string) => void;
  myUserId: string;
  billStatus: "DRAFT" | "FINALIZED" | "SETTLED";
  isOwner: boolean;
  billSessionId: string;
  currency: string;
}

const BillMemberList: React.FC<BillMemberListProps> = ({
  members,
  onConfirm,
  myUserId,
  billStatus,
  isOwner,
  billSessionId,
  currency,
}) => {
  const { t } = useTranslation();

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.userId}
      renderItem={({ item }) => (
        <View style={styles.member}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{truncateText(item.name, 20)}</Text>
            <Text style={styles.amount}>
              {item.amount.toLocaleString()} {currency}
            </Text>
          </View>
          {billStatus === "FINALIZED" &&
            ((item.userId === myUserId || isOwner) && !item.confirmed ? (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => onConfirm(Number(item.userId), billSessionId)}
              >
                <Text style={styles.confirmBtnText}>
                  {t("confirm_payment")}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={item.confirmed ? styles.confirmed : styles.notConfirmed}
              >
                {item.confirmed ? t("paid") : t("unpaid")}
              </Text>
            ))}
          {billStatus === "SETTLED" && (
            <Text style={styles.confirmed}>{t("settled")}</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  member: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  name: { fontWeight: "bold", fontSize: 15 },
  amount: { color: colors.orange, fontWeight: "bold", fontSize: 15 },
  confirmBtn: {
    backgroundColor: colors.cancel,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmBtnText: { color: colors.text, fontWeight: "bold" },
  confirmed: { color: colors.green, fontWeight: "bold" },
  notConfirmed: { color: colors.error, fontWeight: "bold" },
});

export default BillMemberList;
