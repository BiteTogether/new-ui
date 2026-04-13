import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors } from "../../utils/constants";
import BottomTab from "./components/BottomTab";
import { Modalize } from "react-native-modalize";
import * as Location from "expo-location";
import { Region } from "react-native-maps";
import SearchScreen from "../Search/SearchScreen";
import FriendsScreen from "../Friends/FriendsScreen";
import ChatListScreen from "../Chat/ChatListScreen";
import ModalMap from "./components/ModalMap";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const SearchRef = useRef<Modalize>(null);
  const FriendsRef = useRef<Modalize>(null);
  const ChatListRef = useRef<Modalize>(null);
  const modals = [
    { ref: SearchRef, Component: SearchScreen },
    { ref: FriendsRef, Component: FriendsScreen },
    { ref: ChatListRef, Component: ChatListScreen },
  ];

  const handleOpenSearch = () => {
    SearchRef.current?.open();
  };

  const handleOpenFriends = () => {
    FriendsRef.current?.open();
  };

  const handleOpenChatList = () => {
    ChatListRef.current?.open();
  };

  const handleOpenProfile = () => {
    navigation.navigate("Profile", { id: userInfo!.id });
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error(
          "Error getting location: Permission to access location was denied",
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.015,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    }

    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ModalMap region={region}></ModalMap>
      <BottomTab
        onOpenSearch={handleOpenSearch}
        onOpenFriends={handleOpenFriends}
        onOpenChatList={handleOpenChatList}
        onOpenProfile={handleOpenProfile}
      />

      {modals.map(({ ref, Component }, idx) => (
        <Modalize
          key={idx}
          ref={ref}
          modalHeight={700}
          modalStyle={styles.modal_container}
        >
          <View style={{ height: 700 }}>
            <Component />
          </View>
        </Modalize>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modal_container: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
});
export default HomeScreen;
