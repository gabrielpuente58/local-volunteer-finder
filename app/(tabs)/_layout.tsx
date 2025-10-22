import { Feather } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { openOpportunityModal } from "./opportunities";

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
        name="opportunities"
        options={{
          title: "Opportunities",
          headerShown: true,
          header: () => (
            <CustomHeader
              rightComponent={
                isAdmin ? (
                  <TouchableOpacity onPress={openOpportunityModal}>
                    <Feather name="plus" size={30} color={theme.text} />
                  </TouchableOpacity>
                ) : null
              }
            />
          ),
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
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
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
                <TouchableOpacity onPress={() => console.log("Menu pressed")}>
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
