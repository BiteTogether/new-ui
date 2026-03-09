import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { colors, fonts } from "../utils/constants";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  type?: "chat";
}

const SearchBar = ({ placeholder, type }: SearchBarProps) => {
  const handleSearch = () => {};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        // onChangeText={(text) => onSearch?.(text)}
      />
      <TouchableOpacity>
        <Feather name="search" size={24} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginVertical: 24,
  },

  input: {
    color: colors.text,
    fontSize: fonts.size.medium,
    fontWeight: "600",
    width: "85%",
  },
});
export default SearchBar;
