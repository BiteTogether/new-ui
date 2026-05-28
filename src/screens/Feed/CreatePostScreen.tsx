import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { compressImageWithExpo } from "../../utils/image";
import { UploadImage } from "../../types/user";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../utils/constants";
import SearchBar from "../../components/SearchBar";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import InputContent from "../../components/InputContent";
import { uploadImage } from "../../services/api/feedApi";
import { userCreatePost } from "../../store/feed/feedActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

interface NearbyRestaurant {
  ref_id: string;
  name: string;
  address: string;
  distance?: number;
}

const CreatePostScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.9;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, "CreatePost">>();
  const { imageUri, latitude, longitude } = route.params;
  const [compressedImage, setCompressedImage] = useState<UploadImage | null>(
    null,
  );
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<
    NearbyRestaurant[]
  >([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<NearbyRestaurant | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

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

  const handleCompressImage = async (uri: string) => {
    setIsCompressing(true);
    try {
      // Extract a simple filename (e.g., "photo.jpg")
      const filename = uri.split("/").pop() || "image.jpg";
      const compressedUri = await compressImageWithExpo(uri, filename);

      if (compressedUri) {
        setCompressedImage({
          uri: compressedUri,
          name: filename,
          type: "image/webp",
        });
      } else {
        console.error("Error", "Image compression failed.");
      }
    } catch (error) {
      console.error("Compression process failed:", error);
      console.error("Error", "An error occurred during compression.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUploadImage = async (): Promise<string> => {
    if (!compressedImage) {
      throw new Error("No compressed image available");
    }
    const res = await uploadImage(compressedImage);
    if (res.status === 200 && res.data) {
      setCompressedImage(null);
      return res.data as string;
    } else {
      Toast.show({
        type: "error",
        text1: t("image_upload_failed"),
      });
      throw new Error(res.message);
    }
  };

  const handleCreatePost = async () => {
    const placeName = selectedRestaurant?.name?.trim() || searchText.trim();

    if (
      !compressedImage ||
      !placeName ||
      content.trim() === "" ||
      rating === 0
    ) {
      Toast.show({
        type: "error",
        text1: t("post_required_fields"),
      });
      return;
    }

    setIsUpLoading(true);
    try {
      const imageUrl = await handleUploadImage();
      if (!imageUrl) {
        throw new Error("Image upload failed");
      }
      const trimmedContent = content.trim();

      await dispatch(
        userCreatePost({
          placeId: selectedRestaurant?.ref_id ?? "",
          placeName,
          placeAddress: selectedRestaurant?.address ?? "",
          latitude: latitude,
          longitude: longitude,
          content: trimmedContent,
          rating: rating,
          photoUrl: imageUrl,
        }),
      ).unwrap();

      Toast.show({
        type: "success",
        text1: t("post_created"),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post: ", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    } finally {
      setIsUpLoading(false);
    }
  };

  useEffect(() => {
    handleCompressImage(imageUri);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ alignSelf: "flex-end" }}
        >
          <Feather name="x" size={32} color={colors.text} />
        </TouchableOpacity>
        <SearchBar
          type="search_nearby"
          placeholder={t("enter_restaurant_name")}
          setSearchResult={(results) => {
            if (Array.isArray(results)) {
              setNearbyRestaurants(results);
              if (results.length > 0) {
                setModalVisible(true);
              } else {
                setModalVisible(false);
                setSelectedRestaurant(null);
              }
            } else {
              setNearbyRestaurants([]);
              setModalVisible(false);
              setSelectedRestaurant(null);
            }
            if (Array.isArray(results) && results.length > 0) {
              setModalVisible(true);
            }
          }}
          hideIcon={true}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setSelectedRestaurant(null);
          }}
          location={latitude && longitude ? { latitude, longitude } : undefined}
        />
      </View>

      {modalVisible && nearbyRestaurants.length > 0 && (
        <View style={styles.modalContent}>
          <FlatList
            data={nearbyRestaurants}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedRestaurant(item);
                  setSearchText(item.name);
                  setModalVisible(false);
                }}
                style={styles.itemBtn}
              >
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : behaviour}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "60%",
            padding: 24,
            alignSelf: "center",
          }}
        >
          <InputContent
            placeholder={t("add_messages")}
            value={content}
            onChangeText={setContent}
          />
        </View>
      </KeyboardAvoidingView>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <FontAwesome
                name={i <= rating ? "star" : "star-o"}
                size={32}
                color={i <= rating ? colors.primary : colors.secondary}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ minHeight: 80, marginVertical: 24 }}>
          {isCompressing || isUpLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <TouchableOpacity
              style={styles.button_post}
              onPress={handleCreatePost}
            >
              <Feather name="check" size={32} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 24,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  modalContent: {
    backgroundColor: colors.text,
    maxHeight: "30%",
    position: "absolute",
    zIndex: 1,
    top: "20%",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  itemBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral,
  },
  button_post: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 100,
    alignSelf: "center",
  },
});

export default CreatePostScreen;
