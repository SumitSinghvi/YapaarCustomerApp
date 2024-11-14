import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function Home() {
  const [ride, setRide] = useState(true);
  const navigation = useNavigation();
  // router.push("/(app)/(tabs)/(home)/search");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerStyle: { backgroundColor: "#f8f8f8" }, // Soft white color
      headerTintColor: "#000000", // Black text color
      headerTitle: "Yapaar",
    });
  }, []);
  

  return (
    <SafeAreaView className="bg-[#F4F4F4] h-screen">
      <View className="bg-[#003366] px-5 pb-4 rounded-b-2xl">
        <Text className="text-3xl text-white font-semibold py-4">Yapaar</Text>
        <View className="flex flex-row">
          <Button
            onPress={() => {
              setRide(true);
            }}
            className={`w-[12rem] ${ride ? "bg-[#FF6600]" : ""} `}
          >
            <View className="flex flex-row items-center gap-3 justify-start w-full">
              <Image
                source={require("~/assets/images/sedan.png")}
                className="w-10 h-10"
              />
              <Text className="text-2xl text-white">Ride</Text>
            </View>
          </Button>
          <Button
            onPress={() => {
              setRide(false);
            }}
            className={`w-[12rem] ${ride ? "" : "bg-[#FF6600]"} `}
          >
            <View className="flex flex-row items-center gap-3 justify-start w-full">
              <Image
                source={require("~/assets/images/parcel.png")}
                className="w-10 h-10"
              />
              <Text className="text-2xl text-white">Package</Text>
            </View>
          </Button>
        </View>
        <Button
          onPress={() => router.push("/(app)/(tabs)/(home)/search")}
          className="rounded-lg bg-stone-100 mt-4 flex flex-row justify-start gap-2 h-[4rem]"
        >
          <Ionicons name="search" size={24} color="black" />
          <Text className="text-stone-500 font-semibold">
            Enter pickup point
          </Text>
        </Button>
      </View>
      {!ride && (
        <ScrollView className="py-4 bg-[#F4F4F4]">
          <View className="flex flex-row justify-center gap-4 py-4">
            <View className="bg-white p-4 shadow-lg shadow-left-bottom rounded-lg w-[40%]">
              <Text className="font-semibold mx-auto text-xl mb-4 text-[#333333]">Trucks</Text>
              <Image
                source={require("~/assets/images/3d-truck.png")}
                className="w-20 h-20 mx-auto"
              />
            </View>
            <View className="bg-white p-4 shadow-lg rounded-lg w-[40%]">
              <Text className="font-semibold text-xl text-[#333333] mx-auto mb-4">2 Wheelers</Text>
              <Image
                source={require("~/assets/images/delivery-bike.png")}
                className="w-20 h-20 mx-auto"
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
