import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddressAutocomplete from "../components/AddressAutocomplete";
import ImagePickerButtons from "../components/ImagePickerButtons";
import LoadingIndicator from "../components/LoadingIndicator";
import { INTEREST_CATEGORIES } from "../constants/interests";
import { useTheme } from "../contexts/ThemeContext";
import { Opportunity, useOpportunities } from "../hooks/useOpportunities";
import { geocodeAddress } from "../utils/geocoding";

export default function EditOpportunity() {
  const { theme } = useTheme();
  const { opportunityId } = useLocalSearchParams<{ opportunityId: string }>();
  const {
    opportunities,
    updateOpportunity,
    deleteOpportunity,
    loadOpportunities,
  } = useOpportunities();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    peopleNeeded: "",
    dateTime: "",
    imageUri: null as string | null,
    coordinates: undefined as
      | { latitude: number; longitude: number }
      | undefined,
    categories: [] as string[],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const opp = opportunities.find((o) => o.id === opportunityId);
    if (opp) {
      setOpportunity(opp);
      setFormData({
        name: opp.name,
        description: opp.description,
        location: opp.location,
        peopleNeeded: opp.peopleNeeded,
        dateTime: opp.dateTime,
        imageUri: opp.imageUri,
        coordinates: opp.coordinates,
        categories: opp.categories || [],
      });
    } else if (opportunities.length > 0) {
      // Opportunity not found (likely deleted), go back
      router.back();
    }
  }, [opportunityId, opportunities]);

  const handleSave = async () => {
    if (!opportunity) return;

    if (!formData.name || !formData.location || !formData.dateTime) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    let coordinates = formData.coordinates;
    if (formData.location && !coordinates) {
      const geocodedCoords = await geocodeAddress(formData.location);
      if (geocodedCoords) {
        coordinates = geocodedCoords;
      }
    }

    await updateOpportunity(opportunity.id, {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      peopleNeeded: formData.peopleNeeded,
      dateTime: formData.dateTime,
      imageUri: formData.imageUri,
      coordinates: coordinates,
      categories: formData.categories,
    });

    router.back();
  };

  const handleDelete = () => {
    if (!opportunity) return;

    Alert.alert(
      "Delete Opportunity",
      "Are you sure you want to delete this opportunity? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteOpportunity(opportunity.id);
            router.replace("/(tabs)/manageVolunteers");
          },
        },
      ]
    );
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      const finalDate = new Date(selectedDate);
      finalDate.setHours(date.getHours());
      finalDate.setMinutes(date.getMinutes());
      setSelectedDate(finalDate);

      const formatted = finalDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setFormData({ ...formData, dateTime: formatted });
    }
  };

  const handleLocationSelected = (
    address: string,
    coordinates: { latitude: number; longitude: number }
  ) => {
    setFormData({ ...formData, location: address, coordinates });
  };

  const handleImageSelected = (uri: string) => {
    setFormData({ ...formData, imageUri: uri });
  };

  if (!opportunity) {
    return <LoadingIndicator message="Loading opportunity..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.card, borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Edit Opportunity
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={[styles.saveText, { color: theme.primary }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Event Name */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Event Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Enter event name"
              placeholderTextColor={theme.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Enter description"
              placeholderTextColor={theme.textSecondary}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            <AddressAutocomplete
              onPlaceSelected={handleLocationSelected}
              placeholder="Enter location"
              initialValue={formData.location}
            />
          </View>

          {/* Date & Time */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Date & Time <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  justifyContent: "center",
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={[
                  styles.dateTimeText,
                  {
                    color: formData.dateTime ? theme.text : theme.textSecondary,
                  },
                ]}
              >
                {formData.dateTime || "Select date and time"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Volunteers Needed */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Volunteers Needed
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., 20"
              placeholderTextColor={theme.textSecondary}
              value={formData.peopleNeeded}
              onChangeText={(text) =>
                setFormData({ ...formData, peopleNeeded: text })
              }
              keyboardType="number-pad"
            />
          </View>

          {/* Categories */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Categories
            </Text>
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Select all that apply
            </Text>
            <View style={styles.categoriesContainer}>
              {INTEREST_CATEGORIES.map((category) => {
                const isSelected = formData.categories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isSelected
                          ? theme.primary
                          : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          categories: formData.categories.filter(
                            (c) => c !== category
                          ),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          categories: [...formData.categories, category],
                        });
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color: isSelected ? "#FFFFFF" : theme.text,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Image Upload */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>
              Event Image
            </Text>
            {formData.imageUri ? (
              <View>
                <Image
                  source={{ uri: formData.imageUri }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={[
                    styles.changeImageButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setFormData({ ...formData, imageUri: null })}
                >
                  <Text style={[styles.changeImageText, { color: theme.text }]}>
                    Change Image
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ImagePickerButtons onImageSelected={handleImageSelected} />
            )}
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.deleteButton, { borderColor: "#FF4444" }]}
            onPress={handleDelete}
          >
            <Feather name="trash-2" size={20} color="#FF4444" />
            <Text style={styles.deleteText}>Delete Opportunity</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </KeyboardAvoidingView>
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
    minWidth: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  required: {
    color: "#FF4444",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  changeImageText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dateTimeText: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 16,
  },
  deleteText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
