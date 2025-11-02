/**
 * Splash Screen Sequence - KERREGVIEW Design
 * Dos pantallas de splash con transición suave
 */

import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Mantener el splash screen visible
SplashScreen.preventAutoHideAsync();

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  const [showSecondSplash, setShowSecondSplash] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in inicial
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Primera pantalla (solo logo) - 2 segundos
    const firstTimer = setTimeout(() => {
      // Fade out primera pantalla
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Mostrar segunda pantalla
        setShowSecondSplash(true);
        // Fade in segunda pantalla
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);

    // Segunda pantalla (logo + frase) - 2 segundos después
    const secondTimer = setTimeout(() => {
      // Fade out final
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync();
        onFinish();
      });
    }, 4500); // 2s primera + 0.5s transición + 2s segunda

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {!showSecondSplash ? (
        // SPLASH SCREEN 1: Solo Logo
        <View style={styles.splashOne}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
      ) : (
        // SPLASH SCREEN 2: Logo + Frase
        <View style={styles.splashTwo}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoLarge}
            resizeMode="cover"
          />
          <Text style={styles.tagline}>
            Toponymes d'hier, technologies d'aujourd'hui
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  splashOne: {
    flex: 1,
    backgroundColor: '#BABAC1',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  logo: {
    width: 393,
    height: 390,
    aspectRatio: 131 / 130,
  },
  splashTwo: {
    flex: 1,
    width: width > 393 ? 393 : width,
    paddingTop: 139,
    paddingBottom: 189,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 41,
    borderRadius: 20,
    backgroundColor: '#BABAC1',
    alignSelf: 'center',
  },
  logoLarge: {
    width: 394,
    height: 391,
    aspectRatio: 394 / 391,
  },
  tagline: {
    width: 372,
    height: 92,
    color: '#000',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Fuente serif del sistema
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 46,
  },
});
