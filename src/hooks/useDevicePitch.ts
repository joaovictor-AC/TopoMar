import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from 'react';

// Este hook retorna a inclinação vertical (pitch) do dispositivo em graus.
// 90° = celular na vertical, apontando para o horizonte.
// 0° = celular deitado com a tela para cima.
// Valores abaixo de 90° significam que está apontado para baixo.
export const useDevicePitch = () => {
  const [pitch, setPitch] = useState(90);

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
        
        // O valor de beta quando o celular está na vertical é 90.
        // Nós ajustamos para que o nosso 'pitch' reflita isso.
        setPitch(betaDeg);
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