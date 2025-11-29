import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import { useTheme } from "../contexts/ThemeContext";
import { Opportunity, useOpportunities } from "../hooks/useOpportunities";

export default function MyOpportunities() {
  const { theme } = useTheme();
  const { opportunities, loading } = useOpportunities();
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Filter opportunities where the current user is signed up
    // For now, we'll show all opportunities as a placeholder
    // In a real app, you'd check if userName is in the volunteers list
    setMyOpportunities(opportunities);
  }, [opportunities]);

  if (loading) {
    return <LoadingIndicator message="Loading your opportunities..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Opportunities
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {myOpportunities.length > 0 ? (
          myOpportunities.map((opportunity) => (
            <View
              key={opportunity.id}
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.opportunityName, { color: theme.text }]}>
                  {opportunity.name}
                </Text>
                <TouchableOpacity
                  style={[styles.removeButton, { borderColor: theme.border }]}
                  onPress={() => {
                    // TODO: Implement remove functionality
                    console.log("Remove from", opportunity.name);
                  }}
                >
                  <Feather name="x" size={16} color="#FF4444" />
                  <Text style={[styles.removeText, { color: "#FF4444" }]}>
                    Leave
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <Feather name="map-pin" size={16} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  {opportunity.location}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Feather
                  name="calendar"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  {opportunity.dateTime}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="users" size={16} color={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  {opportunity.volunteersSignedUp || 0} /{" "}
                  {opportunity.peopleNeeded} volunteers
                </Text>
              </View>

              {opportunity.description && (
                <Text
                  style={[styles.description, { color: theme.textSecondary }]}
                  numberOfLines={2}
                >
                  {opportunity.description}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.detailsButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => {
                  // TODO: Navigate to opportunity detail page
                  console.log("View details for", opportunity.name);
                }}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No Opportunities Yet
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              Sign up for opportunities to see them here
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { backgroundColor: theme.primary }]}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.browseButtonText}>Browse Opportunities</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  opportunityName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  removeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  detailsButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
