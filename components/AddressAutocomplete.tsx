import React from "react";
import { LogBox } from "react-native";
import "react-native-get-random-values";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useTheme } from "../contexts/ThemeContext";

// Suppress the VirtualizedList warning for GooglePlacesAutocomplete
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

// Your Google Places API key from environment variables
const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

type Props = {
  onPlaceSelected: (
    address: string,
    coordinates: { latitude: number; longitude: number }
  ) => void;
  placeholder?: string;
  initialValue?: string;
};

export default function AddressAutocomplete({
  onPlaceSelected,
  placeholder = "Search for location...",
  initialValue = "",
}: Props) {
  const { theme } = useTheme();

  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails={true}
      listViewDisplayed="auto"
      suppressDefaultStyles={false}
      onPress={(data, details = null) => {
        console.log("Place selected:", data.description);
        if (details && details.geometry) {
          const address = data.description;
          const coordinates = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
          console.log("Coordinates:", coordinates);
          onPlaceSelected(address, coordinates);
        }
      }}
      onFail={(error) => {
        console.error("Google Places API Error:", error);
      }}
      onNotFound={() => {
        console.log("No results found");
      }}
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: "en",
      }}
      predefinedPlaces={[]}
      enablePoweredByContainer={false}
      minLength={2}
      debounce={200}
      keyboardShouldPersistTaps="always"
      listUnderlayColor="transparent"
      styles={{
        container: {
          flex: 0,
        },
        textInputContainer: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderBottomWidth: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          marginTop: 0,
          marginBottom: 0,
        },
        textInput: {
          backgroundColor: theme.surface,
          color: theme.text,
          fontSize: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          paddingHorizontal: 14,
          paddingVertical: 10,
          height: 44,
          marginTop: 0,
          marginBottom: 0,
        },
        listView: {
          backgroundColor: theme.card,
          borderRadius: 8,
          marginTop: 4,
          borderWidth: 1,
          borderColor: theme.border,
        },
        row: {
          backgroundColor: theme.card,
          paddingVertical: 12,
          paddingHorizontal: 14,
        },
        separator: {
          height: 1,
          backgroundColor: theme.border,
        },
        description: {
          color: theme.text,
          fontSize: 14,
        },
        predefinedPlacesDescription: {
          color: theme.primary,
        },
        poweredContainer: {
          display: "none",
        },
      }}
      textInputProps={{
        placeholderTextColor: theme.textSecondary,
        autoCorrect: false,
        autoCapitalize: "none",
      }}
    />
  );
}
