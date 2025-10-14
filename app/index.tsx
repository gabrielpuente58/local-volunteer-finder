import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import SearchBar from "../components/SearBar";

export default function Index() {
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerTitleAlign: "left",

          headerTitle: () => (
            <SearchBar
              value={query}
              onChangeText={setQuery}
              containerStyle={{ flex: 1 }}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});
