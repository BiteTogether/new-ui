import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { AppDispatch, RootState } from "../../store";
import { useWebSocket } from "../../hooks/useWebSocket";
import { MainStackParamList } from "../../types/navigations";
import { BillList, BillSession } from "../../types/chat";
import {
  userGetBillSessions,
  userConfirmBillPayment,
} from "../../store/chat/chatActions";
import Toast from "react-native-toast-message";
import TopBar from "../../components/TopBar";
import { colors, fonts } from "../../utils/constants";
import Avatar from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { truncateText } from "../../utils/helpers";
import { userFinalizeBillSession } from "../../store/chat/chatActions";

type BillMember = {
  userId: number;
  name: string;
  amount: number;
  paidAmount: number;
  confirmed: boolean;
  status: "UNPAID" | "PARTIAL" | "PAID";
  avatarUrl: string | null;
};

const BillResultsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { bills } = useWebSocket("BILL_UPDATE") as { bills: BillList };
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { conversations } = useSelector((state: RootState) => state.chat);
  const route = useRoute<RouteProp<MainStackParamList, "BillResults">>();
  const { conversationId } = route.params;

  const [billSessions, setBillSessions] = useState<BillList>(bills);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const conversation = conversations?.conversations?.find(
    (item) => item.id === conversationId,
  );
  const members = useMemo(
    () =>
      (conversation?.participants || []).map(
        (participant) => participant.chatUserSnapshot,
      ),
    [conversation],
  );

  const buildMembers = (billSession: BillSession): BillMember[] => {
    const memberMap = new Map(members.map((member) => [member.userId, member]));

    return billSession.shares.map((share) => {
      const member = memberMap.get(share.userId);
      return {
        userId: share.userId,
        name: member?.fullName || `User ${share.userId}`,
        amount: share.amount,
        paidAmount: share.paidAmount,
        confirmed: share.paid,
        status: share.status,
        avatarUrl: member?.avatar || null,
      };
    });
  };

  const getStatusLabel = (status: BillSession["status"]) => {
    switch (status) {
      case "DRAFT":
        return t("draft");
      case "FINALIZED":
        return t("finalized");
      case "SETTLED":
        return t("settled");
      default:
        return status;
    }
  };

  const getStatusColor = (status: BillSession["status"]) => {
    switch (status) {
      case "DRAFT":
        return colors.secondary;
      case "FINALIZED":
        return colors.orange;
      case "SETTLED":
        return colors.green;
      default:
        return colors.secondary;
    }
  };

  const handleFinalizeBill = async (billSessionId: string) => {
    try {
      await dispatch(userFinalizeBillSession(billSessionId)).unwrap();
      Toast.show({ type: "success", text1: t("finalize_bill_success") });
    } catch (error) {
      console.error("Error finalizing bill:", error);
      Toast.show({ type: "error", text1: t("finalize_bill_error") });
    }
  };

  useEffect(() => {
    const fetchBillSessions = async () => {
      if (!conversationId) return;
      try {
        const res = await dispatch(
          userGetBillSessions(conversationId),
        ).unwrap();
        setBillSessions(res);
      } catch (error) {
        console.error("Error fetching bill sessions:", error);
      }
    };

    fetchBillSessions();
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (
      !Array.isArray(bills) ||
      !bills.every((bill) => bill && bill.conversationId === conversationId)
    ) {
      return;
    }

    setBillSessions((prev) => {
      const updated = [...prev];
      bills.forEach((bill) => {
        const index = updated.findIndex((item) => item.id === bill.id);
        if (index !== -1) {
          updated[index] = { ...updated[index], ...bill };
        } else {
          updated.push(bill);
        }
      });
      return updated;
    });
  }, [bills, conversationId]);

  const handleConfirmPayment = async (
    userId: number,
    billSessionId: string,
  ) => {
    try {
      await dispatch(
        userConfirmBillPayment({ userId, billSessionId }),
      ).unwrap();
      Toast.show({ type: "success", text1: t("bill_payment_success") });
    } catch (error) {
      console.error("Error confirming bill payment:", error);
      Toast.show({ type: "error", text1: t("bill_payment_error") });
    }
  };

  const renderMember = (member: BillMember, bill: BillSession) => {
    const statusText =
      member.status === "PAID"
        ? t("paid")
        : member.status === "PARTIAL"
          ? t("paid_amount")
          : t("unpaid");

    const canConfirm =
      bill &&
      bill.status === "FINALIZED" &&
      member.status === "UNPAID" &&
      (member.userId === userInfo?.id || bill.createdBy === userInfo?.id);

    return (
      <View style={styles.memberRow} key={member.userId}>
        <TouchableOpacity
          style={styles.memberAvatar}
          onPress={() => {
            navigation.navigate("Profile", { id: member.userId });
          }}
        >
          <Avatar uri={member.avatarUrl} size={40} />
        </TouchableOpacity>

        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>
              {truncateText(member.name, 15)}
            </Text>
            {userInfo?.id === member.userId && (
              <View style={styles.meBadge}>
                <Text style={styles.meBadgeText}>{t("me")}</Text>
              </View>
            )}
          </View>
          <Text style={styles.memberAmount}>
            {member.amount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.memberStatusWrap}>
          <Text
            style={[
              styles.memberStatus,
              {
                color:
                  member.status === "PAID"
                    ? colors.green
                    : member.status === "PARTIAL"
                      ? colors.orange
                      : colors.error,
              },
            ]}
          >
            {statusText}
          </Text>
          {member.paidAmount > 0 && (
            <Text style={styles.memberPaidAmount}>
              {t("paid_amount")} {member.paidAmount.toLocaleString()}
            </Text>
          )}
          {canConfirm && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => handleConfirmPayment(member.userId, bill.id)}
            >
              <Text style={styles.confirmBtnText}>{t("confirm_payment")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderBillSession = ({ item }: { item: BillSession }) => {
    const expanded = expandedId === item.id;
    const totalPaid = item.shares.reduce(
      (sum, share) => sum + (share.paidAmount || 0),
      0,
    );
    const completedCount = item.shares.filter((share) => share.paid).length;
    const detailMembers = buildMembers(item);
    const progressPercent = Math.min(
      100,
      (totalPaid / Math.max(item.totalAmount, 1)) * 100,
    );

    return (
      <View style={styles.sessionCard}>
        <TouchableOpacity
          style={styles.sessionHeader}
          onPress={() => setExpandedId(expanded ? null : item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.sessionTitleWrap}>
            <Text style={styles.sessionTitle}>{t("bill")}</Text>
            <Text style={styles.sessionMeta}>
              {completedCount}/{item.shares.length} {t("paid")}
            </Text>
          </View>

          <View style={styles.sessionRight}>
            <Text
              style={[
                styles.sessionStatus,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.secondary}
            />
          </View>
        </TouchableOpacity>
        {item.status === "DRAFT" && item.createdBy === userInfo?.id && (
          <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
            <TouchableOpacity
              style={styles.finalizeBtn}
              onPress={() => handleFinalizeBill(item.id)}
            >
              <Text style={styles.finalizeBtnText}>{t("finalize_bill")}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>{t("total_amount")}</Text>
            <Text style={styles.amountText}>
              {item.totalAmount.toLocaleString()} {item.currency}
            </Text>
          </View>
          <View style={styles.splitBadge}>
            <Text style={styles.splitBadgeText}>
              {item.splitType === "EQUAL"
                ? t("equal_split")
                : t("custom_split")}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>

        {expanded && (
          <View style={styles.expandedSection}>
            <Text style={styles.sectionLabel}>{t("members")}</Text>
            {detailMembers.map((m) => renderMember(m, item))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar type="other" title={t("bill")} />
      <FlatList
        data={billSessions}
        keyExtractor={(item) => item.id}
        renderItem={renderBillSession}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          billSessions.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t("no_bill")}</Text>
            <Text style={styles.emptySubtitle}>{t("bill_empty_subtitle")}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  sessionCard: {
    backgroundColor: colors.text,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  sessionTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  sessionTitle: {
    fontWeight: "700",
    fontSize: fonts.size.medium,
  },
  sessionMeta: {
    marginTop: 2,
    color: colors.secondary,
    fontSize: fonts.size.small,
  },
  sessionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sessionStatus: {
    fontWeight: "700",
    fontSize: fonts.size.small,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  amountLabel: {
    color: colors.secondary,
    fontSize: fonts.size.small,
    marginBottom: 2,
  },
  amountText: {
    fontSize: fonts.size.large,
    fontWeight: "800",
    color: colors.orange,
  },
  splitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.neutral,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  splitBadgeText: {
    fontSize: fonts.size.small,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8ECF2",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.green,
  },
  expandedSection: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EDF0F4",
  },
  sectionLabel: {
    fontSize: fonts.size.medium,
    fontWeight: "700",
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    fontWeight: "800",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberName: {
    fontSize: fonts.size.medium,
    fontWeight: "700",
  },
  meBadge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  meBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
  },
  memberAmount: {
    marginTop: 2,
    color: colors.secondary,
    fontSize: fonts.size.small,
  },
  memberStatusWrap: {
    alignItems: "flex-end",
  },
  memberStatus: {
    fontSize: fonts.size.small,
    fontWeight: "700",
  },
  memberPaidAmount: {
    marginTop: 2,
    fontSize: 11,
    color: colors.secondary,
  },
  confirmBtn: {
    marginTop: 8,
    backgroundColor: colors.cancel,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  confirmBtnText: {
    color: colors.text,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: fonts.size.large,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: fonts.size.medium,
    color: colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  finalizeBtn: {
    backgroundColor: colors.orange,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  finalizeBtnText: {
    color: colors.text,
    fontWeight: "700",
  },
});

export default BillResultsScreen;
