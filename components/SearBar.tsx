import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
};

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search",
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Feather name="search" size={18} color="#777" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9a9a9a"
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={10}>
          <Feather name="x" size={18} color="#777" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 250,
    maxWidth: 340,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 6,
  },
});
