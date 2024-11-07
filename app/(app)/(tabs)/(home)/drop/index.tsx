import { SafeAreaView } from "react-native-safe-area-context";
import PickupLocationInput from "@/src/components/GooglePlaceInput";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function AddressFetch() {
  //give header here
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Drop location Details",
      headerShown: true,
    });
  }, []);
  return (
    <SafeAreaView>
      <PickupLocationInput type="drop" />
    </SafeAreaView>
  );
}
