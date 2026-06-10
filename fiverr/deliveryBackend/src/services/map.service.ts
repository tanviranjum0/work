import axios from "axios";

/**
 * Get Address Coordinates
 */
export const getAddressCoordinate = async (
  address: string,
): Promise<{ ltd: number; lng: number }> => {
  const apiKey = process.env.GOOGLE_MAPS_API as string;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;

      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

/**
 * Get Distance & Time
 */
export const getDistanceTime = async (
  origin: string,
  destination: string,
): Promise<any> => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API as string;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin,
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (err: unknown) {
    console.error(err);
    throw err;
  }
};

/**
 * Get Autocomplete Suggestions
 */
export const getAutoCompleteSuggestionsService = async (
  input: string,
): Promise<string[]> => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API as string;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input,
  )}&key=${apiKey}`;

  try {
    const result = await fetch(url);
    const response = await result.json();
    // console.log(response);
    if (response.status === "OK") {
      // return response;
      return response.predictions
        .map((prediction: any, index: number) => {
          const data = {
            id: index,
            display: prediction.structured_formatting.main_text,
            secondary: prediction.structured_formatting.secondary_text,
          };
          return data;
        })
        .filter((value: string) => value);
      // return response.predictions
      //   .map((prediction: any) => prediction.description)
      //   .filter((value: string) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err: any) {
    console.log(err.message);
    throw err;
  }
};
