import React, { useRef } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Region } from "react-native-maps";
import { colors } from "../../../utils/constants";
import FocusIcon from "../../../../assets/icons/FocusIcon";

interface ModalMapProps {
  region?: Region;
}

const ModalMap = ({ region }: ModalMapProps) => {
  const mapRef = useRef<MapView>(null);
  const handleFocusLocation = () => {
    if (region) {
      mapRef.current?.animateToRegion(region, 500);
    }
  };

  return (
    <>
      <MapView
        style={styles.container}
        showsMyLocationButton={false}
        showsUserLocation
        region={region}
        ref={mapRef}
      />

      <TouchableOpacity
        style={styles.focus_button}
        onPress={handleFocusLocation}
      >
        <FocusIcon size={24} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  focus_button: {
    position: "absolute",
    bottom: "20%",
    right: "5%",
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 8,
  },
});

export default ModalMap;
