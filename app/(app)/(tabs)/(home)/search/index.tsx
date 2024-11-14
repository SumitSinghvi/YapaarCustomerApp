import { SafeAreaView } from "react-native-safe-area-context";
import PickupLocationInput from "~/src/components/GooglePlaceInput";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function SearchFetch() {
  const navigation = useNavigation();

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Plan your ride",
      headerShown: true,
    });
  }, [navigation]);
  
  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex gap-2 bg-white p-4">
        <PickupLocationInput />
      </View>
    </SafeAreaView>
  );
}
