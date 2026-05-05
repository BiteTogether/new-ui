import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../../../utils/constants";
import { BillSession } from "../../../types/chat";
import BillSessionCard from "./BillSessionCard";
import BillMemberList from "./BillMemberList";
import { useTranslation } from "react-i18next";

interface Member {
  userId: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
}

interface BillDetailModalProps {
  visible: boolean;
  billSession: BillSession | null;
  members: Member[];
  isOwner: boolean;
  myUserId: string;
  onClose: () => void;
  onConfirmPayment: (userId: number, billSessionId: string) => void;
  onFinalize: () => void;
}

const BillDetailModal = ({
  visible,
  billSession,
  members,
  isOwner,
  myUserId,
  onClose,
  onConfirmPayment,
  onFinalize,
}: BillDetailModalProps) => {
  if (!billSession) return null;

  const { t } = useTranslation();
  const memberMap = new Map(members.map((member) => [member.userId, member]));
  const detailMembers = billSession.shares.map((share) => {
    const member = memberMap.get(share.userId);
    return {
      userId: String(share.userId),
      name: member?.fullName,
      avatar: member?.avatar,
      amount: share.amount,
      confirmed: share.paid,
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.touchOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t("bill_detail")}</Text>
              <Text style={styles.subtitle}>{t("bill_payment_tracking")}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={18} />
            </TouchableOpacity>
          </View>

          <BillSessionCard
            totalAmount={billSession.totalAmount}
            currency={billSession.currency}
            splitType={billSession.splitType}
            status={billSession.status}
            onFinalize={onFinalize}
            isOwner={isOwner}
          />

          <Text style={styles.sectionTitle}>{t("members")}</Text>
          <BillMemberList
            members={detailMembers}
            myUserId={myUserId}
            billStatus={billSession.status}
            onConfirm={onConfirmPayment}
            isOwner={isOwner}
            billSessionId={billSession.id}
            currency={billSession.currency}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  touchOverlay: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    color: colors.secondary,
    fontSize: fonts.size.small,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.neutral,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: fonts.size.medium,
    fontWeight: "bold",
    color: colors.text,
  },
});

export default BillDetailModal;
