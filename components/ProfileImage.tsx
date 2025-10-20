import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const AVATAR_SIZE = 200;

type Props = {
  uri: string | null;
  size?: number;
};

export default function ProfileImage({ uri, size = AVATAR_SIZE }: Props) {
  const { theme } = useTheme();

  const dynamicStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dynamicStyles]} />;
  }

  return (
    <View
      style={[
        styles.image,
        styles.placeholder,
        dynamicStyles,
        { backgroundColor: theme.placeholder },
      ]}
    >
      <FontAwesome
        name="user"
        size={size * 0.45}
        color={theme.placeholderIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginTop: 12,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
