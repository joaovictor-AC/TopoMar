import * as Location from "expo-location";
import { useEffect, useState } from "react";

/**
 * Un hook React personnalisé pour suivre la position géographique de l'utilisateur en temps réel.
 *
 * Ce hook gère la demande de permissions de localisation au premier plan et configure un
 * abonnement à `expo-location` pour recevoir des mises à jour continues. Il nettoie
 * l'abonnement automatiquement lorsque le composant est démonté.
 *
 * @returns {{
 *  location: Location.LocationObject | null; [Le dernier objet de localisation de `expo-location`, ou `null` si pas encore disponible]
 *  errorMsg: string | null; [Une chaîne avec un message d'erreur si les permissions sont refusées, sinon `null`]
 * }}
 *
 * @see {@link https://docs.expo.dev/versions/latest/sdk/location/| Expo Location} pour plus de détails.
 */

export const useLocation = (): {
  location: Location.LocationObject | null;
  errorMsg: string | null;
} => {
  // État pour stocker l'objet de localisation actuel
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  // État pour stocker les messages d'erreur
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Variable pour contenir l'objet d'abonnement à la localisation
    let subscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      // Demander les permissions de localisation au premier plan à l'utilisateur
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("La permission d'accéder à la localisation a été refusée");
        return;
      }

      // Configurer un observateur pour recevoir les mises à jour de localisation
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1,
          timeInterval: 100,
        },
        (newLocation) => {
          setLocation(newLocation); // Mettre à jour l'état avec la nouvelle localisation
        }
      );
    };

    startLocationTracking();

    // Fonction de nettoyage : supprimer l'abonnement lorsque le composant est démonté
    return () => {
      subscription?.remove();
    };
  }, []); // Le tableau de dépendances vide assure que cet effet ne s'exécute qu'une seule fois au montage

  return { location, errorMsg };
};
