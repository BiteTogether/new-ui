import React, { useState, useRef, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { Animated, Easing } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../types/navigations";
import { colors, fonts } from "../../utils/constants";
import ConfirmModal from "../../components/ConfirmModal";
import SelectModal, { Option } from "../../components/SelectModal";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Post } from "../../types/feed";
import Avatar from "../../components/Avatar";
import { truncateText } from "../../utils/helpers";
import MessageInput from "../../components/MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import {
  userSavePost,
  userUnsavePost,
  userLikePost,
} from "../../store/feed/feedActions";
import {
  userSendMessage,
  userCreateConversation,
} from "../../store/chat/chatActions";
import { formatDate } from "../../utils/helpers";

interface PostDetailScreenProps {
  post: Post;
  onDeletePost: (postId: string) => void;
}

const PostDetailScreen = ({ post, onDeletePost }: PostDetailScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [liked, setLiked] = useState<boolean>(post.alreadyLiked);
  const [saved, setSaved] = useState<boolean>(post.alreadySaved);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [conId, setConId] = useState<string | null>(null);

  // Double tap logic
  const lastTap = useRef<number>(0);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);
  const heartScale = heartAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.5, 1.2, 1, 0.5],
  });
  const heartOpacity = heartAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  const options: Option[] = [
    {
      label: t("delete_post"),
      onPress: () => {
        setShowSelectModal(false);
        setShowDeleteModal(true);
      },
    },
  ];

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // Double tap detected
      handleLikePost();

      setShowHeart(true);
      heartAnim.setValue(0);
      Animated.timing(heartAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setShowHeart(false);
      });
    }
    lastTap.current = now;
  };

  const handleLikePost = async () => {
    if (liked) return;
    setLiked(true);
    try {
      await dispatch(userLikePost(post.id)).unwrap();
      setLiked(true);
    } catch (error) {
      setLiked(false);
      console.error("Error liking post:", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    }
  };

  // Debounce like and unlike post to prevent multiple rapid requests
  const handleDebounceSavePost = useMemo(
    () =>
      debounce(
        (newSaved) => {
          if (newSaved) {
            dispatch(userSavePost(post.id));
          } else {
            dispatch(userUnsavePost(post.id));
          }
        },
        500,
        { leading: true, trailing: true },
      ),
    [],
  );

  const handleSavePost = () => {
    setSaved((prev) => {
      const newSaved = !prev;
      handleDebounceSavePost(newSaved);
      return newSaved;
    });
  };

  const handleOpenProfile = () => {
    navigation.navigate("Profile", { id: post.user.id });
  };

  const handleSendMessage = async (text: string) => {
    try {
      if (conId) {
        await dispatch(
          userSendMessage({
            conversationId: conId,
            action: "SEND",
            messageType: "POST_COMMENT",
            content: text,
            postId: post.id,
            photoUrl: post.photoUrl,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    }
  };

  useEffect(() => {
    const handleCreateConversation = async () => {
      if (!conId && post.user.id !== userInfo?.id) {
        try {
          const res = await dispatch(
            userCreateConversation({
              type: "DIRECT",
              participantIds: [userInfo!.id, post.user.id],
            }),
          ).unwrap();
          setConId(res.id);
        } catch (error) {
          console.error("Error creating conversation:", error);
          Toast.show({
            type: "error",
            text1: t("error_occurred"),
          });
        }
      }
    };
    handleCreateConversation();
  }, [conId]);

  return (
    <View style={styles.container}>
      <View style={styles.user_container}>
        <Text style={styles.title}>{post.placeName}</Text>
        {post.user.id === userInfo?.id && (
          <TouchableOpacity onPress={() => setShowSelectModal(true)}>
            <Feather name="more-horizontal" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.address_container}>
        <Text style={[styles.subtitle, { flexShrink: 1 }]}>
          {post.placeAddress}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setStringAsync(
              `${post.placeName}, ${post.placeAddress}`,
            );
            Toast.show({
              type: "success",
              text1: t("address_copied"),
            });
          }}
        >
          <Feather name="copy" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.user_container}>
        <View style={styles.user_info}>
          <TouchableOpacity onPress={handleOpenProfile}>
            <Avatar uri={post.user.avatar} size={40} />
          </TouchableOpacity>
          <View style={{ justifyContent: "center", gap: 4 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Text style={styles.username_text}>
                {truncateText(post.user.fullName, 10)}
              </Text>
              <Text style={{ color: colors.secondary }}>
                {formatDate(post.createdAt)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 2 }}>
              {Array.from({ length: post.rating }).map((_, idx) => (
                <FontAwesome
                  key={idx}
                  name={"star"}
                  size={10}
                  color={colors.primary}
                />
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleSavePost}>
          <FontAwesome
            name={saved ? "bookmark" : "bookmark-o"}
            size={24}
            color={saved ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.content}>{post.content}</Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleDoubleTap}
            style={{
              width: "100%",
              aspectRatio: 1,
              borderRadius: 25,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: post.photoUrl }}
                resizeMode="cover"
                style={{ width: "100%", aspectRatio: 1, borderRadius: 25 }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.accent,
                  }}
                >
                  <ActivityIndicator size="large" color={colors.text} />
                </View>
              )}
            </View>
            {showHeart && (
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: heartOpacity,
                  transform: [{ scale: heartScale }],
                  pointerEvents: "none",
                }}
              >
                <FontAwesome name="heart" size={96} color={colors.pink} />
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {post.user.id !== userInfo?.id && (
        <View
          style={{
            marginTop: 16,
          }}
        >
          <MessageInput
            type="chat"
            onSend={handleSendMessage}
            placeholder={t("send_messages")}
          />
        </View>
      )}

      <SelectModal
        visible={showSelectModal}
        options={options}
        onClose={() => setShowSelectModal(false)}
        title={t("options")}
      />

      <ConfirmModal
        visible={showDeleteModal}
        title={t("delete_post")}
        message={t("delete_post_confirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDeletePost(post.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: fonts.size.xlarge,
    color: colors.text,
    fontWeight: "bold",
  },

  subtitle: {
    color: colors.secondary,
    marginTop: 8,
  },

  address_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  username_text: {
    fontSize: fonts.size.medium,
    fontWeight: 600,
    color: colors.text,
  },

  user_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  user_info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  content: {
    color: colors.text,
    marginVertical: 8,
    fontSize: fonts.size.medium,
  },
});
export default PostDetailScreen;
