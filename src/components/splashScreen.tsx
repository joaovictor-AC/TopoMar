// Importer les modules nécessaires
import { screenStyle } from '@/style/screen/screen_style';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Animated, Image, View } from 'react-native';

// Définir l'actif statique pour l'image de l'écran de démarrage
const SPLASH_IMG = require('../assets/images/splash_screen.png');

// ---
// CRITIQUE : Empêcher l'écran de démarrage natif d'Expo de se masquer automatiquement.
// Ceci est appelé en dehors du composant car il doit s'exécuter immédiatement
// au chargement de l'application, avant même que React ne fasse le rendu. Cela permet à notre
// composant personnalisé de contrôler quand l'écran de démarrage disparaît.
// ---
SplashScreen.preventAutoHideAsync();

/**
 * Props pour le composant CustomSplashScreen.
 */
interface CustomSplashScreenProps {
  /**
   * Une fonction de rappel qui sera exécutée lorsque l'animation de démarrage
   * est terminée et que le composant est prêt à être démonté.
   */
  onFinish: () => void;
}

/**
 * Un composant d'écran de démarrage personnalisé.
 *
 * Ce composant prend le contrôle total de l'expérience de l'écran de démarrage.
 * Il masque l'écran de démarrage natif d'Expo et affiche une animation
 * personnalisée (un fondu sortant) avant de signaler que l'application est prête
 * à afficher son contenu principal via la prop `onFinish`.
 */
export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  // `isVisible` contrôle si ce composant rend quelque chose.
  // Si faux, le composant retourne null, le démontant.
  const [isVisible, setIsVisible] = useState(true);

  // `fadeAnim` est la valeur animée pour l'opacité du composant.
  // Nous l'initialisons à 1 (totalement visible) et l'animons vers 0 (invisible).
  // Nous utilisons [0] pour obtenir la valeur elle-même, pas la fonction de mise à jour.
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Cet effet ne s'exécute qu'une seule fois au montage du composant (grâce à []).
  useEffect(() => {
    // Masquer l'écran de démarrage natif maintenant que notre composant personnalisé est visible.
    SplashScreen.hideAsync();

    // Définir une minuterie pour garder l'écran de démarrage personnalisé visible pendant une courte durée (2 secondes).
    // Cela laisse du temps pour toute configuration initiale de l'application ou simplement pour l'image de marque.
    const timer = setTimeout(() => {
      // Après 2 secondes, démarrer l'animation de fondu sortant.
      Animated.timing(fadeAnim, {
        toValue: 0, // Animer l'opacité vers 0
        duration: 1000, // Durée de l'animation (1 seconde)
        useNativeDriver: true, // Utiliser le thread natif pour de meilleures performances
      }).start(() => {
        // Ce rappel s'exécute *après* la fin de l'animation.
        setIsVisible(false); // Marquer le composant comme invisible
        onFinish(); // Notifier le composant parent que nous avons terminé
      });
    }, 2000); // Délai de 2 secondes avant de commencer le fondu sortant

    // Fonction de nettoyage : Ceci s'exécutera si le composant est démonté
    // *avant* que la minuterie ne se termine. Cela empêche les fuites de mémoire.
    return () => {
      clearTimeout(timer);
    };
  }, []); // Le tableau de dépendances vide assure que cet effet ne s'exécute qu'une seule fois.

  // Si le composant n'est plus visible, ne rien rendre.
  // Cela démonte effectivement l'écran de démarrage de l'arbre des composants.
  if (!isVisible) {
    return null;
  }

  // Rendre l'interface utilisateur de l'écran de démarrage.
  // Nous utilisons `Animated.View` pour pouvoir animer son style `opacity`.
  return (
    <Animated.View style={[screenStyle.background, { opacity: fadeAnim }]}>
      <View style={screenStyle.splash_screen}>
        <Image
          source={SPLASH_IMG}
          style={screenStyle.background}
          resizeMode="cover" // S'assurer que l'image couvre tout l'écran
        />
      </View>
    </Animated.View>
  );
}