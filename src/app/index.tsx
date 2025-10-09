import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/screens/CameraScreen/camera"} style={styles.button}> Go to camera </Link>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#353535ff" },
    text: { fontSize: 18, color: "#ffffffff" },
    button: { fontSize: 20, marginTop: 20, color: "#00ffff" }
  }
)