import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { setFairPrice, setGoodsType } from "~/src/slices/vehicle";
import { bookRide } from "~/src/services/bookride";
import { Location } from "~/src/slices/location";

export default function order() {
  const navigation = useNavigation();
  const [selectedGoods, setSelectedGoods] = useState("");
  const dispatch = useDispatch();
  const location = useSelector(
    (state: { location: { pickup: Location; dropoff: Location } }) =>
      state.location
  );
  const auth = useSelector(
    (state: { auth: { token: string; user: any } }) => state.auth
  );
  const handleSubmit = async () => {
    dispatch(setGoodsType(selectedGoods));
    dispatch(setFairPrice(900));
    const response = await bookRide(auth, location);
    router.replace("/(app)/(tabs)/(home)/ride");
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Review Booking",
      headerShown: true,
    });
  }, []);
  return (
    <View className="bg-white mx-auto p-4 w-[90%] mt-4 shadow-lg rounded-lg">
      <View className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm">
        <Ionicons name="car" size={42} color="black" />
        <View>
          <Text className="text-lg font-medium">Tata Ace</Text>
          <TouchableOpacity>
            <Text className="text-xs text-blue-600 underline">
              View Address Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-sm text-gray-700 mt-2">
        Free 100 mins of loading unloading time included.
      </Text>
      <View className="mt-4">
        <Text className="text-lg font-semibold">Fare Summary</Text>
        <View className="flex flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">Base Fare</Text>
          <Text className="text-sm text-gray-800">₹500.00</Text>
        </View>
        <View className="flex flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">Distance Fare</Text>
          <Text className="text-sm text-gray-800">₹200.00</Text>
        </View>
        <View className="flex flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">Time Fare</Text>
          <Text className="text-sm text-gray-800">₹150.00</Text>
        </View>
        <View className="flex flex-row justify-between mt-2">
          <Text className="text-sm text-gray-600">Taxes</Text>
          <Text className="text-sm text-gray-800">₹50.00</Text>
        </View>
        <View className="flex flex-row justify-between mt-4 border-t border-gray-200 pt-2">
          <Text className="text-lg font-semibold">Total</Text>
          <Text className="text-lg font-semibold">₹900.00</Text>
        </View>
      </View>
      <View className="mt-4">
        <Picker
          selectedValue={selectedGoods}
          onValueChange={(itemValue, itemIndex) => setSelectedGoods(itemValue)}
        >
          <Picker.Item label="Select Goods Type" value="" />
          <Picker.Item label="Electronics" value="electronics" />
          <Picker.Item label="Furniture" value="furniture" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Clothing" value="clothing" />
        </Picker>
      </View>
      <Pressable onPress={() => handleSubmit()}>
        <Text className="text-center text-white bg-blue-500 p-2 rounded-lg mt-4">
          Confirm Booking
        </Text>
      </Pressable>
    </View>
  );
}
