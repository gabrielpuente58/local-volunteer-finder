import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheetModal from "../../components/BottomSheetModal";
import ImagePickerButtons from "../../components/ImagePickerButtons";
import ProfileHeader from "../../components/ProfileHeader";
import ThemedButton from "../../components/ThemedButton";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

export default function Profile() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    username,
    setUsername,
    profileImageUri,
    setProfileImageUri,
    isAdmin,
    setIsAdmin,
    loading,
  } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const handleImageSelected = (newUri: string) => {
    setProfileImageUri(newUri);
  };

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername);
    } else {
      setTempUsername(username);
    }
    setIsEditingUsername(false);
  };

  const handleStartEditing = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProfileHeader uri={profileImageUri} />

      {/* Username Display/Edit */}
      {isEditingUsername ? (
        <View style={styles.usernameContainer}>
          <TextInput
            value={tempUsername}
            onChangeText={setTempUsername}
            onBlur={handleSaveUsername}
            onSubmitEditing={handleSaveUsername}
            autoFocus
            returnKeyType="done"
            style={[
              styles.usernameInput,
              {
                color: theme.text,
                borderColor: theme.primary,
              },
            ]}
          />
          <TouchableOpacity onPress={handleSaveUsername}>
            <Feather name="check" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.usernameContainer}
          onPress={handleStartEditing}
        >
          <Text style={[styles.username, { color: theme.text }]}>
            {username}
          </Text>
          <Feather name="edit-2" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      )}

      <ThemedButton
        label="Edit Picture"
        onPress={() => setModalVisible(true)}
      />

      <ThemedButton
        label={isAdmin ? "Logout as Admin" : "Login as Admin"}
        onPress={() => setIsAdmin(!isAdmin)}
        variant="secondary"
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
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
  },
  usernameInput: {
    fontSize: 24,
    fontWeight: "700",
    borderBottomWidth: 2,
    paddingBottom: 4,
    minWidth: 200,
  },
});
