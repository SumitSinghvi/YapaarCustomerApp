import { setVehicleType } from "~/src/slices/vehicle";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function chooseVehicle() {
  const location = useSelector(
    (state: { location: { pickup: any; dropoff: any } }) => state.location
  );
  const [selectedVehicle, setSelectedVehicle] = useState("750 kg");
  const navigation = useNavigation();
  const vehicles = [
    {
      name: "Tata Ace",
      weight: "750 kg",
      price: "500",
    },
    {
      name: "Tata 407",
      weight: "1500 kg",
      price: "1000",
    },
    {
      name: "Tata 909",
      weight: "3000 kg",
      price: "2000",
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Select Vehicle",
    });
  }, []);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(setVehicleType(selectedVehicle));
    router.push("/(app)/(tabs)/(home)/checkout/book");
  };
  return (
    <SafeAreaView>
      <View className="flex">
        <View className="shadow-md shadow-red-500 p-1 bg-white w-[90%] mx-auto rounded-md">
          <View className="p-2">
            <View className="flex flex-row">
              <Text className="capitalize font-semibold">
                {location.pickup.name} -{" "}
              </Text>
              <Text>{location.pickup.phoneNumber}</Text>
            </View>
            <Text
              className="w-[90%] text-gray-600"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {location.pickup.placeName}
            </Text>
          </View>
          <View className="p-2">
            <View className="flex flex-row">
              <Text className="capitalize font-semibold">
                {location.dropoff.name} -{" "}
              </Text>
              <Text>{location.dropoff.phoneNumber}</Text>
            </View>
            <Text
              className="w-[90%] text-gray-600"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {location.dropoff.placeName}
            </Text>
          </View>
          <View className="p-2">
            <Pressable className="p-2 bg-blue-400 rounded-md w-[30%]">
              <Text className="text-center text-white">Edit location</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View className="mt-4">
        {vehicles.map((vehicle) => (
          <Pressable
            key={vehicle.weight}
            onPress={() => setSelectedVehicle(vehicle.weight)}
            className={`flex flex-row justify-between px-8 py-4 ${
              selectedVehicle == vehicle.weight
                ? "bg-blue-100 border-l-4 border-blue-700"
                : "bg-white"
            }`}
          >
            <View className="flex flex-row space-x-3">
              <Ionicons name="car" size={32} color="black" />
              <View>
                <Text>{vehicle.name}</Text>
                <Text>{vehicle.weight}</Text>
              </View>
            </View>
            <View>
              <Text>₹ {vehicle.price}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => handleSubmit()}
        className="bg-blue-400 p-4 rounded-md w-[50%] mx-auto mt-4"
      >
        <Text className="text-center text-white font-semibold">
          Proceed with {selectedVehicle == "750 kg" ? "Tata Ace" : "Tata 909"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
