import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { geocodeAddress } from "../utils/geocoding";

const OPPORTUNITIES_KEY = "volunteer_opportunities";

export type Opportunity = {
  id: string;
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  volunteersSignedUp: number;
  coordinates?: { latitude: number; longitude: number };
  categories?: string[];
};

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load opportunities from AsyncStorage
  const loadOpportunities = useCallback(async (isRefresh = false) => {
    try {
      console.log("Loading opportunities, isRefresh:", isRefresh);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Start timer and data fetch simultaneously
      const minimumLoadTime = new Promise((resolve) =>
        setTimeout(resolve, 800)
      );
      const dataFetch = (async () => {
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

          if (updated) {
            await AsyncStorage.setItem(
              OPPORTUNITIES_KEY,
              JSON.stringify(updatedOpportunities)
            );
          }

          return updatedOpportunities;
        }
        return [];
      })();

      // Wait for both to complete
      const [_, opportunities] = await Promise.all([
        minimumLoadTime,
        dataFetch,
      ]);
      setOpportunities(opportunities);
    } catch (err) {
      console.error("Error loading opportunities:", err);
      setError("Failed to load opportunities");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Save opportunities to AsyncStorage
  const saveOpportunities = useCallback(
    async (newOpportunities: Opportunity[]) => {
      try {
        await AsyncStorage.setItem(
          OPPORTUNITIES_KEY,
          JSON.stringify(newOpportunities)
        );
        setOpportunities(newOpportunities);
      } catch (err) {
        console.error("Error saving opportunities:", err);
        setError("Failed to save opportunities");
      }
    },
    []
  );

  // Add a new opportunity
  const addOpportunity = useCallback(
    async (opportunity: Opportunity) => {
      const newOpportunities = [opportunity, ...opportunities];
      await saveOpportunities(newOpportunities);
    },
    [opportunities, saveOpportunities]
  );

  // Delete an opportunity
  const deleteOpportunity = useCallback(
    async (id: string) => {
      const newOpportunities = opportunities.filter((opp) => opp.id !== id);
      await saveOpportunities(newOpportunities);
    },
    [opportunities, saveOpportunities]
  );

  // Update an opportunity
  const updateOpportunity = useCallback(
    async (id: string, updates: Partial<Opportunity>) => {
      console.log("Updating opportunity:", id, "with:", updates);
      const newOpportunities = opportunities.map((opp) =>
        opp.id === id ? { ...opp, ...updates } : opp
      );
      console.log(
        "New opportunities array:",
        newOpportunities.find((o) => o.id === id)
      );
      await saveOpportunities(newOpportunities);
    },
    [opportunities, saveOpportunities]
  );

  // Get opportunities with coordinates
  const opportunitiesWithCoords = opportunities.filter(
    (opp) => opp.coordinates
  );

  // Load on mount
  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return {
    opportunities,
    opportunitiesWithCoords,
    loading,
    refreshing,
    error,
    loadOpportunities,
    addOpportunity,
    deleteOpportunity,
    updateOpportunity,
  };
}
