import { Stack } from "expo-router";

export default function addressLayout() {
  return (
    <Stack>
      <Stack.Screen name="details" options={{ headerShown: false }} />
    </Stack>
  );
}
