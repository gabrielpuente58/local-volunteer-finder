import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
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
  const [bio, setBio] = useState("I love volunteering in my community!");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);

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

  const handleSaveBio = () => {
    if (tempBio.trim()) {
      setBio(tempBio);
    } else {
      setTempBio(bio);
    }
    setIsEditingBio(false);
  };

  const handleStartEditingBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <ProfileHeader
        uri={profileImageUri}
        onPress={() => setModalVisible(true)}
      />

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

      {/* Bio Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          {!isEditingBio && (
            <TouchableOpacity onPress={handleStartEditingBio}>
              <Feather name="edit-2" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        {isEditingBio ? (
          <View style={styles.bioEditContainer}>
            <TextInput
              value={tempBio}
              onChangeText={setTempBio}
              multiline
              numberOfLines={4}
              maxLength={200}
              style={[
                styles.bioInput,
                {
                  color: theme.text,
                  borderColor: theme.primary,
                  backgroundColor: theme.card,
                },
              ]}
              autoFocus
            />
            <View style={styles.bioActions}>
              <TouchableOpacity
                onPress={() => {
                  setTempBio(bio);
                  setIsEditingBio(false);
                }}
              >
                <Text style={{ color: theme.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveBio}>
                <Text style={{ color: theme.primary, fontWeight: "600" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={[styles.bioText, { color: theme.textSecondary }]}>
            {bio}
          </Text>
        )}
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Volunteer Stats
        </Text>
        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Opportunities
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.primary }]}>48</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Hours
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.primary }]}>5</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              This Month
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Settings
        </Text>
        <View style={styles.settingsContainer}>
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
        </View>
      </View>

      <BottomSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ImagePickerButtons
          onImageSelected={handleImageSelected}
          onClose={() => setModalVisible(false)}
        />
      </BottomSheetModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    padding: 20,
    gap: 20,
    paddingBottom: 40,
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
  section: {
    width: "100%",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bioEditContainer: {
    gap: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: "top",
  },
  bioActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  settingsContainer: {
    gap: 12,
  },
});
