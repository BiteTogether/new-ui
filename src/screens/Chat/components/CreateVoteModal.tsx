import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { colors, fonts } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import SearchBar from "../../../components/SearchBar";
import { Feather } from "@expo/vector-icons";
import { truncateText } from "../../../utils/helpers";

interface OptionInput {
  placeId: string;
  name: string;
  address: string;
}

interface CreateVoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, options: OptionInput[]) => void;
}

const CreateVoteModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateVoteModalProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const handleRemoveOption = (idx: number) => {
    setSelectedRestaurants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (selectedRestaurants.length < 2 || !name) {
      setError(t("option_required"));
      return;
    }
    setError("");
    const formattedOptions = selectedRestaurants.map((opt) => ({
      placeId: opt.ref_id,
      name: opt.name,
      address: opt.address,
    }));

    onSubmit(name, formattedOptions);
    setSelectedRestaurants([]);
    setName("");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{t("create_vote")}</Text>
          <SearchBar
            placeholder={t("search_restaurant")}
            type="search_map"
            textColor={colors.background}
            value={searchText}
            onChangeText={setSearchText}
            setSearchResult={(results) => {
              setNearbyRestaurants(results);
              if (Array.isArray(results) && results.length > 0)
                setModalVisible(true);
            }}
          />
          {modalVisible && nearbyRestaurants.length > 0 && (
            <View style={styles.modalContent}>
              <FlatList
                data={nearbyRestaurants}
                keyExtractor={(_, idx) => idx.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRestaurants((prev) => [...prev, item]);
                      setSearchText("");
                      setModalVisible(false);
                    }}
                    style={styles.itemBtn}
                  >
                    <View>
                      <Text>{item.name}</Text>
                      <Text>{item.address}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          <TextInput
            placeholder={t("enter_vote_name")}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <FlatList
            data={selectedRestaurants}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.optionRow}>
                <View>
                  <Text style={styles.optionName}>
                    {truncateText(item.name, 30)}
                  </Text>
                  <Text style={styles.optionAddress}>
                    {truncateText(item.address, 30)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                  <Feather name="x" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>{t("create")}</Text>
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    minHeight: "50%",
    backgroundColor: colors.text,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontWeight: "600",
    fontSize: fonts.size.large,
    marginBottom: 16,
    textAlign: "center",
  },
  optionRow: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  removeBtn: {
    color: colors.error,
    fontWeight: "bold",
    fontSize: 18,
    paddingHorizontal: 8,
  },
  addBtn: {
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  addBtnText: {
    color: colors.cancel,
    fontWeight: "bold",
    fontSize: fonts.size.medium,
  },
  error: {
    color: colors.error,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  cancelBtn: {
    backgroundColor: colors.neutral,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelBtnText: {
    fontWeight: "bold",
  },
  submitBtn: {
    backgroundColor: colors.green,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  submitBtnText: {
    color: colors.text,
    fontWeight: "bold",
  },

  modalContent: {
    backgroundColor: colors.neutral,
    maxHeight: "60%",
    position: "absolute",
    zIndex: 1,
    top: 130,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
  },
  itemBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral,
  },
  optionName: {
    fontWeight: "600",
    fontSize: fonts.size.medium,
  },
  optionAddress: {
    color: colors.secondary,
  },
});

export default CreateVoteModal;
