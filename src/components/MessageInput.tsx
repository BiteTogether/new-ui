import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { colors, fonts } from "../utils/constants";
import { Feather } from "@expo/vector-icons";

interface MessageInputProps {
  placeholder: string;
  type?: "chat";
  onSend: (text: string) => void;
  isEditing?: boolean;
  textEditing?: string | undefined;
  onChangeTextEditing?: (text: string) => void;
  onEdit?: (text: string) => void;
}

const MessageInput = ({
  placeholder,
  type,
  onSend,
  isEditing,
  textEditing,
  onChangeTextEditing,
  onEdit,
}: MessageInputProps) => {
  const [text, setText] = useState<string>("");
  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      onSend(trimmed);
      setText("");
    }
  };
  const handleEdit = () => {
    const trimmed = (textEditing || "").trim();
    if (trimmed.length > 0 && onEdit) {
      onEdit(trimmed);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        onChangeText={
          isEditing && onChangeTextEditing
            ? onChangeTextEditing
            : (text) => setText(text)
        }
        value={isEditing ? textEditing : text}
        multiline
        onSubmitEditing={
          isEditing
            ? () => {
                if ((textEditing || "").trim().length > 0) handleEdit();
              }
            : () => {
                if (text.trim().length > 0) handleSend();
              }
        }
        returnKeyType="send"
      />

      {((isEditing && textEditing && textEditing.trim().length > 0) ||
        (!isEditing && text.trim().length > 0)) && (
        <TouchableOpacity
          style={styles.send_button}
          onPress={isEditing ? handleEdit : handleSend}
        >
          <Feather name="send" size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingVertical: Platform.OS === "ios" ? 8 : 2,
    paddingHorizontal: 4,
  },

  input: {
    color: colors.text,
    fontSize: fonts.size.medium,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : undefined,
    flex: 1,
  },

  send_button: {
    backgroundColor: colors.cancel,
    borderRadius: 50,
    padding: 8,
  },
});
export default MessageInput;
