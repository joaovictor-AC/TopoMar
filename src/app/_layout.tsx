import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={
          {
            headerTitle: "Test",
            headerTitleAlign: "center"
          }
        } />
      <Stack.Screen
        name="screens/CameraScreen/camera"
        options={{
          headerTitle: "Camera",
        }} />

    </Stack>
  );
}
