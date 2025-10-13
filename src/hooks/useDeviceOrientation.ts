import { DeviceMotion, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

export const useDeviceOrientation = () => {
  const [pitch, setPitch] = useState(90);   // inclinaison verticale
  const [yaw, setYaw] = useState(0);        // direction horizontale

  const smoothingWindow = 15;               // taille de la moyenne glissante
  const pitchValues: number[] = [];
  const yawValues: number[] = [];
  const threshold = 0.5;                    // seuil de variation minimale en degrés

  useEffect(() => {
    DeviceMotion.requestPermissionsAsync();
    Magnetometer.requestPermissionsAsync();

    // 🔹 Listener pour la rotation (pitch)
    const motionSub = DeviceMotion.addListener((motionData) => {
      if (motionData.rotation) {
        const betaDeg = motionData.rotation.beta * (180 / Math.PI);
        pitchValues.push(betaDeg);
        if (pitchValues.length > smoothingWindow) pitchValues.shift();

        const avgPitch =
          pitchValues.reduce((sum, v) => sum + v, 0) / pitchValues.length;

        // N’applique la mise à jour que si le changement est significatif
        if (Math.abs(avgPitch - pitch) > threshold) {
          setPitch(avgPitch);
        }
      }
    });

    // 🔹 Listener pour la boussole (yaw)
    const magSub = Magnetometer.addListener((magData) => {
      const { x, y } = magData;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const yawDeg = (angle + 360) % 360; // direction en degrés 0-360°

      yawValues.push(yawDeg);
      if (yawValues.length > smoothingWindow) yawValues.shift();

      const avgYaw =
        yawValues.reduce((sum, v) => sum + v, 0) / yawValues.length;

      if (Math.abs(avgYaw - yaw) > threshold) {
        setYaw(avgYaw);
      }
    });

    // 🔹 Réduire la fréquence d’échantillonnage pour limiter le bruit
    DeviceMotion.setUpdateInterval(100); // 10 fois par seconde

    return () => {
      motionSub.remove();
      magSub.remove();
    };
  }, []);

  return { pitch, yaw };
};