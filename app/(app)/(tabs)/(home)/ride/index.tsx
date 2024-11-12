import { Location } from "@/src/slices/location";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getSocket } from "@/src/services/socket";

export default function index() {
  const location = useSelector(
    (state: { location: { pickup: Location; dropoff: Location } }) =>
      state.location
  );

  // State to store driver details and real-time updates
  //const [driverDetails, setDriverDetails] = useState<any>(null);
  // const [driverLocation, setDriverLocation] = useState<any>(null);
  const [rideStatus, setRideStatus] = useState<string>("waiting_for_driver"); // Status of the ride
  const [otp, setOtp] = useState<string[] | null>(null); // OTP for ride start

  // Initial map region (centered on pickup location)
  const [region, setRegion] = useState<any>({
    latitude: location.pickup?.latitude ?? 37.78825,
    longitude: location.pickup?.longitude ?? -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const socket = getSocket();
    console.log("Socket ID:", socket.id);
    // Listen for ride acceptance by driver
    socket.on("ride_accepted", (data) => {
      console.log("Ride accepted by driver:", data);
      //setDriverDetails(data.driverDetails); // Store driver details
      setOtp([data.startOtp, data.endOtp]); // Store OTP for ride start
      setRideStatus("driver_on_the_way"); // Update ride status
      //setDriverLocation(data.driverDetails.location); // Set initial driver location
    });

    // Listen for real-time driver location updates
    socket.on("driver_location_update", (data) => {
      console.log("Driver location updated:", data);
      //setDriverLocation(data.location); // Update driver's current location on map
    });

    // Listen for ride start event (after OTP verification)
    socket.on("ride_started", () => {
      console.log("Ride started");
      setRideStatus("ride_in_progress"); // Update status to indicate ride has started
    });

    // Listen for ride completion event
    socket.on("ride_ended", (data) => {
      console.log("Ride completed:", data);
      setRideStatus("ride_ended"); // Mark ride as completed
      // Optionally handle payment or show a summary screen here
    });

    return () => {
      socket.off("ride_accepted");
      socket.off("driver_location_update");
      socket.off("ride_started");
      socket.off("ride_ended");
    };
  }, []);

  return (
    <SafeAreaView>
      {/* Map Section */}
      <View className="h-1/2">
        <MapView
          style={{ flex: 1 }}
          mapType="mutedStandard"
          initialRegion={region}
        >
          {/* Pickup Marker */}
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

          {/* Dropoff Marker */}
          {location.dropoff && (
            <Marker
              coordinate={{
                latitude: location.dropoff.latitude ?? 0,
                longitude: location.dropoff.longitude ?? 0,
              }}
              title="Drop Location"
              description="This is the drop location"
              identifier="drop"
            />
          )}

          {/* Driver Marker - Real-time Driver Location
          {driverLocation && (
            <Marker
              coordinate={{
                latitude: driverLocation.latitude ?? 0,
                longitude: driverLocation.longitude ?? 0,
              }}
              title="Driver Location"
              description="Your driver's current location"
              identifier="driver"
            />
          )} */}

          {/* Route Directions between Pickup and Dropoff */}
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

      {/* Ride Status Section */}
      <View className="h-1/2 bg-white p-4">
        <Text className="text-lg font-semibold">Ride Status</Text>

        {/* Show different content based on ride status */}
        {rideStatus === "waiting_for_driver" && (
          <Text>Waiting for a driver to accept your request...</Text>
        )}

        {rideStatus === "driver_on_the_way" && (
          <View>
            <Text>Driver is on the way!</Text>
            {/* <Text>Driver Name: {driverDetails.name}</Text>
            <Text>Vehicle Info: {driverDetails.vehicle}</Text> */}
            {otp && <Text>OTP for Ride Start: {otp[0]}</Text>}
          </View>
        )}

        {rideStatus === "ride_in_progress" && (
          <View>
            {otp && <Text>OTP for Ride End: {otp[1]}</Text>}
            <Text>Your ride is in progress...</Text>
          </View>
        )}

        {rideStatus === "ride_ended" && (
          <View>
            <Text>Your ride has been completed.</Text>
            {/* Optionally show payment or summary information here */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
