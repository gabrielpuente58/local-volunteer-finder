import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import BottomSheetModal from "../../components/BottomSheetModal";
import ImagePickerButtons from "../../components/ImagePickerButtons";
import InterestPickerModal from "../../components/InterestPickerModal";
import ProfileHeader from "../../components/ProfileHeader";
import SettingsModal from "../../components/SettingsModal";
import ThemedButton from "../../components/ThemedButton";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

let settingsModalTrigger: (() => void) | null = null;

export function openSettingsModal() {
  if (settingsModalTrigger) {
    settingsModalTrigger();
  }
}

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
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [bio, setBio] = useState(
    isAdmin
      ? "I organize volunteer opportunities to help our community thrive!"
      : "I love volunteering in my community!"
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bio);
  const [location, setLocation] = useState("San Francisco, CA");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [memberSince] = useState("January 2024");
  const [interests, setInterests] = useState<string[]>([
    "Environment",
    "Education",
    "Community",
    "Health",
    "Animals",
  ]);
  const [interestPickerVisible, setInterestPickerVisible] = useState(false);

  useEffect(() => {
    settingsModalTrigger = () => setSettingsVisible(true);
    return () => {
      settingsModalTrigger = null;
    };
  }, []);

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

  const handleLocationSelected = (
    address: string,
    coordinates: { latitude: number; longitude: number }
  ) => {
    console.log("handleLocationSelected called with:", address, coordinates);
    setLocation(address);
    setIsEditingLocation(false);
  };

  const handleStartEditingLocation = () => {
    setIsEditingLocation(true);
  };

  const handleSaveInterests = (newInterests: string[]) => {
    setInterests(newInterests);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
    >
      <ProfileHeader
        uri={profileImageUri}
        onPress={isEditMode ? () => setModalVisible(true) : undefined}
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
          {isEditMode && !isEditingBio && (
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

      {/* Location Section */}
      <View style={styles.section}>
        {isEditingLocation ? (
          <View style={styles.locationEditContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Edit Location
              </Text>
              <TouchableOpacity onPress={() => setIsEditingLocation(false)}>
                <Feather name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <AddressAutocomplete
              onPlaceSelected={(address, coordinates) =>
                handleLocationSelected(address, coordinates)
              }
              placeholder="Enter your location..."
              initialValue={location}
            />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={isEditMode ? handleStartEditingLocation : undefined}
              disabled={!isEditMode}
            >
              <Feather name="map-pin" size={20} color={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                {location}
              </Text>
              {isEditMode && (
                <Feather name="edit-2" size={16} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
            <View style={styles.infoRow}>
              <Feather name="calendar" size={20} color={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Member since {memberSince}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {isAdmin ? "Organization Stats" : "Volunteer Stats"}
        </Text>
        <View style={styles.statsContainer}>
          {isAdmin ? (
            // Admin Stats
            <>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  8
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Active Events
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  124
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Volunteers
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  15
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  This Month
                </Text>
              </View>
            </>
          ) : (
            // Volunteer Stats
            <>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  12
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Opportunities
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  48
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  Hours
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  5
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.textSecondary }]}
                >
                  This Month
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Interests Section - Only for Volunteers */}
      {!isAdmin && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Interests
            </Text>
            {isEditMode && (
              <TouchableOpacity onPress={() => setInterestPickerVisible(true)}>
                <Feather name="edit-2" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {interests.length > 0 ? (
            <View style={styles.tagsContainer}>
              {interests.map((interest) => (
                <View
                  key={interest}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.tagText, { color: theme.text }]}>
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.bioText, { color: theme.textSecondary }]}>
              No interests selected. {isEditMode && "Tap edit to add some!"}
            </Text>
          )}
        </View>
      )}

      {/* Achievements Section - Only for Volunteers */}
      {!isAdmin && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Achievements
          </Text>
          <View style={styles.achievementsContainer}>
            <View
              style={[
                styles.achievementCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.achievementIconContainer,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons name="trophy" size={32} color={theme.primary} />
              </View>
              <Text style={[styles.achievementTitle, { color: theme.text }]}>
                First Timer
              </Text>
              <Text
                style={[styles.achievementDesc, { color: theme.textSecondary }]}
              >
                Completed your first opportunity
              </Text>
            </View>
            <View
              style={[
                styles.achievementCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.achievementIconContainer,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons name="star" size={32} color={theme.primary} />
              </View>
              <Text style={[styles.achievementTitle, { color: theme.text }]}>
                Rising Star
              </Text>
              <Text
                style={[styles.achievementDesc, { color: theme.textSecondary }]}
              >
                Volunteered 10 times
              </Text>
            </View>
            <View
              style={[
                styles.achievementCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View
                style={[
                  styles.achievementIconContainer,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-star"
                  size={32}
                  color={theme.primary}
                />
              </View>
              <Text style={[styles.achievementTitle, { color: theme.text }]}>
                Community Hero
              </Text>
              <Text
                style={[styles.achievementDesc, { color: theme.textSecondary }]}
              >
                Reached 50 volunteer hours
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Edit Profile and Admin Toggle Buttons */}
      <View style={styles.section}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <ThemedButton
              label={isEditMode ? "Done Editing" : "Edit Profile"}
              onPress={() => {
                if (isEditMode) {
                  // Exit edit mode and save/cancel any active edits
                  setIsEditingBio(false);
                  setIsEditingLocation(false);
                }
                setIsEditMode(!isEditMode);
              }}
              variant={isEditMode ? "primary" : "secondary"}
            />
          </View>
          <View style={styles.buttonHalf}>
            <ThemedButton
              label={isAdmin ? "Logout as Admin" : "Login as Admin"}
              onPress={() => setIsAdmin(!isAdmin)}
              variant="secondary"
            />
          </View>
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

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <InterestPickerModal
        visible={interestPickerVisible}
        onClose={() => setInterestPickerVisible(false)}
        selectedInterests={interests}
        onSave={handleSaveInterests}
      />
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    flex: 1,
  },
  locationEditContainer: {
    gap: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  achievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  achievementDesc: {
    fontSize: 13,
    flex: 1,
  },
});
