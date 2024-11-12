import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Home() {
  const navigation = useNavigation();
  const Location = useSelector((state: { location: any }) => state.location);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: "#f8f8f8" }, // Soft white color
      headerTintColor: "#000000", // Black text color
      headerTitle: "Yapaar",
    });
  }, []);

  useEffect(() => {
    if (Location?.pickup?.placeName && Location?.dropoff?.placeName) {
      router.push("/(app)/(tabs)/(home)/checkout");
    }
  }, [Location]);

  const handleBook = () => {
    if (!Location?.pickup?.placeName) {
      router.push("/(app)/(tabs)/(home)/pickup");
    } else if (!Location?.dropoff?.placeName) {
      router.push("/(app)/(tabs)/(home)/drop");
    } else if (Location?.pickup?.placeName && Location?.dropoff?.placeName) {
      router.push("/(app)/(tabs)/(home)/checkout");
    }
  };

  return (
    <SafeAreaView>
      <Pressable
        onPress={() => router.push("/(app)/(tabs)/(home)/pickup")}
        className="w-[90%] bg-white flex flex-row items-center mb-2 space-x-3 rounded-lg p-4 mx-auto"
      >
        <Ionicons name="location" size={24} color="black" />
        <View className="flex flex-col w-[85%]">
          <Text className="font-semibold">Pick up</Text>
          <Text className="text-xs" ellipsizeMode="tail" numberOfLines={1}>
            {Location?.pickup?.placeName && Location?.pickup?.name
              ? Location.pickup.placeName
              : "Enter pick up location"}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push("/(app)/(tabs)/(home)/drop")}
        className="w-[90%] bg-white flex flex-row items-center space-x-3 rounded-lg p-4 mx-auto"
      >
        <Ionicons name="location" size={24} color="black" />
        <View className="flex flex-col">
          <Text className="font-semibold">Drop to</Text>
          <Text className="text-xs">
            {Location?.dropoff?.placeName && Location?.dropoff?.name
              ? Location.dropoff.placeName
              : "Enter drop off location"}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => handleBook()}
        className="w-[28%] bg-blue-400 mt-3 rounded-lg p-4 mx-auto"
      >
        <Text className="text-center text-white font-semibold">
          Book a ride
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
