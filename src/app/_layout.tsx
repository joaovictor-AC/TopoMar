import { Stack } from "expo-router";
import { useState } from "react";
// Importer le composant d'écran de démarrage personnalisé.
import CustomSplashScreen from "../components/splashScreen";

/**
 * Ceci est la mise en page racine pour toute l'application.
 * Elle contrôle l'écran de démarrage initial et définit la pile de navigation principale.
 */
export default function RootLayout() {
  // L'état 'showSplash' contrôle si l'écran de démarrage est visible.
  // Il commence à 'true' au chargement de l'application.
  const [showSplash, setShowSplash] = useState(true);

  // --- Logique de l'écran de démarrage ---
  // Rendre conditionnellement l'écran de démarrage en premier.
  if (showSplash) {
    return (
      <CustomSplashScreen 
        // Passer une fonction à l'écran de démarrage.
        // 'CustomSplashScreen' appellera cette fonction 'onFinish' quand il aura terminé.
        onFinish={() => setShowSplash(false)} // Cela met 'showSplash' à faux, le masquant.
      />
    );
  }

  // --- Navigation principale de l'application ---
  // Une fois l'écran de démarrage masqué (showSplash est faux), rendre l'application principale.
  return (
    // 'Stack' est le navigateur qui permet d'empiler/dépiler les écrans.
    <Stack>
      {/* Définir chaque écran dans la pile. */}
      {/* 'index' est l'écran d'accueil, avec son en-tête masqué. */}
      <Stack.Screen name="index" options={{headerShown: false}}/>
      
      {/* Ces écrans font partie d'un groupe de mise en page '(tabs)'. */}
      {/* Les en-têtes pour les écrans caméra et cartes sont masqués. */}
      <Stack.Screen name="(tabs)/(camera)/camera" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(maps)/maps" options={{headerShown: false}}/>
      
      {/* L'écran 'level' affichera un en-tête avec un titre personnalisé. */}
      <Stack.Screen name="(tabs)/(water_level)/level" options={{headerTitle: "Niveau d'eau"}}/>
      <Stack.Screen name="(tabs)/(database)/database" options={{headerTitle: "Base de données"}}/>
    </Stack>
  );
}