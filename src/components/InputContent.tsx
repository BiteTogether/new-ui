import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Platform } from "react-native";
import { colors, fonts } from "../utils/constants";

interface InputContentProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const InputContent = ({
  placeholder,
  value,
  onChangeText,
}: InputContentProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    paddingVertical: Platform.OS === "ios" ? 8 : 2,
    paddingHorizontal: 4,
    backgroundColor: colors.accent + "CC",
  },
  input: {
    color: colors.text,
    fontSize: fonts.size.medium,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : undefined,
    flex: 1,
    fontWeight: "600",
    textAlign: "center",
  },
});
export default InputContent;
