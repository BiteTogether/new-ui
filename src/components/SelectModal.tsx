import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { colors, fonts } from "../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Option {
  label: string;
  onPress: () => void;
}

interface SelectModalProps {
  visible: boolean;
  options: Option[];
  onClose: () => void;
  title?: string;
}

const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  options,
  onClose,
  title,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={styles.overlay}
        />
        <SafeAreaView style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <FlatList
            data={options}
            keyExtractor={(item, idx) => item.label + idx}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={item.onPress}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  modalContainer: {
    backgroundColor: colors.text,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    maxHeight: "60%",
  },
  title: {
    fontSize: fonts.size.medium,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  option: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral,
  },
  optionText: {
    fontSize: fonts.size.medium,
    color: colors.accent,
    textAlign: "center",
  },
});

export default SelectModal;
