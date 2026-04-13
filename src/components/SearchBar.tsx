import React, { useMemo, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { colors, fonts } from "../utils/constants";
import { Feather } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { searchUsers } from "../services/api/userApi";

interface SearchBarProps {
  placeholder: string;
  type: "search_friends" | "search_map";
  setSearchResult: (result: any) => void;
}

const SearchBar = ({ placeholder, type, setSearchResult }: SearchBarProps) => {
  const handleSearch = async (text: string) => {
    let res;
    try {
      if (type === "search_friends") {
        res = await searchUsers(text.trim());
        if (res.status === 200 && res.data) {
          setSearchResult(res.data);
        } else setSearchResult(null);
      } else if (type === "search_map") {
        // Search map logic here (if needed)
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  // Just create the debounced function once, and reuse it across renders
  const debouncedSearch = useMemo(() => debounce(handleSearch, 400), []);

  // Cleanup debounce when component unmounts (leak memory if not)
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        onChangeText={(text) => debouncedSearch(text)}
        autoCapitalize="none"
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 24,
  },

  input: {
    color: colors.text,
    fontSize: fonts.size.medium,
    width: "85%",
  },
});
export default SearchBar;
