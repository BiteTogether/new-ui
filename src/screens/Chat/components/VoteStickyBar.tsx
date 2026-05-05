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
import { VoteList } from "../../../types/chat";
import { useTranslation } from "react-i18next";

interface VoteStickyBarProps {
  voteSessions: VoteList;
  onSelectPoll: (pollId: string) => void;
}

const VoteStickyBar = ({ voteSessions, onSelectPoll }: VoteStickyBarProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!voteSessions || voteSessions.length === 0) return null;

  return (
    <View style={styles.stickyBar}>
      <TouchableOpacity
        style={styles.bar}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <Feather name="bar-chart-2" size={20} color={colors.text} />
        <Text style={styles.barText}>
          {voteSessions.length} {t("vote_in_progress")}
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
            data={voteSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.voteCard}>
                <TouchableOpacity
                  style={styles.pollHeader}
                  onPress={() => {
                    onSelectPoll(item.id);
                    setExpanded(false);
                  }}
                >
                  <Text style={styles.voteTitle}>{item.name}</Text>
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

export default VoteStickyBar;
