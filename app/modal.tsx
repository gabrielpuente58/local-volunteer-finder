import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../components/Button";
import { useProfileImage } from "../store/profileImageStore";

export default function Modal() {
  const router = useRouter();
  const { setUri } = useProfileImage();

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
      setUri(result.assets[0].uri);
      router.back();
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
      setUri(result.assets[0].uri);
      router.back();
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <Button label="Close" onPress={() => router.back()} />
        <Button label="Choose from camera roll" onPress={chooseFromLibrary} />
        <Button label="Take photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "40%",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
});
