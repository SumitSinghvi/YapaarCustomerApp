import axios from "axios";

interface Location {
    placeName: string | null;
    longitude: number | null;
    latitude: number | null;
    placeId: string | null;
}

interface RideLocation {
    pickup: Location;
    dropoff: Location;
}

interface Auth {
    token: string;
}

export async function bookRide(auth: Auth, location: RideLocation): Promise<void> {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/rides/request`, {
            origin: {
                address: location.pickup.placeName,
                location: {
                    type: "Point",
                    coordinates: [location.pickup.longitude, location.pickup.latitude],
                    placeId: location.pickup.placeId,
                }
            },
            destination: {
                address: location.dropoff.placeName,
                location: {
                    type: "Point",
                    coordinates: [location.dropoff.longitude, location.dropoff.latitude],
                    placeId: location.dropoff.placeId,
                }
            },
            fare: "900",
            commercial: false,
        }, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            }
        });
    } catch (error) {
        console.error('Error booking ride:', error);
    }
}
