import { Location } from "@/src/slices/location";
import { useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function index() {
  const location = useSelector(
    (state: { location: { pickup: Location; dropoff: Location } }) =>
      state.location
  );
  const [region, setRegion] = useState<any>({
    latitude: location.pickup?.latitude ?? 37.78825,
    longitude: location.pickup?.longitude ?? -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <SafeAreaView>
      <View className="h-1/2">
        <MapView
        style={{ flex: 1 }}
        mapType="mutedStandard"
        initialRegion={region}
        >
            {location.pickup && (
                <Marker
                    coordinate={{
                        latitude: location.pickup.latitude ?? 0,
                        longitude: location.pickup.longitude ?? 0,
                    }}
                    title="Pickup Location"
                    description="This is the pickup location"
                    identifier="pickup"
                />
            )}
            {
                location.dropoff && (
                    <Marker
                        coordinate={{
                            latitude: location.dropoff.latitude ?? 0,
                            longitude: location.dropoff.longitude ?? 0,
                        }}
                        title="Drop Location"
                        description="This is the drop location"
                        identifier="drop"
                    />
                )
            }
            
          {location.pickup && location.dropoff && (
            <MapViewDirections
              origin={{
                latitude: location.pickup.latitude ?? 0,
                longitude: location.pickup.longitude ?? 0,
              }}
              destination={{
                latitude: location.dropoff.latitude ?? 0,
                longitude: location.dropoff.longitude ?? 0,
              }}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_API || ""}
              strokeWidth={4}
              strokeColor="black"
            />
          )}
        </MapView>
      </View>
      <View className="h-1/2 bg-white">
        <Text>Ride</Text>
      </View>
    </SafeAreaView>
  );
}
