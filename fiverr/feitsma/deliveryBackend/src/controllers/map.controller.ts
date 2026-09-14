import { Request, Response } from "express";
import {
  getAutoCompleteSuggestionsService,
  getAddressCoordinate,
  getDistanceTime as getDistanceTimeService,
} from "../services/map.service.js";
/**
 * Extend Request Query Types
 */
interface CoordinatesQuery {
  address: string;
}

interface DistanceQuery {
  origin: string;
  destination: string;
}

interface AutoCompleteQuery {
  input: string;
}

/**
 * Get Coordinates
 */
export const getCoordinates = async (
  req: Request<{}, {}, {}, CoordinatesQuery>,
  res: Response,
): Promise<Response | void> => {
  const { address } = req.query;

  try {
    const coordinates = await getAddressCoordinate(address);
    return res.status(200).json(coordinates);
  } catch (error: unknown) {
    return res.status(404).json({
      message: "Coordinates not found",
      error,
    });
  }
};

/**
 * Get Distance & Time
 */
// export const getDistanceTime = async (
//   req: Request<{}, {}, {}, DistanceQuery>,
//   res: Response,
// ): Promise<Response | void> => {
//   try {
//     const { origin, destination } = req.query;

//     const distanceTime = await getDistanceTimeService(origin, destination);

//     return res.status(200).json(distanceTime);
//   } catch (err: unknown) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

/**
 * Get Autocomplete Suggestions
 */
export const getAutoCompleteSuggestions = async (
  req: Request<{}, {}, {}, AutoCompleteQuery>,
  res: Response,
): Promise<Response | void> => {
  try {
    const { input } = req.query;

    const suggestions = await getAutoCompleteSuggestionsService(input);

    return res.status(200).json(suggestions);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
