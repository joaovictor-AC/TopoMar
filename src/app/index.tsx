import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>
        HOME PAGE
      </Text>
      <Link href={"/camera"} push>CAMERA</Link>
      <Link href={"/maps"} push>MAPS</Link>
    </View>
  );
}
