import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import { Region, Marker, Callout } from "react-native-maps";
import { colors } from "../../../utils/constants";
import FocusIcon from "../../../../assets/icons/FocusIcon";
import { Posts, Post } from "../../../types/feed";
import { truncateText } from "../../../utils/helpers";
import MapView from "react-native-map-clustering";
import Loading from "../../../components/Loading";
import { FontAwesome } from "@expo/vector-icons";
import { GetUserLocationsResponse } from "../../../types/chat";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface ModalMapProps {
  region?: Region;
  setRegion?: (region: Region) => void;
  gpsRegion?: Region;
  posts?: Posts;
  onPressMarker?: (post: Post) => void;
  onOpenSavedPosts?: () => void;
  membersLocations?: GetUserLocationsResponse[];
}

const ModalMap = ({
  region,
  setRegion,
  gpsRegion,
  posts,
  onPressMarker,
  onOpenSavedPosts,
  membersLocations,
}: ModalMapProps) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const mapRef = useRef<MapView>(null);
  const handleFocusLocation = () => {
    if (gpsRegion) {
      mapRef.current?.animateToRegion(gpsRegion, 500);
    }
  };

  const isRegionEqual = (r1: Region, r2: Region) => {
    if (!r1 || !r2) return false;
    return (
      Math.abs(r1.latitude - r2.latitude) < 0.0001 &&
      Math.abs(r1.longitude - r2.longitude) < 0.0001 &&
      Math.abs(r1.latitudeDelta - r2.latitudeDelta) < 0.0001 &&
      Math.abs(r1.longitudeDelta - r2.longitudeDelta) < 0.0001
    );
  };

  if (!region) return <Loading />;

  return (
    <>
      <MapView
        style={styles.container}
        showsMyLocationButton={false}
        showsUserLocation
        region={region}
        ref={mapRef}
        onRegionChangeComplete={(newRegion) => {
          if (!isRegionEqual(newRegion, region)) {
            setRegion?.(newRegion);
          }
        }}
      >
        {posts?.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: Number(marker.latitude),
              longitude: Number(marker.longitude),
            }}
            onPress={() => onPressMarker?.(marker)}
          >
            <View style={{ alignItems: "center", gap: 4 }}>
              <View style={styles.content_container}>
                <Text>{truncateText(marker.content, 20)}</Text>
              </View>

              <Image
                source={{ uri: marker.user?.avatar }}
                style={styles.avatar}
              />
            </View>
          </Marker>
        ))}

        {membersLocations
          ?.filter((loc) => loc.userId !== userInfo?.id)
          ?.map((location, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: Number(location.lat),
                longitude: Number(location.lng),
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: location?.avatar }}
                  style={styles.avatar}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      <View style={styles.button_container}>
        <TouchableOpacity style={styles.side_button} onPress={onOpenSavedPosts}>
          <FontAwesome name="bookmark" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.side_button}
          onPress={handleFocusLocation}
        >
          <FocusIcon size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  side_button: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  content_container: {
    backgroundColor: colors.text,
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  button_container: {
    position: "absolute",
    bottom: "20%",
    right: "5%",
    gap: 16,
  },
});

export default ModalMap;
