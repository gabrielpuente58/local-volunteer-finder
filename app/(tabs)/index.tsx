import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import { useTheme } from "../../contexts/ThemeContext";

export default function Index() {
  const [query, setQuery] = React.useState("");
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={isDark ? "dark" : "light"}
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
