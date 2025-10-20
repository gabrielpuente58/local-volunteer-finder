import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { UserProvider } from "../contexts/UserContext";

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RootLayoutContent />
      </UserProvider>
    </ThemeProvider>
  );
}
