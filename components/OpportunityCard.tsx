import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Opportunity } from "../hooks/useOpportunities";

type Props = {
  opportunity: Opportunity;
  isAdmin?: boolean;
  onPress?: () => void;
};

export default function OpportunityCard({
  opportunity,
  isAdmin = false,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const {
    name,
    description,
    location,
    peopleNeeded,
    dateTime,
    imageUri,
    volunteersSignedUp,
  } = opportunity;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </Text>
      <View style={styles.detailsRow}>
        {isAdmin ? (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {volunteersSignedUp}/{peopleNeeded} volunteers
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {dateTime}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={theme.primary} />
              <Text style={[styles.detailText, { color: theme.primary }]}>
                {dateTime}
              </Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  details: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
