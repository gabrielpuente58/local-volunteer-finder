import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetModal from "../../components/BottomSheetModal";
import ImagePickerButtons from "../../components/ImagePickerButtons";
import ProfileHeader from "../../components/ProfileHeader";
import ThemedButton from "../../components/ThemedButton";
import { useTheme } from "../../contexts/ThemeContext";

const PROFILE_IMAGE_KEY = "profileImageUri";

export default function Profile() {
  const { theme, toggleTheme, isDark } = useTheme();
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
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const handleImageSelected = (newUri: string) => {
    setUri(newUri);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProfileHeader uri={uri} />

      <ThemedButton
        label="Edit Picture"
        onPress={() => setModalVisible(true)}
      />

      <ThemedButton
        label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        onPress={toggleTheme}
        variant="secondary"
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
    gap: 12,
  },
});
