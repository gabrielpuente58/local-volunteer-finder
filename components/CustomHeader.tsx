import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import ProfileImage from "./ProfileImage";

type Props = {
  rightComponent?: ReactNode;
};

export default function CustomHeader({ rightComponent }: Props) {
  const { theme } = useTheme();
  const { username, profileImageUri } = useUser();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {/* Left side: Profile image and username */}
      <View style={styles.leftSection}>
        <ProfileImage uri={profileImageUri} size={40} />
        <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
      </View>

      {/* Right side: Custom component */}
      {rightComponent && (
        <View style={styles.rightSection}>{rightComponent}</View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 40,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  username: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  rightSection: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
