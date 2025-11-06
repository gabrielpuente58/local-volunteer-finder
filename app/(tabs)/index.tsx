import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import LoadingIndicator from "../../components/LoadingIndicator";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useOpportunities } from "../../hooks/useOpportunities";

export default function Index() {
  const [query, setQuery] = React.useState("");
  const { isDark, theme } = useTheme();
  const { opportunitiesWithCoords, loading, loadOpportunities } =
    useOpportunities();
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useFocusEffect(
    useCallback(() => {
      loadOpportunities(true);
    }, [loadOpportunities])
  );

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

  if (loading) {
    return <LoadingIndicator message="Loading opportunities..." />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={isDark ? "dark" : "light"}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Display opportunity markers */}
        {opportunitiesWithCoords.map((opportunity) => (
          <Marker
            key={opportunity.id}
            coordinate={{
              latitude: opportunity.coordinates!.latitude,
              longitude: opportunity.coordinates!.longitude,
            }}
            pinColor="red"
            title={opportunity.name}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{opportunity.name}</Text>
                <Text style={styles.calloutLocation}>
                  {opportunity.location}
                </Text>
                <Text style={styles.calloutDate}>{opportunity.dateTime}</Text>
                <Text style={styles.calloutPeople}>
                  {opportunity.peopleNeeded} volunteers needed
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
    top: 60,
    width: "100%",
    alignItems: "center",
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  calloutLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  calloutDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  calloutPeople: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
