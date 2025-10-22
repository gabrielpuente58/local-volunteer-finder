import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import ProfileImage from "./ProfileImage";

type Props = {
  uri?: string | null;
  title?: string;
};

export default function ProfileHeader({
  uri: propUri,
  title = "Profile Picture",
}: Props) {
  const { theme } = useTheme();
  const { profileImageUri } = useUser();

  const uri = propUri !== undefined ? propUri : profileImageUri;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <ProfileImage uri={uri} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
});
