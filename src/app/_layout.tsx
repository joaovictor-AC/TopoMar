import { Stack } from "expo-router";
import { useState } from "react";
import CustomSplashScreen from "../components/SplashScreen/CustomSplashScreen";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  // Mostrar splash screens antes de la app principal
  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(camera)/camera" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(maps)/maps" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(water_level)/level" options={{headerTitle: "Water Level"}}/>
    </Stack>
  );
}
