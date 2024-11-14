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
import { autocomplete, getLatandlong } from "~/src/services/places";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setDropoffLocation, setPickupLocation } from "~/src/slices/location";
import { Input } from "~/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { recentRides } from "../services/recentRides";

interface Prediction {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

const PickupLocationInput = () => {
  const [activeInput, setActiveInput] = useState("pickup");
  const [predictions, setPredictions] = useState<Prediction[] | null>([]);

  // Refs for focusing on inputs
  const pickupRef = useRef<TextInput>(null);
  const dropRef = useRef<TextInput>(null);

  const pickuplocation = useSelector(
    (state: { location: { pickup: any } }) => state.location.pickup
  );
  const droplocation = useSelector(
    (state: { location: { dropoff: any } }) => state.location.dropoff
  );
  const [query, setQuery] = useState(() => {
    if (pickuplocation.placeName) {
      return pickuplocation.placeName;
    }
    return "";
  });
  const [dropQuery, setDropQuery] = useState(() => {
    if (droplocation.placeName) {
      return droplocation.placeName;
    }
    return "";
  });
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
    // You can also fetch place details here if needed
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
        pathname: "/(app)/(tabs)/(home)/search/details",
        params: {
          type: 'drop'
        },
      });
    } else if (activeInput === "pickup") {
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
        pathname: "/(app)/(tabs)/(home)/search/details",
        params: {
          type: 'pickup'
        },
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
    <View className="px-4">
      <Input
        ref={pickupRef}
        className="w-[90%] mx-auto px-4 mb-2"
        placeholder={`Enter pick up location`}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPredictions(text);
          setActiveInput("pickup");
        }}
        onFocus={() => setActiveInput("pickup")}
        returnKeyType="next"
      />
      <Input
        ref={dropRef}
        className="w-[90%] mx-auto px-4"
        placeholder={`Where to ?`}
        value={dropQuery}
        onChangeText={(text) => {
          setDropQuery(text);
          fetchPredictions(text);
          setActiveInput("drop");
        }}
        onFocus={() => setActiveInput("drop")}
        returnKeyType="done"
      />
      {predictions && predictions.length > 0 &&
        predictions.map((prediction: Prediction) => (
          <TouchableOpacity
            className="py-2 mt-2 mx-4 border-b border-gray-200 "
            key={prediction.placePrediction.placeId}
            onPress={() =>
              handleSelectPrediction({
                description: prediction.placePrediction.text.text,
                place_id: prediction.placePrediction.placeId,
              })
            }
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              className="text-xs text-stone-600"
            >
              {prediction.placePrediction.text.text}
            </Text>
          </TouchableOpacity>
        ))}

      {/* Show loading state */}
      {isLoading && <Text>Loading recent addresses...</Text>}

      {/* Show error if there's an issue */}
      {error && <Text>Error fetching recent addresses.</Text>}

      {/* Display recent addresses if available */}
      {!isLoading && !error && recentAddresses && predictions && predictions.length == 0 && (
        <ScrollView className="py-4">
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
                  onPress={() => {
                    handleSelectPrediction({
                      description:
                        activeInput == "pickup"
                          ? address.pickupAddress.address
                          : address.dropAddress.address,
                      place_id:
                        activeInput == "drop"
                          ? address.pickupAddress.placeId
                          : address.dropAddress.placeId,
                    });
                  }}
                  key={index}
                  className="mb-2 py-2 mx-4 border-b border-gray-200 "
                >
                  {activeInput === "drop" ? (
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      className="text-xs text-stone-600"
                    >
                      {address.dropAddress.address}
                    </Text>
                  ) : (
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      className="text-xs text-stone-600"
                    >
                      {address.pickupAddress.address}
                    </Text>
                  )}
                </TouchableOpacity>
              )
            )}
        </ScrollView>
      )}
    </View>
  );
};

export default PickupLocationInput;
