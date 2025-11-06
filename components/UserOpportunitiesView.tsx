import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Opportunity } from "../hooks/useOpportunities";
import LoadingIndicator from "./LoadingIndicator";
import OpportunityCard from "./OpportunityCard";

type Props = {
  opportunities: Opportunity[];
  loading: boolean;
};

export default function UserOpportunitiesView({
  opportunities,
  loading,
}: Props) {
  const { theme } = useTheme();

  if (loading) {
    return <LoadingIndicator message="Loading opportunities..." />;
  }

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

      {opportunities.length === 0 ? (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text
            style={[
              styles.cardText,
              { color: theme.textSecondary, textAlign: "center" },
            ]}
          >
            No opportunities available at the moment.
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
            isAdmin={false}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
