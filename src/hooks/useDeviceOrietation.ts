import * as Location from "expo-location";
import { DeviceMotion, Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

/**
 * Obtient l'inclinaison (pitch) de l'appareil en degrés à l'aide des capteurs de mouvement.
 * @returns {number} pitch en degrés
 * @see {@link https://docs.expo.dev/versions/latest/sdk/devicemotion/| Expo DeviceMotion} pour plus de détails.
 */
export const useDevicePitch = () => {
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    // Demande la permission d'utiliser les capteurs de mouvement
    DeviceMotion.requestPermissionsAsync();

    // Ajoute un écouteur pour DeviceMotion
    const subscription = DeviceMotion.addListener((deviceMotionData) => {
      if (deviceMotionData.rotation) {
        // 'beta' est l'angle d'inclinaison (pitch) en radians.
        const betaRad = deviceMotionData.rotation.beta;
        
        // Convertit de radians en degrés
        const betaDeg = betaRad * (180 / Math.PI);
        
        // ➋ Recentrage : 90° (portrait-horizon) → 0°, vers le bas → négatif, vers le haut → positif
        const pitchCentered = 90 - betaDeg;
        // ➌ (Optionnel) borne pour rester propre
        const bounded = Math.max(-90, Math.min(90, pitchCentered));
        setPitch(bounded);
      }
    });

    // Définit la fréquence de mise à jour pour être fluide
    DeviceMotion.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, []);

  return pitch;
};

/**
 * Hook personnalisé pour obtenir le cap de l'appareil (direction de la boussole).
 * Utilise l'API Location pour iOS et le magnétomètre pour Android.
 * @returns {number} cap en degrés
 */
export const useOrientation = (): number => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: any = null;

    const startTracking = async () => {
      if (Platform.OS === 'ios') {
        // iOS : utiliser l'API Location (plus précis)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          subscription = await Location.watchHeadingAsync((headingData) => {
            if (typeof headingData.trueHeading === "number" && headingData.trueHeading >= 0) {
              setHeading(headingData.trueHeading);
            }
          });
        }
      } else {
        // Android : utiliser le magnétomètre directement
        const { status } = await Magnetometer.requestPermissionsAsync();
        if (status === "granted") {
          Magnetometer.setUpdateInterval(100);
          
          subscription = Magnetometer.addListener((data) => {
            // Calculer l'angle du magnétomètre
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            
            // Normaliser entre 0 et 360
            angle = (angle + 360) % 360;
            
            // Sur Android, ajuster pour que 0° soit le Nord
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
