import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../contexts/ThemeContext";
import { geocodeAddress } from "../../utils/geocoding";

const OPPORTUNITIES_KEY = "volunteer_opportunities";

type Opportunity = {
  id: string;
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  volunteersSignedUp: number;
  coordinates?: { latitude: number; longitude: number };
};

export default function Index() {
  const [query, setQuery] = React.useState("");
  const { isDark, theme } = useTheme();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Load opportunities from AsyncStorage
  const loadOpportunities = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(OPPORTUNITIES_KEY);
      if (stored) {
        const allOpportunities = JSON.parse(stored);

        // Geocode opportunities that don't have coordinates
        let updated = false;
        const updatedOpportunities = await Promise.all(
          allOpportunities.map(async (opp: Opportunity) => {
            if (!opp.coordinates && opp.location) {
              const coords = await geocodeAddress(opp.location);
              if (coords) {
                updated = true;
                return { ...opp, coordinates: coords };
              }
            }
            return opp;
          })
        );

        // Save back to storage if we geocoded any
        if (updated) {
          await AsyncStorage.setItem(
            OPPORTUNITIES_KEY,
            JSON.stringify(updatedOpportunities)
          );
        }

        // Filter to only include opportunities with coordinates
        const opportunitiesWithCoords = updatedOpportunities.filter(
          (opp: Opportunity) => opp.coordinates
        );
        setOpportunities(opportunitiesWithCoords);
      }
    } catch (error) {
      console.error("Error loading opportunities:", error);
    }
  }, []);

  // Load opportunities on mount and when screen comes into focus
  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Reload opportunities every time the map tab is focused
  useFocusEffect(
    useCallback(() => {
      loadOpportunities();
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
        {opportunities.map((opportunity) => (
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
    top: 60, // adjust for safe area / iPhone notch
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
