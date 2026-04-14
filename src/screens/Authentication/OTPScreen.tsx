import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import NavigationButton from "./components/NavigationButton";
import { colors, fonts } from "../../utils/constants";
import { OtpInput } from "react-native-otp-entry";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  getIdToken,
} from "@react-native-firebase/auth";
import { validateInfo } from "../../services/api/userApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { userLogin } from "../../store/auth/authActions";
import Toast from "react-native-toast-message";
import Loading from "../../components/Loading";

const OTPScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, "OTP">>();
  const { phoneNumber } = route.params;
  const [countdown, setCountdown] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState<any>(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState("");

  // Handle login
  function handleAuthStateChanged(user: any) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    handleSignInWithPhoneNumber(phoneNumber);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setIsResendDisabled(false);
      return;
    }
    setIsResendDisabled(true);
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle the button press
  async function handleSignInWithPhoneNumber(phoneNumber: string) {
    try {
      setError(null);
      const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("otp_send_failed"),
      });
      setError(error as Error);
      console.error("Error sending OTP: ", error);
    }
  }

  async function confirmCode() {
    try {
      const res = await confirm.confirm(code);
      return res;
    } catch (error) {
      console.error("Error confirming OTP: ", error);
      throw error;
    }
  }

  const handleResend = () => {
    setCountdown(60);
    handleSignInWithPhoneNumber(phoneNumber);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = async () => {
    try {
      setIsLoading(true);
      const confirmation = await confirmCode();
      const idToken = await getIdToken(confirmation.user);
      const res = await validateInfo({
        criteriaType: "PHONE",
        criteriaValue: phoneNumber,
      });
      if (res.status === 200 && res.data?.valid) {
        navigation.navigate("Register", { idToken });
      } else if (res.status === 200 && !res.data?.valid) {
        await dispatch(userLogin({ idToken: idToken })).unwrap();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("invalid_otp"),
      });
      console.error("Error validating: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <NavigationButton
        onGoBack={handleGoBack}
        onGoNext={handleGoNext}
        isDisabledNext={!confirm || code.length !== 6}
      />
      <Text style={styles.title}>
        {t("enter_otp")} {phoneNumber}
      </Text>

      <OtpInput
        numberOfDigits={6}
        focusColor={colors.primary}
        autoFocus={false}
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFilled={(text) => setCode(text)}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
          caretHidden: true,
        }}
        textProps={{
          accessibilityRole: "text",
          accessibilityLabel: "OTP digit",
          allowFontScaling: false,
        }}
        theme={{
          containerStyle: styles.otp_container,
          pinCodeTextStyle: styles.pinCodeText,
        }}
      />

      <View style={styles.text_container}>
        {!confirm && !error ? (
          <>
            <Text style={styles.subtitle}>{t("sending_otp")} </Text>
            <ActivityIndicator color={colors.primary} />
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>{t("otp_helper_text")} </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResendDisabled}
            >
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: isResendDisabled ? colors.secondary : colors.primary,
                  },
                ]}
              >
                {isResendDisabled
                  ? `${t("resend")} (${countdown})`
                  : t("resend")}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    width: "80%",
    margin: 24,
  },

  text_container: {
    flexDirection: "row",
  },

  pinCodeText: {
    color: colors.text,
  },
});

export default OTPScreen;
