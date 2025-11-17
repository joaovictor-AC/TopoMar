import { HEIGHT_SCREEN, WIDTH_SCREEN } from "@/constants/phone_dimensions";
import { StyleSheet } from "react-native";

export const screenStyle = StyleSheet.create({
  background: {
    flex: 1,
    width: WIDTH_SCREEN,
    height: HEIGHT_SCREEN,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splash_screen: {
    flex: 1,
    backgroundColor: "#BABAC1", // KERREGVIEW background color
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
});
