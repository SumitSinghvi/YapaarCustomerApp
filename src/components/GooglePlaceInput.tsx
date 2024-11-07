import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import debounce from "lodash.debounce";
import { getLatandlong } from "@/src/services/places";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setDropoffLocation, setPickupLocation } from "@/src/slices/location";

interface Prediction {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
  };
}

const PickupLocationInput = ({ type }: { type: string }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const dispatch = useDispatch();
  const pickuplocation = useSelector(
    (state: { location: { pickup: any } }) => state.location.pickup
  );
  const droplocation = useSelector(
    (state: { location: { dropoff: any } }) => state.location.dropoff
  );

  // Replace with your actual API key
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API;

  // Debounced function to fetch autocomplete predictions
  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (input.length > 2) {
        try {
          const response = await axios.post(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
              input: input,
              includedRegionCodes: ["in"],
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
              },
            }
          );

          if (response.data.suggestions) {
            setPredictions(response.data.suggestions);
          }
        } catch (error) {
          console.error("Error fetching autocomplete predictions:", error);
        }
      } else {
        setPredictions([]);
      }
    }, 500), // 500ms debounce delay
    []
  );

  // Handle input changes
  const handleInputChange = (text: string) => {
    setQuery(text);
    fetchPredictions(text);
  };

  // Handle selection of a prediction
  const handleSelectPrediction = async (prediction: {
    description: string;
    place_id: string;
  }) => {
    setQuery(prediction.description);
    setPredictions([]);
    // You can also fetch place details here if needed
    const latAndLong = await getLatandlong(prediction.place_id);
    if (type === "drop") {
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
        pathname: "/(app)/(tabs)/(home)/drop/details",
      });
    } else if (type === "pick up") {
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
        pathname: "/(app)/(tabs)/(home)/address/details",
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={`Enter ${type} location`}
        value={query}
        onChangeText={handleInputChange}
      />
      {predictions.length > 0 &&
        predictions.map((prediction: Prediction) => (
          <TouchableOpacity
            key={prediction.placePrediction.placeId}
            style={styles.predictionItem}
            onPress={() =>
              handleSelectPrediction({
                description: prediction.placePrediction.text.text,
                place_id: prediction.placePrediction.placeId,
              })
            }
          >
            <Text>{prediction.placePrediction.text.text}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  predictionsList: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  predictionItem: {
    padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});

export default PickupLocationInput;
