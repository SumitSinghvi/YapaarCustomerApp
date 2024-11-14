import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="pickup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="drop"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
