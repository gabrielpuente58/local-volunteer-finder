import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import { Opportunity, useOpportunities } from "../hooks/useOpportunities";

type Props = {
  visible: boolean;
  opportunity: Opportunity | null;
  onClose: () => void;
  onUpdate?: () => void;
};

export default function OpportunityDetailModal({
  visible,
  opportunity,
  onClose,
  onUpdate,
}: Props) {
  const { theme } = useTheme();
  const {
    signedUpOpportunityIds,
    signUpForOpportunity,
    leaveOpportunity,
    isAdmin,
  } = useUser();
  const { updateOpportunity, opportunities } = useOpportunities();

  // Get fresh opportunity data from the opportunities array
  const currentOpportunity = opportunity
    ? opportunities.find((opp) => opp.id === opportunity.id) || opportunity
    : null;

  if (!currentOpportunity) return null;

  const isSignedUp = signedUpOpportunityIds.includes(currentOpportunity.id);

  const handleSignUp = async () => {
    console.log("Signing up for opportunity:", currentOpportunity.id);
    console.log("Current count:", currentOpportunity.volunteersSignedUp);
    await signUpForOpportunity(currentOpportunity.id);
    // Increment the volunteer count
    await updateOpportunity(currentOpportunity.id, {
      volunteersSignedUp: (currentOpportunity.volunteersSignedUp || 0) + 1,
    });
    console.log(
      "Updated count to:",
      (currentOpportunity.volunteersSignedUp || 0) + 1
    );
    onUpdate?.();
    onClose();
  };

  const handleLeave = async () => {
    await leaveOpportunity(currentOpportunity.id);
    // Decrement the volunteer count
    await updateOpportunity(currentOpportunity.id, {
      volunteersSignedUp: Math.max(
        (currentOpportunity.volunteersSignedUp || 0) - 1,
        0
      ),
    });
    onUpdate?.();
    onClose();
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
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Event Details
          </Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Image */}
          {currentOpportunity.imageUri && (
            <Image
              source={{ uri: currentOpportunity.imageUri }}
              style={styles.image}
            />
          )}

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            {currentOpportunity.name}
          </Text>

          {/* Description */}
          {currentOpportunity.description && (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {currentOpportunity.description}
            </Text>
          )}

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {currentOpportunity.dateTime}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location" size={20} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {currentOpportunity.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={20} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.text }]}>
                {currentOpportunity.volunteersSignedUp || 0} /{" "}
                {currentOpportunity.peopleNeeded} volunteers
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Button - Only show for non-admin users */}
        {!isAdmin && (
          <View
            style={[
              styles.footer,
              { backgroundColor: theme.card, borderTopColor: theme.border },
            ]}
          >
            {isSignedUp ? (
              <TouchableOpacity
                style={[styles.button, styles.leaveButton]}
                onPress={handleLeave}
              >
                <Feather name="x" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Leave Event</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleSignUp}
              >
                <Feather name="check" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  leaveButton: {
    backgroundColor: "#FF4444",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
