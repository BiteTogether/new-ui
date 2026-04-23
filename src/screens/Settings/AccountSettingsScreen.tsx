import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../utils/constants";
import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { userUpdateInfo } from "../../store/user/userActions";
import Toast from "react-native-toast-message";
import {
  uploadAvatar,
  deleteAvatar,
  validateInfo,
} from "../../services/api/userApi";
import InfoInput from "../../components/InfoInput";
import Avatar from "../../components/Avatar";
import { isValidUsername } from "../../utils/helpers";
import ConfirmModal from "../../components/ConfirmModal";
import SelectModal, { Option } from "../../components/SelectModal";
import * as ImagePicker from "expo-image-picker";
import { compressImageWithExpo } from "../../utils/image";
import { UploadImage } from "../../types/user";

const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [username, setUsername] = useState<string>(userInfo?.username || "");
  const [fullName, setFullName] = useState<string>(userInfo?.fullName || "");
  const [avatar, setAvatar] = useState<string | null>(userInfo?.avatar || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [compressedImage, setCompressedImage] = useState<UploadImage | null>(
    null,
  );

  const avatarOptions: Option[] = [
    {
      label: t("change_avatar"),
      onPress: () => {
        setShowAvatarOptions(false);
        pickImage();
      },
    },
    {
      label: t("delete_avatar"),
      onPress: () => {
        setShowAvatarOptions(false);
        setShowDeleteModal(true);
      },
    },
  ];

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: t("permission_required"),
        text2: t("media_library_permission_required"),
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      await handleCompressImage(uri);
    }
  };

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

  const handleDeleteAvatar = async () => {
    setShowDeleteModal(false);
    if (avatar === null) {
      Toast.show({
        type: "error",
        text1: t("no_avatar"),
      });
      return;
    } else if (compressedImage) {
      setCompressedImage(null);
      setAvatar(null);
    }

    try {
      const res = await deleteAvatar(userInfo!.id);
      if (res.status === 200) {
        setAvatar(null);
      }
    } catch (error) {
      console.error("Error deleting avatar: ", error);
      Toast.show({
        type: "error",
        text1: t("error_occurred"),
      });
    }
  };

  const handleUploadAvatar = async () => {
    if (!compressedImage) return;
    const res = await uploadAvatar(userInfo!.id, compressedImage);
    if (res.status === 200 && res.data) {
      setAvatar(res.data as string);
      setCompressedImage(null);
      return res.data as string;
    } else {
      Toast.show({
        type: "error",
        text1: t("avatar_upload_failed"),
      });
      throw new Error(res.message);
    }
  };

  const handleSave = async () => {
    if (!isValidUsername(username)) {
      Toast.show({
        type: "error",
        text1: t("invalid_username"),
      });
      return;
    }
    try {
      setIsLoading(true);
      const avatarUrl = await handleUploadAvatar();
      const cleanUsername = username.trim().toLowerCase();
      const cleanFullName = fullName.trim();
      if (cleanUsername !== userInfo?.username) {
        const res = await validateInfo({
          criteriaType: "USERNAME",
          criteriaValue: cleanUsername,
        });
        if (res.status === 200 && res.data?.valid) {
          await dispatch(
            userUpdateInfo({
              id: userInfo!.id,
              username: cleanUsername,
              fullName: cleanFullName,
              avatar: avatarUrl,
            }),
          ).unwrap();

          Toast.show({
            type: "success",
            text1: t("user_update_success"),
          });
        } else if (res.status === 200 && !res.data?.valid) {
          Toast.show({
            type: "error",
            text1: t("username_taken"),
          });
        }
      } else {
        await dispatch(
          userUpdateInfo({
            id: userInfo!.id,
            username: cleanUsername,
            fullName: cleanFullName,
            avatar: avatarUrl,
          }),
        ).unwrap();

        Toast.show({
          type: "success",
          text1: t("user_update_success"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("user_update_failed"),
      });
      console.error("Error updating user info: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsChanged(
      username !== userInfo?.username ||
        fullName !== userInfo?.fullName ||
        avatar !== userInfo?.avatar,
    );
  }, [username, fullName, avatar, userInfo]);

  return (
    <View style={styles.container}>
      <TopBar
        type="other"
        title={t("account")}
        onSave={handleSave}
        saveLoading={isLoading || isCompressing}
        isChanged={isChanged}
      />
      <TouchableOpacity
        style={styles.avatar_container}
        onPress={() => setShowAvatarOptions(true)}
      >
        <Avatar size={100} uri={avatar} />
      </TouchableOpacity>
      <InfoInput
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
      />

      <SelectModal
        visible={showAvatarOptions}
        options={avatarOptions}
        onClose={() => setShowAvatarOptions(false)}
        title={t("options")}
      />

      <ConfirmModal
        visible={showDeleteModal}
        title={t("delete_avatar")}
        message={t("delete_avatar_confirm")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDeleteAvatar();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },

  avatar_container: {
    alignItems: "center",
    marginBottom: 32,
  },
});

export default AccountSettingsScreen;
