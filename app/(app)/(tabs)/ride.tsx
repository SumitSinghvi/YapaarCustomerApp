// // app/ride-request/[rideId].tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { getSocket } from '@/src/services/socket';

// const RideRequestScreen = () => {
//   const router = useRouter();
//   const { rideId } = useLocalSearchParams<{ rideId: string }>();
//   const [rideStatus, setRideStatus] = useState<string>('accepted');

//   useEffect(() => {
//     const socket = getSocket();

//     const handleRideStatusUpdate = (data: any) => {
//       if (data.rideId === rideId) {
//         setRideStatus(data.status);
//         if (data.status === 'in_progress') {
//           Alert.alert('Ride Started', 'Your ride has started.');
//         }
//         if (data.status === 'completed') {
//           Alert.alert('Ride Completed', 'Your ride has been completed.');
//           router.replace('/');
//         }
//         if (data.status === 'cancelled') {
//           Alert.alert('Ride Cancelled', 'Your ride has been cancelled.');
//           router.replace('/');
//         }
//       }
//     };

//     socket.on('ride_status_update', handleRideStatusUpdate);

//     return () => {
//       socket.off('ride_status_update', handleRideStatusUpdate);
//     };
//   }, [rideId]);

//   const handleCompleteRide = () => {
//     const socket = getSocket();
//     socket.emit('ride_completed', { rideId });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Ride in Progress</Text>
//       <Text>Status: {rideStatus}</Text>
//       {rideStatus === 'in_progress' && (
//         <Button title="Complete Ride" onPress={handleCompleteRide} />
//       )}
//     </View>
//   );
// };

// export default RideRequestScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#f0f4f7',
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 15,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

import useInitializeSocket from "@/src/hooks/useInitializeSocket";
import { getSocket } from "@/src/services/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function Index() {
  return (
    <SafeAreaView>
      <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          router.replace("/sign-in");
        }}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

