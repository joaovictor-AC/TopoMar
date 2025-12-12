import { LocationObjectCoords } from "expo-location";
import { Coordinates } from "../types/locationTypes";

/**
 * Convertit un angle de degrés en radians.
 * @param {number} degrees - L'angle en degrés à convertir.
 * @returns {number} L'angle équivalent en radians.
 * @internal
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/** 
 * Convertit un angle de radians en degrés.
 * @param {number} radians - L'angle en radians à convertir.
 * @returns {number} L'angle équivalent en degrés.
 * @internal
 */
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
}

/**
 * Calcule la distance entre deux points géographiques.
 *
 * @param {LocationObjectCoords} currentLocation - Les coordonnées de l'appareil.
 * @param {Coordinates} targetLocation - Les coordonnées du point de destination.
 * @returns {number} La distance calculée entre les deux points en mètres.
 *
 * @see {@link https://www.movable-type.co.uk/scripts/latlong.html| Comment calculer la distance ?} pour plus de détails sur les calculs.
 *
 */
export const calculateDistance = (
  currentLocation: LocationObjectCoords,
  targetLocation: Coordinates
): number => {

  // Rayon moyen de la Terre en mètres
  const R = 6371e3;

  const phi1 = toRadians(currentLocation.latitude);
  const phi2 = toRadians(targetLocation.latitude);

  const deltaPhi = toRadians(
    targetLocation.latitude - currentLocation.latitude
  );
  const deltaLambda = toRadians(
    targetLocation.longitude - currentLocation.longitude
  );

  // Formule de Haversine partie 'a': a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  // Formule de Haversine partie 'c': c = 2 ⋅ atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance finale : d = R ⋅ c
  return R * c;
};

/**
 * Calcule l'azimut (bearing) entre deux points géographiques.
 *
 * @param {LocationObjectCoords} currentLocation - Les coordonnées de l'appareil.
 * @param {Coordinates} targetLocation - Les coordonnées du point de destination.
 * @returns {number} L'azimut initial en degrés depuis la position actuelle vers la cible.
 *
 * @see {@link https://www.movable-type.co.uk/scripts/latlong.html| Comment calculer l'azimut ?} pour plus de détails sur les calculs.
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

  // Azimut en radians
  let bearingRad = Math.atan2(y, x);

  // Azimut final en degrés (normalisé entre 0 et 360)
  return (toDegrees(bearingRad) + 360) % 360; 
  
};
