import { Stack } from "expo-router";

export default function searchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="pinLocation" options={{ headerShown: false }} />
    </Stack>
  );
}
