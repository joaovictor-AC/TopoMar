/**
 * Splash Screen - KERREGVIEW Design
 * Welcome screen with logo and tagline
 */

import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Keep the splash screen visible
SplashScreen.preventAutoHideAsync();

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Hide the native Expo splash immediately
    SplashScreen.hideAsync();

    // Keep image visible for 2 seconds
    const timer = setTimeout(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        onFinish();
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.splash}>
        <Image
          source={require('../../../assets/images/SPLASH_SCREEN.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  splash: {
    flex: 1,
    backgroundColor: '#BABAC1', // KERREGVIEW background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: width,
    height: height,
  },
});
