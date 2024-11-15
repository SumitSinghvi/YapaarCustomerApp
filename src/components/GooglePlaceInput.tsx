import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import debounce from "lodash.debounce";
import { autocomplete, getLatandlong, reverseGeocodingLatLong } from "~/src/services/places";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setDropoffLocation, setPickupLocation } from "~/src/slices/location";
import { Input } from "~/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { recentRides } from "../services/recentRides";
import Spinner from "./Spinner";
import * as Location from "expo-location";

// Define the Prediction interface for type safety
interface Prediction {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

const PickupLocationInput = () => {
  const [activeInput, setActiveInput] = useState<"pickup" | "drop">("pickup");
  const [predictions, setPredictions] = useState<Prediction[] | null>([]);

  // Refs for focusing on inputs
  const pickupRef = useRef<TextInput>(null);
  const dropRef = useRef<TextInput>(null);

  // Retrieve pickup and dropoff locations from Redux store
  const pickuplocation = useSelector(
    (state: { location: { pickup: any } }) => state.location.pickup
  );
  const droplocation = useSelector(
    (state: { location: { dropoff: any } }) => state.location.dropoff
  );

  const [query, setQuery] = useState(() => pickuplocation.placeName || "");
  const [dropQuery, setDropQuery] = useState(
    () => droplocation.placeName || ""
  );

  const dispatch = useDispatch();

  // Fetch recent rides using React Query
  const {
    data: recentAddresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentSearches"],
    queryFn: async () => {
      const response = await recentRides();
      return response;
    },
  });

