import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "~/src/components/Spinner";
import { reverseGeocodingLatLong } from "~/src/services/places";
import { setDropoffLocation, setPickupLocation } from "~/src/slices/location";
import { useNavigation, useLocalSearchParams, router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function PinLocationOnMap() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const params = useLocalSearchParams<{ type: string }>();

  const pickUpLocation = useSelector(
    (state: {
      location: {
        pickup: {
          latitude: number;
          longitude: number;
          placeName: string;
          placeId: string;
        };
      };
    }) => state.location.pickup
  );
  const dropOffLocation = useSelector(
    (state: {
      location: {
        dropoff: {
          latitude: number;
          longitude: number;
          placeName: string;
          placeId: string;
        };
      };
    }) => state.location.dropoff
  );

  const [loading, setLoading] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    latitude:
      params.type == "pickup"
        ? pickUpLocation.latitude
        : dropOffLocation.latitude,
    longitude:
      params.type == "pickup"
        ? pickUpLocation.longitude
        : dropOffLocation.longitude,
  });

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Pickup Location",
      headerShown: true,
    });
  }, [navigation]);

  const handleChange = async (event: any) => {
    setLoading(true);
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude });
    try {
      const response = await reverseGeocodingLatLong(latitude, longitude);
      if (params.type == "pickup") {
        dispatch(
          setPickupLocation({
            ...pickUpLocation,
            placeName:
              response.results[0]?.formatted_address ||
              pickUpLocation.placeName,
            placeId: response.results[0]?.place_id || pickUpLocation.placeId,
            latitude,
            longitude,
          })
        );
      } else if (params.type == "drop") {
        dispatch(
          setDropoffLocation({
            ...dropOffLocation,
            placeName:
              response.results[0]?.formatted_address ||
              dropOffLocation.placeName,
            placeId: response.results[0]?.place_id || dropOffLocation.placeId,
            latitude,
            longitude,
          })
        );
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    dispatch(
      setPickupLocation({
        ...pickUpLocation,
        latitude,
        longitude,
      })
    );
  };

  const handleConfirmLocation = () => {
    if (params.type == "pickup") {
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/details",
        params: {
          type: "pickup",
        },
      });
    } else {
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/details",
        params: {
          type: "drop",
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-1 rounded-t-3xl overflow-hidden shadow-lg">
          <MapView
            style={{ width, height }}
            mapType="mutedStandard"
            initialRegion={{
              latitude:
                params.type == "pickup"
                  ? pickUpLocation.latitude
                  : dropOffLocation.latitude,
              longitude:
                params.type == "pickup"
                  ? pickUpLocation.longitude
                  : dropOffLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleChange}
            className="flex-1"
          >
            <Marker
              draggable
              coordinate={markerLocation}
              onDragEnd={handleDragEnd}
              title="Pickup Location"
              description={
                params.type == "pickup"
                  ? pickUpLocation.placeName
                  : dropOffLocation.placeName
              }
            />
          </MapView>
          {loading && (
            <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <Spinner visible={true} size="large" color="#ffffff" />
            </View>
          )}
        </View>
        <View className="p-6 bg-white shadow-inner">
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            className="text-lg font-medium text-gray-800 mb-4"
          >
            {params.type == "pickup"
              ? pickUpLocation.placeName
              : dropOffLocation.placeName}
          </Text>
          <TouchableOpacity
            onPress={handleConfirmLocation}
            className="bg-[#003366] py-3 rounded-md"
          >
            <Text className="text-white text-center text-xl font-semibold">
              Enter Complete Address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
