import * as Location from "expo-location";
import { useEffect, useState } from "react";

/**
 * A custom React hook to track the user's current geographical location in real-time.
 *
 * This hook handles requesting foreground location permissions and sets up a
 * subscription to `expo-location` to receive continuous updates. It cleans
 * up the subscription automatically when the component unmounts.
 *
 * @returns {{
 *  location: Location.LocationObject | null; [The latest location object from `expo-location`, or `null` if not yet available]
 *  errorMsg: string | null; [A string with an error message if permissions are denied, otherwise `null`]
 * }}
 *
 * @see {@link https://docs.expo.dev/versions/latest/sdk/location/| Expo Location} for more details.
 */

export const useLocation = (): {
  location: Location.LocationObject | null;
  errorMsg: string | null;
} => {
  // State to store the current location object
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  // State to store any error messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Variable to hold the location subscription object
    let subscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      // Request foreground location permissions from the user
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Set up a watcher to receive location updates
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 100,
        },
        (newLocation) => {
          setLocation(newLocation); // Update state with the new location
        }
      );
    };

    startLocationTracking();

    // Cleanup function: remove the subscription when the component unmounts
    return () => {
      subscription?.remove();
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return { location, errorMsg };
};
