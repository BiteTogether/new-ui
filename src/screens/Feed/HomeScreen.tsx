import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors } from "../../utils/constants";
import BottomTab from "./components/BottomTab";
import { Modalize } from "react-native-modalize";
import * as Location from "expo-location";
import { Region } from "react-native-maps";
import FriendsScreen from "../Friends/FriendsScreen";
import ChatListScreen from "../Chat/ChatListScreen";
import PostDetailScreen from "./PostDetailScreen";
import ModalMap from "./components/ModalMap";
import { RootState } from "../../store";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { useSearchScreen, searchScreenStyles } from "../Search/SearchScreen";
import { useSavedPostsScreen, savedPostsScreenStyles } from "./SavedPostScreen";
import { Post } from "../../types/feed";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  userGetPosts,
  userGetSavedPosts,
  userGetPostDetail,
  userDeletePost,
} from "../../store/feed/feedActions";
import { useRoute, RouteProp } from "@react-navigation/native";
import { setUserLocation } from "../../store/user/userSlice";
import { useWebSocket } from "../../hooks/useWebSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const { userInfo, userLocation } = useSelector(
    (state: RootState) => state.user,
  );
  const { posts, savedPosts } = useSelector((state: RootState) => state.feed);
  const { locations } = useSelector((state: RootState) => state.chat);
  const { sendLocation } = useWebSocket("LOCATION_UPDATE");
  const SearchRef = useRef<Modalize>(null);
  const FriendsRef = useRef<Modalize>(null);
  const ChatListRef = useRef<Modalize>(null);
  const PostDetailRef = useRef<Modalize>(null);
  const SavedPostsRef = useRef<Modalize>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState<boolean>(true);
  const route = useRoute<RouteProp<MainStackParamList, "Home">>();

  const [behaviour, setBehaviour] = useState<"height" | undefined>("height");
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("height");
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const searchScreen = useSearchScreen();
  const savedPostsScreen = useSavedPostsScreen();

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

  const handleOpenPostDetail = (post: Post) => {
    setSelectedPost(post);
    PostDetailRef.current?.open();
  };

  const fetchSavedPosts = async () => {
    setLoadingSavedPosts(true);
    try {
      await dispatch(userGetSavedPosts());
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      Toast.show({
        type: "error",
        text1: t("fetch_saved_posts_failed"),
      });
    } finally {
      setLoadingSavedPosts(false);
    }
  };

  const handleOpenSavedPosts = () => {
    SavedPostsRef.current?.open();
    fetchSavedPosts();
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await dispatch(userDeletePost(postId)).unwrap();
      Toast.show({
        type: "success",
        text1: t("delete_post_success"),
      });
      PostDetailRef.current?.close();
    } catch (error) {
      console.error("Error deleting post:", error);
      Toast.show({
        type: "error",
        text1: t("delete_post_error"),
      });
    }
  };

  const handleFetchPosts = useCallback(async (region: Region | undefined) => {
    if (!region) return;
    try {
      await dispatch(
        userGetPosts({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  // Debounce fetchPosts
  const debouncedFetchPosts = useCallback(debounce(handleFetchPosts, 400), [
    handleFetchPosts,
  ]);

  const handlePressRestaurant = (restaurant: any) => {
    // Handle restaurant press, e.g., navigate to details screen
  };

  const pickImage = async () => {
    if (!userLocation) return;
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: t("permission_required"),
        text2: t("camera_permission_required"),
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      navigation.navigate("CreatePost", {
        imageUri: uri,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      let subscription: Location.LocationSubscription;

      async function subscribeLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 10,
          },
          (location) => {
            dispatch(
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.015,
              }),
            );
            setMapRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.015,
            });

            const sharing = sharingRef.current;
            if (sharing?.isSharing && sharing.conversationId) {
              sendLocation({
                conversationId: sharing.conversationId,
                location: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
              });
            }
          },
        );
      }

      subscribeLocation();

      return () => {
        if (subscription) subscription.remove();
      };
    }, []),
  );

  const sharingRef = useRef<{
    conversationId: string;
    isSharing: boolean;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadSharing = async () => {
        const data = await AsyncStorage.getItem(
          "CONVERSATION_LOCATION_SHARING",
        );

        if (data) {
          sharingRef.current = JSON.parse(data);
        }
      };

      loadSharing();
    }, []),
  );

  // Fetch posts when mapRegion changes with debounce
  useEffect(() => {
    if (mapRegion) debouncedFetchPosts(mapRegion);
  }, [mapRegion]);

  useEffect(() => {
    const handleFetchPostDetail = async (postId: string) => {
      try {
        const post = await dispatch(userGetPostDetail(postId)).unwrap();

        if (post) {
          setSelectedPost(post);
          PostDetailRef.current?.open();
        }
        // Remove postId from route params to prevent reopening the modal when coming back to this screen
        navigation.setParams?.({ postId: undefined });
      } catch (error) {
        console.error("Error fetching post detail:", error);
        Toast.show({
          type: "error",
          text1: t("fetch_post_detail_error"),
        });
      }
    };
    // If there's a postId in route params, try to fetch the post detail
    if (route.params?.postId) {
      handleFetchPostDetail(route.params?.postId);
    }
  }, [route.params?.postId, savedPosts, posts]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : behaviour}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ModalMap
          region={mapRegion}
          setRegion={setMapRegion}
          gpsRegion={userLocation}
          membersLocations={locations}
          posts={posts}
          onPressMarker={handleOpenPostDetail}
          onOpenSavedPosts={handleOpenSavedPosts}
        />
        <BottomTab
          onOpenSearch={handleOpenSearch}
          onOpenFriends={handleOpenFriends}
          onOpenCamera={pickImage}
          onOpenChatList={handleOpenChatList}
          onOpenProfile={handleOpenProfile}
        />

        <Modalize
          ref={SearchRef}
          modalHeight={700}
          modalStyle={styles.modal_container}
          HeaderComponent={searchScreen.HeaderComponent}
          flatListProps={{
            data: searchScreen.restaurants,
            keyExtractor: (_, idx) => idx.toString(),
            showsVerticalScrollIndicator: false,

            renderItem: ({ item }) => (
              <TouchableOpacity
                onPress={() => handlePressRestaurant(item)}
                style={searchScreenStyles.itemBtn}
              >
                <View>
                  <Text style={searchScreenStyles.address_text}>
                    {item.name}
                  </Text>
                  <Text style={searchScreenStyles.address_text}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ),
            contentContainerStyle: { paddingBottom: 24 },
          }}
        />

        <Modalize
          ref={FriendsRef}
          modalHeight={700}
          modalStyle={styles.modal_container}
        >
          <View style={{ height: 700 }}>
            <FriendsScreen />
          </View>
        </Modalize>

        <Modalize
          ref={ChatListRef}
          modalHeight={700}
          modalStyle={styles.modal_container}
        >
          <View style={{ height: 700 }}>
            <ChatListScreen />
          </View>
        </Modalize>

        <Modalize
          ref={PostDetailRef}
          modalHeight={700}
          modalStyle={styles.modal_container}
        >
          <View style={{ height: 700 }}>
            <PostDetailScreen
              post={selectedPost}
              onDeletePost={handleDeletePost}
            />
          </View>
        </Modalize>

        <Modalize
          ref={SavedPostsRef}
          modalHeight={700}
          modalStyle={styles.modal_container}
          HeaderComponent={savedPostsScreen.HeaderComponent}
          flatListProps={{
            data: savedPosts,
            keyExtractor: (_, idx) => idx.toString(),
            showsVerticalScrollIndicator: false,
            numColumns: savedPostsScreen.numColumns,
            columnWrapperStyle: { gap: savedPostsScreen.imageMargin },
            contentContainerStyle: { paddingHorizontal: 24 },

            renderItem: ({ item, index }) => {
              const isLastInRow =
                (index + 1) % savedPostsScreen.numColumns === 0;

              if (loadingSavedPosts) {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  style={{
                    marginVertical: savedPostsScreen.imageMargin,
                    marginRight: isLastInRow ? 0 : savedPostsScreen.imageMargin,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                  onPress={() => {
                    SavedPostsRef.current?.close();
                    handleOpenPostDetail(item);
                  }}
                >
                  <Image
                    source={{ uri: item.photoUrl }}
                    style={{
                      width: savedPostsScreen.imageSize,
                      height: savedPostsScreen.imageSize,
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            },

            ListEmptyComponent: loadingSavedPosts ? null : (
              <Text style={savedPostsScreenStyles.no_result_text}>
                {t("no_saved_posts")}
              </Text>
            ),
          }}
        />
      </View>
    </KeyboardAvoidingView>
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
