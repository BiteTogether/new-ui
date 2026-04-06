import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";
import { PhoneInput, isValidNumber } from "react-native-phone-entry";
import { CountryCode } from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";

const InputScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = () => {
    if (isValidNumber(phoneNumber, countryCode)) {
      navigation.navigate("OTP", { phoneNumber });
    } else {
      Toast.show({
        type: "error",
        text1: t("invalid_phone"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <NavigationButton
        onGoBack={handleGoBack}
        onGoNext={handleGoNext}
        isDisabledNext={!phoneNumber}
      />
      <Text style={styles.title}>{t("enter_phone")}</Text>

      <PhoneInput
        defaultValues={{
          countryCode: "VN",
          callingCode: "+84",
          phoneNumber: "+84",
        }}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        onChangeCountry={(country) => setCountryCode(country.cca2)}
        autoFocus={true}
        disabled={false}
        countryPickerProps={{
          withFilter: true,
          withFlag: true,
          withCountryNameButton: true,
        }}
        theme={{
          containerStyle: styles.input,
        }}
        hideDropdownIcon={false}
        isCallingCodeEditable={false}
      />
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

  input: {
    width: "80%",
    borderRadius: 16,
    margin: 24,
  },
});
export default InputScreen;
