import React, { useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { colors, fonts } from "../utils/constants";
import { Feather } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import { searchUsers } from "../services/api/userApi";
import {
  searchNearbyRestaurants,
  searchRestaurant,
} from "../services/api/mapApi";

interface SearchBarProps {
  placeholder: string;
  type?: "search_friends" | "search_map" | "search_nearby";
  setSearchResult: (result: any) => void;
  hideIcon?: boolean;
  value?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  onChangeText?: (text: string) => void;
  textColor?: string;
}

const SearchBar = ({
  placeholder,
  type,
  setSearchResult,
  hideIcon,
  value,
  location,
  onChangeText,
  textColor = colors.text,
}: SearchBarProps) => {
  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setSearchResult(null);
      return;
    }
    let res;
    try {
      if (type === "search_friends") {
        res = await searchUsers(text.trim());
        if (res.status === 200 && res.data) {
          setSearchResult(res.data);
        } else setSearchResult(null);
      } else if (type === "search_nearby" && location) {
        res = await searchNearbyRestaurants(
          location.latitude,
          location.longitude,
          text.trim(),
        );
        if (res?.status === 200 && res.data) {
          if (Array.isArray(res.data)) {
            const filtered = res.data.filter((item) => item.distance <= 0.5);
            setSearchResult(filtered);
          } else {
            setSearchResult([]);
          }
        } else setSearchResult(null);
      } else if (type === "search_map") {
        res = await searchRestaurant(text.trim());
        if (res?.status === 200 && res.data) {
          setSearchResult(res.data);
        } else setSearchResult(null);
      } else {
        setSearchResult(text);
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
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        onChangeText={(text) => {
          debouncedSearch(text);
          if (onChangeText) {
            onChangeText(text);
          }
        }}
        autoCapitalize="none"
        value={value}
      />
      {!hideIcon && (
        <TouchableOpacity>
          <Feather name="search" size={24} color={colors.secondary} />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingVertical: Platform.OS === "ios" ? 4 : 2,
    paddingHorizontal: 12,
    marginVertical: 16,
  },

  input: {
    fontSize: fonts.size.medium,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 10 : undefined,
    flex: 1,
  },
});
export default SearchBar;
