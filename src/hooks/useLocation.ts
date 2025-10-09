import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

/**
 * Hook que monitora a localização do usuário com alta precisão.
 */
export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatching = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão de acesso à localização foi negada');
                return;
            }

            // Inicia o monitoramento da posição do usuário.
            subscription = await Location.watchPositionAsync(
                {
                    // ALTERADO: Solicitando a maior precisão possível para navegação e AR.
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000, // Atualiza a cada 1 segundo
                    distanceInterval: 1, // Atualiza a cada 1 metro de deslocamento
                },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );
        };

        startWatching();

        return () => {
            subscription?.remove();
        };
    }, []);

    return { location, errorMsg };
};