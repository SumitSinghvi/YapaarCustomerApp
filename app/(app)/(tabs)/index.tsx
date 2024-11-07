import LocationTracker from "@/src/components/locationTracker";
import { getSocket } from "@/src/services/socket";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  
  useEffect(() => {
    const socket = getSocket();

    const handleNewRideRequest = (data: any) => {
      console.log("ride request", data);
    };
    socket.on("new_ride_request", handleNewRideRequest);
    console.log("Listening for new ride requests...", socket.id);
    return () => {
      socket.off("new_ride_request", handleNewRideRequest);
      console.log("Stopped listening for new ride requests...");
    };
  }, []);
  return (
    <SafeAreaView>
      <View className="bg-stone-200 flex flex-row justify-between items-center px-4">
        <Text className="text-xl font-semibold">Yapaar Delivery App</Text>
        <LocationTracker />
      </View>
      <View className="px-4 py-2">
        <Text className="font-semibold text-lg">Ride Requests :</Text>
        <View className="bg-stone-100 w-[90%] mx-auto p-2 mt-2 rounded-lg">
          <Text>Nitish Patel, 5 km</Text>
          <Text>Origin: Axis Antara, Akshayanagar</Text>
          <Text>Destination: Provident Park Square, Kanakpura</Text>
          <Text>₹ 550 inr</Text>
          <View className="flex flex-row gap-3 mt-2">
            <Text className="bg-green-600 rounded-lg px-2 py-1 font-semibold">Accept</Text>
            <Text className="bg-red-600 rounded-lg px-2 py-1 font-semibold">Reject</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
