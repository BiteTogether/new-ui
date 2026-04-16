import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { colors, fonts } from "../utils/constants";
import { useTranslation } from "react-i18next";

import { ReactNode } from "react";
interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  hasInput?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  children?: ReactNode;
}

const ConfirmModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  hasInput,
  inputValue,
  setInputValue,
  children,
}: ConfirmModalProps) => {
  const { t } = useTranslation();
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
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {hasInput && (
              <TextInput
                style={styles.input}
                placeholder={t("enter_group_name")}
                value={inputValue}
                onChangeText={setInputValue}
              />
            )}
            {children}
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
  touch_overlay: {
    ...StyleSheet.absoluteFill,
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

  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: fonts.size.medium,
  },
});

export default ConfirmModal;
