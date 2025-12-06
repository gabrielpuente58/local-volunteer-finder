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
import LoadingIndicator from "../../components/LoadingIndicator";
import OpportunityCard from "../../components/OpportunityCard";
import OpportunityDetailModal from "../../components/OpportunityDetailModal";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Opportunity, useOpportunities } from "../../hooks/useOpportunities";

export default function MyOpportunities() {
  const { theme } = useTheme();
  const { signedUpOpportunityIds } = useUser();
  const { opportunities, loading, loadOpportunities } = useOpportunities();
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  useEffect(() => {
    // Filter opportunities where the current user is signed up
    const signedUp = opportunities.filter((opp) =>
      signedUpOpportunityIds.includes(opp.id)
    );
    setMyOpportunities(signedUp);
  }, [opportunities, signedUpOpportunityIds]);

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Events
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {myOpportunities.length}{" "}
          {myOpportunities.length === 1 ? "event" : "events"} signed up
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {myOpportunities.length > 0 ? (
          myOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isAdmin={false}
              onPress={() => {
                setSelectedOpportunity(opportunity);
                setDetailModalVisible(true);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather
              name="calendar"
              size={80}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No Events Yet
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              Sign up for volunteer opportunities to see them here
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

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        visible={detailModalVisible}
        opportunity={selectedOpportunity}
        onClose={() => setDetailModalVisible(false)}
        onUpdate={() => loadOpportunities(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  opportunityName: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#FFF5F5",
  },
  removeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 2,
  },
  infoText: {
    fontSize: 15,
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  detailsButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  browseButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 12,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
