import { setCredentials } from "~/src/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useDispatch } from "react-redux";

export default function AppLayout() {
  const [token, setToken] = useState<string | null>("");
  const dispatch = useDispatch();
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("tokenYCA");
    const storedUser = await AsyncStorage.getItem("userYCA");
    if (storedToken && storedUser) {
      dispatch(
        setCredentials({ token: storedToken, user: JSON.parse(storedUser) })
      );
    }
    setToken(storedToken);
  };
  useEffect(() => {
    checkToken();
  }, []);
  if (token === "") {
    return <Text className="text-red-400">Loading...</Text>;
  }
  if (!token) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    // <Text>App Layout</Text>
  );
}
