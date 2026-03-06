import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigations";
import { colors, fonts } from "../../utils/constants";
import BottomTab from "./components/BottomTab";
import { Modalize } from "react-native-modalize";
import ChatListScreen from "../Chat/ChatListScreen";

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const ChatListRef = React.useRef<Modalize>(null);

  const handleOpenChatList = () => {
    ChatListRef.current?.open();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoNext = () => {
    // navigation.navigate("OTP");
  };
  return (
    <View style={styles.container}>
      <Text>home nè</Text>
      <BottomTab onOpenChatList={handleOpenChatList} />

      <Modalize
        ref={ChatListRef}
        modalHeight={700}
        modalStyle={styles.modal_container}
      >
        <View style={{ height: 700 }}>
          <ChatListScreen />
        </View>
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    alignItems: "center",
  },

  modal_container: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
});
export default HomeScreen;
