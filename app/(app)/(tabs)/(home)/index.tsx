import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function Home() {
  const navigation = useNavigation();
  const Location = useSelector((state: { location: any }) => state.location);
  // router.push("/(app)/(tabs)/(home)/search");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
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
    <SafeAreaView className="px-5 bg-white">
      <Text className="text-3xl font-semibold py-4">Yapaar</Text>
      <View className="flex flex-row">
        <Button className="border-b-2 w-[12rem]">
          <View className="flex flex-row items-center gap-3 justify-start w-full">
            <Image
              source={require("~/assets/images/sedan.png")}
              className="w-10 h-10"
            />
            <Text className="text-2xl">Ride</Text>
          </View>
        </Button>
        <Button className="w-[12rem]">
          <View className="flex flex-row items-center gap-3 justify-start w-full">
            <Image
              source={require("~/assets/images/parcel.png")}
              className="w-10 h-10"
            />
            <Text className="text-2xl">Package</Text>
          </View>
        </Button>
      </View>
      <Button
      onPress={() => router.push("/(app)/(tabs)/(home)/search")}
      className="border rounded-lg bg-stone-100 mt-4 flex flex-row justify-start gap-2 h-[4rem]">
        <Ionicons name="search" size={24} color="black" />
        <Text className="text-stone-500 font-semibold">Enter pickup point</Text>
      </Button>
      
    </SafeAreaView>
  );
}
