import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const AVATAR_SIZE = 200;

type Props = {
  uri: string | null;
  size?: number;
};

export default function ProfileImage({ uri, size = AVATAR_SIZE }: Props) {
  const dynamicStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dynamicStyles]} />;
  }

  return (
    <View style={[styles.image, styles.placeholder, dynamicStyles]}>
      <FontAwesome name="user" size={size * 0.45} color="#ccc" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginTop: 12,
  },
  placeholder: {
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
