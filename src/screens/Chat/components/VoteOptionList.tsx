import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { colors, fonts } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { VoteSession } from "../../../types/chat";
import { truncateText } from "../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  userCastVote,
  userCloseVoteSession,
} from "../../../store/chat/chatActions";
import Toast from "react-native-toast-message";
import ConfirmModal from "../../../components/ConfirmModal";

interface VoteOptionListProps {
  voteSession: VoteSession;
  visible: boolean;
  onCancel: () => void;
}

const VoteOptionList = ({
  voteSession,
  visible,
  onCancel,
}: VoteOptionListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [showCloseVoteModal, setShowCloseVoteModal] = useState(false);
  const [closing, setClosing] = useState<boolean>(false);

  const handleCastVote = async (optionId: string) => {
    try {
      await dispatch(
        userCastVote({ voteSessionId: voteSession.id, optionId }),
      ).unwrap();
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

  const handleCloseVote = async () => {
    setShowCloseVoteModal(false);
    try {
      setClosing(true);
      await dispatch(userCloseVoteSession(voteSession.id)).unwrap();
      Toast.show({
        type: "success",
        text1: t("close_vote_success"),
      });
      onCancel();
    } catch (error) {
      console.error("Error closing vote:", error);
      Toast.show({
        type: "error",
        text1: t("close_vote_error"),
      });
    } finally {
      setClosing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.touch_overlay}
          activeOpacity={1}
          onPress={onCancel}
        />
        <View style={styles.modalBox}>
          <FlatList
            data={voteSession.options}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.title}>{voteSession.name}</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  voteSession.votes[String(userInfo?.id)] === item.id &&
                    styles.voted,
                  voteSession.winnerOptionId === item.id && styles.winner,
                ]}
                onPress={() => handleCastVote(item.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{truncateText(item.name, 32)}</Text>
                  <Text style={styles.address}>
                    {truncateText(item.address, 44)}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <View style={styles.voteBadge}>
                    <Text style={styles.voteBadgeText}>
                      {
                        Object.values(voteSession.votes || {}).filter(
                          (v) => v === item.id,
                        ).length
                      }
                    </Text>
                  </View>
                  {voteSession.winnerOptionId === item.id && (
                    <Text style={styles.winnerLabel}>{t("winner")}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
          {voteSession.createdBy === userInfo?.id && (
            <TouchableOpacity
              onPress={() => setShowCloseVoteModal(true)}
              style={styles.close_vote_btn}
              disabled={closing}
            >
              <Text style={styles.close_vote_btn_text}>{t("close_vote")}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onCancel} style={styles.cancel_btn}>
            <Feather name="x" size={24} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmModal
        visible={showCloseVoteModal}
        title={t("close_vote")}
        message={t("close_vote_confirm")}
        confirmText={t("close_vote")}
        cancelText={t("cancel")}
        onCancel={() => setShowCloseVoteModal(false)}
        onConfirm={() => {
          handleCloseVote();
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  touch_overlay: {
    ...StyleSheet.absoluteFill,
  },
  modalBox: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: colors.text,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.neutral,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  voted: { borderColor: colors.green, backgroundColor: colors.mint_green },
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
  winner: {
    borderColor: colors.green,
    borderWidth: 2,
    backgroundColor: colors.mint_green,
  },
  winnerLabel: { color: colors.green, fontWeight: "bold", marginLeft: 8 },
  name: { fontWeight: "bold", fontSize: fonts.size.medium },
  address: { color: colors.secondary, fontSize: fonts.size.small },
  voteCount: {
    marginLeft: 6,
    color: colors.accent,
    fontSize: fonts.size.small,
  },

  cancel_btn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
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

export default VoteOptionList;
