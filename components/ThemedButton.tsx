import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export default function ThemedButton({
  label,
  onPress,
  variant = "primary",
}: Props) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary"
          ? {
              backgroundColor: pressed ? theme.primaryPressed : theme.primary,
            }
          : {
              backgroundColor: pressed ? theme.surface : theme.card,
              borderWidth: 1,
              borderColor: theme.border,
            },
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variant === "primary" ? "#FFFFFF" : theme.text,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
