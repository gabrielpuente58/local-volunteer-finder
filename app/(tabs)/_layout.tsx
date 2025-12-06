import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { openSettingsModal } from "./profile";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { isAdmin } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Opportunities",
          headerShown: false,
          tabBarIcon: ({ color }) =>
            isAdmin ? (
              <MaterialIcons
                name="admin-panel-settings"
                size={28}
                color={color}
              />
            ) : (
              <MaterialIcons
                name="volunteer-activism"
                size={28}
                color={color}
              />
            ),
        }}
      />

      <Tabs.Screen
        name="opportunities"
        options={{
          href: null, // Hide this tab from navigation
        }}
      />

      <Tabs.Screen
        name="myOpportunities"
        options={{
          title: "My Events",
          headerShown: false,
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="manageVolunteers"
        options={{
          title: "Manage",
          headerShown: false,
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Feather name="clipboard" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          header: () => (
            <CustomHeader
              rightComponent={
                <TouchableOpacity
                  onPress={openSettingsModal}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="menu" size={30} color={theme.text} />
                </TouchableOpacity>
              }
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
