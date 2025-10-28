import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Region } from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function Index() {
  const [query, setQuery] = React.useState("");
  const { isDark } = useTheme();
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Get user's location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is needed to show your position on the map."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={isDark ? "dark" : "light"}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />
      <View style={styles.overlay}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          containerStyle={{ width: "92%" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 60, // adjust for safe area / iPhone notch
    width: "100%",
    alignItems: "center",
  },
});
