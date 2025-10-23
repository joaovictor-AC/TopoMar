import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME PAGE</Text>

      <View style={styles.links}>
        <Link href={"/camera"} style={styles.link}>
          <Text style={styles.linkText}>CAMERA</Text>
        </Link>

        <Link href={"/maps"} style={styles.link}>
          <Text style={styles.linkText}>MAPS</Text>
        </Link>

        <Link href={"/level"} style={styles.link}>
          <Text style={styles.linkText}>WATER LEVEL</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
  },
  links: {
    width: "100%",
    maxWidth: 420,
  },
  link: {
    backgroundColor: "#0a84ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
