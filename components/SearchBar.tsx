import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.searchBackground,
          shadowColor: theme.shadow,
        },
        containerStyle,
      ]}
    >
      <Feather name="search" size={18} color={theme.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.searchPlaceholder}
        style={[styles.input, { color: theme.searchText }]}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={10}>
          <Feather name="x" size={18} color={theme.searchIcon} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 250,
    maxWidth: 340,
    marginVertical: 8,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 6,
  },
});
