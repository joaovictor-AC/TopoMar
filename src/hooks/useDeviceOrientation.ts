import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

/**
 * Hook que retorna a orientação do dispositivo (heading) de 0 a 360 graus,
 * onde 0 é o Norte Verdadeiro.
 * Utiliza o Location.watchHeadingAsync para maior precisão e estabilidade,
 * combinando dados do magnetômetro, acelerômetro e giroscópio.
 * Inclui um filtro de suavização para movimentos mais fluidos.
 */
export const useDeviceOrientation = () => {
    const [heading, setHeading] = useState(0);
    
    // Fator de suavização. Valor menor = mais suave, porém com mais latência.
    // Um bom valor inicial é entre 0.1 e 0.2.  
    const SMOOTHING_FACTOR = 0.1;

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatching = async () => {
            // Pede permissão para acessar a localização, que é necessária para o heading.
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permissão de localização negada. O heading não pode ser obtido.');
                return;
            }

            // Inicia o monitoramento da orientação do dispositivo.
            subscription = await Location.watchHeadingAsync((headingData) => {
                // headingData.trueHeading é a direção em graus para o Norte Verdadeiro.
                // Usamos 'trueHeading' pois é baseado em dados geográficos, não magnéticos.
                if (typeof headingData.trueHeading === 'number' && headingData.trueHeading >= 0) {
                    const newHeading = headingData.trueHeading;
                    
                    // ADICIONADO: Filtro de suavização (Interpolação Linear)
                    // Isso evita que os marcadores "tremam" na tela.
                    setHeading((prevHeading) => {
                        // Se a diferença for muito grande (ex: de 359° para 1°), pulamos a suavização
                        if (Math.abs(newHeading - prevHeading) > 180) {
                            return newHeading;
                        }

                        return prevHeading * (1 - SMOOTHING_FACTOR) + newHeading * SMOOTHING_FACTOR;
                    });
                }
            });
        };

        startWatching();

        // Limpa a inscrição ao desmontar o componente para evitar vazamentos de memória.
        return () => {
            subscription?.remove();
        };
    }, []);

    return heading;
};