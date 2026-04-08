import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { colors, fonts } from "../utils/constants";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
}

const ConfirmModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: ConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.leftButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: colors.text,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  title: {
    fontSize: fonts.size.large,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: fonts.size.medium,
    color: colors.accent,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderColor: colors.neutral,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  leftButton: {
    borderRightWidth: 1,
    borderColor: colors.neutral,
  },
  cancelText: {
    color: colors.cancel,
    fontWeight: "bold",
    fontSize: fonts.size.medium,
  },
  confirmText: {
    color: colors.error,
    fontWeight: "bold",
    fontSize: fonts.size.medium,
  },
});

export default ConfirmModal;
