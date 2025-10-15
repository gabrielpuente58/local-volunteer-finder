import FontAwesome from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="opportunities"
        options={{
          title: "Opportunities",
          headerShown: true,
          tabBarIcon: () => (
            <MaterialIcons
              name="volunteer-activism"
              size={28}
              color="#1982c4"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <FontAwesome size={28} name="home" color={"#1982c4"} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: () => (
            <FontAwesome size={28} name="user-circle" color={"#1982c4"} />
          ),
        }}
      />
    </Tabs>
  );
}
