import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerTitle: "Home"}}/>
      <Stack.Screen name="(tabs)/(camera)/camera" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)/(maps)/maps" options={{headerTitle: "Maps"}}/>
    </Stack>
  );
}
