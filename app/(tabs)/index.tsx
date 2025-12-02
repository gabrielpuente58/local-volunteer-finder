import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import CreateOpportunityModal from "../../components/CreateOpportunityModal";
import LoadingIndicator from "../../components/LoadingIndicator";
import OpportunityCard from "../../components/OpportunityCard";
import OpportunityDetailModal from "../../components/OpportunityDetailModal";
import OpportunityFilters from "../../components/OpportunityFilters";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Opportunity, useOpportunities } from "../../hooks/useOpportunities";
import { geocodeAddress } from "../../utils/geocoding";

type Tab = "map" | "list";

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Index() {
  const [query, setQuery] = React.useState("");
  const { isDark, theme } = useTheme();
  const { isAdmin } = useUser();
  const {
    opportunities,
    opportunitiesWithCoords,
    loading,
    loadOpportunities,
    addOpportunity,
  } = useOpportunities();
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    getLocation();
  }, []);

  // Filter opportunities based on selected filters
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter((opp) =>
        opp.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Skip other filtering for admin users
    if (isAdmin) {
      return filtered;
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((opp) => {
        if (!opp.categories || opp.categories.length === 0) return false;
        return selectedCategories.some((cat) => opp.categories?.includes(cat));
      });
    }

    // Filter by distance
    if (userLocation && maxDistance < 50) {
      filtered = filtered.filter((opp) => {
        if (!opp.coordinates) return false;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          opp.coordinates.latitude,
          opp.coordinates.longitude
        );
        return distance <= maxDistance;
      });
    }

    return filtered;
  }, [
    opportunities,
    selectedCategories,
    maxDistance,
    userLocation,
    isAdmin,
    query,
  ]);

  const filteredOpportunitiesWithCoords = useMemo(() => {
    return opportunitiesWithCoords.filter((opp) =>
      filteredOpportunities.some((filtered) => filtered.id === opp.id)
    );
  }, [opportunitiesWithCoords, filteredOpportunities]);

  const handleApplyFilters = (categories: string[], distance: number) => {
    setSelectedCategories(categories);
    setMaxDistance(distance);
  };

  const activeFiltersCount =
    selectedCategories.length + (maxDistance < 50 ? 1 : 0);

  const handleCreateOpportunity = async (formData: {
    name: string;
    description: string;
    location: string;
    peopleNeeded: string;
    dateTime: string;
    imageUri: string | null;
    coordinates?: { latitude: number; longitude: number };
    categories: string[];
  }) => {
    // If we have a location but no coordinates, geocode it
    let coordinates = formData.coordinates;

    if (formData.location && !coordinates) {
      const geocodedCoords = await geocodeAddress(formData.location);
      if (geocodedCoords) {
        coordinates = geocodedCoords;
      }
    }

    // Create new opportunity
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      location: formData.location,
      peopleNeeded: formData.peopleNeeded,
      dateTime: formData.dateTime,
      imageUri: formData.imageUri,
      volunteersSignedUp: 0,
      coordinates: coordinates,
      categories: formData.categories,
    };

    // Add to list using the hook
    await addOpportunity(newOpportunity);
    setCreateModalVisible(false);
    // Reload to ensure the UI updates
    await loadOpportunities(true);
  };

  const handleOpportunityPress = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDetailModalVisible(true);
  };

  if (loading) {
    return <LoadingIndicator message="Loading opportunities..." />;
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: theme.background, paddingTop: 60 },
        ]}
      />

      {/* Search Bar with Filter/Add Button */}
      <View
        style={[
          styles.searchBarContainer,
          { backgroundColor: theme.background, paddingTop: 0 },
        ]}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          containerStyle={{ flex: 1 }}
        />
        {isAdmin ? (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setCreateModalVisible(true)}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.filterIconButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setFiltersVisible(true)}
          >
            <Feather name="filter" size={20} color={theme.text} />
            {activeFiltersCount > 0 && (
              <View
                style={[
                  styles.filterIconBadge,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Dropdown */}
      {query.trim() && filteredOpportunities.length > 0 && (
        <View
          style={[
            styles.searchResults,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <ScrollView
            style={styles.searchResultsScroll}
            keyboardShouldPersistTaps="handled"
          >
            {filteredOpportunities.map((opp) => (
              <TouchableOpacity
                key={opp.id}
                style={[
                  styles.searchResultItem,
                  { borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  setQuery("");
                  setSelectedOpportunity(opp);
                  setDetailModalVisible(true);
                }}
              >
                <Text style={[styles.searchResultName, { color: theme.text }]}>
                  {opp.name}
                </Text>
                <Text
                  style={[
                    styles.searchResultLocation,
                    { color: theme.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {opp.location}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab Bar */}
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "map" && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "map" ? theme.primary : theme.textSecondary,
              },
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "list" && { borderBottomColor: theme.primary },
          ]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "list" ? theme.primary : theme.textSecondary,
              },
            ]}
          >
            List View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            userInterfaceStyle={isDark ? "dark" : "light"}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Display opportunity markers */}
            {filteredOpportunitiesWithCoords.map((opportunity) => (
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
                    <Text style={styles.calloutDate}>
                      {opportunity.dateTime}
                    </Text>
                    <Text style={styles.calloutPeople}>
                      {opportunity.peopleNeeded} volunteers needed
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      ) : (
        <ScrollView
          style={[styles.listContainer, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.listContent}
        >
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isAdmin={isAdmin}
                onPress={() => handleOpportunityPress(opportunity)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {selectedCategories.length > 0 || maxDistance < 50
                  ? "No opportunities match your filters"
                  : "No opportunities available"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Filters Modal */}
      <OpportunityFilters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        selectedCategories={selectedCategories}
        maxDistance={maxDistance}
        onApplyFilters={handleApplyFilters}
      />

      {/* Create Opportunity Modal */}
      <CreateOpportunityModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateOpportunity}
      />

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        visible={detailModalVisible}
        opportunity={selectedOpportunity}
        onClose={() => setDetailModalVisible(false)}
        onUpdate={() => loadOpportunities(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 6,
    gap: 8,
  },
  searchResults: {
    position: "absolute",
    top: 130,
    left: 16,
    right: 16,
    maxHeight: 300,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchResultsScroll: {
    maxHeight: 300,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  searchResultLocation: {
    fontSize: 14,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterIconBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
  },
  map: { width: "100%", height: "100%" },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
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
