import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

// Ce hook retourne l'inclinaison verticale (pitch) du téléphone en degrés.
// 90° = téléphone vertical (vers l'horizon), 0° = téléphone à plat.
export const useDevicePitch = () => {
  const [pitch, setPitch] = useState<number>(90); // Valeur initiale
  const smoothingWindow = 20; // Nombre d'échantillons pour la moyenne glissante
  const values = useRef<number[]>([]); // Stocke les dernières valeurs

  useEffect(() => {
    // Demande la permission pour accéder aux capteurs
    DeviceMotion.requestPermissionsAsync();

    // Abonnement aux données du capteur
    const subscription = DeviceMotion.addListener((deviceMotionData) => {
      if (deviceMotionData.rotation) {
        // 'beta' correspond à l'inclinaison avant/arrière en radians
        const betaRad = deviceMotionData.rotation.beta;
        const betaDeg = betaRad * (180 / Math.PI);

        // Ajoute la nouvelle valeur
        values.current.push(betaDeg);

        // Garde seulement les 'smoothingWindow' dernières valeurs
        if (values.current.length > smoothingWindow) {
          values.current.shift();
        }

        // Calcule la moyenne glissante
        const avg =
          values.current.reduce((sum, v) => sum + v, 0) /
          values.current.length;

        if (Math.abs(avg - pitch) > 0.5) { // seuil de 0.5 degré
          setPitch(avg);
        }
      }
    });

    // Réduit la fréquence d’échantillonnage (ici 10 fois par seconde)
    DeviceMotion.setUpdateInterval(100);

    // Nettoyage à la fin
    return () => {
      subscription.remove();
    };
  }, []);

  return pitch;
};