import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import AddressAutocomplete from "./AddressAutocomplete";
import ThemedButton from "./ThemedButton";

type FormData = {
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

type Props = {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function OpportunityForm({
  formData,
  onFormDataChange,
  onCancel,
  onSubmit,
}: Props) {
  const { theme } = useTheme();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      onFormDataChange({
        ...formData,
        imageUri: result.assets[0].uri,
      });
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const existingTime = formData.dateTime.split(" at ")[1] || "";
      const newDateTime = existingTime
        ? `${formattedDate} at ${existingTime}`
        : formattedDate;
      onFormDataChange({ ...formData, dateTime: newDateTime });
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

      const existingDate =
        formData.dateTime.split(" at ")[0] ||
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      const newDateTime = `${existingDate} at ${formattedTime}`;
      onFormDataChange({ ...formData, dateTime: newDateTime });
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Create Volunteer Opportunity
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Fill out the details below
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => onFormDataChange({ ...formData, name: text })}
          placeholder="e.g., Community Garden Cleanup"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Description *</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) =>
            onFormDataChange({ ...formData, description: text })
          }
          placeholder="Describe the volunteer opportunity..."
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Location *</Text>
        <AddressAutocomplete
          onPlaceSelected={(address, coordinates) => {
            onFormDataChange({
              ...formData,
              location: address,
              coordinates: coordinates,
            });
          }}
          onTextChange={(text) => {
            // Update location text but clear coordinates since it's manual entry
            onFormDataChange({
              ...formData,
              location: text,
              coordinates: undefined, // Clear coordinates for manual entry
            });
          }}
          placeholder="Type an address..."
          initialValue={formData.location}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>
          Number of People Needed *
        </Text>
        <TextInput
          value={formData.peopleNeeded}
          onChangeText={(text) =>
            onFormDataChange({ ...formData, peopleNeeded: text })
          }
          placeholder="e.g., 10"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Date & Time *</Text>

        <View style={styles.dateTimeButtons}>
          <View style={styles.buttonWrapper}>
            <ThemedButton
              label="Set Date"
              onPress={() => setShowDatePicker(true)}
              variant="secondary"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <ThemedButton
              label="Set Time"
              onPress={() => setShowTimePicker(true)}
              variant="secondary"
            />
          </View>
        </View>

        {formData.dateTime ? (
          <View
            style={[
              styles.dateTimeDisplay,
              {
                backgroundColor: theme.card,
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.dateTimeRow}>
              <Ionicons
                name="calendar"
                size={20}
                color={theme.primary}
                style={styles.dateTimeIcon}
              />
              <Text style={[styles.dateTimeText, { color: theme.text }]}>
                {formData.dateTime}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.dateTimePlaceholder,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[styles.placeholderText, { color: theme.textSecondary }]}
            >
              No date/time selected
            </Text>
          </View>
        )}

        {(showDatePicker || showTimePicker) && (
          <View style={styles.pickerContainer}>
            {showDatePicker && (
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              </View>
            )}

            {showTimePicker && (
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Image</Text>
        {formData.imageUri ? (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: formData.imageUri }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={[
                styles.changeImageButton,
                { backgroundColor: theme.primary },
              ]}
              onPress={handleImagePick}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.imagePicker,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={handleImagePick}
          >
            <Ionicons
              name="camera"
              size={32}
              color={theme.textSecondary}
              style={styles.cameraIcon}
            />
            <Text
              style={[styles.imagePickerText, { color: theme.textSecondary }]}
            >
              Tap to add image
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <View style={styles.buttonWrapper}>
          <ThemedButton label="Cancel" onPress={onCancel} variant="secondary" />
        </View>
        <View style={styles.buttonWrapper}>
          <ThemedButton label="Create" onPress={onSubmit} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  imagePicker: {
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    fontSize: 16,
  },
  imagePreview: {
    gap: 8,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  changeImageButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  changeImageText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    minWidth: 0,
  },
  dateTimeDisplay: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeIcon: {
    marginRight: 8,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  dateTimePlaceholder: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  dateTimeButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  pickerWrapper: {
    flex: 1,
  },
  cameraIcon: {
    marginBottom: 8,
  },
});
