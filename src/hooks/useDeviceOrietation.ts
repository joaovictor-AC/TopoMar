import * as Location from "expo-location";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";

/**
 * Get the device pitch (tilt) in degrees using motion sensors.
 * @returns {number} pitch in degrees
 * @see {@link https://docs.expo.dev/versions/latest/sdk/devicemotion/| Expo DeviceMotion} for more details.
 */
export const useDevicePitch = () => {
  const [pitch, setPitch] = useState(90); // Initial pitch value
  const smoothingWindow = 3; // Number of recent values for moving average
  const values: number[] = []; // Array to store recent pitch values

  useEffect(() => {
    // Request permission to access device motion sensors
    DeviceMotion.requestPermissionsAsync();

    // Add a listener to receive device motion data
    const subscription = DeviceMotion.addListener((deviceMotionData) => {
      if (deviceMotionData.rotation) {
        const betaRad = deviceMotionData.rotation.beta; // Tilt in radians
        const betaDeg = betaRad * (180 / Math.PI); // Convert to degrees

        // Add the new value to the array
        values.push(betaDeg);

        // Keep only the last 'smoothingWindow' values
        if (values.length > smoothingWindow) {
          values.shift();
        }

        // Calculate the moving average
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

        setPitch(avg);
      }
    });

    // Reduce sampling frequency to limit noise (100ms = 10 times per second)
    DeviceMotion.setUpdateInterval(100);

    // Remove listener when component unmounts
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
