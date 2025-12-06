import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import ProfileImage from "./ProfileImage";

type Props = {
  uri?: string | null;
  title?: string;
  onPress?: () => void;
};

export default function ProfileHeader({
  uri: propUri,
  title = "Profile Picture",
  onPress,
}: Props) {
  const { theme } = useTheme();
  const { profileImageUri } = useUser();

  const uri = propUri !== undefined ? propUri : profileImageUri;

  return (
    <View style={styles.container}>
      {onPress ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ProfileImage uri={uri} />
        </TouchableOpacity>
      ) : (
        <ProfileImage uri={uri} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
