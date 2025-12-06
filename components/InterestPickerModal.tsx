import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { INTEREST_CATEGORIES } from "../constants/interests";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedInterests: string[];
  onSave: (interests: string[]) => void;
};

export default function InterestPickerModal({
  visible,
  onClose,
  selectedInterests,
  onSave,
}: Props) {
  const { theme } = useTheme();
  const [localInterests, setLocalInterests] =
    useState<string[]>(selectedInterests);
  const [customInterest, setCustomInterest] = useState("");

  const toggleInterest = (interest: string) => {
    if (localInterests.includes(interest)) {
      setLocalInterests(localInterests.filter((i) => i !== interest));
    } else {
      setLocalInterests([...localInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !localInterests.includes(trimmed)) {
      setLocalInterests([...localInterests, trimmed]);
      setCustomInterest("");
    }
  };

  const handleSave = () => {
    onSave(localInterests);
    onClose();
  };

  const handleCancel = () => {
    setLocalInterests(selectedInterests);
    setCustomInterest("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.card, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: theme.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Edit Interests
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text
              style={[
                styles.headerButtonText,
                { color: theme.primary, fontWeight: "600" },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Custom Interest Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Add Custom Interest
            </Text>
            <View style={styles.customInputContainer}>
              <TextInput
                value={customInterest}
                onChangeText={setCustomInterest}
                placeholder="Type your interest..."
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.customInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
                onSubmitEditing={addCustomInterest}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={addCustomInterest}
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                disabled={!customInterest.trim()}
              >
                <Feather name="plus" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Selected Interests */}
          {localInterests.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Selected ({localInterests.length})
              </Text>
              <View style={styles.interestsGrid}>
                {localInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      styles.selectedChip,
                      {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.interestChipText, { color: "#FFFFFF" }]}
                    >
                      {interest}
                    </Text>
                    <Feather name="x" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Available Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Choose from Categories
            </Text>
            <View style={styles.interestsGrid}>
              {INTEREST_CATEGORIES.filter(
                (category) => !localInterests.includes(category)
              ).map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.interestChipText, { color: theme.text }]}
                  >
                    {interest}
                  </Text>
                  <Feather name="plus" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  customInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedChip: {
    borderWidth: 0,
  },
  interestChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
