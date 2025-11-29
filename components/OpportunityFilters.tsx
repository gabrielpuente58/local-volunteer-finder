import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { INTEREST_CATEGORIES } from "../constants/interests";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedCategories: string[];
  maxDistance: number;
  onApplyFilters: (categories: string[], distance: number) => void;
};

export default function OpportunityFilters({
  visible,
  onClose,
  selectedCategories,
  maxDistance,
  onApplyFilters,
}: Props) {
  const { theme } = useTheme();
  const [localCategories, setLocalCategories] =
    useState<string[]>(selectedCategories);
  const [localDistance, setLocalDistance] = useState(maxDistance);

  const toggleCategory = (category: string) => {
    if (localCategories.includes(category)) {
      setLocalCategories(localCategories.filter((c) => c !== category));
    } else {
      setLocalCategories([...localCategories, category]);
    }
  };

  const handleApply = () => {
    onApplyFilters(localCategories, localDistance);
    onClose();
  };

  const handleReset = () => {
    setLocalCategories([]);
    setLocalDistance(50);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.card, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Filters
          </Text>
          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <Text style={[styles.resetText, { color: theme.primary }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Distance Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Distance
            </Text>
            <View style={styles.distanceContainer}>
              <Text style={[styles.distanceText, { color: theme.text }]}>
                Within {localDistance} miles
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={localDistance}
                onValueChange={setLocalDistance}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.primary}
                step={1}
              />
              <View style={styles.distanceLabels}>
                <Text
                  style={[styles.distanceLabel, { color: theme.textSecondary }]}
                >
                  1 mi
                </Text>
                <Text
                  style={[styles.distanceLabel, { color: theme.textSecondary }]}
                >
                  100 mi
                </Text>
              </View>
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Categories
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
            >
              {localCategories.length > 0
                ? `${localCategories.length} selected`
                : "Select categories to filter"}
            </Text>
            <View style={styles.categoriesGrid}>
              {INTEREST_CATEGORIES.map((category) => {
                const isSelected = localCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    style={[
                      styles.categoryChip,
                      isSelected
                        ? {
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                          }
                        : {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                          },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? "#FFFFFF" : theme.text },
                      ]}
                    >
                      {category}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  resetText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  distanceContainer: {
    paddingVertical: 8,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  distanceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  distanceLabel: {
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
