import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useTheme } from "../../contexts/ThemeContext";
import { Opportunity, useOpportunities } from "../../hooks/useOpportunities";

export default function ManageVolunteers() {
  const { theme } = useTheme();
  const { opportunities, loading, loadOpportunities } = useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  // Reload opportunities when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOpportunities(true);
    }, [loadOpportunities])
  );

  if (loading) {
    return <LoadingIndicator message="Loading volunteers..." />;
  }

  const handleOpportunityPress = (opportunity: Opportunity) => {
    // Navigate to edit page with opportunity ID
    router.push(`/editOpportunity?opportunityId=${opportunity.id}`);
  };

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Manage Volunteers
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {opportunities.length}{" "}
          {opportunities.length === 1 ? "opportunity" : "opportunities"}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <TouchableOpacity
              key={opportunity.id}
              style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => handleOpportunityPress(opportunity)}
              activeOpacity={0.7}
            >
              {opportunity.imageUri && (
                <Image
                  source={{ uri: opportunity.imageUri }}
                  style={styles.image}
                />
              )}

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.opportunityName, { color: theme.text }]}>
                    {opportunity.name}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={24}
                    color={theme.textSecondary}
                  />
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[styles.infoText, { color: theme.textSecondary }]}
                  >
                    {opportunity.location}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar"
                    size={16}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[styles.infoText, { color: theme.textSecondary }]}
                  >
                    {opportunity.dateTime}
                  </Text>
                </View>

                <View style={styles.statsRow}>
                  <View
                    style={[
                      styles.statBadge,
                      { backgroundColor: theme.primary + "20" },
                    ]}
                  >
                    <Ionicons name="people" size={16} color={theme.primary} />
                    <Text style={[styles.statText, { color: theme.primary }]}>
                      {opportunity.volunteersSignedUp || 0} /{" "}
                      {opportunity.peopleNeeded} volunteers
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather
              name="clipboard"
              size={80}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No Opportunities Yet
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              Create volunteer opportunities to manage them here
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              onPress={() => router.push("/(tabs)")}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Opportunity</Text>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  opportunityName: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
