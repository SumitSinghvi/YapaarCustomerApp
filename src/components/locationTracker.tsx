// src/components/LocationTracker.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Alert, Pressable } from "react-native";
import * as Location from "expo-location";
import { Switch } from '@rneui/themed';
import { getSocket } from "../services/socket";
import Toast from "react-native-root-toast";

const LocationTracker = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  console.log('location', location);
  const [isTracking, setIsTracking] = useState(false);
  let subscription: Location.LocationSubscription | null = null;

  useEffect(() => {
    if (isTracking) {
      startLocationUpdates();
    } else {
      stopLocationUpdates();
    }

    return () => {
      stopLocationUpdates();
    };
  }, [isTracking]);

  const startLocationUpdates = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      setIsTracking(false);
      return;
    }

    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (loc) => {
        setLocation(loc);
        sendLocation(loc.coords);
      }
    );

    Toast.show("You are Online", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
  };

  const stopLocationUpdates = () => {
    if (subscription) {
      subscription.remove();
      subscription = null;
      Toast.show("You are offline", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  const sendLocation = (coords: Location.LocationObjectCoords) => {
    try {
      const socket = getSocket();
      socket.emit("update_location", {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch (error) {
      console.log("Socket not initialized:", error);
    }
  };

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <View className="flex flex-row items-center">
      {isTracking ? (
        <Text className="font-semibold text-green-600 text-xl">Online</Text>
      ) : (
        <Text className="font-semibold text-red-600 text-xl">Offline</Text>
      )}
      <Pressable onPress={handleToggleTracking}>
        <Switch value={isTracking} onValueChange={() => handleToggleTracking()} />
      </Pressable>
    </View>
  );
};

export default LocationTracker;
