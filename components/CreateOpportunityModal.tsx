import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { INTEREST_CATEGORIES } from "../constants/interests";
import { useTheme } from "../contexts/ThemeContext";
import AddressAutocomplete from "./AddressAutocomplete";
import ImagePickerButtons from "./ImagePickerButtons";

type FormData = {
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  coordinates?: { latitude: number; longitude: number };
  categories: string[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
};

export default function CreateOpportunityModal({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    location: "",
    peopleNeeded: "",
    dateTime: "",
    imageUri: null,
    categories: [],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.location || !formData.dateTime) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
    // Reset form
    setFormData({
      name: "",
      description: "",
      location: "",
      peopleNeeded: "",
      dateTime: "",
      imageUri: null,
      categories: [],
    });
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      name: "",
      description: "",
      location: "",
      peopleNeeded: "",
      dateTime: "",
      imageUri: null,
      categories: [],
    });
  };

  const handleLocationSelected = (
    address: string,
    coordinates: { latitude: number; longitude: number }
  ) => {
    setFormData({ ...formData, location: address, coordinates });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setShowTimePicker(true); // Show time picker after date is selected
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      const finalDate = new Date(selectedDate);
      finalDate.setHours(date.getHours());
      finalDate.setMinutes(date.getMinutes());
      setSelectedDate(finalDate);

      // Format the date nicely
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

  const handleImageSelected = (uri: string) => {
    setFormData({ ...formData, imageUri: uri });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
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
              onPress={handleCancel}
              style={styles.headerButton}
            >
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Create Opportunity
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.headerButton}
            >
              <Text style={[styles.createText, { color: theme.primary }]}>
                Create
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
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
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
                      color: formData.dateTime
                        ? theme.text
                        : theme.textSecondary,
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
                          borderColor: isSelected
                            ? theme.primary
                            : theme.border,
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
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, imageUri: null })}
                  >
                    <Text
                      style={[styles.changeImageText, { color: theme.text }]}
                    >
                      Change Image
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ImagePickerButtons onImageSelected={handleImageSelected} />
              )}
            </View>
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
  createText: {
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
    marginTop: -4,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
