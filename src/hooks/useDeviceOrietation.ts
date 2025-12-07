import * as Location from "expo-location";
import { DeviceMotion, Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

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
 * Uses Location API for iOS and Magnetometer for Android.
 * @returns {number} heading in degrees
 */
export const useOrientation = (): number => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: any = null;

    const startTracking = async () => {
      if (Platform.OS === 'ios') {
        // iOS: usar Location API (más preciso)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          subscription = await Location.watchHeadingAsync((headingData) => {
            if (typeof headingData.trueHeading === "number" && headingData.trueHeading >= 0) {
              setHeading(headingData.trueHeading);
            }
          });
        }
      } else {
        // Android: usar Magnetometer directamente
        const { status } = await Magnetometer.requestPermissionsAsync();
        if (status === "granted") {
          Magnetometer.setUpdateInterval(100);
          
          subscription = Magnetometer.addListener((data) => {
            // Calcular el ángulo del magnetómetro
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            
            // Normalizar a 0-360
            angle = (angle + 360) % 360;
            
            // En Android, ajustar para que 0° sea Norte
            const heading = (360 - angle) % 360;
            
            setHeading(heading);
          });
        }
      }
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  return heading;
};
