import { Stack } from "expo-router";
import { useState } from "react";
// Import the custom splash screen component.
import CustomSplashScreen from "../components/splashScreen";

/**
 * This is the Root Layout for the entire app.
 * It controls the initial splash screen and defines the main navigation stack.
 */
export default function RootLayout() {
  // 'showSplash' state controls whether the splash screen is visible.
  // It starts as 'true' when the app loads.
  const [showSplash, setShowSplash] = useState(true);

  // --- Splash Screen Logic ---
  // Conditionally render the splash screen first.
  if (showSplash) {
    return (
      <CustomSplashScreen 
        // Pass a function to the splash screen.
        // 'CustomSplashScreen' will call this 'onFinish' function when it is done.
        onFinish={() => setShowSplash(false)} // This sets 'showSplash' to false, hiding it.
      />
    );
  }

  // --- Main App Navigation ---
  // After the splash screen is hidden (showSplash is false), render the main app.
  return (
    // 'Stack' is the navigator that allows pushing/popping screens.
    <Stack>
      {/* Define each screen in the stack. */}
      {/* 'index' is the home screen, with its header hidden. */}
      <Stack.Screen name="index" options={{headerShown: false}}/>
      
      {/* These screens are part of a '(tabs)' layout group. */}
      {/* The headers for the camera and maps screens are hidden. */}
      <Stack.Screen name="(tabs)/(camera)/camera" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(maps)/maps" options={{headerShown: false}}/>
      
      {/* The 'level' screen will show a header with a custom title. */}
      <Stack.Screen name="(tabs)/(water_level)/level" options={{headerTitle: "Water Level"}}/>
    </Stack>
  );
}