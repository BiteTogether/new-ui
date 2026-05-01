import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../../utils/constants";
import { Feather } from "@expo/vector-icons";
import { CreateBillRequest, VoteList } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Member {
  userId: number;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
}

interface CustomSplit {
  userId: number;
  amount: number;
}

interface CreateBillModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBillRequest) => void;
  conversationId: string;
  voteSessions: VoteList;
  members: Member[];
  defaultCurrency?: string;
}

const CreateBillModal = ({
  visible,
  onClose,
  onSubmit,
  voteSessions,
  members,
  defaultCurrency = "VND",
  conversationId,
}: CreateBillModalProps) => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [voteSessionId, setVoteSessionId] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const [splitType, setSplitType] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [customSplits, setCustomSplits] = useState<CustomSplit[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");

  const selectedVote = voteSessions.find((v) => v.id === voteSessionId);
  const voterIds = selectedVote
    ? new Set(Object.keys(selectedVote.votes || {}))
    : null;
  const filteredMembers = voterIds
    ? members.filter((m) => voterIds.has(String(m.userId)))
    : members;

  useEffect(() => {
    setSelectedMemberIds([]);
    setCustomSplits([]);
  }, [voteSessionId]);

  const handleCustomAmountChange = (userId: number, value: string) => {
    setCustomSplits((prev) => {
      const filtered = prev.filter((s) => s.userId !== userId);
      return [...filtered, { userId, amount: Number(value) || 0 }];
    });
  };

  const handleClearFields = () => {
    setError("");
    setVoteSessionId("");
    setTotalAmount("");
    setSplitType("EQUAL");
    setCurrency(defaultCurrency);
    setCustomSplits([]);
    setSelectedMemberIds([]);
    onClose();
  };

  const handleSubmit = () => {
    if (!voteSessionId || !totalAmount) {
      setError(t("bill_required_fields"));
      return;
    }
    if (splitType === "CUSTOM" && selectedVote) {
      const hasMissingAmount = selectedMemberIds.some((memberId) => {
        const found = customSplits.find((s) => s.userId === memberId);
        return !found || !Number.isFinite(found.amount) || found.amount <= 0;
      });
      if (selectedMemberIds.length === 0 || hasMissingAmount) {
        setError(t("bill_required_fields"));
        return;
      }
      const total = Number(totalAmount);
      const sumCustom = selectedMemberIds.reduce((acc, memberId) => {
        const found = customSplits.find((s) => s.userId === memberId);
        return acc + (found?.amount || 0);
      }, 0);
      if (!Number.isFinite(total) || sumCustom !== total) {
        setError(t("bill_total_mismatch"));
        return;
      }
      const splits = selectedMemberIds.map((memberId) => {
        const found = customSplits.find((s) => s.userId === memberId);
        return { userId: memberId, amount: found?.amount || 0 };
      });
      onSubmit({
        conversationId,
        voteSessionId,
        totalAmount: Number(totalAmount),
        currency,
        splitType,
        customSplits: splits,
      });
    } else {
      onSubmit({
        conversationId,
        voteSessionId,
        totalAmount: Number(totalAmount),
        currency,
        splitType,
        customSplits: [],
      });
    }
    handleClearFields();
  };

  const toggleMember = (memberId: number) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>Bill</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>{t("create_bill")}</Text>
              <Text style={styles.subtitle}>{t("select_vote_session")}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={handleClearFields}
            >
              <Feather name="x" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              {voteSessions.filter((v) => v.createdBy === userInfo?.id).length >
              0 ? (
                <FlatList
                  data={voteSessions.filter(
                    (v) => v.createdBy === userInfo?.id,
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.voteBtn,
                        voteSessionId === item.id && styles.voteBtnActive,
                      ]}
                      onPress={() => setVoteSessionId(item.id)}
                    >
                      <Text
                        style={
                          voteSessionId === item.id
                            ? styles.voteBtnTextActive
                            : styles.voteBtnText
                        }
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.no_result_text}>
                  {t("no_vote_sessions")}
                </Text>
              )}
            </View>

            <View style={styles.sectionRow}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>{t("total_amount")}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={totalAmount}
                  onChangeText={setTotalAmount}
                  placeholder={t("enter_amount")}
                  placeholderTextColor={colors.secondary}
                />
              </View>
              <View style={styles.fieldBlockSmall}>
                <Text style={styles.label}>{t("currency")}</Text>
                <TextInput
                  style={styles.input}
                  value={currency}
                  onChangeText={setCurrency}
                  placeholder={t("currency")}
                  placeholderTextColor={colors.secondary}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>{t("split_type")}</Text>
              <View style={styles.splitTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.splitTypeBtn,
                    splitType === "EQUAL" && styles.splitTypeBtnActive,
                  ]}
                  onPress={() => setSplitType("EQUAL")}
                >
                  <Text
                    style={
                      splitType === "EQUAL"
                        ? styles.splitTypeTextActive
                        : styles.splitTypeText
                    }
                  >
                    {t("equal")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.splitTypeBtn,
                    splitType === "CUSTOM" && styles.splitTypeBtnActive,
                  ]}
                  onPress={() => setSplitType("CUSTOM")}
                >
                  <Text
                    style={
                      splitType === "CUSTOM"
                        ? styles.splitTypeTextActive
                        : styles.splitTypeText
                    }
                  >
                    {t("custom")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {splitType === "CUSTOM" && (
              <View style={styles.section}>
                <Text style={styles.subLabel}>{t("select_members")}</Text>
                <View style={styles.memberGrid}>
                  {filteredMembers.map((mem) => {
                    const memberId = mem.userId;
                    const isSelected = selectedMemberIds.includes(memberId);
                    return (
                      <TouchableOpacity
                        key={String(memberId)}
                        style={[
                          styles.memberChip,
                          isSelected && styles.memberChipActive,
                        ]}
                        onPress={() => toggleMember(memberId)}
                      >
                        <Text
                          style={
                            isSelected
                              ? styles.memberTextActive
                              : styles.memberText
                          }
                        >
                          {mem.fullName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {selectedMemberIds.map((memberId) => {
                  const mem = filteredMembers.find(
                    (m) => m.userId === memberId,
                  );
                  if (!mem) return null;
                  return (
                    <View key={memberId} style={styles.customRow}>
                      <Text style={styles.customName}>{mem.fullName}</Text>
                      <TextInput
                        style={styles.customAmountInput}
                        keyboardType="numeric"
                        value={
                          customSplits
                            .find((s) => s.userId === memberId)
                            ?.amount?.toString() || ""
                        }
                        onChangeText={(v) =>
                          handleCustomAmountChange(memberId, v)
                        }
                        placeholder={t("amount")}
                        placeholderTextColor={colors.secondary}
                      />
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={{ color: colors.error }}>{error}</Text>
          </ScrollView>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClearFields}
            >
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>{t("create")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.text,
    borderRadius: 20,
    padding: 20,
    width: "92%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  scrollArea: {
    marginBottom: 6,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  headerBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  headerBadgeText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    color: colors.secondary,
  },
  closeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    fontSize: 18,
    marginTop: -1,
  },
  section: {
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  fieldBlock: {
    flex: 1,
  },
  fieldBlockSmall: {
    width: 86,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
  },
  subLabel: {
    marginTop: 2,
    marginBottom: 6,
    color: colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#FAFAFA",
  },
  currencyPill: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  currencyText: {
    fontWeight: "600",
  },
  splitTypeRow: {
    flexDirection: "row",
    gap: 10,
  },
  splitTypeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  splitTypeBtnActive: {
    backgroundColor: colors.cancel,
    borderColor: colors.cancel,
  },
  splitTypeText: {
    fontWeight: "600",
  },
  splitTypeTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  voteBtn: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#FAFAFA",
  },
  voteBtnActive: {
    backgroundColor: colors.cancel,
    borderColor: colors.cancel,
  },
  voteBtnText: {
    fontWeight: "600",
  },
  voteBtnTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  customName: {
    flex: 1,
    fontWeight: "600",
  },
  customAmountInput: {
    width: 120,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#FAFAFA",
    textAlign: "left",
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  memberChip: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FAFAFA",
  },
  memberChipActive: {
    backgroundColor: colors.cancel,
    borderColor: colors.cancel,
  },
  memberText: {
    fontWeight: "600",
  },
  memberTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    alignItems: "center",
    backgroundColor: colors.text,
  },
  cancelText: {
    fontWeight: "600",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: colors.text,
    fontWeight: "700",
  },
  no_result_text: {
    color: colors.secondary,
    textAlign: "center",
  },
});

export default CreateBillModal;
