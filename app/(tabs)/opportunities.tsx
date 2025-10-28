import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OpportunityCard from "../../components/OpportunityCard";
import OpportunityForm from "../../components/OpportunityForm";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const OPPORTUNITIES_KEY = "volunteer_opportunities";

// Global reference to modal controls
let globalOpenModal: (() => void) | null = null;

export const openOpportunityModal = () => {
  if (globalOpenModal) {
    globalOpenModal();
  }
};

type Opportunity = {
  id: string;
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  volunteersSignedUp: number;
};

export default function Opportunities() {
  const { theme } = useTheme();
  const { isAdmin } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    location: string;
    peopleNeeded: string;
    dateTime: string;
    imageUri: string | null;
    coordinates?: { latitude: number; longitude: number };
  }>({
    name: "",
    description: "",
    location: "",
    peopleNeeded: "",
    dateTime: "",
    imageUri: null,
  });

  const openModal = () => setModalVisible(true);

  // Load opportunities from AsyncStorage on mount
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const stored = await AsyncStorage.getItem(OPPORTUNITIES_KEY);
        if (stored) {
          setOpportunities(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOpportunities();
  }, []);

  // Save opportunities to AsyncStorage whenever they change
  useEffect(() => {
    const saveOpportunities = async () => {
      try {
        await AsyncStorage.setItem(
          OPPORTUNITIES_KEY,
          JSON.stringify(opportunities)
        );
      } catch (error) {
        console.error("Error saving opportunities:", error);
      }
    };
    if (!loading) {
      saveOpportunities();
    }
  }, [opportunities, loading]);

  // Expose openModal globally
  useEffect(() => {
    globalOpenModal = openModal;
    return () => {
      globalOpenModal = null;
    };
  }, []);

  const handleSubmit = () => {
    // Create new opportunity
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      location: formData.location,
      peopleNeeded: formData.peopleNeeded,
      dateTime: formData.dateTime,
      imageUri: formData.imageUri,
      volunteersSignedUp: 0,
    };

    // Add to list
    setOpportunities([newOpportunity, ...opportunities]);

    setModalVisible(false);
    // Reset form
    setFormData({
      name: "",
      description: "",
      location: "",
      peopleNeeded: "",
      dateTime: "",
      imageUri: null,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      peopleNeeded: "",
      dateTime: "",
      imageUri: null,
    });
  };

  if (isAdmin) {
    // Admin User
    if (modalVisible) {
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
              onFormDataChange={setFormData}
              onCancel={() => {
                setModalVisible(false);
                resetForm();
              }}
              onSubmit={handleSubmit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    return (
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Manage Volunteer Opportunities
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            View and manage all opportunities
          </Text>
        </View>

        {opportunities.length === 0 ? (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text
              style={[
                styles.cardText,
                { color: theme.textSecondary, textAlign: "center" },
              ]}
            >
              No opportunities. Tap the + button to create one!
            </Text>
          </View>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              name={opportunity.name}
              description={opportunity.description}
              location={opportunity.location}
              peopleNeeded={opportunity.peopleNeeded}
              dateTime={opportunity.dateTime}
              imageUri={opportunity.imageUri}
              volunteersSignedUp={opportunity.volunteersSignedUp}
              isAdmin={true}
            />
          ))
        )}
      </ScrollView>
    );
  }

  // Normal User
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Volunteer Opportunities
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Find ways to make a difference
        </Text>
      </View>

      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          name={opportunity.name}
          description={opportunity.description}
          location={opportunity.location}
          peopleNeeded={opportunity.peopleNeeded}
          dateTime={opportunity.dateTime}
          imageUri={opportunity.imageUri}
          volunteersSignedUp={opportunity.volunteersSignedUp}
          isAdmin={false}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
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
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
