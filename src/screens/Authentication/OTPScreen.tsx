import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";

const OTPScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const handleChange = (text: string, idx: number) => {
    // Only keep the last character if user pastes more than 1 character
    if (text.length > 1) {
      text = text.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[idx] = text;
    setOtp(newOtp);

    if (text && idx < 3) {
      inputs[idx + 1].current?.focus();
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <NavigationButton onGoBack={handleGoBack} onGoNext={handleGoNext} />
      <Text style={styles.title}>{t("enter_otp")}</Text>

      <View style={styles.otp_container}>
        {otp.map((value, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, idx)}
          />
        ))}
      </View>

      <View style={styles.text_container}>
        <Text style={styles.subtitle}>{t("otp_helper_text")} </Text>
        <TouchableOpacity>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            {t("resend")} (60)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  title: {
    fontSize: fonts.size.large,
    color: colors.text,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: fonts.size.medium,
    fontWeight: "600",
    color: colors.text,
  },

  input: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    color: colors.text,
    fontSize: fonts.size.large,
    fontWeight: "600",
    textAlign: "center",
  },

  otp_container: {
    flexDirection: "row",
    gap: 10,
    margin: 24,
  },

  text_container: {
    flexDirection: "row",
  },
});

export default OTPScreen;
