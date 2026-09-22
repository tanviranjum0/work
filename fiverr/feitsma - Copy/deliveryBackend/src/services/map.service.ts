import axios from "axios";

// /**
//  * Get Address Coordinates
//  */
// export const getAddressCoordinate = async (
//   address: string,
// ): Promise<{ lat: number; lng: number }> => {
//   const apiKey = process.env.GOOGLE_MAPS_API as string;

//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//     address,
//   )}&key=${apiKey}`;
//   try {
//     const response = await axios.get(url);

//     if (response.data.status === "OK") {
//       const location = response.data.results[0].geometry.location;

//       return {
//         lat: location.lat,
//         lng: location.lng,
//       };
//     } else {
//       throw new Error("Unable to fetch coordinates");
//     }
//   } catch (error: unknown) {
//     console.error(error);
//     throw error;
//   }
// };

/**
 * Get Address Coordinates
 */
export const getAddressCoordinate = async (
  address: string,
): Promise<{ lat: number; lng: number }> => {
  if (!address?.trim()) {
    throw new Error("Address is required");
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured");
  }

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: address,
          apiKey,
          limit: 1,
        },
      },
    );

    const feature = response.data?.features?.[0];

    if (!feature) {
      throw new Error(`Unable to find coordinates for address: ${address}`);
    }

    const { lat, lon } = feature.properties;

    if (typeof lat !== "number" || typeof lon !== "number") {
      throw new Error("Invalid coordinates returned by Geoapify");
    }

    return {
      lat,
      lng: lon,
    };
  } catch (error: unknown) {
    console.error("Geoapify geocoding error:", error);
    throw error;
  }
};

/**
 * Get Distance & Time
 */

interface Location {
  lat: number;
  lng: number;
}

interface DistanceTimeResult {
  distance: number; // meters
  time: number; // seconds
}

/**
 * Get Distance & Time using Geoapify Routing API
 */
export const getDistanceTime = async (
  origin: Location,
  destination: Location,
): Promise<DistanceTimeResult> => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured");
  }

  const url = "https://api.geoapify.com/v1/routing";

  try {
    const response = await axios.get(url, {
      params: {
        waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
        mode: "drive",
        apiKey,
      },
    });

    const features = response.data?.features;
    if (!features?.length) {
      throw new Error("No route found");
    }

    if (!features[0]?.properties) {
      throw new Error("Invalid route response");
    }

    return {
      distance: features[0]?.properties.distance / 1000,
      time: features[0]?.properties.time,
    };
  } catch (err: unknown) {
    console.error("Geoapify routing error:", err);

    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Unable to fetch distance and time",
      );
    }

    throw err;
  }
};

// export const getDistanceTime = async (
//   origin: string,
//   destination: string,
// ): Promise<any> => {
//   if (!origin || !destination) {
//     throw new Error("Origin and destination are required");
//   }

//   const apiKey = process.env.GOOGLE_MAPS_API as string;

//   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
//     origin,
//   )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);

//     if (response.data.status === "OK") {
//       if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
//         throw new Error("No routes found");
//       }

//       return response.data.rows[0].elements[0];
//     } else {
//       throw new Error("Unable to fetch distance and time");
//     }
//   } catch (err: unknown) {
//     console.error(err);
//     throw err;
//   }
// };

/**
 * Get Autocomplete Suggestions
 */
// export const getAutoCompleteSuggestionsService = async (
//   input: string,
// ): Promise<string[]> => {
//   if (!input) {
//     throw new Error("query is required");
//   }

//   const apiKey = process.env.GOOGLE_MAPS_API as string;
//   const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//     input,
//   )}&key=${apiKey}`;

//   try {
//     const result = await fetch(url);
//     const response = await result.json();
//     if (response.status === "OK") {
//       return response.predictions
//         .map((prediction: any, index: number) => {
//           const data = {
//             id: index,
//             display: prediction.structured_formatting.main_text,
//             secondary: prediction.structured_formatting.secondary_text,
//             message: prediction,
//           };
//           return data;
//         })
//         .filter((value: string) => value);
//     } else {
//       throw new Error("Unable to fetch suggestions");
//     }
//   } catch (err: any) {
//     console.log(err.message);
//     throw err;
//   }
// };

interface GeoapifyFeature {
  type: "Feature";
  properties: {
    place_id: string;
    name?: string;
    formatted?: string;
    country?: string;
    state?: string;
    city?: string;
    postcode?: string;
    result_type?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

interface GeoapifyAutocompleteResponse {
  type: "FeatureCollection";
  features: GeoapifyFeature[];
}

export interface AutocompleteSuggestion {
  id: string;
  display: string;
  secondary: string;
  formatted: string;
  lat: number;
  lng: number;
}

/**
 * Get Autocomplete Suggestions
 */
export const getAutoCompleteSuggestionsService = async (
  input: string,
): Promise<AutocompleteSuggestion[]> => {
  const query = input.trim();
  if (!query) {
    throw new Error("Query is required");
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("Geoapify API key is not configured");
  }

  const params = new URLSearchParams({
    text: query,
    apiKey,
    limit: "5",
  });

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Geoapify API request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as GeoapifyAutocompleteResponse;

    return data.features.map((feature) => {
      const { properties, geometry } = feature;

      // Geoapify returns [lng, lat]
      const [lng, lat] = geometry.coordinates;
      return {
        id: properties.place_id,
        display: properties.name ?? properties.formatted ?? "",
        secondary: [properties.city, properties.state, properties.country]
          .filter(Boolean)
          .join(", "),
        formatted: properties.formatted ?? "",
        lat,
        lng,
      };
    });
  } catch (error) {
    console.error("Geoapify autocomplete error:", error);

    throw error instanceof Error
      ? error
      : new Error("Failed to fetch autocomplete suggestions");
  }
};
