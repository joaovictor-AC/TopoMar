import { SUBMERGED, VISIBLE } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const themeColor = StyleSheet.create({
  visibleTheme: {
    backgroundColor: VISIBLE,
  },
  submergedTheme: {
    backgroundColor: SUBMERGED,
  },
});
