import axios from "axios";

export async function getLatandlong(place_id: string) {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API;

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${place_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "adrFormatAddress,location,plusCode",
        },
      }
    );

    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching autocomplete predictions:", error);
  }
}
