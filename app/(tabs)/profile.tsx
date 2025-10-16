import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetModal from "../../components/BottomSheetModal";
import Button from "../../components/Button";
import ImagePickerButtons from "../../components/ImagePickerButtons";
import ProfileImage from "../../components/ProfileImage";

const PROFILE_IMAGE_KEY = "profileImageUri";

export default function Profile() {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedUri = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (storedUri) {
          setUri(storedUri);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, []);

  useEffect(() => {
    const saveImage = async () => {
      try {
        if (uri === null) {
          await AsyncStorage.removeItem(PROFILE_IMAGE_KEY);
        } else {
          await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
        }
      } catch (error) {
        console.error("Error saving profile image:", error);
      }
    };
    if (!loading) {
      saveImage();
    }
  }, [uri, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleImageSelected = (newUri: string) => {
    setUri(newUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture</Text>
      <ProfileImage uri={uri} />
      <Button
        label="Edit Picture"
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [
          {
            marginTop: 30,
            marginBottom: 10,
            backgroundColor: pressed ? "#005BBB" : "#007AFF",
            padding: 10,
            borderRadius: 5,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        textStyle={{ color: "white", fontWeight: "600", textAlign: "center" }}
      />
      <BottomSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ImagePickerButtons
          onImageSelected={handleImageSelected}
          onClose={() => setModalVisible(false)}
        />
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
});
