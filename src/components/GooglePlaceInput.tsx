import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
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
  const [query, setQuery] = useState("");
  const [dropQuery, setDropQuery] = useState("");
  const [activeInput, setActiveInput] = useState("pickup");
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Ref for focusing on pickup input
  const inputRef = useRef<TextInput>(null);

  const pickuplocation = useSelector(
    (state: { location: { pickup: any } }) => state.location.pickup
  );
  const droplocation = useSelector(
    (state: { location: { dropoff: any } }) => state.location.dropoff
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
    // You can also fetch place details here if needed
    const latAndLong = await getLatandlong(prediction.place_id);
    if (activeInput === "drop") {
      setDropQuery(prediction.description)
      dispatch(
        setDropoffLocation({
          ...droplocation,
          placeName: prediction.description,
          placeId: prediction.place_id,
          latitude: latAndLong.location.latitude,
          longitude: latAndLong.location.longitude,
        })
      );
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
    }
    if( query !== '' && dropQuery !== ''){
      router.replace("/(app)/(tabs)/(home)/pickup/details");
    }
  };

  // Focus on pickup input when screen opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <View className="px-4">
      <Input
        ref={inputRef}
        className="w-[90%] mx-auto px-4 mb-2"
        placeholder={`Enter pick up location`}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPredictions(text);
          setActiveInput("pickup");
        }}
        onFocus={() => setActiveInput("pickup")}
      />
      <Input
        className="w-[90%] mx-auto px-4"
        placeholder={`Where to ?`}
        value={dropQuery}
        onChangeText={(text) => {
          setDropQuery(text);
          fetchPredictions(text);
          setActiveInput("drop");
        }}
        onFocus={() => setActiveInput("drop")}
      />
      {predictions.length > 0 &&
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
            <Text ellipsizeMode="tail" numberOfLines={1} className="text-xs text-stone-600">{prediction.placePrediction.text.text}</Text>
          </TouchableOpacity>
        ))}

      {/* Show loading state */}
      {isLoading && <Text>Loading recent addresses...</Text>}

      {/* Show error if there's an issue */}
      {error && <Text>Error fetching recent addresses.</Text>}

      {/* Display recent addresses if available */}
      {!isLoading && !error && recentAddresses && predictions.length == 0 && (
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
                  dropAddress: { address: string, placeId: string };
                  pickupAddress: { address: string, placeId: string };
                },
                index: number
              ) => (
                <TouchableOpacity
                  onPress={() => {
                    handleSelectPrediction({
                      description: activeInput == 'pickup' ? address.pickupAddress.address : address.dropAddress.address,
                      place_id: activeInput == 'drop' ? address.pickupAddress.placeId : address.dropAddress.placeId,
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
