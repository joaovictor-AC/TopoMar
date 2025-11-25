import * as Location from "expo-location";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";

/**
 * Get the device pitch (tilt) in degrees using motion sensors.
 * @returns {number} pitch in degrees
 * @see {@link https://docs.expo.dev/versions/latest/sdk/devicemotion/| Expo DeviceMotion} for more details.
 */
export const useDevicePitch = () => {
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    // Pede permissão para usar os sensores de movimento
    DeviceMotion.requestPermissionsAsync();

    // Adiciona um listener para o DeviceMotion
    const subscription = DeviceMotion.addListener((deviceMotionData) => {
      if (deviceMotionData.rotation) {
        // 'beta' é o ângulo de inclinação (pitch) em radianos.
        const betaRad = deviceMotionData.rotation.beta;
        
        // Converte de radianos para graus
        const betaDeg = betaRad * (180 / Math.PI);
        
        // ➋ recentrage : 90° (portrait-horizon) → 0°, vers le bas → négatif, vers le haut → positif
        const pitchCentered = 90 - betaDeg;
        // ➌ (optionnel) borne pour rester propre
        const bounded = Math.max(-90, Math.min(90, pitchCentered));
        setPitch(bounded);
      }
    });

    // Define a frequência de atualização para ser suave
    DeviceMotion.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, []);

  return pitch;
};

/**
 * Custom hook to get the device heading (compass direction).
 * Applies smoothing to the heading values.
 * @returns {number} heading in degrees
 * @see {@link https://docs.expo.dev/versions/latest/sdk/location/| Expo Location} for more details.
 */

export const useOrientation = (): number => {
  const [heading, setHeading] = useState(0); // Initial heading value
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Error message

  useEffect(() => {
    // Variable to hold the location subscription object
    let subscription: Location.LocationSubscription | null = null;

    /**
     * Starts tracking the device orientation.
     * Requests permission and listens for heading changes.
     */
    const startLocationTracking = async () => {
      // Request foreground location permissions from the user
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Start listening for heading (compass) changes
      subscription = await Location.watchHeadingAsync((headingData) => {
        if (
          typeof headingData.trueHeading == "number" &&
          headingData.trueHeading >= 0
        ) {
          const newHeading = headingData.trueHeading;
          setHeading((prevHeading) => {
            // If the difference is too large, update directly
            if (Math.abs(newHeading - prevHeading) > 180) {
              return newHeading;
            }

            // Smooth the heading transition
            return prevHeading * (1 - 0.2) + newHeading * 0.2;
          });
        }
      });
    };

    startLocationTracking();

    // Remove listener when component unmounts
    return () => {
      subscription?.remove();
    };
  }, []);

  return heading;
};
