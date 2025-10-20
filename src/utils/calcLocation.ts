import { LocationObjectCoords } from "expo-location";
import { Coordinates } from "../types/locationTypes";

/**
 * Converts an angle from degrees to radians.
 * @param {number} degrees - The angle in degrees to convert.
 * @returns {number} The equivalent angle in radians.
 * @internal
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculates the distance between two geographical points.
 *
 * @param {LocationObjectCoords} currentLocation - The cellphone coordinates
 * @param {Coordinates} targetLocation - The destination point coordinates.
 * @returns {number} The calculated distance between the two points in meters.
 *
 * @see {@link https://www.movable-type.co.uk/scripts/latlong.html| How to calculate the distance ?} for more details on the calculations.
 *
 */
export const calculateDistance = (
  currentLocation: LocationObjectCoords,
  targetLocation: Coordinates
): number => {

  // Earth's mean radius in meters
  const R = 6371e3;

  const phi1 = toRadians(currentLocation.latitude);
  const phi2 = toRadians(targetLocation.latitude);

  const deltaPhi = toRadians(
    targetLocation.latitude - currentLocation.latitude
  );
  const deltaLambda = toRadians(
    targetLocation.longitude - currentLocation.longitude
  );

  // Haversine formula part 'a': a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  // Haversine formula part 'c': c = 2 ⋅ atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Final distance: d = R ⋅ c
  return R * c;
};

/**
 * Calculates the bearing between two geographical points.
 *
 * @param {LocationObjectCoords} currentLocation - The cellphone coordinates
 * @param {Coordinates} targetLocation - The destination point coordinates.
 * @returns {number} The initial bearing in degrees from the current location to the target.
 *
 * @see {@link https://www.movable-type.co.uk/scripts/latlong.html| How to calculate the bearing ?} for more details on the calculations.
 */

export const calculateBearing = (
  currentLocation: LocationObjectCoords,
  targetLocation: Coordinates
): number => {
  const phi1 = toRadians(currentLocation.latitude);
  const phi2 = toRadians(targetLocation.latitude);
  const deltaLambda = toRadians(
    targetLocation.longitude - currentLocation.longitude
  );

  // θ = atan2( sin Δλ ⋅ cos φ2 , cos φ1 ⋅ sin φ2 − sin φ1 ⋅ cos φ2 ⋅ cos Δλ )
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  // Bearing in radians
  let bearingRad = Math.atan2(y, x);

  // Final bearing in degrees
  return ((bearingRad * 180) / Math.PI + 360) % 360;
};
