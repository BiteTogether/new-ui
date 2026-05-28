import React, { useState, useEffect, useRef } from "react";
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
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import { validateInfo } from "../../services/api/userApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { userLogin } from "../../store/auth/authActions";
import Toast from "react-native-toast-message";
import Loading from "../../components/Loading";

type FirebaseOtpError = {
  code?: string;
  message?: string;
};

type ApiLikeError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

const getOtpErrorToastKey = (error: unknown, fallbackKey: string) => {
  const code = (error as FirebaseOtpError | null)?.code;
  const message = (error as FirebaseOtpError | null)?.message;

  if (String(code) === "18002" || message?.includes("18002")) {
    console.error("FirebaseAuth 18002 ignored:", error);
    return null;
  }

  switch (code) {
    case "auth/code-expired":
    case "auth/session-expired":
    case "auth/invalid-verification-id":
    case "auth/missing-verification-code":
      return "otp_expired";
    case "auth/invalid-verification-code":
      return "invalid_otp";
    case "auth/too-many-requests":
      return "too_many_requests";
    case "auth/network-request-failed":
      return "network_error";
    default:
      return fallbackKey;
  }
};

const getApiErrorToastKey = (error: unknown, fallbackKey: string) => {
  const status = (error as ApiLikeError | null)?.response?.status;

  if (status === 401 || status === 403 || status === 404 || status === 422) {
    return "error_occurred";
  }

  if (status === 429) {
    return "too_many_requests";
  }

  if (status && status >= 500) {
    return "something_went_wrong";
  }

  return fallbackKey;
};

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
  const processedUserIdRef = useRef<string | null>(null);

  // If null, no SMS has been sent
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState("");

  // Handle login
  async function handleAuthenticatedUser(
    user: FirebaseAuthTypes.User,
    idToken?: string,
  ) {
    if (!user?.uid) return;
    if (processedUserIdRef.current === user.uid) return;

    processedUserIdRef.current = user.uid;
    setIsLoading(true);

    try {
      const token = idToken ?? (await getIdToken(user));
      const res = await validateInfo({
        criteriaType: "PHONE",
        criteriaValue: phoneNumber,
      });

      if (res.status === 200 && res.data?.valid) {
        navigation.navigate("Register", { idToken: token });
      } else if (res.status === 200 && !res.data?.valid) {
        await dispatch(userLogin({ idToken: token })).unwrap();
      } else {
        processedUserIdRef.current = null;
        throw new Error("Unexpected validation response");
      }
    } catch (error) {
      processedUserIdRef.current = null;
      const toastKey = getApiErrorToastKey(error, "something_went_wrong");
      if (toastKey) {
        Toast.show({
          type: "error",
          text1: t(toastKey),
        });
      }
      console.error("Error validating: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      void handleAuthenticatedUser(user);
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
      const toastKey = getOtpErrorToastKey(error, "otp_send_failed");
      if (toastKey) {
        Toast.show({
          type: "error",
          text1: t(toastKey),
        });
      }
      setError(error as Error);
      console.error("Error sending OTP: ", error);
    }
  }

  async function confirmCode(): Promise<FirebaseAuthTypes.UserCredential | null> {
    if (!confirm) {
      throw new Error("Confirmation result not ready");
    }

    try {
      const res = await confirm.confirm(code);
      return res;
    } catch (error) {
      const toastKey = getOtpErrorToastKey(error, "something_went_wrong");
      if (toastKey) {
        Toast.show({
          type: "error",
          text1: t(toastKey),
        });
      }
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
      const confirmation = await confirmCode();
      if (!confirmation?.user) {
        throw new Error("User credential not available");
      }

      await handleAuthenticatedUser(
        confirmation.user,
        await getIdToken(confirmation.user),
      );
    } catch (error) {
      const toastKey = getApiErrorToastKey(error, "something_went_wrong");
      if (toastKey) {
        Toast.show({
          type: "error",
          text1: t(toastKey),
        });
      }
      console.error("Error validating: ", error);
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
