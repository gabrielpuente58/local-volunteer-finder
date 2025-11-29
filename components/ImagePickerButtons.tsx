import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  onImageSelected: (uri: string) => void;
  onClose?: () => void;
};

export default function ImagePickerButtons({
  onImageSelected,
  onClose,
}: Props) {
  const { theme } = useTheme();

  const chooseFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
      onClose?.();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("We need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      cameraType: ImagePicker.CameraType.front,
    });
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
      onClose?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={chooseFromLibrary}
        >
          <Feather name="image" size={24} color={theme.textSecondary} />
          <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
            Choose Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={takePhoto}
        >
          <Feather name="camera" size={24} color={theme.textSecondary} />
          <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
            Take Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
