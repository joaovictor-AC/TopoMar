// Import necessary modules
import { screenStyle } from '@/style/screen/screen_style';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Animated, Image, View } from 'react-native';

// Define the static asset for the splash screen image
const SPLASH_IMG = require('../assets/images/splash_screen.png');

// ---
// CRITICAL: Prevent the native Expo splash screen from auto-hiding.
// This is called outside the component because it needs to run immediately
// when the app loads, before React even renders. This allows our
// custom component to control when the splash screen disappears.
// ---
SplashScreen.preventAutoHideAsync();

/**
 * Props for the CustomSplashScreen component.
 */
interface CustomSplashScreenProps {
  /**
   * A callback function that will be executed when the splash
   * animation is complete and the component is ready to unmount.
   */
  onFinish: () => void;
}

/**
 * A custom splash screen component.
 *
 * This component takes full control over the splash screen experience.
 * It hides the native Expo splash screen and displays a custom
 * animation (a fade-out) before signaling that the app is ready
 * to display its main content via the `onFinish` prop.
 */
export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  // `isVisible` controls whether this component renders anything.
  // When false, the component returns null, unmounting it.
  const [isVisible, setIsVisible] = useState(true);

  // `fadeAnim` is the Animated value for the component's opacity.
  // We initialize it to 1 (fully visible) and animate it to 0 (invisible).
  // We use [0] to get the value itself, not the update function.
  const fadeAnim = useState(new Animated.Value(1))[0];

  // This effect runs only once when the component mounts (due to `[]`).
  useEffect(() => {
    // Hide the native splash screen now that our custom component is visible.
    SplashScreen.hideAsync();

    // Set a timer to keep the custom splash screen visible for a short duration (2 seconds).
    // This allows time for any initial app setup or just for branding.
    const timer = setTimeout(() => {
      // After 2 seconds, start the fade-out animation.
      Animated.timing(fadeAnim, {
        toValue: 0, // Animate opacity to 0
        duration: 1000, // Animation duration (1 second)
        useNativeDriver: true, // Use the native thread for better performance
      }).start(() => {
        // This callback runs *after* the animation is complete.
        setIsVisible(false); // Mark the component as invisible
        onFinish(); // Notify the parent component that we are finished
      });
    }, 2000); // 2-second delay before starting the fade-out

    // Cleanup function: This will run if the component is unmounted
    // *before* the timer finishes. This prevents memory leaks.
    return () => {
      clearTimeout(timer);
    };
  }, []); // The empty dependency array ensures this effect runs only once.

  // If the component is no longer visible, render nothing.
  // This effectively unmounts the splash screen from the component tree.
  if (!isVisible) {
    return null;
  }

  // Render the splash screen UI.
  // We use `Animated.View` so we can animate its `opacity` style.
  return (
    <Animated.View style={[screenStyle.background, { opacity: fadeAnim }]}>
      <View style={screenStyle.splash_screen}>
        <Image
          source={SPLASH_IMG}
          style={screenStyle.background}
          resizeMode="cover" // Ensure the image covers the entire screen
        />
      </View>
    </Animated.View>
  );
}