import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ animation: "fade_from_bottom", headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}