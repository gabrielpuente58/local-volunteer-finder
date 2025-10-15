import { Stack } from "expo-router";
import { ProfileImageProvider } from "../store/profileImageStore";
export default function RootLayout() {
  return (
    <ProfileImageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "transparentModal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </ProfileImageProvider>
  );
}
