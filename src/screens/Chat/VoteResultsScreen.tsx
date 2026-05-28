import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  userGetVoteSessions,
  userCastVote,
  userCloseVoteSession,
} from "../../store/chat/chatActions";
import { VoteList } from "../../types/chat";
import { MainStackParamList } from "../../types/navigations";
import { RouteProp, useRoute } from "@react-navigation/native";
import { VoteSession } from "../../types/chat";
import { colors, fonts } from "../../utils/constants";
import { Feather } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import ConfirmModal from "../../components/ConfirmModal";

const normalizeVoteSessions = (sessions: VoteList): VoteList => {
  const seenIds = new Set<string>();

  return sessions
    .filter((session) => {
      if (!session || !session.id) return false;
      if (seenIds.has(session.id)) return false;

      seenIds.add(session.id);
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "OPEN" ? -1 : 1;
      }

      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    });
};

const VoteResultsScreen = () => {
  const { votes } = useWebSocket("VOTE_UPDATE") as { votes: VoteList };
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const route = useRoute<RouteProp<MainStackParamList, "VoteResults">>();
  const { conversationId } = route.params;
  const [voteSessions, setVoteSessions] = useState<VoteList>(
    normalizeVoteSessions(Array.isArray(votes) ? votes : []),
  );
  const [showCloseVoteModal, setShowCloseVoteModal] = useState(false);
  const [closing, setClosing] = useState<boolean>(false);
  const [selectedVoteSessionId, setSelectedVoteSessionId] = useState<
    string | null
  >(null);

  const handleCastVote = async (voteSessionId: string, optionId: string) => {
    try {
      await dispatch(userCastVote({ voteSessionId, optionId })).unwrap();
      Toast.show({
        type: "success",
        text1: t("cast_vote_success"),
      });
    } catch (error) {
      console.error("Error casting vote:", error);
      Toast.show({
        type: "error",
        text1: t("cast_vote_error"),
      });
    }
  };

  const handleCloseVote = async (voteSessionId: string) => {
    setShowCloseVoteModal(false);
    try {
      setClosing(true);
      await dispatch(userCloseVoteSession(voteSessionId)).unwrap();
      Toast.show({
        type: "success",
        text1: t("close_vote_success"),
      });
    } catch (error) {
      console.error("Error closing vote:", error);
      Toast.show({
        type: "error",
        text1: t("close_vote_error"),
      });
    } finally {
      setSelectedVoteSessionId(null);
      setClosing(false);
    }
  };

  useEffect(() => {
    const fetchVoteSessions = async () => {
      if (!conversationId) return;
      try {
        const res = await dispatch(
          userGetVoteSessions(conversationId),
        ).unwrap();
        setVoteSessions(normalizeVoteSessions(res));
      } catch (error) {
        console.error("Error fetching vote sessions:", error);
      }
    };

    fetchVoteSessions();
  }, [conversationId]);

  useEffect(() => {
    if (
      !Array.isArray(votes) ||
      !votes.every((v) => v && v.conversationId === conversationId)
    )
      return;
    setVoteSessions((prev) => {
      const updated = [...prev];
      votes.forEach((vote) => {
        const idx = updated.findIndex((v) => v.id === vote.id);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], ...vote };
        } else {
          updated.push(vote);
        }
      });
      return normalizeVoteSessions(updated);
    });
  }, [votes]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  type VoteOption = {
    id: string;
    placeId?: string;
    name: string;
    address: string;
  };

  const renderOption = (option: VoteOption, session: VoteSession) => {
    const voteCount = Object.values(session.votes || {}).filter(
      (v) => v === option.id,
    ).length;
    const isWinner = session.winnerOptionId === option.id;
    const myVote = userInfo ? session.votes[String(userInfo.id)] : undefined;
    const isVoted = myVote === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.option,
          isWinner && styles.winner,
          isVoted && styles.voted,
        ]}
        activeOpacity={0.6}
        disabled={session.status === "CLOSED"}
        onPress={() => handleCastVote(session.id, option.id)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.optionName}>{option.name}</Text>
          <Text style={styles.optionAddress}>{option.address}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.voteBadge}>
            <Text style={styles.voteBadgeText}>{voteCount}</Text>
          </View>
          {isWinner && <Text style={styles.winnerLabel}>{t("winner")}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar type="other" title={t("vote_results")} />
      <FlatList
        data={voteSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <TouchableOpacity
              style={styles.sessionHeader}
              onPress={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.sessionTitle}>{item.name}</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text
                  style={[
                    styles.sessionStatus,
                    {
                      color:
                        item.status === "CLOSED" ? colors.error : colors.green,
                    },
                  ]}
                >
                  {item.status === "CLOSED" ? t("closed") : t("opening")}
                </Text>
                <Feather
                  name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                  size={18}
                />
              </View>
            </TouchableOpacity>
            {expandedId === item.id && (
              <>
                <View style={styles.optionsList}>
                  {item.options.map((opt) => renderOption(opt, item))}
                </View>
                {item.createdBy === userInfo?.id && item.status === "OPEN" && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedVoteSessionId(item.id);
                      setShowCloseVoteModal(true);
                    }}
                    style={styles.close_vote_btn}
                    disabled={closing}
                  >
                    <Text style={styles.close_vote_btn_text}>
                      {t("close_vote")}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      />
      <ConfirmModal
        visible={showCloseVoteModal}
        title={t("close_vote")}
        message={t("close_vote_confirm")}
        confirmText={t("close_vote")}
        cancelText={t("cancel")}
        onCancel={() => setShowCloseVoteModal(false)}
        onConfirm={() => {
          handleCloseVote(selectedVoteSessionId!);
        }}
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
  header: {
    fontSize: fonts.size.large,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
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
    borderColor: colors.neutral,
  },
  sessionTitle: { fontWeight: "600", fontSize: fonts.size.medium, flex: 1 },
  sessionStatus: { color: colors.secondary, fontWeight: "bold" },
  optionsList: { marginTop: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  winner: {
    borderColor: colors.green,
    borderWidth: 2,
    backgroundColor: colors.mint_green,
  },
  voted: { borderColor: colors.green, backgroundColor: colors.mint_green },
  optionName: { fontWeight: "600", fontSize: fonts.size.medium },
  optionAddress: { color: colors.secondary, fontSize: fonts.size.small },
  voteCount: { marginLeft: 12, color: colors.accent, fontWeight: "bold" },
  winnerLabel: { color: colors.green, fontWeight: "bold", marginLeft: 8 },
  voteBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  voteBadgeText: {
    color: colors.text,
    fontWeight: "700",
  },
  close_vote_btn: {
    backgroundColor: colors.cancel,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  close_vote_btn_text: {
    color: colors.text,
    fontWeight: "bold",
  },
});

export default VoteResultsScreen;
