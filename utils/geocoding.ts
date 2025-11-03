const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function geocodeAddress(
  address: string
): Promise<Coordinates | null> {
  if (!address || address.trim().length === 0) {
    console.warn("Empty address provided for geocoding");
    return null;
  }

  if (!GOOGLE_API_KEY) {
    console.error("Google API key not found in environment variables");
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const coordinates: Coordinates = {
        latitude: location.lat,
        longitude: location.lng,
      };
      return coordinates;
    } else {
      console.warn("Geocoding failed:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error during geocoding:", error);
    return null;
  }
}
