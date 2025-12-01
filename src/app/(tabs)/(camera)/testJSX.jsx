import { CameraView } from "expo-camera";
import { Text, View } from "react-native";

export default function TestCamera() {
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} active={true} facing="back" />
      <Text style={{ position: "absolute", top: 50, left: 50, color: "white" }}>
        Test caméra
      </Text>
    </View>
  );
}