  // Debounced function to fetch autocomplete predictions
  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (input.length > 2) {
        const response = await autocomplete(input);
        setPredictions(response);
      } else {
        setPredictions([]);
      }
    }, 500), // 500ms debounce delay
    []
  );

  // Handle selection of a prediction
  const handleSelectPrediction = async (prediction: {
    description: string;
    place_id: string;
  }) => {
    setPredictions([]);
    Keyboard.dismiss();
    // Fetch latitude and longitude based on place_id
    const latAndLong = await getLatandlong(prediction.place_id);
    if (activeInput === "drop") {
      setDropQuery(prediction.description);
      dispatch(
        setDropoffLocation({
          ...droplocation,
          placeName: prediction.description,
          placeId: prediction.place_id,
          latitude: latAndLong.location.latitude,
          longitude: latAndLong.location.longitude,
        })
      );
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/pinLocation",
        params: { type: "drop" },
      });
    } else {
      setQuery(prediction.description);
      dispatch(
        setPickupLocation({
          ...pickuplocation,
          placeName: prediction.description,
          placeId: prediction.place_id,
          latitude: latAndLong.location.latitude,
          longitude: latAndLong.location.longitude,
        })
      );
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/pinLocation",
        params: { type: "pickup" },
      });
    }
  };
  // Handle current location
  const handleCurrent = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const response = await reverseGeocodingLatLong(latitude, longitude);
    if (activeInput === "drop") {
      setDropQuery(response.results[0]?.formatted_address);
      dispatch(
        setDropoffLocation({
          ...droplocation,
          placeName: response.results[0]?.formatted_address,
          placeId: response.results[0]?.place_id,
          latitude,
          longitude,
        })
      );
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/pinLocation",
        params: { type: "drop" },
      });
    } else {
      setQuery(response.results[0]?.formatted_address);
      dispatch(
        setPickupLocation({
          ...pickuplocation,
          placeName: response.results[0]?.formatted_address,
          placeId: response.results[0]?.place_id,
          latitude,
          longitude,
        })
      );
      router.push({
        pathname: "/(app)/(tabs)/(home)/search/pinLocation",
        params: { type: "pickup" },
      });
    }
  };

  // Effect to manage initial focus
  useEffect(() => {
    // Delay the focus to ensure that the component has mounted
    const timeout = setTimeout(() => {
      if (pickuplocation.placeName) {
        dropRef.current?.focus();
      } else {
        pickupRef.current?.focus();
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timeout);
  }, [pickuplocation.placeName]);

  return (
    <View className="bg-white p-4">
      {/* Pickup Location Input */}
      <Input
        ref={pickupRef}
        className="w-full px-4 mb-4 border border-gray-300 rounded-md"
        placeholder="Enter pickup location"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPredictions(text);
          setActiveInput("pickup");
        }}
        onFocus={() => setActiveInput("pickup")}
        returnKeyType="next"
      />

      {/* Dropoff Location Input */}
      <Input
        ref={dropRef}
        className="w-full px-4 mb-4 border border-gray-300 rounded-md"
        placeholder="Where to?"
        value={dropQuery}
        onChangeText={(text) => {
          setDropQuery(text);
          fetchPredictions(text);
          setActiveInput("drop");
        }}
        onFocus={() => setActiveInput("drop")}
        returnKeyType="done"
      />

      {/* Autocomplete Predictions */}
      {predictions && predictions.length > 0 && (
        <ScrollView className="max-h-60">
          {predictions.map((prediction: Prediction) => (
            <TouchableOpacity
              key={prediction.placePrediction.placeId}
              className="py-3 px-4 border-b border-gray-200"
              onPress={() =>
                handleSelectPrediction({
                  description: prediction.placePrediction.text.text,
                  place_id: prediction.placePrediction.placeId,
                })
              }
            >
              <Text className="text-gray-700">
                {prediction.placePrediction.text.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <View className="flex justify-center items-center mt-4">
          <Spinner visible={true} size="large" color="#3B82F6" />
        </View>
      )}

      {/* Error Message */}
      {error && (
        <Text className="text-red-500 text-center mt-4">
          Error fetching recent addresses.
        </Text>
      )}

      {/* Recent Addresses */}
      {!isLoading &&
        !error &&
        recentAddresses &&
        predictions &&
        predictions.length === 0 && (
          <View className="mt-4">
            <Text className="text-gray-600 mb-2">Recent Addresses</Text>
            {recentAddresses.uniqueAddresses
              .filter(
                (
                  address: {
                    pickupAddress: { address: string };
                    dropAddress: { address: string };
                  },
                  index: number,
                  self: {
                    pickupAddress: { address: string };
                    dropAddress: { address: string };
                  }[]
                ) =>
                  index ===
                  self.findIndex(
                    (addr) =>
                      addr.pickupAddress.address ===
                        address.pickupAddress.address &&
                      addr.dropAddress.address === address.dropAddress.address
                  )
              )
              .map(
                (
                  address: {
                    dropAddress: { address: string; placeId: string };
                    pickupAddress: { address: string; placeId: string };
                  },
                  index: number
                ) => (
                  <TouchableOpacity
                    key={index}
                    className="py-3 px-4 border-b border-gray-200"
                    onPress={() => {
                      handleSelectPrediction({
                        description:
                          activeInput === "pickup"
                            ? address.pickupAddress.address
                            : address.dropAddress.address,
                        place_id:
                          activeInput === "pickup"
                            ? address.pickupAddress.placeId
                            : address.dropAddress.placeId,
                      });
                    }}
                  >
                    <Text ellipsizeMode="tail" numberOfLines={2} className="text-gray-700">
                      {activeInput === "pickup"
                        ? address.pickupAddress.address
                        : address.dropAddress.address}
                    </Text>
                  </TouchableOpacity>
                )
              )}
          </View>
        )}
      <View className="flex flex-row mx-auto gap-2">
        <TouchableOpacity onPress={() => handleCurrent()} className="bg-gray-200 flex-1 items-center font-semibold p-4 rounded-md">
          <Text>Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCurrent()} className="bg-gray-200 flex-1 items-center font-semibold p-4 rounded-md">
          <Text>Locate on map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PickupLocationInput;
