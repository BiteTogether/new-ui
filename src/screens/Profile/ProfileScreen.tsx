import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, fonts } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Avatar from "../../components/Avatar";

interface ProfileScreenProps {}

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <TopBar type="myProfile" userInfo={userInfo} />
      <View style={styles.info_container}>
        <Avatar size={80} />
        <Text style={styles.title}>{userInfo?.fullName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fonts.size.xlarge,
    fontWeight: 600,
    color: colors.text,
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
export default ProfileScreen;
