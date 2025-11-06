import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import OpportunityForm from "./OpportunityForm";

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

export default function OpportunityFormView({
  formData,
  onFormDataChange,
  onCancel,
  onSubmit,
}: Props) {
  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContainer}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <OpportunityForm
          formData={formData}
          onFormDataChange={onFormDataChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});
