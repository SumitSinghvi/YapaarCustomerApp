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

export async function autocomplete(input: string) {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API;

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
      return response.data.suggestions;
    }
    return null;
  } catch (error) {
    console.error("Error fetching autocomplete predictions:", error);
  }
}

export async function reverseGeocodingLatLong(lat: number, long: number) {
  const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&location_type=ROOFTOP&result_type=street_address&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error("Error fetching autocomplete predictions:", error);
  }
}
