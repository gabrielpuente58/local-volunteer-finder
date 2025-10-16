import * as ImagePicker from "expo-image-picker";
import React from "react";
import { View } from "react-native";
import Button from "./Button";

type Props = {
  onImageSelected: (uri: string) => void;
  onClose?: () => void;
};

export default function ImagePickerButtons({
  onImageSelected,
  onClose,
}: Props) {
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
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      onImageSelected(result.assets[0].uri);
      onClose?.();
    }
  };

  return (
    <View style={{ gap: 30, alignItems: "center" }}>
      {onClose && <Button label="Close" onPress={onClose} />}
      <Button label="Choose from camera roll" onPress={chooseFromLibrary} />
      <Button label="Take photo" onPress={takePhoto} />
    </View>
  );
}
